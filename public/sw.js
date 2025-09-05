const CACHE_NAME = 'cercle-prive-https-v2';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/src/main.tsx'
];

// Installation optimisée HTTPS - Version robuste
self.addEventListener('install', (event) => {
  console.log('SW: Installation HTTPS');
  self.skipWaiting(); // Activation immédiate
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Cache HTTPS ouvert');
        return cache.addAll(urlsToCache).catch(err => {
          console.warn('SW: Erreur cache non-bloquante:', err);
          return Promise.resolve(); // Ne pas faire échouer l'installation
        });
      })
  );
});

// Activation immédiate
self.addEventListener('activate', (event) => {
  console.log('SW: Activation HTTPS');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim(); // Prendre contrôle immédiatement
    })
  );
});

// Stratégie Network First optimisée pour HTTPS
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Ignorer les requêtes non-HTTPS en développement
  if (event.request.url.startsWith('http:') && !event.request.url.includes('localhost')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache seulement les réponses valides
        if (response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache))
            .catch(err => console.warn('SW: Erreur cache:', err));
        }
        return response;
      })
      .catch(() => {
        // Fallback vers le cache uniquement pour les ressources importantes
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Pour les pages, retourner la page d'accueil en cache
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          throw new Error('Ressource non disponible');
        });
      })
  );
});