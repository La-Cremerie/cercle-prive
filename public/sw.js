const CACHE_NAME = 'cercle-prive-v5';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/assets/index.css',
  '/assets/index.js'
];

// Installation PWA ultra-robuste - Version 5
self.addEventListener('install', (event) => {
  console.log('SW: Installation PWA v5 - Correction page blanche');
  self.skipWaiting(); // Activation immédiate
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Cache PWA v5 ouvert');
        return cache.addAll(urlsToCache).catch(err => {
          console.warn('SW: Erreur cache non-bloquante:', err);
          return Promise.resolve(); // Ne pas faire échouer l'installation
        });
      })
  );
});

// Activation immédiate
self.addEventListener('activate', (event) => {
  console.log('SW: Activation PWA v5');
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

// Stratégie Network First pour le contenu principal, Cache First pour les assets
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

  // Stratégie différente selon le type de ressource
  const isNavigationRequest = event.request.mode === 'navigate';
  const isAssetRequest = event.request.url.includes('/assets/') || 
                        event.request.url.includes('.css') || 
                        event.request.url.includes('.js') ||
                        event.request.url.includes('.png') ||
                        event.request.url.includes('.jpg') ||
                        event.request.url.includes('.webp');

  event.respondWith(
    (async () => {
      try {
        if (isNavigationRequest) {
          // Pour les pages : Network First avec fallback cache
          try {
            const networkResponse = await fetch(event.request);
            if (networkResponse.ok) {
              const cache = await caches.open(CACHE_NAME);
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            }
          } catch (networkError) {
            console.warn('SW: Erreur réseau navigation:', networkError);
          }
          
          // Fallback vers le cache
          const cachedResponse = await caches.match('/') || await caches.match('/index.html');
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Dernière option : page d'erreur simple
          return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>CERCLE PRIVÉ - Hors ligne</title>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0;padding:2rem;background:#111827;color:white;font-family:system-ui;text-align:center;">
              <h1 style="color:#D97706;font-weight:300;letter-spacing:0.1em;">CERCLE PRIVÉ</h1>
              <p style="color:#9CA3AF;margin:2rem 0;">Application temporairement indisponible</p>
              <button onclick="window.location.reload()" style="background:#D97706;color:white;border:none;padding:1rem 2rem;border-radius:0.5rem;cursor:pointer;">
                Réessayer
              </button>
            </body>
            </html>
          `, {
            status: 200,
            headers: { 'Content-Type': 'text/html' }
          });
        }
        
        if (isAssetRequest) {
          // Pour les assets : Cache First
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          try {
            const networkResponse = await fetch(event.request);
            if (networkResponse.ok) {
              const cache = await caches.open(CACHE_NAME);
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          } catch (error) {
            console.warn('SW: Asset non disponible:', event.request.url);
            throw error;
          }
        }
        
        // Pour les autres requêtes : Network First
        try {
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          throw error;
        }
        
      } catch (error) {
        console.error('SW: Erreur générale:', error);
        return new Response('Erreur de chargement', {
          status: 500,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    })()
  );
});