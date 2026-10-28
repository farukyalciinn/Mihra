package com.farukyalcin.mihra;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.app.WallpaperManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.util.Log;
import java.io.File;
import java.util.TimeZone;

/**
 * Duvar kağıdı sözünü zamanında değiştirir.
 * Uygulama her söz için bir resim hazırlar (filesDir/wall/N.jpg); burada o anki
 * zaman dilimine düşen resim duvar kağıdı yapılır ve bir sonraki değişim için alarm kurulur.
 * Dilim hesabı web tarafındaki slot() ile aynıdır: yerel saate göre (saat * 3600000) ms'lik dilimler.
 */
public final class WallpaperScheduler {
    static final String PREFS = "mihra_wallpaper";
    private static final String TAG = "MihraWallpaper";

    private WallpaperScheduler() {}

    static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    static File dir(Context c) {
        return new File(c.getFilesDir(), "wall");
    }

    static long slot(long now, int hours) {
        long local = now + TimeZone.getDefault().getOffset(now);
        return local / (hours * 3600000L);
    }

    /** O anki sözün resmini duvar kağıdı yapar (aynı resim zaten uygulandıysa atlar). */
    static void apply(Context c, boolean force) {
        SharedPreferences p = prefs(c);
        if (!p.getBoolean("enabled", false)) return;
        int count = p.getInt("count", 0), hours = Math.max(1, p.getInt("hours", 2));
        if (count <= 0) return;
        int idx = (int) (slot(System.currentTimeMillis(), hours) % count);
        if (!force && idx == p.getInt("applied", -1)) return;
        File f = new File(dir(c), idx + ".jpg");
        if (!f.exists()) return;
        Bitmap bmp = BitmapFactory.decodeFile(f.getAbsolutePath());
        if (bmp == null) return;
        try {
            String target = p.getString("target", "both");
            int flags = "lock".equals(target) ? WallpaperManager.FLAG_LOCK
                    : "home".equals(target) ? WallpaperManager.FLAG_SYSTEM
                    : WallpaperManager.FLAG_LOCK | WallpaperManager.FLAG_SYSTEM;
            WallpaperManager.getInstance(c).setBitmap(bmp, null, true, flags);
            p.edit().putInt("applied", idx).apply();
        } catch (Exception e) {
            Log.w(TAG, "Duvar kağıdı ayarlanamadı", e);
        } finally {
            bmp.recycle();
        }
    }

    /** Bir sonraki dilim başına alarm kurar. */
    static void scheduleNext(Context c) {
        SharedPreferences p = prefs(c);
        if (!p.getBoolean("enabled", false)) return;
        int hours = Math.max(1, p.getInt("hours", 2));
        long now = System.currentTimeMillis(), len = hours * 3600000L;
        long offset = TimeZone.getDefault().getOffset(now);
        long next = (slot(now, hours) + 1) * len - offset + 5000; // dilim başından 5 sn sonra
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        PendingIntent pi = pending(c);
        boolean exact = Build.VERSION.SDK_INT < Build.VERSION_CODES.S || am.canScheduleExactAlarms();
        if (exact) am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, next, pi);
        else am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, next, pi);
    }

    static void cancel(Context c) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am != null) am.cancel(pending(c));
    }

    private static PendingIntent pending(Context c) {
        Intent i = new Intent(c, WallpaperReceiver.class).setAction(WallpaperReceiver.ACTION_TICK);
        return PendingIntent.getBroadcast(c, 4601, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }
}
