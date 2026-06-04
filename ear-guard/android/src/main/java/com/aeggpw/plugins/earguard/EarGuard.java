package com.aeggpw.plugins.earguard;

import com.getcapacitor.Logger;

public class EarGuard {

    public String echo(String value) {
        Logger.info("Echo", value);
        return value;
    }
}
