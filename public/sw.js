const CACHE_NAME = 'cercle-prive-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/src/main.tsx',
  '/src/App.tsx'
];

// Installation PWA ultra-robuste - Version 4
self.addEventListener('install', (event) => {
  console.log('SW: Installation PWA v4 - Ultra-robuste');
  self.skipWaiting(); // Activation immédiate
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Cache PWA v4 ouvert');
        return cache.addAll(urlsToCache).catch(err => {
          console.warn('SW: Erreur cache non-bloquante:', err);
          return Promise.resolve(); // Ne pas faire échouer l'installation
        });
      })
  );
});

// Activation immédiate
self.addEventListener('activate', (event) => {
  console.log('SW: Activation PWA v4');
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

// Stratégie Cache First pour éviter les pages blanches
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
    caches.match(event.request)
      .then((cachedResponse) => {
        // Si en cache, retourner immédiatement
        if (cachedResponse) {
          console.log('SW: Ressource servie depuis le cache:', event.request.url);
          return cachedResponse;
        }
        
        // Sinon, essayer le réseau
        return fetch(event.request)
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
          .catch((error) => {
            console.warn('SW: Erreur réseau pour:', event.request.url, error);
            // Pour les pages, retourner la page d'accueil en cache
            if (event.request.mode === 'navigate') {
              return caches.match('/') || caches.match('/index.html');
            }
            throw error;
          });
      })
      .catch(() => {
        // Pour les pages, retourner la page d'accueil en cache
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        // Retourner une réponse offline simple
        return new Response('Application hors ligne', {
          status: 200,
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});