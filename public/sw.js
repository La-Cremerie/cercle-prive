// Service Worker Optimisé pour Performance et Stabilité HTTPS
const CACHE_NAME = 'cercle-prive-v3-optimized';
const STATIC_CACHE = 'static-assets-v3';
const IMAGES_CACHE = 'images-cache-v3';
const API_CACHE = 'api-cache-v3';

// Ressources critiques à mettre en cache immédiatement
const CRITICAL_RESOURCES = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Ressources statiques à mettre en cache
const STATIC_RESOURCES = [
  '/src/main.tsx',
  '/src/index.css'
];

// Installation optimisée avec gestion d'erreur robuste
self.addEventListener('install', (event) => {
  console.log('SW: Installation optimisée v3');
  self.skipWaiting();
  
  event.waitUntil(
    Promise.all([
      // Cache des ressources critiques
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(CRITICAL_RESOURCES).catch(err => {
          console.warn('SW: Erreur cache critique (non-bloquante):', err);
          return Promise.resolve();
        });
      }),
      // Cache des ressources statiques
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll(STATIC_RESOURCES).catch(err => {
          console.warn('SW: Erreur cache statique (non-bloquante):', err);
          return Promise.resolve();
        });
      })
    ]).catch(err => {
      console.warn('SW: Erreur installation (non-bloquante):', err);
      return Promise.resolve();
    })
  );
});

// Activation avec nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activation optimisée v3');
  
  event.waitUntil(
    Promise.all([
      // Nettoyer les anciens caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (![CACHE_NAME, STATIC_CACHE, IMAGES_CACHE, API_CACHE].includes(cacheName)) {
              console.log('SW: Suppression ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Prendre contrôle immédiatement
      self.clients.claim()
    ]).catch(err => {
      console.warn('SW: Erreur activation (non-bloquante):', err);
      return Promise.resolve();
    })
  );
});

// Stratégie de cache intelligente par type de ressource
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-GET et problématiques
  if (request.method !== 'GET' || 
      url.protocol === 'chrome-extension:' ||
      url.protocol === 'moz-extension:' ||
      url.protocol === 'safari-extension:' ||
      url.hostname === 'localhost' && url.port === '24678') {
    return;
  }

  // Stratégie par type de ressource
  if (url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
    // Images : Cache First avec fallback
    event.respondWith(handleImageRequest(request));
  } else if (url.pathname.match(/\.(css|js)$/i)) {
    // Assets statiques : Stale While Revalidate
    event.respondWith(handleStaticAssets(request));
  } else if (url.hostname === 'images.pexels.com') {
    // Images Pexels : Cache First longue durée
    event.respondWith(handlePexelsImages(request));
  } else {
    // Pages HTML : Network First avec fallback
    event.respondWith(handlePageRequest(request));
  }
});

// Gestion optimisée des images
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGES_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Revalidation en arrière-plan
      fetch(request).then(response => {
        if (response && response.ok) {
          cache.put(request, response.clone());
        }
      }).catch(() => {}); // Erreur silencieuse
      
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
    
  } catch (error) {
    console.warn('SW: Erreur image:', error);
    // Retourner une image placeholder en cas d'échec
    return new Response(
      '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#f3f4f6"/><text x="200" y="150" text-anchor="middle" fill="#9ca3af">Image indisponible</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Gestion des images Pexels
async function handlePexelsImages(request) {
  try {
    const cache = await caches.open(IMAGES_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
    
  } catch (error) {
    console.warn('SW: Erreur Pexels:', error);
    return new Response('', { status: 503 });
  }
}

// Gestion des assets statiques
async function handleStaticAssets(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    
    // Essayer le réseau d'abord
    try {
      const networkResponse = await fetch(request);
      if (networkResponse && networkResponse.ok) {
        cache.put(request, networkResponse.clone());
        return networkResponse;
      }
    } catch (networkError) {
      console.warn('SW: Réseau indisponible pour asset:', request.url);
    }
    
    // Fallback vers le cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw new Error('Asset non disponible');
    
  } catch (error) {
    console.warn('SW: Erreur asset statique:', error);
    return new Response('/* Asset temporairement indisponible */', {
      status: 503,
      headers: { 'Content-Type': 'text/css' }
    });
  }
}

// Gestion des pages HTML
async function handlePageRequest(request) {
  try {
    // Network First pour les pages
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
  } catch (networkError) {
    console.warn('SW: Réseau indisponible pour page:', request.url);
  }
  
  // Fallback vers le cache
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback vers la page d'accueil
    const indexResponse = await cache.match('/');
    if (indexResponse) {
      return indexResponse;
    }
    
  } catch (cacheError) {
    console.warn('SW: Erreur cache:', cacheError);
  }
  
  // Dernière option : page d'erreur propre
  return new Response(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CERCLE PRIVÉ - Connexion en cours</title>
      <style>
        body { 
          font-family: system-ui, sans-serif; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          height: 100vh; 
          margin: 0; 
          background: #111827; 
          color: white; 
          text-align: center; 
        }
        .logo { color: #D97706; font-size: 2rem; font-weight: 300; margin-bottom: 1rem; }
        .message { color: #9CA3AF; margin-bottom: 2rem; }
        .retry { 
          background: #D97706; 
          color: white; 
          border: none; 
          padding: 0.75rem 1.5rem; 
          border-radius: 0.375rem; 
          cursor: pointer; 
          font-size: 1rem;
        }
        .retry:hover { background: #B45309; }
      </style>
    </head>
    <body>
      <div>
        <h1 class="logo">CERCLE PRIVÉ</h1>
        <p class="message">Connexion en cours...<br>Veuillez patienter ou vérifier votre connexion internet.</p>
        <button class="retry" onclick="window.location.reload()">Réessayer</button>
      </div>
    </body>
    </html>
  `, {
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    }
  });
}

// Gestion des erreurs globales du Service Worker
self.addEventListener('error', (event) => {
  console.error('SW: Erreur globale:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.warn('SW: Promise rejetée:', event.reason);
  event.preventDefault();
});

// Nettoyage périodique du cache
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    cleanOldCaches();
  }
});

async function cleanOldCaches() {
  try {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
      !name.includes('v3') && 
      (name.includes('cercle-prive') || name.includes('images-cache') || name.includes('static-assets'))
    );
    
    await Promise.all(oldCaches.map(name => caches.delete(name)));
    console.log('SW: Anciens caches nettoyés:', oldCaches.length);
  } catch (error) {
    console.warn('SW: Erreur nettoyage cache:', error);
  }
}