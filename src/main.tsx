import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';

// Service worker registration (non-blocking)
if ('serviceWorker' in navigator) {
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

// Fonction de rendu sécurisée
const renderApp = () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Element root non trouvé');
    }

    const root = createRoot(rootElement);
    
    // Rendu avec gestion d'erreur
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
    // Masquer le loader initial après le rendu réussi
    setTimeout(() => {
      document.body.classList.add('react-loaded');
      const loader = document.getElementById('initial-loader');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 300);
      }
    }, 100);
    
  } catch (error) {
    console.error('Erreur critique lors du rendu:', error);
    
    // Masquer le loader
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.display = 'none';
    }
    
    // Afficher un message d'erreur de fallback
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="min-height: 100vh; background: #111827; display: flex; align-items: center; justify-content: center; color: white; text-align: center; font-family: system-ui; padding: 1rem;">
          <div style="max-width: 400px;">
            <h1 style="color: #D97706; font-size: 1.5rem; margin-bottom: 1rem; font-weight: 300; letter-spacing: 0.1em;">CERCLE PRIVÉ</h1>
            <p style="color: #9CA3AF; margin-bottom: 1.5rem;">Erreur critique de rendu</p>
            <button onclick="window.location.reload()" style="padding: 0.75rem 1.5rem; background: #D97706; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 500;">
              Recharger
            </button>
            <div style="margin-top: 1rem;">
              <button onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload();" style="padding: 0.5rem 1rem; background: transparent; color: #6B7280; border: 1px solid #374151; border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem;">
                Réinitialiser
              </button>
            </div>
            <div style="margin-top: 1rem;">
              <a href="mailto:nicolas.c@lacremerie.fr" style="color: #D97706; text-decoration: none; font-size: 0.875rem;">
                Contacter le support
              </a>
            </div>
          </div>
        </div>
      `;
    }
  }
};

// Gestion d'erreur globale améliorée
window.addEventListener('error', (event) => {
  console.error('Erreur globale:', event.error);
  
  // Masquer le loader en cas d'erreur
  const loader = document.getElementById('initial-loader');
  if (loader) {
    loader.style.display = 'none';
  }
  
  // Afficher un message d'erreur si la page est vide
  const rootElement = document.getElementById('root');
  if (rootElement && (!rootElement.innerHTML || rootElement.innerHTML.trim() === '')) {
    rootElement.innerHTML = `
      <div style="min-height: 100vh; background: #111827; display: flex; align-items: center; justify-content: center; color: white; text-align: center; font-family: system-ui;">
        <div style="max-width: 400px; padding: 2rem;">
          <h1 style="color: #D97706; font-size: 1.5rem; margin-bottom: 1rem; font-weight: 300; letter-spacing: 0.1em;">CERCLE PRIVÉ</h1>
          <p style="color: #9CA3AF; margin-bottom: 1.5rem;">Une erreur technique est survenue</p>
          <button onclick="window.location.reload()" style="padding: 0.75rem 1.5rem; background: #D97706; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 500;">
            Recharger la page
          </button>
          <div style="margin-top: 1rem;">
            <button onclick="localStorage.clear(); window.location.reload();" style="padding: 0.5rem 1rem; background: transparent; color: #6B7280; border: 1px solid #374151; border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem;">
              Réinitialiser les données
            </button>
          </div>
        </div>
      </div>
    `;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejetée:', event.reason);
  event.preventDefault();
});

// Rendu immédiat
renderApp();