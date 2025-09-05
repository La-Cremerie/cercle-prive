import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';

// Service worker registration (non-blocking et sécurisé)
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker enregistré:', registration.scope);
      })
      .catch((error) => {
        console.warn('Service Worker non disponible:', error);
      });
  });
}

// Fonction de rendu ultra-simplifiée
const renderApp = () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Element root non trouvé');
    }

    const root = createRoot(rootElement);
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
    // Masquer le loader après rendu réussi
    setTimeout(() => {
      document.body.classList.add('react-loaded');
      const loader = document.getElementById('initial-loader');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
          if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 300);
      }
    }, 100);
    
  } catch (error) {
    console.error('Erreur critique lors du rendu:', error);
    
    // Fallback ultra-simple
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="min-height: 100vh; background: #111827; display: flex; align-items: center; justify-content: center; color: white; text-align: center; font-family: system-ui; padding: 1rem;">
          <div style="max-width: 400px;">
            <h1 style="color: #D97706; font-size: 1.5rem; margin-bottom: 1rem; font-weight: 300; letter-spacing: 0.1em;">CERCLE PRIVÉ</h1>
            <p style="color: #9CA3AF; margin-bottom: 1.5rem;">Erreur de chargement</p>
            <button onclick="window.location.reload()" style="padding: 0.75rem 1.5rem; background: #D97706; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 500;">
              Recharger
            </button>
          </div>
        </div>
      `;
    }
  }
};

// Gestion d'erreur globale simplifiée
window.addEventListener('error', (event) => {
  console.error('Erreur globale:', event.error);
  event.preventDefault(); // Empêcher l'affichage d'erreur par défaut
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejetée:', event.reason);
  event.preventDefault();
});

// Rendu immédiat sans délai
renderApp();