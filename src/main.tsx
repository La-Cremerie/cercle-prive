import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// Import i18n seulement si nécessaire
// import './i18n';

// Service worker simplifié
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker enregistré avec succès:', registration.scope);
      })
      .catch((error) => {
        console.warn('Service Worker non disponible:', error);
      });
  });
}

// Optimisation du rendu initial
createRoot(document.getElementById('root')!).render(
  <App />
);

// Masquer le loader initial immédiatement
requestAnimationFrame(() => {
  document.body.classList.add('react-loaded');