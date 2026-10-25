// Offline-ondersteuning. Verhoog VERSIE bij elke release zodat telefoons de nieuwe versie ophalen.
const VERSIE = 'gezinsplan-2';
const SHELL = ['./', 'index.html', 'config.js', 'supabase.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSIE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSIE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return; // database en lettertypes altijd via het netwerk
  if (url.pathname.includes('/media/')) { // animaties: na eerste keer offline beschikbaar
    e.respondWith(caches.open(VERSIE + '-media').then(c => c.match(e.request).then(hit => hit || fetch(e.request).then(r => { if (r.ok && r.status === 200) c.put(e.request, r.clone()); return r; }))));
    return;
  }
  // app zelf: eerst netwerk (altijd de nieuwste), offline uit de cache
  e.respondWith(fetch(e.request).then(r => { if (r.ok) caches.open(VERSIE).then(c => c.put(e.request, r.clone())); return r; }).catch(() => caches.match(e.request).then(hit => hit || caches.match('index.html'))));
});
