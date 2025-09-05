import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import LoginForm from './components/LoginForm';

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
  const [isContentReady, setIsContentReady] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Tous les hooks doivent être appelés dans le même ordre à chaque rendu
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Précharger les ressources critiques
        await preloadCriticalResources();
        
        // Vérifier si l'utilisateur est connecté
        let userLoggedIn = false;
        let adminLoggedIn = false;
        
        try {
          userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
          adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        } catch (storageError) {
          console.warn('Erreur localStorage (non-bloquante):', storageError);
          // Continuer avec les valeurs par défaut
        }
        
        setIsUserLoggedIn(userLoggedIn);
        if (isDevelopment) setIsAdminLoggedIn(adminLoggedIn);
        
        // Marquer le contenu comme prêt
        setIsContentReady(true);
        
        // Délai minimal pour éviter le flash
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (err) {
        console.error('Initialization error:', err);
        // Ne pas bloquer l'application en cas d'erreur
        setIsUserLoggedIn(false);
        if (isDevelopment) setIsAdminLoggedIn(false);
        setIsContentReady(true); // Afficher quand même en cas d'erreur
      } finally {
        setIsLoadingApp(false);
        
        // Signal que React est complètement prêt
        setTimeout(() => {
          window.dispatchEvent(new Event('reactReady'));
        }, 100);
      }
    };

    initializeApp();
  }, []);

  // Vérification de l'état de chargement pour éviter le rendu prématuré
  useEffect(() => {
    if (!isLoadingApp && isContentReady) {
      // Assurer que le DOM est prêt avant de signaler à l'HTML
      const timer = setTimeout(() => {
        document.body.classList.add('react-loaded');
      }, 100);
    
      return () => clearTimeout(timer);
    }
  }, [isLoadingApp, isContentReady]);

  // Hook pour gérer le chargement des images - toujours appelé
  useEffect(() => {
    if (isContentReady) {
      // Ajouter la classe 'loaded' aux images une fois qu'elles sont chargées
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (img.complete) {
          img.classList.add('loaded');
        } else {
          img.onload = () => img.classList.add('loaded');
        }
      });
    }
  }, [isContentReady]);

  // Hook pour signaler que le DOM est prêt - toujours appelé
  useEffect(() => {
    if (!isLoadingApp && isContentReady) {
      // Assurer que le DOM est prêt avant de signaler à l'HTML
      const timer = setTimeout(() => {
        document.body.classList.add('react-loaded');
      }, 100);
    
      return () => clearTimeout(timer);
    }
  }, [isLoadingApp, isContentReady]);

  // Fonction de préchargement des ressources critiques
  const preloadCriticalResources = async () => {
    return new Promise<void>((resolve) => {
      const criticalImages = [
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920',
        'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'
      ];
      
      let loadedCount = 0;
      const totalImages = criticalImages.length;
      
      if (totalImages === 0) {
        resolve();
        return;
      }
      
      criticalImages.forEach(src => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            resolve();
          }
        };
        img.src = src;
      });
      
      // Timeout pour ne pas bloquer indéfiniment
      setTimeout(resolve, 2000);
    });
  };

  // Loading state amélioré
  if (isLoadingApp || !isContentReady) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-yellow-600 animate-spin mx-auto" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-yellow-600/20 rounded-full mx-auto"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-light text-white tracking-wider">CERCLE PRIVÉ</h2>
            <p className="text-sm text-gray-400 font-light">Préparation de votre expérience</p>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
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