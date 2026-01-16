const CACHE_NAME = 'nicoly-pro-v4';
const assets = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './logo.png',
  './favicon.ico',
  './apple-touch-icon.png'
];

// Installation : Mise en cache de tous les fichiers du projet
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Installation : Mise en cache des ressources Nicoly-io Pro');
      return cache.addAll(assets);
    })
  );
});

// Activation : Nettoyage des anciennes versions pour éviter les bugs
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
});

// Stratégie de récupération : Priorité au cache (Offline First)
// Si l'utilisateur est hors-ligne, le SW servira les fichiers déjà stockés.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cacheRes => {
      return cacheRes || fetch(event.request);
    })
  );
});
