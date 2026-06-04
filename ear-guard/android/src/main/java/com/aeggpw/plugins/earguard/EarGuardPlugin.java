package com.aeggpw.plugins.earguard;

import android.content.Intent;
import android.os.Build;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "EarGuard")
public class EarGuardPlugin extends Plugin {

    private EarGuard implementation = new EarGuard();
    public static double latestDb = 0;

    @PluginMethod
    public void echo(PluginCall call) {
        String value = call.getString("value");

        JSObject ret = new JSObject();
        ret.put("value", implementation.echo(value));
        call.resolve(ret);
    }

    @PluginMethod
    public void start(PluginCall call) {

        Intent intent =
                new Intent(
                        getContext(),
                        NoiseMonitorService.class
                );

        getContext().startForegroundService(intent);

        call.resolve();
    }

    @PluginMethod
    public void stop(PluginCall call) {

        Intent intent =
                new Intent(
                        getContext(),
                        NoiseMonitorService.class
                );

        getContext().stopService(intent);

        call.resolve();
    }

    @PluginMethod
    public void getCurrentDb(PluginCall call) {

        JSObject ret = new JSObject();

        Log.d("app.EARGUARD", "plugin.latestDb = " + latestDb);
        Log.d("app.EARGUARD", "service.latestDb = " + NoiseMonitorService.latestDb);

        ret.put("db", latestDb);
        
        call.resolve(ret);
    }
}
