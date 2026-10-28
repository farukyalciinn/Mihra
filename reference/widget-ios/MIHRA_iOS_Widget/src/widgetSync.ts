import { Platform } from "react-native";
import { ExtensionStorage } from "@bacons/apple-targets";

// MİHRA açılışında çağır: ayetlerin mushaf sayfa numaralarını widget'a iletir.
const GROUP = "group.com.farukyalciinn.mihra"; // app.json ile aynı olmalı
const REFS = ["13:28", "20:114", "20:25", "21:87", "2:152", "2:201", "2:286", "39:53", "3:173", "65:3", "94:5"];

export async function syncWidgetPages() {
  if (Platform.OS !== "ios") return;
  const pages: Record<string, number> = {};
  await Promise.all(
    REFS.map(async (r) => {
      try {
        const j = await (await fetch(`https://api.alquran.cloud/v1/ayah/${r}`)).json();
        if (j?.data?.page) pages[r] = j.data.page;
      } catch {}
    })
  );
  const storage = new ExtensionStorage(GROUP);
  storage.set("pages", JSON.stringify(pages));
  ExtensionStorage.reloadWidget();
}

// Duvar kağıdı ayarlarında seçilen değişim süresi (1, 2, 3 veya 6 saat) ve yazı rengi (#RRGGBB).
// Kilit ekranı widget'larında yazı rengini iOS belirler; renk ana ekran widget'ında geçerlidir.
export function syncWidgetSettings(hours: 1 | 2 | 3 | 6, color: string) {
  if (Platform.OS !== "ios") return;
  const storage = new ExtensionStorage(GROUP);
  storage.set("settings", JSON.stringify({ hours, color }));
  ExtensionStorage.reloadWidget();
}
