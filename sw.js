const CACHE_NAME = 'mg-guide-cache-v6';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './images/logo/favicon.png',
  // Les données sont intégrées dans index.html, donc pas besoin de les mettre en cache séparément.
  // Les dépendances externes (Leaflet, Google Fonts) ne peuvent pas être mises en cache directement ici.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
      )
  );
});
