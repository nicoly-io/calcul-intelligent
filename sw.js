const CACHE_NAME = 'nicoly-pro-v5'; // Version augmentée pour forcer la mise à jour mobile
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

// Installation : Force le navigateur à charger les nouveaux fichiers immédiatement
self.addEventListener('install', event => {
  self.skipWaiting(); // Force le nouveau Service Worker à devenir actif
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Activation : Supprime l'ancien cache (v4) pour libérer de l'espace et éviter les conflits
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim(); // Prend le contrôle des pages immédiatement
});

// Stratégie : Récupère d'abord dans le cache, sinon sur le réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cacheRes => {
      return cacheRes || fetch(event.request);
    })
  );
});
