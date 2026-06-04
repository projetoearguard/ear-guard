package com.aeggpw.earguard;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Log.d("app.EARGUARD", "MainActivity onCreate");
    }
}
