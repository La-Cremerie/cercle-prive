import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import LoginForm from './components/LoginForm';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import NotreAdnSection from './components/NotreAdnSection';
import OffMarketSection from './components/OffMarketSection';
import ServicesSection from './components/ServicesSection';
import RechercheSection from './components/RechercheSection';
import PropertyGallery from './components/PropertyGallery';
import VendreSection from './components/VendreSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import Chatbot from './components/Chatbot';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);

    // Vérifier si l'admin est connecté
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    setShowAdminPanel(adminLoggedIn);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleAdminClick = () => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (adminLoggedIn) {
      setShowAdminPanel(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setShowAdminLogin(false);
    setShowAdminPanel(true);
  };

  const handleAdminLogout = () => {
    setShowAdminPanel(false);
  };

  const handleBackFromAdminLogin = () => {
    setShowAdminLogin(false);
  };

  // Si l'admin panel est ouvert
  if (showAdminPanel) {
    return (
      <>
        <AdminPanel onLogout={handleAdminLogout} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Si la page de connexion admin est ouverte
  if (showAdminLogin) {
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

  // Si l'utilisateur n'est pas connecté
  if (!isLoggedIn) {
    return (
      <>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Site principal pour les utilisateurs connectés
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation onAdminClick={handleAdminClick} />
      <HeroSection />
      <NotreAdnSection />
      <OffMarketSection />
      <ServicesSection />
      <RechercheSection />
      <PropertyGallery />
      <VendreSection />
      <ContactSection />
      <Footer />
      <PWAInstallPrompt />
      <Chatbot />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;