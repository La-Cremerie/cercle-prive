import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';

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
const root = createRoot(document.getElementById('root')!);

// Gestion d'erreur globale pour éviter les pages blanches
window.addEventListener('error', (event) => {
  console.error('Erreur globale:', event.error);
  // En cas d'erreur critique, afficher un message d'erreur au lieu d'une page blanche
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejetée:', event.reason);
  // Empêcher que les promesses rejetées cassent l'app
  event.preventDefault();
});

root.render(<App />);

// Masquer le loader initial immédiatement
requestAnimationFrame(() => {
  document.body.classList.add('react-loaded');