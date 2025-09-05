const CACHE_NAME = 'cercle-prive-https-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/src/main.tsx',
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
  );
});

self.addEventListener('fetch', (event) => {
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
        // Ne pas faire échouer l'installation
        return response;
      })
      .catch(() => {
        // Fallback vers le cache en cas d'échec réseau
        return caches.match(event.request);
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
});