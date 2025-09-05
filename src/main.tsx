  }, 1000);
}
    navigator.serviceWorker.register('/sw.js')
  setTimeout(() => {
      .then(() => console.log('Service Worker enregistré'))
if ('serviceWorker' in navigator && location.protocol === 'https:') {
      .catch(() => console.warn('Service Worker non disponible'));
// Service worker registration (après le rendu)