import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Rendu immédiat et simple
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  // Marquer React comme chargé
  setTimeout(() => {
    document.body.classList.add('react-loaded');
  }, 100);
} else {
  console.error('Element root non trouvé');
}