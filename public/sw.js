const CACHE_NAME = 'cercle-prive-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Installation optimisée HTTPS - Version robuste
self.addEventListener('install', (event) => {
  console.log('SW: Installation PWA v3');
  self.skipWaiting(); // Activation immédiate
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Cache PWA ouvert');
        return cache.addAll(urlsToCache).catch(err => {
          console.warn('SW: Erreur cache non-bloquante:', err);
          return Promise.resolve(); // Ne pas faire échouer l'installation
        });
      })
  );
});

// Activation immédiate
self.addEventListener('activate', (event) => {
  console.log('SW: Activation PWA');
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

// Stratégie Network First optimisée pour PWA
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Ignorer les requêtes externes non-HTTPS
  if (event.request.url.startsWith('http:') && 
      !event.request.url.includes('localhost') && 
      !event.request.url.includes('127.0.0.1')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache seulement les réponses valides
        if (response.status === 200 && (response.type === 'basic' || response.type === 'cors')) {
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
          // Retourner une réponse offline simple
          return new Response('Application hors ligne', {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
});