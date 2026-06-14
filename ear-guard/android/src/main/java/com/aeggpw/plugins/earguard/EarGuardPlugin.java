package com.aeggpw.plugins.earguard;

import android.Manifest;
import android.content.Intent;
import android.util.Log;
import android.util.Base64;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.PermissionState;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@CapacitorPlugin(
    name = "EarGuard",
    permissions = {
        @Permission(strings = { Manifest.permission.POST_NOTIFICATIONS }, alias = "notifications")
    }
)
public class EarGuardPlugin extends Plugin {
    private static final String TAG = "app.EARGUARD";

    @PluginMethod
    public void start(PluginCall call) {
        Intent intent = new Intent(getContext(), NoiseMonitorService.class);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            getContext().startForegroundService(intent);
        } else {
            getContext().startService(intent);
        }
        call.resolve();
    }

    @PluginMethod
    public void configure(PluginCall call) {
        String configJson = call.getString("config");
        Log.d(TAG, "Config recebida: " + configJson);
        NoiseMonitorService.updateConfig(getContext(), configJson);
        call.resolve();
    }

    @PluginMethod
    public void requestNotificationPermission(PluginCall call) {
        if (android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.TIRAMISU) {
            call.resolve();
            return;
        }

        if (getPermissionState("notifications") == PermissionState.GRANTED) {
            call.resolve();
            return;
        }

        requestPermissionForAlias("notifications", call, "onNotificationPermissionResult");
    }

    @PluginMethod
    public void saveAudio(PluginCall call) {
        String audioId = call.getString("audioId");
        String fileName = call.getString("fileName");
        String data = call.getString("data");

        if (audioId == null || audioId.trim().isEmpty() || data == null || data.trim().isEmpty()) {
            call.reject("Dados de áudio inválidos");
            return;
        }

        try {
            String nativeFileName = buildNativeFileName(audioId, fileName);
            File dir = new File(getContext().getFilesDir(), "earguard_audio");
            if (!dir.exists() && !dir.mkdirs()) {
                call.reject("Não foi possível criar a pasta de áudio");
                return;
            }

            File outFile = new File(dir, nativeFileName);
            byte[] bytes = Base64.decode(stripDataUrlPrefix(data), Base64.DEFAULT);
            try (FileOutputStream fos = new FileOutputStream(outFile)) {
                fos.write(bytes);
                fos.flush();
            }

            JSObject ret = new JSObject();
            ret.put("nativeFileName", nativeFileName);
            ret.put("path", outFile.getAbsolutePath());
            call.resolve(ret);
        } catch (IOException e) {
            call.reject("Falha ao salvar áudio", e);
        } catch (IllegalArgumentException e) {
            call.reject("Conteúdo base64 inválido", e);
        }
    }

    @PluginMethod
    public void deleteAudio(PluginCall call) {
        String nativeFileName = call.getString("nativeFileName");
        if (nativeFileName == null || nativeFileName.trim().isEmpty()) {
            call.resolve();
            return;
        }

        File outFile = new File(new File(getContext().getFilesDir(), "earguard_audio"), nativeFileName);
        if (outFile.exists()) {
            outFile.delete();
        }
        call.resolve();
    }

    @PluginMethod
    public void playAudio(PluginCall call) {
        String audioId = call.getString("audioId");
        Double volume = call.getDouble("volume");

        boolean ok = NoiseMonitorService.playAudio(getContext(), audioId, volume != null ? volume : 1.0);
        JSObject ret = new JSObject();
        ret.put("ok", ok);
        call.resolve(ret);
    }

    @PluginMethod
    public void stopAudio(PluginCall call) {
        NoiseMonitorService.stopPlayback();
        call.resolve();
    }

    @PluginMethod
    public void stop(PluginCall call) {
        Intent intent = new Intent(getContext(), NoiseMonitorService.class);
        getContext().stopService(intent);
        call.resolve();
    }

    @PluginMethod
    public void getCurrentDb(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("db", NoiseMonitorService.latestDb);
        call.resolve(ret);
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("db", NoiseMonitorService.latestDb);
        ret.put("playing", NoiseMonitorService.isPlaying());
        ret.put("audioId", NoiseMonitorService.getCurrentAudioId());
        ret.put("triggerId", NoiseMonitorService.getCurrentTriggerId());
        call.resolve(ret);
    }

    @PluginMethod
    public void setThreshold(PluginCall call) {
        Double value = call.getDouble("value");
        if (value != null) {
            NoiseMonitorService.threshold = value;
        }
        call.resolve();
    }

    @PermissionCallback
    public void onNotificationPermissionResult(PluginCall call) {
        call.resolve();
    }

    private String buildNativeFileName(String audioId, String fileName) {
        String ext = "";
        if (fileName != null) {
            int dotIndex = fileName.lastIndexOf('.');
            if (dotIndex >= 0 && dotIndex < fileName.length() - 1) {
                ext = fileName.substring(dotIndex);
            }
        }
        if (ext.isEmpty()) {
            ext = ".mp3";
        }
        return audioId + ext;
    }

    private String stripDataUrlPrefix(String data) {
        int commaIndex = data.indexOf(',');
        if (data.startsWith("data:") && commaIndex >= 0) {
            return data.substring(commaIndex + 1);
        }
        return data;
    }
}
