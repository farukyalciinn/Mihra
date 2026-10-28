package com.farukyalcin.mihra;

import android.content.Context;
import android.util.Base64;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileOutputStream;

/**
 * JS tarafı: Capacitor.Plugins.MihraWallpaper
 *  clear()                         → kayıtlı resimleri siler
 *  saveImage({index, data})        → base64 JPEG'i wall/index.jpg olarak kaydeder
 *  start({count, hours, target})   → otomatik değişimi başlatır (target: both | lock | home)
 *  stop()                          → durdurur
 *  status()                        → {enabled, count, hours, target}
 */
@CapacitorPlugin(name = "MihraWallpaper")
public class WallpaperPlugin extends Plugin {

    @PluginMethod
    public void clear(PluginCall call) {
        File d = WallpaperScheduler.dir(getContext());
        File[] fs = d.listFiles();
        if (fs != null) for (File f : fs) f.delete();
        call.resolve();
    }

    @PluginMethod
    public void saveImage(PluginCall call) {
        Integer index = call.getInt("index");
        String data = call.getString("data");
        if (index == null || index < 0 || data == null) {
            call.reject("index ve data gerekli");
            return;
        }
        File d = WallpaperScheduler.dir(getContext());
        if (!d.exists() && !d.mkdirs()) {
            call.reject("Klasör oluşturulamadı");
            return;
        }
        try (FileOutputStream out = new FileOutputStream(new File(d, index + ".jpg"))) {
            out.write(Base64.decode(data, Base64.DEFAULT));
            call.resolve();
        } catch (Exception e) {
            call.reject("Resim kaydedilemedi", e);
        }
    }

    @PluginMethod
    public void start(PluginCall call) {
        int count = call.getInt("count", 0), hours = call.getInt("hours", 2);
        String target = call.getString("target", "both");
        if (count <= 0) {
            call.reject("count gerekli");
            return;
        }
        final Context c = getContext().getApplicationContext();
        WallpaperScheduler.prefs(c).edit()
                .putBoolean("enabled", true).putInt("count", count).putInt("hours", Math.max(1, hours))
                .putString("target", target).putInt("applied", -1).apply();
        // setBitmap biraz sürebilir; arayüzü kilitlememek için arka planda
        new Thread(() -> {
            WallpaperScheduler.apply(c, true);
            WallpaperScheduler.scheduleNext(c);
            call.resolve();
        }).start();
    }

    @PluginMethod
    public void stop(PluginCall call) {
        Context c = getContext().getApplicationContext();
        WallpaperScheduler.prefs(c).edit().putBoolean("enabled", false).apply();
        WallpaperScheduler.cancel(c);
        call.resolve();
    }

    @PluginMethod
    public void status(PluginCall call) {
        android.content.SharedPreferences p = WallpaperScheduler.prefs(getContext());
        JSObject r = new JSObject();
        r.put("enabled", p.getBoolean("enabled", false));
        r.put("count", p.getInt("count", 0));
        r.put("hours", p.getInt("hours", 2));
        r.put("target", p.getString("target", "both"));
        call.resolve(r);
    }
}
