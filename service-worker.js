self.addEventListener('install', event => {
  self.skipWaiting(); // 🔥 iš karto aktyvuoti šį service worker
  event.waitUntil(
    caches.open('route-cache-v1').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json',
        './service-worker.js',
        'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
        'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  // 🔥 išvalo senas talpyklas, jeigu reikia
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== 'route-cache-v1')
            .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});
