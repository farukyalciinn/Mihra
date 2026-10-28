# MİHRA — proje devir notu

Kullanıcı Türkçe (samimi dil) konuşur. Cevapları Türkçe ver.

## Ne
Namaz vakitleri + İslami yaşam uygulaması. React Native / Expo SDK 54 / TypeScript. Hedef: App Store (öncelik) ve Google Play.
Bundle id: com.farukyalciinn.mihra. GitHub: farukyalciinn.

## Tasarım (DEĞİŞTİRME, baştan tasarlama)
Koyu zümrüt yeşil zemin, altın detaylar, krem / yeşile çalan yumuşak kartlar. Renkler: src/theme.ts.
Sekmeler: Vakitler, Kıble, Zikir, Kur'an, Öğren (+ Ayarlar, Duvar Kağıdı, Hakkında).
Referans (çalışan, test edilmiş web sürümü): reference/web-index.html — tüm sekmelerin davranışı ve görünümü buradan taşınır.

## Durum
- Bitti (yazıldı ama HİÇ çalıştırılmadı): iskelet, tema, store, onboarding, Vakitler sekmesi, ortak veriler (src/data).
- Yapılacak: Kıble (pusula + titreşim), Zikir (özel hedef, parlama animasyonu, Esmaül Hüsna seçimi; salavat kaldırıldı), Kur'an (sure listesi + sadece okuma), Öğren (dersler), Ayarlar (animasyonlu sayfa, bildirimler), Duvar Kağıdı/widget ayarları (1/2/3/6 saat, yazı rengi), Hakkında, gerçek zamanlanmış bildirimler.
- Widget: reference/widget-ios (SwiftUI + @bacons/apple-targets, App Group group.com.farukyalciinn.mihra). Derlenmedi, denenmedi. Duvar kağıdını DEĞİŞTİRMEZ; mevcut duvar kağıdı üstünde ayet/dua/hadis + kaynak + mushaf sayfası gösterir.

## Kararlar
- Hesap/giriş YOK; veri sadece cihazda (AsyncStorage). Kurumsal sayfalar var (reference/gizlilik.html).
- Veri kaynakları: Aladhan (Türkiye için yöntem 13, diğerleri 3), AlQuran Cloud (quran-uthmani + tr.diyanet), BigDataCloud, Open-Meteo geocoding.
- Dinî içerik Hanefî / Diyanet İlmihali'ne göre; yayın öncesi bir din görevlisi kontrol etmeli. Geliştirici adı ve e-posta Hakkında/gizlilikte yayın öncesi doldurulacak.

## İlk iş
1. npm install, npx expo start; hataları düzelt (npx tsc --noEmit).
2. Vakitler sekmesini telefonda doğrula, sonra kalan sekmeleri web referansına bakarak taşı.
3. EAS Build ile iOS/Android derleme, TestFlight, mağaza hazırlığı.
