import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader2, AlertTriangle, RefreshCw, Home } from 'lucide-react';

// Import direct des composants essentiels pour éviter les problèmes de lazy loading
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

// Composants admin uniquement en développement
const AdminLogin = React.lazy(() => import('./components/AdminLogin'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));
const Chatbot = React.lazy(() => import('./components/Chatbot'));

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Admin states only in development
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Initialisation ultra-rapide
  useEffect(() => {
    try {
      // Vérification synchrone de l'état de connexion
      const userLoggedIn = localStorage.getItem('userLoggedIn');
      const adminLoggedIn = isDevelopment ? localStorage.getItem('adminLoggedIn') : null;
      
      if (userLoggedIn === 'true') {
        setIsLoggedIn(true);
      }
      
      if (isDevelopment && adminLoggedIn === 'true') {
        setIsAdminLoggedIn(true);
      }
    } catch (err) {
      console.warn('Erreur localStorage:', err);
      // Continuer même en cas d'erreur localStorage
    }
    
    // Terminer l'initialisation immédiatement
    setIsInitializing(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setError(null);
  };

  const toggleAdmin = () => {
    if (!isDevelopment) return;
    
    if (isAdminLoggedIn) {
      setShowAdmin(!showAdmin);
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    if (!isDevelopment) return;
    setIsAdminLoggedIn(true);
    setShowAdminLogin(false);
    setShowAdmin(true);
  };

  const handleAdminLogout = () => {
    if (!isDevelopment) return;
    setIsAdminLoggedIn(false);
    setShowAdmin(false);
  };

  const handleBackFromAdminLogin = () => {
    if (!isDevelopment) return;
    setShowAdminLogin(false);
  };

  // Écran de chargement initial minimal
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-yellow-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-light text-white tracking-wider">CERCLE PRIVÉ</h2>
          <p className="text-gray-400 text-sm mt-2">Initialisation...</p>
        </div>
      </div>
    );
  }

  // Affichage d'erreur si problème
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-light text-white mb-4 tracking-wider">
            Problème technique
          </h2>
          <p className="text-gray-400 font-light mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Recharger la page</span>
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Login
  if (!isLoggedIn) {
    return (
      <>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Admin login (développement uniquement)
  if (isDevelopment && showAdminLogin) {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-yellow-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-light text-white tracking-wider">CERCLE PRIVÉ</h2>
          </div>
        </div>
      }>
        <AdminLogin 
          onLoginSuccess={handleAdminLoginSuccess}
          onBack={handleBackFromAdminLogin}
        />
        <Toaster position="top-right" />
      </React.Suspense>
    );
  }

  // Admin panel (développement uniquement)
  if (isDevelopment && showAdmin) {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-yellow-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-light text-white tracking-wider">CERCLE PRIVÉ</h2>
          </div>
        </div>
      }>
        <AdminPanel onLogout={handleAdminLogout} />
        <Toaster position="top-right" />
      </React.Suspense>
    );
  }

  // Site principal avec tous les composants importés directement
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navigation onAdminClick={isDevelopment ? toggleAdmin : undefined} />
      <HeroSection />
      <NotreAdnSection />
      <ServicesSection />
      <OffMarketSection />
      <RechercheSection />
      <PropertyGallery />
      <VendreSection />
      
      {/* Chatbot uniquement en développement */}
      {isDevelopment && (
        <React.Suspense fallback={null}>
          <Chatbot />
        </React.Suspense>
      )}
      
      <PWAInstallPrompt />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;