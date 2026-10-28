# MİHRA · iOS widget paketi (kilit ekranı / ana ekran sözü)

Widget, duvar kağıdını DEĞİŞTİRMEZ. Kullanıcının mevcut duvar kağıdının üstünde yazı olarak durur.
Söz seçilen sürede (1, 2, 3 veya 6 saat; varsayılan 2) değişir; liste uygulamanın içinde gömülüdür, internet gerekmez.
Ayet sayfa numaraları uygulama açılınca internetten alınıp widget'a iletilir.

## İçindekiler
- `targets/widget/MihraWidget.swift` – SwiftUI/WidgetKit widget (kilit ekranı dikdörtgen + satır içi, ana ekran küçük/orta)
- `targets/widget/expo-target.config.js` – widget'ı Expo projesine ekler (@bacons/apple-targets)
- `src/widgetSync.ts` – ayet sayfa numaralarını widget'a gönderir
- `app.json.ornek` – gerekli app.json ayarları (bundle id, App Group, konum/hareket izin metinleri)

## ÖNEMLİ: bu paketin durumu
- Bunu bu ortamda DERLEYEMEDİM ve iPhone'da denemedim. İlk derlemede küçük hatalar çıkabilir; derleme günlüğünü bana yapıştır, düzeltirim.
- Widget tek başına App Store'a gönderilemez; MİHRA'nın tamamı gerçek bir iOS uygulaması olmalı. Mevcut web sürümünü bir tarayıcı kabuğuna koymak, Apple'ın "yalnızca web sitesi" red gerekçesine (Kural 4.2) takılabilir. Önerilen yol: sekmeleri React Native'e taşımak.

## Mağazaya çıkmak için gerekenler
1. Apple Developer Program üyeliği (yıllık ücretli; onay birkaç gün sürebilir).
2. Bundle ID ve App Group adını sabitle: `com.farukyalciinn.mihra` ve `group.com.farukyalciinn.mihra`. Değiştirirsen app.json, `MihraWidget.swift` ve `widgetSync.ts` içinde aynısını yap.
3. Bilgisayarsız derleme: Expo EAS Build veya Codemagic gibi bulut derleme servisi; ilk imzalama kurulumu için Apple hesabı girişi gerekir. Mac'e sahip biri ya da bulut Mac gerekebilir.
4. Mağaza metinleri, ekran görüntüleri, gizlilik politikası adresi, konum ve bildirim izin gerekçeleri.

## Projeye ekleme
1. Bu klasördeki `targets/` ve `src/widgetSync.ts` dosyalarını Expo projenin köküne kopyala.
2. `app.json.ornek` içindeki `ios` ve `plugins` ayarlarını kendi `app.json`'una işle.
3. Bağımlılık: `npx expo install @bacons/apple-targets expo-location`
4. Uygulama açılışında (App.tsx) `syncWidgetPages()` çağır.
5. Derle (EAS Build, iOS). Kullanıcı widget'ı kendisi ekler: kilit ekranına uzun bas → Özelleştir → widget ekle → MİHRA.
