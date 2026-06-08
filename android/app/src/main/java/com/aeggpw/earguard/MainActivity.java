package com.aeggpw.earguard;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.aeggpw.plugins.earguard.EarGuardPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Registra o plugin manualmente para garantir a comunicação
        registerPlugin(EarGuardPlugin.class);
    }
}
