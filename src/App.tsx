import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

// Import direct des composants
import LoginForm from './components/LoginForm';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import NotreAdnSection from './components/NotreAdnSection';
import ServicesSection from './components/ServicesSection';
import OffMarketSection from './components/OffMarketSection';
import RechercheSection from './components/RechercheSection';
import PropertyGallery from './components/PropertyGallery';
import VendreSection from './components/VendreSection';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import Chatbot from './components/Chatbot';

// Fallback de chargement
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-light text-yellow-600 tracking-wider mb-4">
        CERCLE PRIVÉ
      </h1>
      <div className="w-8 h-8 border-2 border-gray-600 border-t-yellow-600 rounded-full animate-spin mx-auto"></div>
    </div>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Initialisation ultra-simple et robuste
  useEffect(() => {
    try {
      console.log('App initialization started');
      // Vérifier les connexions de manière sécurisée
      const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
      
      console.log('Login status check:', { userLoggedIn, adminLoggedIn });
      
      setIsUserLoggedIn(userLoggedIn);
      setIsAdminLoggedIn(adminLoggedIn);
      setAppReady(true);
      
      console.log('App ready, hiding loader');
      // Masquer le loader HTML
      document.body.classList.add('app-ready');
      const loader = document.getElementById('initial-loader');
      if (loader) {
        loader.style.display = 'none';
      }
    } catch (error) {
      console.warn('Erreur initialisation:', error);
      setHasError(true);
      setAppReady(true);
      document.body.classList.add('app-ready');
    }
  }, []);

  // Gestion d'erreur globale
  const handleError = (error: Error) => {
    console.error('Erreur App:', error);
    setHasError(true);
  };

  const handleLoginSuccess = () => {
    console.log('Login success callback triggered');
    setIsUserLoggedIn(true);
    setIsLoading(false);
  };

  // Fallback d'erreur
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-yellow-600 tracking-wider mb-4">
            CERCLE PRIVÉ
          </h1>
          <p className="text-gray-400 mb-6">Erreur de chargement</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            Recharger la page
          </button>
        </div>
      </div>
    );
  }

  // Attendre que l'app soit prête
  if (!appReady) {
    return <LoadingFallback />;
  }

  const toggleAdmin = () => {
    if (isAdminLoggedIn) {
      setShowAdmin(!showAdmin);
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setShowAdminLogin(false);
    setShowAdmin(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setShowAdmin(false);
  };

  const handleBackFromAdminLogin = () => {
    setShowAdminLogin(false);
  };

  // Si l'utilisateur n'est pas connecté, afficher le formulaire de connexion
  if (!isUserLoggedIn) {
    return (
      <>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Admin panel (development only)
  if (showAdmin && import.meta.env.DEV) {
    return (
      <>
        <AdminPanel onLogout={handleAdminLogout} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Admin login (development only)
  if (showAdminLogin && import.meta.env.DEV) {
    return (
      <>
        <AdminLogin 
          onLoginSuccess={handleAdminLoginSuccess}
          onBack={handleBackFromAdminLogin}
        />
        <Toaster position="top-right" />
      </>
    );
  }

  // Main site - show all sections
  return (
    <>
      <Navigation onAdminClick={import.meta.env.DEV ? toggleAdmin : undefined} />
      <HeroSection />
      <NotreAdnSection />
      <ServicesSection />
      <OffMarketSection />
      <RechercheSection />
      <PropertyGallery />
      <VendreSection />
      <PWAInstallPrompt />
      {import.meta.env.DEV && <Chatbot />}
      <Toaster position="top-right" />
    </>
  );
}

export default App;