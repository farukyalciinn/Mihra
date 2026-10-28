// MİHRA · Kilit ekranı sözü (2 saatte bir değişir)
// Scriptable uygulamasında yeni script olarak yapıştır. Kilit ekranına "Scriptable" widget'ı ekleyip bu script'i seç.
const SOZ = [
 [
  "Şüphesiz güçlükle beraber bir kolaylık vardır.",
  "İnşirâh 94:5"
 ],
 [
  "Biliniz ki kalpler ancak Allah’ı anmakla huzur bulur.",
  "Ra‘d 13:28"
 ],
 [
  "Allah hiç kimseye gücünün yettiğinden fazlasını yüklemez.",
  "Bakara 2:286"
 ],
 [
  "Siz beni anın, ben de sizi anayım.",
  "Bakara 2:152"
 ],
 [
  "Kim Allah’a güvenirse O, ona yeter.",
  "Talâk 65:3"
 ],
 [
  "Allah’ın rahmetinden ümit kesmeyin.",
  "Zümer 39:53"
 ],
 [
  "Lâ ilâhe illâ ente sübhâneke innî küntü minez-zâlimîn.",
  "Enbiyâ 21:87"
 ],
 [
  "Hasbünallâhü ve ni‘mel-vekîl.",
  "Âl-i İmrân 3:173"
 ],
 [
  "Rabbişrah lî sadrî ve yessir lî emrî.",
  "Tâhâ 20:25-26"
 ],
 [
  "Rabbenâ âtinâ fid-dünyâ haseneten ve fil-âhireti haseneten ve kınâ azâben-nâr.",
  "Bakara 2:201"
 ],
 [
  "Rabbi zidnî ilmâ.",
  "Tâhâ 20:114"
 ],
 [
  "Lâ havle ve lâ kuvvete illâ billâh.",
  "Zikir"
 ],
 [
  "Ameller ancak niyetlere göredir.",
  "Hadis-i şerif · Buhârî, Müslim"
 ],
 [
  "Kolaylaştırın, zorlaştırmayın; müjdeleyin, nefret ettirmeyin.",
  "Hadis-i şerif · Buhârî, Müslim"
 ],
 [
  "Sizin en hayırlınız, Kur’an’ı öğrenen ve öğretendir.",
  "Hadis-i şerif · Buhârî"
 ],
 [
  "Temizlik imanın yarısıdır.",
  "Hadis-i şerif · Müslim"
 ],
 [
  "Güzel söz sadakadır.",
  "Hadis-i şerif · Buhârî, Müslim"
 ],
 [
  "Müslüman, diğer Müslümanların elinden ve dilinden emin olduğu kimsedir.",
  "Hadis-i şerif · Buhârî, Müslim"
 ],
 [
  "Hiçbiriniz, kendisi için istediğini din kardeşi için de istemedikçe iman etmiş olmaz.",
  "Hadis-i şerif · Buhârî, Müslim"
 ]
];
const off = new Date().getTimezoneOffset() * 60000;
const slot = Math.floor((Date.now() - off) / 7200000);   // her çift saatte yeni söz
const s = SOZ[slot % SOZ.length];

const small = config.widgetFamily && config.widgetFamily.startsWith("accessory");
const w = new ListWidget();
w.backgroundColor = new Color("#000000");
const t = w.addText("“" + s[0] + "”");
t.font = Font.italicSystemFont(small ? 12 : 17);
t.textColor = Color.white();
t.minimumScaleFactor = 0.6;
w.addSpacer(4);
const r = w.addText(s[1]);
r.font = Font.systemFont(small ? 9 : 11);
r.textColor = new Color("#E7C98B");
w.refreshAfterDate = new Date((slot + 1) * 7200000 + off);

if (config.runsInWidget) { Script.setWidget(w); } else { await w.presentMedium(); }
Script.complete();
