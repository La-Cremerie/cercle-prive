import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
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
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

// Import Chatbot only in development
const Chatbot = React.lazy(() => import('./components/Chatbot'));

// Import admin components only in development
const AdminLogin = React.lazy(() => import('./components/AdminLogin'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Admin states only in development
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    // Check admin login only in development
    if (isDevelopment) {
      const adminLoggedIn = localStorage.getItem('adminLoggedIn');
      if (adminLoggedIn === 'true') {
        setIsAdminLoggedIn(true);
      }
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const toggleAdmin = () => {
    // Admin access only in development
    if (!isDevelopment) {
      console.log('Admin panel not available in production');
      return;
    }
    
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

  if (isDevelopment && showAdminLogin) {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Chargement...</div></div>}>
        <>
          <AdminLogin 
            onLoginSuccess={handleAdminLoginSuccess}
            onBack={handleBackFromAdminLogin}
          />
          <Toaster position="top-right" />
        </>
      </React.Suspense>
    );
  }

  if (isDevelopment && showAdmin) {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Chargement...</div></div>}>
        <>
          <AdminPanel onLogout={handleAdminLogout} />
          <Toaster position="top-right" />
        </>
      </React.Suspense>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Navigation onAdminClick={isDevelopment ? toggleAdmin : undefined} />
        <HeroSection />
        <NotreAdnSection />
        <ServicesSection />
        <OffMarketSection />
        <RechercheSection />
        <PropertyGallery />
        <VendreSection />
        {/* Chatbot only in development */}
        {import.meta.env.DEV && (
          <React.Suspense fallback={null}>
            <Chatbot />
          </React.Suspense>
        )}
        <PWAInstallPrompt />
      </div>
      <Toaster position="top-right" />
    </>
  );
}

export default App;