/* MİHRA service worker: uygulama kabuğunu önbelleğe alır, internet yokken de açılmasını sağlar.
   Dosya listesi değişince VERSION'ı artır. */
const VERSION = 'mihra-v3';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/data.js', 'js/core.js', 'js/vakitler.js', 'js/kible.js', 'js/zikir.js', 'js/kuran.js',
  'js/ogren.js', 'js/bildirim.js', 'js/duvar.js', 'js/ayarlar.js', 'js/app.js', 'js/pwa.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-32.png'
];
// Çevrimdışı da işe yarayan API yanıtları (vakitler, sureler)
const API = ['api.aladhan.com', 'api.alquran.cloud'];
const API_CACHE = 'mihra-api'; // sürümden bağımsız, güncellemede silinmez

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSION && k !== API_CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Bildirime dokununca açık pencereyi öne getir, yoksa uygulamayı aç
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
    const w = ws.find(c => c.url.startsWith(self.registration.scope));
    return w ? w.focus() : self.clients.openWindow('./');
  }));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Kendi dosyalarımız: önce önbellek, arka planda güncelle
  if (url.origin === location.origin) {
    e.respondWith(caches.open(VERSION).then(async c => {
      const hit = await c.match(req, { ignoreSearch: true }) || (req.mode === 'navigate' ? await c.match('index.html') : null);
      const net = fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r }).catch(() => null);
      if (hit) { e.waitUntil(net); return hit }
      return (await net) || Response.error();
    }));
    return;
  }

  // API'ler: önce ağ, olmazsa son kaydedilen yanıt
  if (API.includes(url.hostname)) {
    e.respondWith(caches.open(API_CACHE).then(c =>
      fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r })
        .catch(() => c.match(req).then(h => h || Response.error()))));
  }
});
