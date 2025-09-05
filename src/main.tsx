import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppression immédiate du loader
const loader = document.getElementById('initial-loader');
if (loader) {
  loader.remove();
}

// Rendu immédiat
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  // Fallback si pas de root
  document.body.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #111827; color: white; font-family: system-ui;">
      <div style="text-align: center;">
        <h1 style="color: #D97706; margin-bottom: 1rem;">CERCLE PRIVÉ</h1>
        <p>Erreur de chargement</p>
        <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #D97706; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
          Recharger
        </button>
      </div>
    </div>
  `;
}