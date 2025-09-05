import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

// Import direct des composants pour éviter les problèmes de chargement
const LoginForm = React.lazy(() => import('./components/LoginForm'));
const Navigation = React.lazy(() => import('./components/Navigation'));
const HeroSection = React.lazy(() => import('./components/HeroSection'));
const NotreAdnSection = React.lazy(() => import('./components/NotreAdnSection'));
const ServicesSection = React.lazy(() => import('./components/ServicesSection'));
const OffMarketSection = React.lazy(() => import('./components/OffMarketSection'));
const RechercheSection = React.lazy(() => import('./components/RechercheSection'));
const PropertyGallery = React.lazy(() => import('./components/PropertyGallery'));
const VendreSection = React.lazy(() => import('./components/VendreSection'));
const PWAInstallPrompt = React.lazy(() => import('./components/PWAInstallPrompt'));
const AdminLogin = React.lazy(() => import('./components/AdminLogin'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));
const Chatbot = React.lazy(() => import('./components/Chatbot'));
const Footer = React.lazy(() => import('./components/Footer'));
const ContactSection = React.lazy(() => import('./components/ContactSection'));

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
      // Vérifier les connexions de manière sécurisée
      const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
      
      setIsUserLoggedIn(userLoggedIn);
      setIsAdminLoggedIn(adminLoggedIn);
      setAppReady(true);
      
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
    setIsUserLoggedIn(true);
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
      <React.Suspense fallback={<LoadingFallback />}>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
        <Toaster position="top-right" />
      </React.Suspense>
    );
  }

  // Admin panel (développement uniquement)
  if (showAdmin && import.meta.env.DEV) {
    return (
      <React.Suspense fallback={<LoadingFallback />}>
        <AdminPanel onLogout={handleAdminLogout} />
        <Toaster position="top-right" />
      </React.Suspense>
    );
  }

  // Admin login (développement uniquement)
  if (showAdminLogin && import.meta.env.DEV) {
    return (
      <React.Suspense fallback={<LoadingFallback />}>
        <AdminLogin 
          onLoginSuccess={handleAdminLoginSuccess}
          onBack={handleBackFromAdminLogin}
        />
        <Toaster position="top-right" />
      </React.Suspense>
    );
  }

  // Site principal
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Navigation onAdminClick={import.meta.env.DEV ? toggleAdmin : undefined} />
        <HeroSection />
        <NotreAdnSection />
        <ServicesSection />
        <OffMarketSection />
        <RechercheSection />
        <PropertyGallery />
        <VendreSection />
        <ContactSection />
        <Footer />
        <Chatbot />
        <PWAInstallPrompt />
      </div>
      <Toaster position="top-right" />
    </React.Suspense>
  );
}

export default App;