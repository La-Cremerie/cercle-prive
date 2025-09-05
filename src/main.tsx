  // Service worker registration (après le rendu)
if ('serviceWorker' in navigator && location.protocol === 'https:') {
    setTimeout(() => {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('Service Worker enregistré'))
            .catch(() => console.warn('Service Worker non disponible'));
    }, 1000);
}