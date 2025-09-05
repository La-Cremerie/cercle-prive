import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Point d'entrée simplifié
console.log('🔧 Main.tsx - Initialisation simplifiée');

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
    console.log('✅ Application React montée avec succès');
    
    // Marquer l'application comme prête
    setTimeout(() => {
      document.body.classList.add('app-loaded');
      console.log('🎉 Application complètement chargée');
    }, 500);
  } else {
    console.error('❌ Élément root non trouvé');
    throw new Error('Root element not found');
  }
} catch (error) {
  console.error('❌ Erreur critique lors du montage:', error);
  
  // Interface d'erreur simple
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #111827 0%, #1F2937 100%);
        color: white;
        font-family: system-ui, sans-serif;
        text-align: center;
        padding: 2rem;
      ">
        <div>
          <h1 style="color: #D97706; font-size: 2rem; margin-bottom: 1rem; font-weight: 300;">
            CERCLE PRIVÉ
          </h1>
          <p style="color: #9CA3AF; margin-bottom: 2rem; line-height: 1.6;">
            Nous rencontrons un problème technique temporaire.<br>
            Nos équipes travaillent à le résoudre rapidement.
          </p>
          <button onclick="window.location.reload()" style="
            background: #D97706;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.375rem;
            cursor: pointer;
            font-weight: 500;
          ">
            Réessayer
          </button>
        </div>
      </div>
    `;
  }
}