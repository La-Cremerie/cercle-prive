const CACHE_NAME = 'cercle-prive-https-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/src/main.tsx'
];

// Installation optimisée HTTPS
self.addEventListener('install', (event) => {
  console.log('SW: Installation HTTPS');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Cache HTTPS ouvert');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.warn('SW: Erreur cache HTTPS:', error);
        // Ne pas faire échouer l'installation
        return Promise.resolve();
      })
  );
  // Activer immédiatement pour HTTPS
  self.skipWaiting();
});

// Activation optimisée HTTPS
self.addEventListener('activate', (event) => {
  console.log('SW: Activation HTTPS');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Suppression cache obsolète:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
    .catch((error) => {
      console.warn('SW: Erreur activation:', error);
      return Promise.resolve();
    })
  );
});

// Stratégie Network First pour HTTPS
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-HTTPS
  if (event.request.url.startsWith('http:')) {
    return;
  }

  // Stratégie simple : Network First avec fallback cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache les réponses valides
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache))
            .catch(() => {}); // Ignorer les erreurs de cache
        }
        return response;
      })
      .catch(() => {
        // Fallback vers le cache en cas d'échec réseau
        return caches.match(event.request);
      })
  );
});