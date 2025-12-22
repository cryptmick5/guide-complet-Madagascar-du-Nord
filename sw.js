const CACHE_NAME = 'mg-guide-cache-v16'; // Incremented to FINAL USER version
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './images/logo/favicon.png',
  './css/styles-premium.css',
  './data/lieux.js',
  './data/itineraires.js',
  './data/phrases.js',
  './js/app.js',
  './js/map-logic.js'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache v16');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. STRATEGIE IMAGES : Cache First, puis Network (et mise en cache dynamique)
  if (url.pathname.includes('/images/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          // Si trouvé en cache, on retourne
          if (response) return response;

          // Sinon on va chercher sur le réseau
          return fetch(event.request).then(networkResponse => {
            // On met en cache pour la prochaine fois
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // 2. STRATEGIE APP SHELL : Cache First (Statique)
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
