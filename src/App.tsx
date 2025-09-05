import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { UserService } from './services/userService';
import { EmailService } from './services/emailService';
import type { UserRegistration } from './types/database';
import toast from 'react-hot-toast';

// Components
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import NotreAdnSection from './components/NotreAdnSection';
import ServicesSection from './components/ServicesSection';
import OffMarketSection from './components/OffMarketSection';
import RechercheSection from './components/RechercheSection';
import PropertyGallery from './components/PropertyGallery';
import VendreSection from './components/VendreSection';
import ContactSection from './components/ContactSection';
import Chatbot from './components/Chatbot';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import AdminPanel from './components/AdminPanel';
import LoginForm from './components/LoginForm';
import AdminLogin from './components/AdminLogin';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    // Vérifier le statut de connexion
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    
    setIsLoggedIn(userLoggedIn);
    setIsAdminLoggedIn(adminLoggedIn);
    
    // Vérifier si on est en mode admin via l'URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      setIsAdminMode(true);
      if (!adminLoggedIn) {
        setShowAdminLogin(true);
      }
    }
    
    setIsLoading(false);

    // Enregistrer le service worker pour PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker enregistré'))
        .catch(err => console.log('Erreur Service Worker:', err));
    }
  }, []);

  // Gestion des raccourcis clavier pour l'admin
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl + Shift + A pour accéder à l'admin
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsAdminMode(true);
        if (!isAdminLoggedIn) {
          setShowAdminLogin(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAdminLoggedIn]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsAdminMode(false);
    setShowAdminLogin(false);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setShowAdminLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setIsAdminMode(false);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    setIsAdminLoggedIn(false);
    setIsAdminMode(false);
    // Rediriger vers la page normale
    window.location.href = window.location.origin;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Mode admin
  if (isAdminMode) {
    if (!isAdminLoggedIn) {
      return showAdminLogin ? (
        <AdminLogin 
          onLoginSuccess={handleAdminLoginSuccess}
          onBack={() => {
            setIsAdminMode(false);
            setShowAdminLogin(false);
          }}
        />
      ) : null;
    }
    
    return <AdminPanel onLogout={handleAdminLogout} />;
  }

  // Formulaire de connexion utilisateur
  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  // Site principal
  return (
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
      
      {/* Composants flottants */}
      <Chatbot />
      <PWAInstallPrompt />
      
      {/* Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F2937',
            color: '#F9FAFB',
          },
        }}
      />
    </div>
  );
}

export default App;