import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Import direct des composants essentiels
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import NotreAdnSection from './components/NotreAdnSection';
import ServicesSection from './components/ServicesSection';
import OffMarketSection from './components/OffMarketSection';
import RechercheSection from './components/RechercheSection';
import PropertyGallery from './components/PropertyGallery';
import VendreSection from './components/VendreSection';
import PWAInstallPrompt from './components/PWAInstallPrompt';

const isDevelopment = import.meta.env.DEV;

const AdminLogin = isDevelopment ? React.lazy(() => import('./components/AdminLogin')) : null;
const AdminPanel = isDevelopment ? React.lazy(() => import('./components/AdminPanel')) : null;
const Chatbot = isDevelopment ? React.lazy(() => import('./components/Chatbot')) : null;

function App() {
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        let adminLoggedIn = false;
        
        try {
          adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        } catch (storageError) {
          console.warn('Erreur localStorage (non-bloquante):', storageError);
          // Continuer avec les valeurs par défaut
        }
        
        if (isDevelopment) setIsAdminLoggedIn(adminLoggedIn);
      } catch (err) {
        console.error('Initialization error:', err);
        // Ne pas bloquer l'application en cas d'erreur
        if (isDevelopment) setIsAdminLoggedIn(false);
      } finally {
        setIsLoadingApp(false);
      }
    };

    // Initialisation avec timeout de sécurité
    const timeoutId = setTimeout(initializeApp, 100);
    
    // Cleanup function
    return () => clearTimeout(timeoutId);
  }, []);

  // Loading state
  if (isLoadingApp) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-yellow-600 animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-light text-white tracking-wider">CERCLE PRIVÉ</h2>
        </div>
      </div>
    );
  }

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

  // Admin panel (développement uniquement)
  if (showAdmin && AdminPanel) {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-yellow-600 animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-light text-white tracking-wider">CERCLE PRIVÉ</h2>
          </div>
        </div>
      }>
        <AdminPanel onLogout={handleAdminLogout} />
        <Toaster position="top-right" />
      </React.Suspense>
    );
  }

  // Admin login (développement uniquement)
  if (showAdminLogin && AdminLogin) {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-yellow-600 animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-light text-white tracking-wider">CERCLE PRIVÉ</h2>
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

  // Site principal - accès direct sans connexion
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
      {Chatbot && (
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