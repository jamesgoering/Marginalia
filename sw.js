// Marginalia offline support. When you upload a new version, change VERSION so phones and iPads pick it up.
const VERSION = '1.7.1';
const CACHE = 'marginalia-' + VERSION;
const DATA = 'marginalia-bibles';
const SHELL = ['./', 'index.html', 'app.js', 'app.css', 'config.js', 'manifest.webmanifest', 'vendor/msal-browser.min.js', 'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/favicon-32.png', 'fonts/figtree-latin-400-normal.woff2','fonts/figtree-latin-500-normal.woff2','fonts/figtree-latin-600-normal.woff2','fonts/figtree-latin-700-normal.woff2','fonts/fonts.css', 'fonts/gelasio-latin-400-normal.woff2', 'fonts/gelasio-latin-400-italic.woff2', 'fonts/gelasio-latin-600-normal.woff2', 'fonts/charis-sil-latin-400-normal.woff2', 'fonts/charis-sil-latin-400-italic.woff2', 'fonts/charis-sil-latin-700-normal.woff2', 'fonts/domitian-400-normal.woff2', 'fonts/domitian-400-italic.woff2', 'fonts/domitian-700-normal.woff2','fonts/inter-latin-400-normal.woff2','fonts/inter-latin-500-normal.woff2','fonts/inter-latin-600-normal.woff2','fonts/literata-latin-400-italic.woff2','fonts/literata-latin-400-normal.woff2','fonts/literata-latin-600-normal.woff2','fonts/source-serif-4-latin-400-italic.woff2','fonts/source-serif-4-latin-400-normal.woff2','fonts/source-serif-4-latin-600-normal.woff2'];

self.addEventListener('install', e => {
  // cache: 'reload' skips the browser's own cache, so a new version never stores old files.
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('marginalia-') && k !== CACHE && k !== DATA).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
const netFirst = (req, key) => {
  const fromNet = fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(key || req, copy)); }
    return res;
  });
  const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 3000));
  return Promise.race([fromNet, timeout]).catch(() => caches.match(key || req).then(r => r || fromNet));
};
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (req.mode === 'navigate') { e.respondWith(netFirst(req, 'index.html')); return; }
  if (url.pathname.endsWith('/config.js')) { e.respondWith(netFirst(req)); return; }
  if (url.pathname.includes('/data/')) {
    // Bible text: keep every book once it has been opened, so it works offline.
    e.respondWith(caches.open(DATA).then(c => c.match(req).then(hit => hit || fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
