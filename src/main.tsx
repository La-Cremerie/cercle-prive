import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Composant d'erreur de fallback
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
    <div className="text-center max-w-md">
      <h1 className="text-2xl font-light text-yellow-600 tracking-wider mb-4">
        CERCLE PRIVÉ
      </h1>
      <p className="text-gray-400 mb-6">
        Erreur de chargement de l'application
      </p>
      <div className="space-y-3">
        <button
          onClick={() => window.location.reload()}
          className="w-full px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
        >
          Recharger la page
        </button>
        <button
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
          }}
          className="w-full px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Vider le cache et recharger
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Erreur: {error.message}
      </p>
    </div>
  </div>
);

// Boundary d'erreur React
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Rendu ultra-robuste avec gestion d'erreur complète
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Element root non trouvé');
  }
  
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  
  console.log('✅ React app montée avec succès');
  
  // Masquer le loader après le montage réussi
  setTimeout(() => {
    document.body.classList.add('app-loaded');
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.display = 'none';
    }
  }, 100);
  
} catch (error) {
  console.error('❌ Erreur critique lors du montage React:', error);
  
  // Fallback d'urgence
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="min-height: 100vh; background: #111827; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center;">
        <h1 style="color: #D97706; font-size: 2rem; font-weight: 300; letter-spacing: 0.1em; margin-bottom: 2rem;">CERCLE PRIVÉ</h1>
        <p style="color: #9CA3AF; margin-bottom: 2rem;">Erreur critique de chargement</p>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
          <button onclick="window.location.reload()" style="background: #D97706; color: white; border: none; padding: 1rem 2rem; border-radius: 0.5rem; cursor: pointer; font-weight: 500;">
            Recharger la page
          </button>
          <button onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload();" style="background: #6B7280; color: white; border: none; padding: 1rem 2rem; border-radius: 0.5rem; cursor: pointer; font-weight: 500;">
            Vider le cache
          </button>
          <button onclick="window.location.href='mailto:nicolas.c@lacremerie.fr?subject=Erreur technique site'" style="background: transparent; color: #D97706; border: 1px solid #D97706; padding: 1rem 2rem; border-radius: 0.5rem; cursor: pointer; font-weight: 500;">
            Signaler le problème
          </button>
        </div>
        <p style="color: #6B7280; font-size: 0.8rem; margin-top: 2rem;">
          Erreur: ${error.message}
        </p>
      </div>
    `;
  }
  
  // Masquer le loader même en cas d'erreur
  document.body.classList.add('app-loaded');
  const loader = document.getElementById('initial-loader');
  if (loader) {
    loader.style.display = 'none';
  }
  }
}
