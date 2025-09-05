import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundaryManager } from './utils/errorBoundary';
import { PerformanceOptimizer } from './utils/performance';

// Diagnostic et récupération automatique
console.log('🔧 Main.tsx - Initialisation du diagnostic');

// Initialiser les gestionnaires d'erreur
ErrorBoundaryManager.getInstance().init();
PerformanceOptimizer.getInstance().init();

// Fonction de diagnostic de l'état de l'application
function diagnoseApplicationState() {
  const checks = {
    domReady: document.readyState === 'complete',
    rootElement: !!document.getElementById('root'),
    reactAvailable: typeof React !== 'undefined',
    vitalsSupported: 'PerformanceObserver' in window,
    storageAvailable: (() => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch (e) {
        return false;
      }
    })()
  };
  
  console.log('📊 État de l\'application:', checks);
  return checks;
}

// Fonction de récupération en cas d'erreur
function attemptRecovery(error) {
  console.error('🚨 Erreur critique détectée:', error);
  
  // Nettoyer le localStorage corrompu
  try {
    const corruptedKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        JSON.parse(localStorage.getItem(key) || '{}');
      } catch (e) {
        corruptedKeys.push(key);
      }
    }
    
    corruptedKeys.forEach(key => {
      console.warn('🧹 Suppression clé corrompue:', key);
      localStorage.removeItem(key);
    });
  } catch (e) {
    console.warn('Erreur nettoyage localStorage:', e);
  }
  
  // Afficher un message d'erreur utilisateur-friendly
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
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
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
            <button onclick="localStorage.clear(); window.location.reload();" style="
              background: transparent;
              color: #D97706;
              border: 1px solid #D97706;
              padding: 0.75rem 1.5rem;
              border-radius: 0.375rem;
              cursor: pointer;
              font-weight: 500;
            ">
              Vider le cache
            </button>
            <a href="mailto:nicolas.c@lacremerie.fr?subject=Problème technique site" style="
              background: transparent;
              color: #9CA3AF;
              border: 1px solid #4B5563;
              padding: 0.75rem 1.5rem;
              border-radius: 0.375rem;
              text-decoration: none;
              font-weight: 500;
              display: inline-block;
            ">
              Contacter le support
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

// Rendu simple et direct
try {
  // Diagnostic initial
  const initialDiagnosis = diagnoseApplicationState();
  
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
  attemptRecovery(error);
}