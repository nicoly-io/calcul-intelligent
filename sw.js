const CACHE_NAME = 'nicoly-pro-v1';
const assets = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './logo.png',
  './manifest.json'
];

// Installation du Service Worker et mise en cache des fichiers
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Mise en cache des ressources Nicoly-io');
      return cache.addAll(assets);
    })
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
});

// Récupération des ressources (permet le mode hors-ligne)
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});
