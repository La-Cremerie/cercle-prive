import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

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
