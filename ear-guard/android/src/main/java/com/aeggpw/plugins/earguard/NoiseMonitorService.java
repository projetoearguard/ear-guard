package com.aeggpw.plugins.earguard;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.RequiresApi;
import androidx.annotation.RequiresPermission;
import androidx.core.app.ActivityCompat;

public class NoiseMonitorService extends Service {

    public static double latestDb = 0;
    private boolean running = false;
    private AudioRecord audioRecord;
    private Thread worker;

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d("app.EARGUARD", "NoiseMonitorService started");

        startForeground(1, createNotification());

        if (!running) {
            startMonitoring();
        }

        return START_STICKY;
    }

    @RequiresPermission(Manifest.permission.RECORD_AUDIO)
    private void startMonitoring() {
        try {
            int sampleRate = 44100;

            int bufferSize = AudioRecord.getMinBufferSize(
                    sampleRate,
                    AudioFormat.CHANNEL_IN_MONO,
                    AudioFormat.ENCODING_PCM_16BIT
            );

            Log.d("app.EARGUARD", "bufferSize=" + bufferSize);

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

                    int read = audioRecord.read(
                            buffer,
                            0,
                            buffer.length
                    );

                    if (read <= 0) {
                        Log.d("app.EARGUARD", "read <= 0");
                        continue;
                    }

                    short peak = 0;

                    for (int i = 0; i < read; i++) {
                        short abs = (short)Math.abs(buffer[i]);

                        if (abs > peak) {
                            peak = abs;
                        }
                    }

                    double sum = 0;

                    for (int i = 0; i < read; i++) {
                        double sample = buffer[i];
                        sum += sample * sample;
                    }

                    double rms = Math.sqrt(sum / read);

                    double db;

                    if (rms > 0) {
                        db = 20 * Math.log10(rms / 32768.0) + 100;
                    } else {
                        db = 0;
                    }

                    EarGuardPlugin.latestDb = db;
                    NoiseMonitorService.latestDb = db;

                    Log.d("app.EARGUARD",
                        "read=" + read +
                        " rms=" + rms +
                        " db=" + db +
                        " latestDb=" + NoiseMonitorService.latestDb);

                    try {
                        Thread.sleep(200);
                    } catch (InterruptedException ignored) {
                    }
                }

            });

            worker.start();
        } catch (Exception e) {
            Log.e("app.EARGUARD", "FAILED", e);
        }
    }

    @Override
    public void onDestroy() {

        running = false;

        if (audioRecord != null) {

            try {
                audioRecord.stop();
            } catch (Exception ignored) {
            }

            audioRecord.release();
            audioRecord = null;
        }

        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private Notification createNotification() {

        String channelId = "noise_monitor";

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

            NotificationChannel channel =
                    new NotificationChannel(
                            channelId,
                            "Noise Monitoring",
                            NotificationManager.IMPORTANCE_LOW
                    );

            NotificationManager manager =
                    getSystemService(NotificationManager.class);

            manager.createNotificationChannel(channel);
        }

        return new Notification.Builder(this, channelId)
                .setContentTitle("EarGuard")
                .setContentText("Monitoring ambient noise")
                .setSmallIcon(android.R.drawable.ic_btn_speak_now)
                .build();
    }
}