import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import LoginForm from './components/LoginForm';
import { PerformanceOptimizer } from './utils/performance';
import { ErrorBoundaryManager } from './utils/errorBoundary';

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
    // Initialiser les optimisations de performance
    const performanceOptimizer = PerformanceOptimizer.getInstance();
    const errorBoundary = ErrorBoundaryManager.getInstance();
    
    console.log('🚀 Initialisation des optimisations de performance');
    
    // Vérifier les connexions
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    
    setIsUserLoggedIn(userLoggedIn);
    setIsAdminLoggedIn(adminLoggedIn);
    
    // Masquer le loader après un délai court
    setTimeout(() => {
      setIsLoading(false);
      document.body.classList.add('app-ready');
      
      // Mesurer les performances après le chargement initial
      setTimeout(() => {
        performanceOptimizer.measureWebVitals();
        console.log('📊 Métriques de performance collectées');
      }, 1000);
    }, 1000);
    
    // Nettoyage au démontage
    return () => {
      console.log('🧹 Nettoyage des optimisations');
    };
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
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1F2937',
              color: '#F9FAFB',
              border: '1px solid #374151'
            }
          }}
        />
      </>
    );
  }

  // Admin panel (développement uniquement)
  if (showAdmin && AdminPanel) {
    return (
      <>
        <AdminPanel onLogout={handleAdminLogout} />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1F2937',
              color: '#F9FAFB',
              border: '1px solid #374151'
            }
          }}
        />
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
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1F2937',
              color: '#F9FAFB',
              border: '1px solid #374151'
            }
          }}
        />
      </>
    );
  }

  // Site principal
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors performance-optimized">
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
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F2937',
            color: '#F9FAFB',
            border: '1px solid #374151'
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#F9FAFB'
            }
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#F9FAFB'
            }
          }
        }}
      />
    </div>
  );
}

export default App;