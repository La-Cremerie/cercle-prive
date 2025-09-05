import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Fonction de rendu robuste avec gestion d'erreur
const renderApp = () => {
  try {
    const root = ReactDOM.createRoot(document.getElementById('root')!);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Marquer React comme chargé
    document.body.classList.add('react-loaded');
    
    // Supprimer le loader initial
    const loader = document.getElementById('initial-loader');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 500);
      }, 100);
    }
    
  } catch (error) {
    console.error('Erreur lors du rendu React:', error);
    
    // Fallback d'urgence
    document.body.classList.add('react-loaded');
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.innerHTML = '<div style="color: #D97706; text-align: center; padding: 2rem;">Chargement en cours...</div>';
    }
    
    // Retry après 2 secondes
    setTimeout(() => {
      try {
        renderApp();
      } catch (retryError) {
        console.error('Erreur lors du retry:', retryError);
      }
    }, 2000);
  }
};

// Attendre que le DOM soit prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}

  // Service worker registration (après le rendu)
if ('serviceWorker' in navigator && location.protocol === 'https:') {
}