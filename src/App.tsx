import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Import direct des composants essentiels (pas de lazy loading)
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

const AdminLogin = isDevelopment ? React.lazy(() => import('./components/AdminLogin')) : null;
const AdminPanel = isDevelopment ? React.lazy(() => import('./components/AdminPanel')) : null;
const Chatbot = isDevelopment ? React.lazy(() => import('./components/Chatbot')) : null;
// Composants admin uniquement en développement
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false); // Pas d'initialisation bloquante
  // Admin states only in development
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

    }, 0);
        
        setIsLoggedIn(userLoggedIn);
        if (isDevelopment) setIsAdminLoggedIn(adminLoggedIn);
      } catch (err) {
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

  // Pas d'écran de chargement bloquant
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-900"></div>
        />
        <Toaster position="top-right" />
      </React.Suspense>
    );
  }

  // Admin panel (développement uniquement)
  if (isDevelopment && showAdmin && AdminPanel) {
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

  // Site principal - tous les composants importés directement
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
      {isDevelopment && Chatbot && (
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