import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import LoginForm from './components/LoginForm';

// Composants principaux
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
import Footer from './components/Footer';
import ContactSection from './components/ContactSection';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Initialisation simple
  useEffect(() => {
    // Vérifier les connexions
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    
    setIsUserLoggedIn(userLoggedIn);
    setIsAdminLoggedIn(adminLoggedIn);
    
    // Masquer le loader après un délai court
    setTimeout(() => {
      setIsLoading(false);
      document.body.classList.add('app-ready');
    }, 1000);
  }, []);

  const handleLoginSuccess = () => {
    setIsUserLoggedIn(true);
  };

  // Loading state simple
  if (isLoading) {
    return null; // Le loader HTML s'occupe de l'affichage
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

  // Admin panel (développement uniquement)
  if (showAdmin && AdminPanel) {
    return (
      <>
        <AdminPanel onLogout={handleAdminLogout} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Admin login (développement uniquement)
  if (showAdminLogin && AdminLogin) {
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

  // Site principal
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navigation onAdminClick={toggleAdmin} />
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
      <Toaster position="top-right" />
    </div>
  );
}

export default App;