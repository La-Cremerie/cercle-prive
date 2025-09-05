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

// Timeout de sécurité pour éviter le blocage
let appMounted = false;

// Fonction de rendu avec gestion d'erreur
const renderApp = () => {
  try {
    root.render(<App />);
    appMounted = true;
    
    // Masquer le loader initial après le rendu réussi
    setTimeout(() => {
      document.body.classList.add('react-loaded');
    }, 100);
  } catch (error) {
    console.error('Erreur critique lors du rendu:', error);
    
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
          </div>
        </div>
      `;
    }
    
    // Masquer le loader initial
    document.body.classList.add('react-loaded');
  }
};

// Gestion d'erreur globale pour éviter les pages blanches
window.addEventListener('error', (event) => {
  console.error('Erreur globale:', event.error);
  
  // En cas d'erreur critique, afficher un message d'erreur au lieu d'une page blanche
  const rootElement = document.getElementById('root');
  if (rootElement && (!rootElement.innerHTML || rootElement.innerHTML.trim() === '')) {
    rootElement.innerHTML = `
      <div style="min-height: 100vh; background: #111827; display: flex; align-items: center; justify-content: center; color: white; text-align: center; font-family: system-ui;">
        <div style="max-width: 400px; padding: 2rem;">
          <h1 style="color: #D97706; font-size: 1.5rem; margin-bottom: 1rem; font-weight: 300; letter-spacing: 0.1em;">CERCLE PRIVÉ</h1>
          <p style="color: #9CA3AF; margin-bottom: 1.5rem;">Une erreur technique est survenue</p>
          <button onclick="window.location.reload()" style="padding: 0.75rem 1.5rem; background: #D97706; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 500; transition: background-color 0.2s;">
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
  
  // Empêcher que les promises rejetées cassent l'app
  event.preventDefault();
  
  // Si c'est une erreur critique de chargement, afficher un fallback
  if (event.reason?.message?.includes('Loading') || event.reason?.message?.includes('import')) {
    const rootElement = document.getElementById('root');
    if (rootElement && (!rootElement.innerHTML || rootElement.innerHTML.trim() === '')) {
      rootElement.innerHTML = `
        <div style="min-height: 100vh; background: #111827; display: flex; align-items: center; justify-content: center; color: white; text-align: center; font-family: system-ui;">
          <div style="max-width: 400px; padding: 2rem;">
            <h1 style="color: #D97706; font-size: 1.5rem; margin-bottom: 1rem; font-weight: 300; letter-spacing: 0.1em;">CERCLE PRIVÉ</h1>
            <p style="color: #9CA3AF; margin-bottom: 1.5rem;">Problème de chargement des ressources</p>
            <button onclick="window.location.reload()" style="padding: 0.75rem 1.5rem; background: #D97706; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 500;">
              Recharger
            </button>
          </div>
        </div>
      `;
    }
  }
});

// Rendu avec protection
renderApp();
