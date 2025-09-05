import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';

// Fonction de rendu optimisée pour HTTPS
const renderApp = () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('Element root non trouvé');
      return;
    }

    const root = createRoot(rootElement);
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
    // Masquer le loader immédiatement après rendu
    requestAnimationFrame(() => {
      document.body.classList.add('react-loaded');
    });
    
  } catch (error) {
    console.error('Erreur critique lors du rendu:', error);
  }
};

// Service worker registration (après le rendu)
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  setTimeout(() => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('Service Worker enregistré'))
      .catch(() => console.warn('Service Worker non disponible'));
  }, 1000);
}

// Rendu immédiat sans délai
renderApp();