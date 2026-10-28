import WidgetKit
import SwiftUI

// Uygulama grubu: app.json içindeki ios.entitlements ile AYNI olmalı.
private let appGroup = "group.com.farukyalciinn.mihra"

struct Soz {
    let text: String
    let src: String
    let ref: String   // "94:5" gibi; ayet değilse boş
}

private let SOZLER: [Soz] = [
    Soz(text: "Şüphesiz güçlükle beraber bir kolaylık vardır.", src: "İnşirâh 94:5", ref: "94:5"),
    Soz(text: "Biliniz ki kalpler ancak Allah’ı anmakla huzur bulur.", src: "Ra‘d 13:28", ref: "13:28"),
    Soz(text: "Allah hiç kimseye gücünün yettiğinden fazlasını yüklemez.", src: "Bakara 2:286", ref: "2:286"),
    Soz(text: "Siz beni anın, ben de sizi anayım.", src: "Bakara 2:152", ref: "2:152"),
    Soz(text: "Kim Allah’a güvenirse O, ona yeter.", src: "Talâk 65:3", ref: "65:3"),
    Soz(text: "Allah’ın rahmetinden ümit kesmeyin.", src: "Zümer 39:53", ref: "39:53"),
    Soz(text: "Lâ ilâhe illâ ente sübhâneke innî küntü minez-zâlimîn.", src: "Enbiyâ 21:87", ref: "21:87"),
    Soz(text: "Hasbünallâhü ve ni‘mel-vekîl.", src: "Âl-i İmrân 3:173", ref: "3:173"),
    Soz(text: "Rabbişrah lî sadrî ve yessir lî emrî.", src: "Tâhâ 20:25-26", ref: "20:25"),
    Soz(text: "Rabbenâ âtinâ fid-dünyâ haseneten ve fil-âhireti haseneten ve kınâ azâben-nâr.", src: "Bakara 2:201", ref: "2:201"),
    Soz(text: "Rabbi zidnî ilmâ.", src: "Tâhâ 20:114", ref: "20:114"),
    Soz(text: "Lâ havle ve lâ kuvvete illâ billâh.", src: "Zikir", ref: ""),
    Soz(text: "Ameller ancak niyetlere göredir.", src: "Hadis-i şerif · Buhârî, Müslim", ref: ""),
    Soz(text: "Kolaylaştırın, zorlaştırmayın; müjdeleyin, nefret ettirmeyin.", src: "Hadis-i şerif · Buhârî, Müslim", ref: ""),
    Soz(text: "Sizin en hayırlınız, Kur’an’ı öğrenen ve öğretendir.", src: "Hadis-i şerif · Buhârî", ref: ""),
    Soz(text: "Temizlik imanın yarısıdır.", src: "Hadis-i şerif · Müslim", ref: ""),
    Soz(text: "Güzel söz sadakadır.", src: "Hadis-i şerif · Buhârî, Müslim", ref: ""),
    Soz(text: "Müslüman, diğer Müslümanların elinden ve dilinden emin olduğu kimsedir.", src: "Hadis-i şerif · Buhârî, Müslim", ref: ""),
    Soz(text: "Hiçbiriniz, kendisi için istediğini din kardeşi için de istemedikçe iman etmiş olmaz.", src: "Hadis-i şerif · Buhârî, Müslim", ref: "")
]

struct SozEntry: TimelineEntry {
    let date: Date
    let soz: Soz
    let page: Int?
    let color: Color

    var label: String {
        if let p = page { return "\(soz.src) · Sayfa \(p)" }
        return soz.src
    }
}

// Web sürümüyle aynı kural: yerel saate göre her çift saatte yeni söz.
private func slotIndex(_ date: Date, hours: Int) -> Int {
    let offset = Double(TimeZone.current.secondsFromGMT(for: date))
    return Int(floor((date.timeIntervalSince1970 + offset) / Double(hours * 3600)))
}

extension Color {
    init(hex: String) {
        var s = hex.trimmingCharacters(in: .whitespaces)
        if s.hasPrefix("#") { s.removeFirst() }
        var v: UInt64 = 0
        Scanner(string: s).scanHexInt64(&v)
        self.init(red: Double((v >> 16) & 0xFF) / 255,
                  green: Double((v >> 8) & 0xFF) / 255,
                  blue: Double(v & 0xFF) / 255)
    }
}

