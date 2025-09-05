import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import LoginForm from './components/LoginForm';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    if (userLoggedIn === 'true') {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg font-light">Chargement...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-light text-yellow-600 tracking-wide mb-8">
            CERCLE PRIVÉ
          </h1>
          <div className="w-24 h-px bg-yellow-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300 font-light leading-relaxed max-w-3xl mx-auto mb-12">
            Bienvenue dans votre espace dédié à l'immobilier de prestige en off-market. 
            Découvrez nos biens d'exception sélectionnés avec soin pour votre patrimoine.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Concept
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light">
                L'excellence immobilière en toute discrétion
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Services
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light">
                Accompagnement personnalisé pour vos projets
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Contact
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light">
                <a href="mailto:nicolas.c@lacremerie.fr" className="text-yellow-600 hover:text-yellow-700">
                  nicolas.c@lacremerie.fr
                </a>
              </p>
            </div>
          </div>
          
          <div className="mt-16">
            <a
              href="mailto:nicolas.c@lacremerie.fr"
              className="inline-block border border-yellow-600 text-yellow-600 px-8 py-3 text-sm font-light tracking-wider hover:bg-yellow-600 hover:text-white transition-all duration-300"
            >
              Entrer en relation
            </a>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;