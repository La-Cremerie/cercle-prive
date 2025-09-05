const CACHE_NAME = 'cercle-prive-v2';
const urlsToCache = [
  '/',
  '/manifest.json'
];

// Installation sécurisée pour HTTPS
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.warn('Service Worker: Erreur cache:', error);
      })
  );
  // Activer immédiatement
  self.skipWaiting();
});

// Activation sécurisée
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression cache obsolète:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Prendre le contrôle immédiatement
      return self.clients.claim();
    })
  );
});

// Stratégie de cache optimisée pour HTTPS
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-HTTPS en production
  if (event.request.url.startsWith('http:') && location.protocol === 'https:') {
    return;
  }

  // Stratégie Network First pour les pages HTML
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Mettre en cache seulement si la réponse est OK
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.warn('Erreur mise en cache:', error);
              });
          }
          return response;
        })
        .catch(() => {
          // Fallback vers le cache seulement en cas d'échec réseau
          return caches.match(event.request);
        })
    );
    return;
  }

  // Pour les autres ressources, essayer le cache d'abord
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then((response) => {
            // Ne pas mettre en cache les erreurs
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.warn('Erreur mise en cache:', error);
              });

            return response;
          });
      })
      .catch((error) => {
        console.warn('Service Worker: Erreur fetch:', error);
        // Retourner une réponse par défaut en cas d'erreur
        return new Response('Service temporairement indisponible', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});