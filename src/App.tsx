import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import './i18n';

// Import des composants essentiels
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import NotreAdnSection from './components/NotreAdnSection';
import ServicesSection from './components/ServicesSection';
import OffMarketSection from './components/OffMarketSection';
import RechercheSection from './components/RechercheSection';
import PropertyGallery from './components/PropertyGallery';
import VendreSection from './components/VendreSection';
import ContactSection from './components/ContactSection';
import LoginForm from './components/LoginForm';
import Chatbot from './components/Chatbot';
import PWAInstallPrompt from './components/PWAInstallPrompt';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Si l'utilisateur n'est pas connecté, afficher le formulaire de connexion
  if (!isLoggedIn) {
    return (
      <>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Site principal
  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navigation />
        <HeroSection />
        <NotreAdnSection />
        <ServicesSection />
        <OffMarketSection />
        <RechercheSection />
        <PropertyGallery />
        <VendreSection />
        <ContactSection />
        <Chatbot />
        <PWAInstallPrompt />
      </div>
      <Toaster position="top-right" />
    </>
  );
}

export default App;