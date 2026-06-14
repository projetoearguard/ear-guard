package com.aeggpw.plugins.earguard;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.pm.ServiceInfo;
import android.content.res.AssetFileDescriptor;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.util.Log;

import java.io.File;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NoiseMonitorService extends Service {

    private static final String TAG = "app.EARGUARD";
    private static final String PREFS_NAME = "earguard_native";
    private static final String PREF_CONFIG = "config_json";
    private static final boolean DEFAULT_NOTIFY_ON_HIGH_NOISE = true;
    private static final boolean DEFAULT_NOTIFY_ON_TRIGGER = true;

    public static volatile double latestDb = 0;
    public static volatile double threshold = 80.0;

    private static final Object CONFIG_LOCK = new Object();
    private static final Map<String, NativeAudio> AUDIO_LIBRARY = new HashMap<>();
    private static final List<NativeTrigger> TRIGGERS = new ArrayList<>();

    private static volatile int debounceMs = 800;
    private static volatile int cooldownMs = 3000;
    private static volatile double dbOffset = 0.0;
    private static volatile boolean notifyOnHighNoise = true;
    private static volatile boolean notifyOnTrigger = true;
    private static volatile String currentAudioId = null;
    private static volatile String currentTriggerId = null;
    private static volatile boolean playing = false;
    private static volatile String lastLoadedConfig = "{}";
    private static volatile boolean thresholdAlertActive = false;
    private static volatile long lastThresholdNotificationAt = 0L;
    private static final long THRESHOLD_NOTIFICATION_COOLDOWN_MS = 15000L;
    private static final int THRESHOLD_NOTIFICATION_ID = 2001;
    private static final int TRIGGER_NOTIFICATION_ID = 2002;

    private boolean running = false;
    private AudioRecord audioRecord;
    private Thread worker;
    private PowerManager.WakeLock wakeLock;
    private static MediaPlayer mediaPlayer;
    private long lastTriggerAt = 0L;
    private long pendingTriggerSince = 0L;
    private String pendingTriggerId = null;

    private static final class NativeAudio {
        final String id;
        final String name;
        final String assetPath;
        final String nativeFileName;
        final double volume;

        NativeAudio(String id, String name, String assetPath, String nativeFileName, double volume) {
            this.id = id;
            this.name = name;
            this.assetPath = assetPath;
            this.nativeFileName = nativeFileName;
            this.volume = volume;
        }
    }

    private static final class NativeTrigger {
        final String id;
        final String name;
        final double dbMin;
        final double dbMax;
        final String audioId;
        final double volume;
        final boolean enabled;

        NativeTrigger(String id, String name, double dbMin, double dbMax, String audioId, double volume, boolean enabled) {
            this.id = id;
            this.name = name;
            this.dbMin = dbMin;
            this.dbMax = dbMax;
            this.audioId = audioId;
            this.volume = volume;
            this.enabled = enabled;
        }
    }

    public static void updateConfig(Context context, String configJson) {
        if (configJson == null || configJson.trim().isEmpty()) {
            configJson = "{}";
        }
        boolean previousNotifyOnHighNoise;
        boolean previousNotifyOnTrigger;
        synchronized (CONFIG_LOCK) {
            previousNotifyOnHighNoise = notifyOnHighNoise;
            previousNotifyOnTrigger = notifyOnTrigger;
            lastLoadedConfig = configJson;
            applyConfigLocked(configJson);
        }
        applyNotificationPreferenceChanges(context, previousNotifyOnHighNoise, previousNotifyOnTrigger);
        persistConfig(context, configJson);
    }

    public static boolean playAudio(Context context, String audioId, double volume) {
        return playAudio(context, audioId, volume, true);
    }

    public static boolean playAudio(Context context, String audioId, double volume, boolean loop) {
        if (audioId == null || audioId.trim().isEmpty()) {
            return false;
        }

        synchronized (CONFIG_LOCK) {
            NativeAudio audio = AUDIO_LIBRARY.get(audioId);
            if (audio == null || (audio.assetPath == null || audio.assetPath.isEmpty()) && (audio.nativeFileName == null || audio.nativeFileName.isEmpty())) {
                Log.w(TAG, "Áudio nativo não encontrado para " + audioId);
                return false;
            }

            stopPlaybackLocked();
            try {
                MediaPlayer player = new MediaPlayer();
                if (audio.assetPath != null && !audio.assetPath.isEmpty()) {
                    AssetFileDescriptor afd = context.getAssets().openFd(resolveAssetPath(audio.assetPath));
                    player.setDataSource(afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength());
                    afd.close();
                } else {
                    File outFile = new File(new File(context.getFilesDir(), "earguard_audio"), audio.nativeFileName);
                    player.setDataSource(outFile.getAbsolutePath());
                }
                final boolean shouldLoop = loop;
                player.setLooping(shouldLoop);
                float targetVolume = clampVolume((float) (volume >= 0 ? volume : audio.volume));
                player.setVolume(targetVolume, targetVolume);
                player.setOnErrorListener((mp, what, extra) -> {
                    Log.e(TAG, "Erro ao reproduzir áudio nativo: " + what + "/" + extra);
                    stopPlayback();
                    return true;
                });
                if (!shouldLoop) {
                    player.setOnCompletionListener(mp -> {
                        synchronized (CONFIG_LOCK) {
                            if (mediaPlayer == mp) {
                                try {
                                    mp.release();
                                } catch (Exception ignored) { }
                                mediaPlayer = null;
                                playing = false;
                                currentAudioId = null;
                                currentTriggerId = null;
                            }
                        }
                    });
                }
                player.prepare();
                player.start();
                mediaPlayer = player;
                currentAudioId = audio.id;
                playing = true;
                //Log.d(TAG, "Tocando áudio nativo: " + audio.name);
                return true;
            } catch (Exception e) {
                Log.e(TAG, "Falha ao iniciar reprodução nativa", e);
                stopPlaybackLocked();
                return false;
            }
        }
    }

    public static void stopPlayback() {
        synchronized (CONFIG_LOCK) {
            stopPlaybackLocked();
            currentTriggerId = null;
        }
    }

    public static boolean isPlaying() {
        return playing;
    }

    public static String getCurrentAudioId() {
        return currentAudioId;
    }

    public static String getCurrentTriggerId() {
        return currentTriggerId;
    }

    private static void persistConfig(Context context, String configJson) {
        if (context == null) return;
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putString(PREF_CONFIG, configJson).apply();
    }

    private static void loadPersistedConfig(Context context) {
        if (context == null) return;
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String saved = prefs.getString(PREF_CONFIG, "{}");
        synchronized (CONFIG_LOCK) {
            if (saved != null && !saved.trim().isEmpty()) {
                lastLoadedConfig = saved;
                applyConfigLocked(saved);
            }
        }
    }

    private static void applyConfigLocked(String configJson) {
        try {
            JSONObject root = new JSONObject(configJson);
            threshold = root.optDouble("noiseNotifyThreshold", threshold);
            debounceMs = root.optInt("debounce", debounceMs);
            cooldownMs = (int) Math.max(0, Math.round(root.optDouble("cooldown", cooldownMs / 1000.0) * 1000.0));
            dbOffset = root.optDouble("dbOffset", dbOffset);
            notifyOnHighNoise = root.has("notifyOnHighNoise")
                ? root.optBoolean("notifyOnHighNoise", DEFAULT_NOTIFY_ON_HIGH_NOISE)
                : DEFAULT_NOTIFY_ON_HIGH_NOISE;
            notifyOnTrigger = root.has("notifyOnTrigger")
                ? root.optBoolean("notifyOnTrigger", DEFAULT_NOTIFY_ON_TRIGGER)
                : DEFAULT_NOTIFY_ON_TRIGGER;
            //Log.d(TAG, "notifyOnHighNoise=" + notifyOnHighNoise);
            //Log.d(TAG, "notifyOnTrigger=" + notifyOnTrigger);

            AUDIO_LIBRARY.clear();
            JSONArray audios = root.optJSONArray("audios");
            if (audios != null) {
                for (int i = 0; i < audios.length(); i++) {
                    JSONObject audio = audios.optJSONObject(i);
                    if (audio == null) continue;
                    String id = audio.optString("id", "");
                    String assetPath = audio.optString("assetPath", "");
                    String nativeFileName = audio.optString("nativeFileName", "");
                    if (id.isEmpty() || (assetPath.isEmpty() && nativeFileName.isEmpty())) continue;
                    AUDIO_LIBRARY.put(id, new NativeAudio(
                        id,
                        audio.optString("name", id),
                        assetPath,
                        nativeFileName,
                        audio.optDouble("volume", 1.0)
                    ));
                }
            }

            TRIGGERS.clear();
            JSONArray triggers = root.optJSONArray("triggers");
            if (triggers != null) {
                for (int i = 0; i < triggers.length(); i++) {
                    JSONObject trigger = triggers.optJSONObject(i);
                    if (trigger == null) continue;
                    TRIGGERS.add(new NativeTrigger(
                        trigger.optString("id", ""),
                        trigger.optString("name", ""),
                        trigger.optDouble("dbMin", 0),
                        trigger.optDouble("dbMax", 0),
                        trigger.optString("audioId", ""),
                        trigger.optDouble("volume", 1.0),
                        trigger.optBoolean("enabled", true)
                    ));
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Falha ao aplicar configuração nativa", e);
        }
    }

    private static void applyNotificationPreferenceChanges(Context context, boolean previousNotifyOnHighNoise, boolean previousNotifyOnTrigger) {
        if (context == null) return;

        if (previousNotifyOnHighNoise && !notifyOnHighNoise) {
            synchronized (CONFIG_LOCK) {
                thresholdAlertActive = false;
                lastThresholdNotificationAt = 0L;
            }
            cancelNotification(context, THRESHOLD_NOTIFICATION_ID);
        }

        if (previousNotifyOnTrigger && !notifyOnTrigger) {
            cancelNotification(context, TRIGGER_NOTIFICATION_ID);
        }
    }

    private static void cancelNotification(Context context, int notificationId) {
        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager != null) {
            manager.cancel(notificationId);
        }
    }

    private static String resolveAssetPath(String assetPath) {
        if (assetPath.startsWith("public/")) {
            return assetPath;
        }
        return "public/" + assetPath;
    }

    private static float clampVolume(float value) {
        return Math.max(0f, Math.min(1f, value));
    }

    private static void stopPlaybackLocked() {
        playing = false;
        currentAudioId = null;

        if (mediaPlayer != null) {
            try {
                if (mediaPlayer.isPlaying()) {
                    mediaPlayer.stop();
                }
            } catch (Exception ignored) { }
            try {
                mediaPlayer.release();
            } catch (Exception ignored) { }
            mediaPlayer = null;
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        //Log.d(TAG, "Serviço iniciado em segundo plano");
        loadPersistedConfig(getApplicationContext());
        //Log.d(TAG, "notifyOnHighNoise=" + notifyOnHighNoise);
        //Log.d(TAG, "notifyOnTrigger=" + notifyOnTrigger);

        PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);
        if (powerManager != null) {
            wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "EarGuard::KeepAlive");
            if (!wakeLock.isHeld()) wakeLock.acquire();
        }

        Notification notification = createNotification("EarGuard Ativo", "Monitorando em segundo plano...");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(1, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE);
        } else {
            startForeground(1, notification);
        }

        if (!running) {
            startMonitoring();
        }

        return START_STICKY;
    }

    private void startMonitoring() {
        try {
            int sampleRate = 44100;
            int bufferSize = AudioRecord.getMinBufferSize(
                sampleRate,
                AudioFormat.CHANNEL_IN_MONO,
                AudioFormat.ENCODING_PCM_16BIT
            );

            if (bufferSize <= 0) {
                throw new IllegalStateException("Buffer de áudio inválido");
            }

            audioRecord = new AudioRecord(
                MediaRecorder.AudioSource.MIC,
                sampleRate,
                AudioFormat.CHANNEL_IN_MONO,
                AudioFormat.ENCODING_PCM_16BIT,
                bufferSize
            );
            audioRecord.startRecording();
            running = true;

            worker = new Thread(() -> {
                short[] buffer = new short[bufferSize];
                while (running) {
                    int read = audioRecord.read(buffer, 0, buffer.length);
                    if (read > 0) {
                        double sum = 0;
                        for (int i = 0; i < read; i++) {
                            sum += buffer[i] * buffer[i];
                        }

                        double rms = Math.sqrt(sum / read);
                        double db = rms > 1 ? 20 * Math.log10(rms / 32768.0) + 85 + dbOffset : 0;
                        latestDb = Math.max(0, db);

                        evaluateTriggers(latestDb);
                        // Log.d(TAG, "dB: " + (int) latestDb + " / Limite: " + (int) threshold);
                    }

                    try {
                        Thread.sleep(10);
                    } catch (InterruptedException e) {
                        break;
                    }
                }
            }, "EarGuardNoiseWorker");
            worker.start();
        } catch (Exception e) {
            Log.e(TAG, "Erro ao iniciar monitoramento", e);
        }
    }

    private void evaluateTriggers(double db) {
        long now = System.currentTimeMillis();
        evaluateThresholdNotification(db);
        NativeTrigger matched = null;

        synchronized (CONFIG_LOCK) {
            for (NativeTrigger trigger : TRIGGERS) {
                if (!trigger.enabled) continue;
                if (db >= trigger.dbMin && db <= trigger.dbMax) {
                    matched = trigger;
                    break;
                }
            }

            if (matched == null) {
                pendingTriggerId = null;
                pendingTriggerSince = 0L;
                currentTriggerId = null;
                return;
            }

            if (!matched.id.equals(pendingTriggerId)) {
                pendingTriggerId = matched.id;
                pendingTriggerSince = now;
                return;
            }

            if (now - pendingTriggerSince < debounceMs) {
                return;
            }

            if (currentTriggerId != null && currentTriggerId.equals(matched.id)) {
                return;
            }

            if (now - lastTriggerAt < cooldownMs) {
                return;
            }
        }

        NativeTrigger trigger = matched;
        NativeAudio audio;
        synchronized (CONFIG_LOCK) {
            audio = AUDIO_LIBRARY.get(trigger.audioId);
        }

        boolean played = false;
        if (audio != null) {
            played = playAudio(getApplicationContext(), audio.id, trigger.volume >= 0 ? trigger.volume : audio.volume, false);
            if (played) {
                //Log.d(TAG, "Gatilho ativado: " + trigger.name + " -> " + audio.name);
            }
        } else {
            Log.w(TAG, "Gatilho sem áudio nativo correspondente: " + trigger.name);
        }

        if (played) {
            synchronized (CONFIG_LOCK) {
                currentTriggerId = trigger.id;
                lastTriggerAt = now;
            }
        }

        if (played && notifyOnTrigger) {
            //Log.d(TAG, "Notificação de gatilho: " + trigger.name);
            dispatchTriggerNotification(trigger, audio, db);
        }
    }

    private void evaluateThresholdNotification(double db) {
        boolean shouldNotify = false;
        double currentThreshold;

        synchronized (CONFIG_LOCK) {
            if (!notifyOnHighNoise) {
                thresholdAlertActive = false;
                return;
            }
            currentThreshold = threshold;
            if (db < currentThreshold) {
                thresholdAlertActive = false;
                return;
            }

            long now = System.currentTimeMillis();
            if (thresholdAlertActive || now - lastThresholdNotificationAt < THRESHOLD_NOTIFICATION_COOLDOWN_MS) {
                return;
            }

            thresholdAlertActive = true;
            lastThresholdNotificationAt = now;
            shouldNotify = true;
        }

        if (!shouldNotify) return;
        //Log.d(TAG, "Tentando enviar notificação de ruído");
        if (!canPostNotifications()) return;

        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager != null) {
            manager.notify(
                THRESHOLD_NOTIFICATION_ID,
                createThresholdNotification(
                    "Ruído elevado",
                    "Nível registrado: " + (int) db + " dB"
                )
            );
        }
    }

    private void dispatchTriggerNotification(NativeTrigger trigger, NativeAudio audio, double db) {
        //Log.d(TAG, "Tentando enviar notificação de gatilho");
        if (!canPostNotifications()) {
            return;
        }

        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager == null) {
            return;
        }

        manager.notify(
            TRIGGER_NOTIFICATION_ID,
            createTriggerNotification(
                "Gatilho ativado",
                trigger.name + " · " + audio.name + " · " + (int) db + " dB"
            )
        );
    }

    @Override
    public void onDestroy() {
        running = false;
        if (worker != null) {
            worker.interrupt();
            worker = null;
        }
        if (audioRecord != null) {
            try {
                audioRecord.stop();
            } catch (Exception ignored) { }
            audioRecord.release();
            audioRecord = null;
        }
        synchronized (CONFIG_LOCK) {
            stopPlaybackLocked();
            thresholdAlertActive = false;
            lastThresholdNotificationAt = 0L;
        }
        cancelNotification(getApplicationContext(), THRESHOLD_NOTIFICATION_ID);
        cancelNotification(getApplicationContext(), TRIGGER_NOTIFICATION_ID);
        if (wakeLock != null && wakeLock.isHeld()) {
            wakeLock.release();
        }
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private boolean canPostNotifications() {
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU
            || checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED;
    }

    private Notification createNotification(String title, String text) {
        String channelId = "noise_monitor";
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(channelId, "Monitor", NotificationManager.IMPORTANCE_LOW);
            getSystemService(NotificationManager.class).createNotificationChannel(channel);
        }
        return new Notification.Builder(this, channelId)
            .setContentTitle(title)
            .setContentText(text)
            .setSmallIcon(android.R.drawable.ic_btn_speak_now)
            .setOngoing(true)
            .build();
    }

    private Notification createThresholdNotification(String title, String text) {
        String channelId = "noise_alert";
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(channelId, "Alertas de ruído", NotificationManager.IMPORTANCE_DEFAULT);
            getSystemService(NotificationManager.class).createNotificationChannel(channel);
        }
        return new Notification.Builder(this, channelId)
            .setContentTitle(title)
            .setContentText(text)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setAutoCancel(true)
            .build();
    }

    private Notification createTriggerNotification(String title, String text) {
        String channelId = "trigger_alert";
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(channelId, "Alertas de gatilho", NotificationManager.IMPORTANCE_DEFAULT);
            getSystemService(NotificationManager.class).createNotificationChannel(channel);
        }
        return new Notification.Builder(this, channelId)
            .setContentTitle(title)
            .setContentText(text)
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setAutoCancel(true)
            .build();
    }
}
