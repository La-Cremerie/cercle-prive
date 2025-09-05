import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Optimisations de performance globales
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW: Enregistré avec succès');
        
        // Nettoyage périodique du cache
        setInterval(() => {
          registration.active?.postMessage({ type: 'CLEAN_CACHE' });
        }, 24 * 60 * 60 * 1000); // Tous les jours
      })
      .catch(error => {
        console.warn('SW: Erreur enregistrement (non-bloquante):', error);
      });
  });
}

// Préchargement des ressources critiques
const preloadCriticalResources = () => {
  const criticalImages = [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Optimisations de performance
const optimizePerformance = () => {
  // Préchargement des ressources
  preloadCriticalResources();
  
  // Optimisation des fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preconnect';
  fontLink.href = 'https://fonts.googleapis.com';
  document.head.appendChild(fontLink);
  
  // Optimisation des images Pexels
  const pexelsLink = document.createElement('link');
  pexelsLink.rel = 'preconnect';
  pexelsLink.href = 'https://images.pexels.com';
  document.head.appendChild(pexelsLink);
};

// Gestion d'erreur globale pour HTTPS
window.addEventListener('error', (e) => {
  console.warn('Erreur globale capturée:', e.error);
  // Ne pas bloquer le rendu pour les erreurs non-critiques
});

window.addEventListener('unhandledrejection', (e) => {
  console.warn('Promise rejetée:', e.reason);
  // Ne pas bloquer le rendu pour les promesses rejetées
  e.preventDefault();
});

// Optimisations au chargement
optimizePerformance();

// Rendu simple et direct
try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('Application React montée avec succès');
    
    // Marquer l'application comme prête
    setTimeout(() => {
      document.body.classList.add('fade-in-ready');
    }, 100);
  } else {
    console.error('Élément root non trouvé');
  }
} catch (error) {
  console.error('Erreur lors du montage de l\'application:', error);
  // Afficher un message d'erreur basique
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
      <div style="text-align: center; padding: 2rem;">
        <h1 style="color: #D97706; margin-bottom: 1rem;">CERCLE PRIVÉ</h1>
        <p style="color: #666;">Chargement en cours...</p>
        <p style="color: #999; font-size: 0.8rem; margin-top: 1rem;">Si cette page persiste, veuillez actualiser.</p>
      </div>
    </div>
  `;
}
