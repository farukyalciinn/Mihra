package com.farukyalcin.mihra;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Alarm geldiğinde sözü değiştirir; telefon yeniden başlayınca veya uygulama güncellenince alarmı yeniden kurar. */
public class WallpaperReceiver extends BroadcastReceiver {
    static final String ACTION_TICK = "com.farukyalcin.mihra.WALLPAPER_TICK";

    @Override
    public void onReceive(Context context, Intent intent) {
        final PendingResult result = goAsync();
        final Context app = context.getApplicationContext();
        new Thread(() -> {
            try {
                WallpaperScheduler.apply(app, false);
                WallpaperScheduler.scheduleNext(app);
            } finally {
                result.finish();
            }
        }).start();
    }
}
