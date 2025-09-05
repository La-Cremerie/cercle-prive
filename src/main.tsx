import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Version ultra-simple pour tester
function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-light mb-4">CERCLE PRIVÉ</h1>
        <p className="text-gray-300">L'excellence immobilière en toute discrétion</p>
        <button 
          onClick={() => alert('Site fonctionnel!')}
          className="mt-8 px-6 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Tester l'interactivité
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);