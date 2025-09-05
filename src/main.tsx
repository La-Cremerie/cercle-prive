import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Fonction de rendu anti-FOUC avec signalisation
const renderApp = () => {
  try {
    const root = ReactDOM.createRoot(document.getElementById('root')!);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Signal immédiat que React est prêt
    window.dispatchEvent(new Event('reactReady'));
    
    console.log('✅ React app rendu avec succès');
    
  } catch (error) {
    console.error('Erreur lors du rendu React:', error);
    
    // En cas d'erreur, masquer quand même le loader
    setTimeout(() => {
      window.dispatchEvent(new Event('reactReady'));
    }, 1000);
  }
};

// Rendu immédiat pour éviter le FOUC
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}

// Service worker registration (optionnel)
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  // Enregistrement différé pour ne pas impacter le chargement
  setTimeout(() => {
    navigator.serviceWorker.register('/sw.js').catch(console.warn);
  }, 2000);
}