// Ayarlar: uygulama App Group içine "settings" anahtarıyla JSON metni yazar, örn. {"hours":2,"color":"#FFFFFF"}
private func loadSettings() -> (hours: Int, color: Color) {
    var hours = 2
    var color = Color.white
    if let json = UserDefaults(suiteName: appGroup)?.string(forKey: "settings"),
       let data = json.data(using: .utf8),
       let o = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
        if let h = o["hours"] as? Int, [1, 2, 3, 6].contains(h) { hours = h }
        if let hex = o["color"] as? String { color = Color(hex: hex) }
    }
    return (hours, color)
}

// Sayfa numaralarını uygulama, App Group içine "pages" anahtarıyla JSON metni olarak yazar.
private func loadPages() -> [String: Int] {
    guard
        let json = UserDefaults(suiteName: appGroup)?.string(forKey: "pages"),
        let data = json.data(using: .utf8),
        let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any]
    else { return [:] }
    var out: [String: Int] = [:]
    for (k, v) in obj {
        if let n = v as? Int { out[k] = n }
    }
    return out
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SozEntry {
        SozEntry(date: Date(), soz: SOZLER[0], page: nil, color: .white)
    }

    func getSnapshot(in context: Context, completion: @escaping (SozEntry) -> Void) {
        completion(makeEntry(Date()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SozEntry>) -> Void) {
        let cal = Calendar.current
        let now = Date()
        let hours = loadSettings().hours
        var comps = cal.dateComponents([.year, .month, .day, .hour], from: now)
        comps.hour = ((comps.hour ?? 0) / hours) * hours
        let start = cal.date(from: comps) ?? now
        var entries: [SozEntry] = []
        for i in 0..<(24 / hours) {
            if let d = cal.date(byAdding: .hour, value: hours * i, to: start) {
                entries.append(makeEntry(d))
            }
        }
        completion(Timeline(entries: entries, policy: .atEnd))
    }

    private func makeEntry(_ d: Date) -> SozEntry {
        let n = SOZLER.count
        let st = loadSettings()
        let s = SOZLER[((slotIndex(d, hours: st.hours) % n) + n) % n]
        let page = s.ref.isEmpty ? nil : loadPages()[s.ref]
        return SozEntry(date: d, soz: s, page: page, color: st.color)
    }
}

struct SozWidgetView: View {
    @Environment(\.widgetFamily) private var family
    let entry: SozEntry

    var body: some View {
        switch family {
        case .accessoryInline:
            Text(entry.soz.text)
        case .accessoryRectangular:
            VStack(alignment: .leading, spacing: 2) {
                Text("“\(entry.soz.text)”")
                    .font(.system(size: 12, design: .serif).italic())
                    .minimumScaleFactor(0.6)
                    .lineLimit(4)
                Text(entry.label)
                    .font(.system(size: 9))
                    .opacity(0.8)
                    .lineLimit(1)
            }
        default:
            VStack(alignment: .leading, spacing: 6) {
                Text("“\(entry.soz.text)”")
                    .font(.system(size: family == .systemSmall ? 15 : 19, design: .serif).italic())
                    .foregroundColor(entry.color)
                    .minimumScaleFactor(0.6)
                Text(entry.label)
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(entry.color.opacity(0.8))
            }
            .shadow(color: .black.opacity(0.6), radius: 3, x: 0, y: 1)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        }
    }
}

struct MihraSozWidget: Widget {
    let kind: String = "MihraSozWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            if #available(iOS 17.0, *) {
                SozWidgetView(entry: entry)
                    .containerBackground(.clear, for: .widget)
            } else {
                SozWidgetView(entry: entry).padding()
            }
        }
        .configurationDisplayName("MİHRA · Günün Sözü")
        .description("Ayet, dua ve hadislerden seçilen söz seçtiğin sürede bir değişir. Duvar kağıdın değişmez.")
        .supportedFamilies([.accessoryRectangular, .accessoryInline, .systemSmall, .systemMedium])
    }
}

@main
struct MihraWidgets: WidgetBundle {
    var body: some Widget {
        MihraSozWidget()
    }
}
