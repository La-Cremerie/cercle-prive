// Service Worker optimisé pour Vite PWA
// Ce fichier est maintenant géré par vite-plugin-pwa

const CACHE_NAME = 'cercle-prive-v6';

// Installation simplifiée
self.addEventListener('install', (event) => {
  console.log('SW: Installation v6');
  self.skipWaiting();
});

// Activation immédiate
self.addEventListener('activate', (event) => {
  console.log('SW: Activation v6');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Stratégie de cache simplifiée
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // Laisser vite-plugin-pwa gérer la mise en cache des assets
  if (event.request.url.includes('/assets/')) {
    return;
  }
  
  // Cache First pour les images Pexels
  if (event.request.url.includes('images.pexels.com')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(fetchResponse => {
          const responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return fetchResponse;
        });
      })
    );
  }
});