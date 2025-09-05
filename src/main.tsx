import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Rendu ultra-robuste avec gestion d'erreur
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Element root non trouvé');
  }
  
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('✅ React app montée avec succès');
} catch (error) {
  console.error('❌ Erreur critique lors du montage React:', error);
  
  // Fallback d'urgence
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="min-height: 100vh; background: #111827; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center;">
        <h1 style="color: #D97706; font-size: 2rem; font-weight: 300; letter-spacing: 0.1em; margin-bottom: 2rem;">CERCLE PRIVÉ</h1>
        <p style="color: #9CA3AF; margin-bottom: 2rem;">Erreur de chargement de l'application</p>
        <button onclick="window.location.reload()" style="background: #D97706; color: white; border: none; padding: 1rem 2rem; border-radius: 0.5rem; cursor: pointer; font-weight: 500;">
          Recharger la page
        </button>
      </div>
    `;
  }
}
