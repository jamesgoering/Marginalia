// Marginalia offline support. When you upload a new version, change VERSION so phones and iPads pick it up.
const VERSION = '0.5.0';
const CACHE = 'marginalia-' + VERSION;
const ASSETS = ['./', 'index.html', 'manifest.webmanifest', 'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-32.png', 'fonts/fonts.css','fonts/inter-latin-400-normal.woff2','fonts/inter-latin-500-normal.woff2','fonts/inter-latin-600-normal.woff2','fonts/literata-latin-400-italic.woff2','fonts/literata-latin-400-normal.woff2','fonts/literata-latin-600-normal.woff2','fonts/source-serif-4-latin-400-italic.woff2','fonts/source-serif-4-latin-400-normal.woff2','fonts/source-serif-4-latin-600-normal.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('marginalia-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // The page itself: try the network (3 s), fall back to the saved copy when offline.
    const fromNet = fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); }
      return res;
    });
    const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 3000));
    e.respondWith(Promise.race([fromNet, timeout]).catch(() =>
      caches.match('index.html').then(r => r || caches.match('./')).then(r => r || fromNet)));
    return;
  }
  // Everything else (fonts, icons): saved copy first, network if missing.
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
