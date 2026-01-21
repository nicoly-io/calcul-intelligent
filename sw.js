// Version 10 - Force la mise à jour sur tous les appareils
const CACHE_NAME = 'nicoly-ultimate-v10';

// Liste des fichiers essentiels à sauvegarder pour le mode hors-ligne
const assets = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './favicon.ico',
  './logo.png',
  './apple-touch-icon.png'
];

// 1. INSTALLATION : Télécharge les fichiers dans le cache du téléphone
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Force l'activation immédiate
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Hub Nicoly-io : Mise en cache sécurisée');
      return cache.addAll(assets);
    })
  );
});

// 2. ACTIVATION : Supprime les vieilles versions (v7, v8, etc.) pour libérer de l'espace
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    })
  );
  return self.clients.claim(); // Prend le contrôle du site sans rafraîchir
});

// 3. FETCH : Récupère les fichiers du cache si l'élève n'a pas de connexion
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
