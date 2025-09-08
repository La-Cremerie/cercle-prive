import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

// Import direct des composants
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
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import Chatbot from './components/Chatbot';
import ContactSection from './components/ContactSection';
import UpdateSlider from './components/UpdateSlider';
import { useUpdateChecker } from './hooks/useUpdateChecker';
import { useRealTimeSync } from './hooks/useRealTimeSync';
import { syncService } from './services/realTimeSync';
import { ContentVersioningService } from './services/contentVersioningService';
import DiagnosticPanel from './components/DiagnosticPanel';
import BlankPageDetector from './components/BlankPageDetector';
import { BlankPageDiagnostics } from './utils/diagnostics';
import NicolasContentViewer from './components/NicolasContentViewer';

// Fallback de chargement
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-light text-yellow-600 tracking-wider mb-4">
        CERCLE PRIVÉ
      </h1>
      <div className="w-8 h-8 border-2 border-gray-600 border-t-yellow-600 rounded-full animate-spin mx-auto"></div>
    </div>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [forceShowLogin, setForceShowLogin] = useState(false);
  const { showUpdateSlider, setShowUpdateSlider, updateInfo, isPWA, isMobile } = useUpdateChecker();
  
  // Initialiser la synchronisation temps réel
  const { connectionStatus } = useRealTimeSync('main-app', (event) => {
    console.log('🔄 Changement reçu dans App:', event);
    
    // Forcer le re-render des composants si nécessaire
    if (event.type === 'content' || event.type === 'design') {
      // Les composants se mettront à jour automatiquement via les événements
      console.log('✅ Mise à jour automatique déclenchée');
     
     // Notification spéciale pour la publication de contenu
     if (event.adminName === 'Nicolas' && event.action === 'update') {
       toast.success('🎉 Nouveau contenu publié par Nicolas !', {
         duration: 5000,
         icon: '📢'
       });
     }
    }
  });

  // Écouter les mises à jour forcées pour mobile
  useEffect(() => {
    const handleForceUpdate = (event: CustomEvent) => {
      console.log('🔄 MISE À JOUR COLLABORATIVE REÇUE:', event.detail);
      
      // Forcer le re-render immédiat pour afficher les changements
      setAppReady(false);
      setTimeout(() => setAppReady(true), 100);
      
      // Notification spéciale pour les modifications collaboratives
      if (event.detail?.source === 'supabase') {
        toast.success('🔄 Site mis à jour par un administrateur', {
          duration: 5000,
          icon: '📡'
        });
      }
    };

    window.addEventListener('forceUpdate', handleForceUpdate as EventListener);
    
    return () => {
      window.removeEventListener('forceUpdate', handleForceUpdate as EventListener);
    };
  }, []);

  // Écouter les paramètres URL pour forcer l'affichage du login
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'true' || urlParams.get('force-login') === 'true') {
      setForceShowLogin(true);
    }
  }, []);
  // Initialisation ultra-simple et robuste
  useEffect(() => {
    try {
      console.log('App initialization started');
      
      // Synchroniser les données depuis Supabase au démarrage
      const initializeContentSync = async () => {
        try {
          await ContentVersioningService.syncFromSupabaseToLocal();
          console.log('✅ Synchronisation initiale depuis Supabase terminée');
        } catch (error) {
          console.warn('⚠️ Erreur synchronisation initiale Supabase:', error);
        }
      };
      
      initializeContentSync();
      
      // Vérifier les connexions de manière sécurisée
      const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
      
      console.log('Login status check:', { userLoggedIn, adminLoggedIn });
      
      setIsUserLoggedIn(userLoggedIn);
      setIsAdminLoggedIn(adminLoggedIn);
      setAppReady(true);
      
      console.log('App ready, hiding loader');
      // Masquer le loader HTML
      document.body.classList.add('app-ready');
      const loader = document.getElementById('initial-loader');
      if (loader) {
        loader.style.display = 'none';
      }
    } catch (error) {
      console.warn('Erreur initialisation:', error);
      setHasError(true);
      setAppReady(true);
      document.body.classList.add('app-ready');
    }
  }, []);

  // Cleanup de la synchronisation
  useEffect(() => {
    return () => {
      syncService.cleanup();
    };
  }, []);

  // Gestion d'erreur globale
  const handleError = (error: Error) => {
    console.error('Erreur App:', error);
    BlankPageDiagnostics.logError(error, 'App.tsx');
    setHasError(true);
  };

  const handleLoginSuccess = () => {
    console.log('Login success callback triggered');
    setIsUserLoggedIn(true);
    setIsLoading(false);
    setForceShowLogin(false);
    // Nettoyer l'URL
    const url = new URL(window.location.href);
    url.searchParams.delete('login');
    url.searchParams.delete('force-login');
    window.history.replaceState({}, '', url.toString());
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userData');
    localStorage.removeItem('adminLoggedIn');
    setIsUserLoggedIn(false);
    setIsAdminLoggedIn(false);
    setShowAdmin(false);
    setForceShowLogin(false);
    toast.success('Déconnexion réussie');
  };
  // Fallback d'erreur
  if (hasError) {
    return (
      <>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-yellow-600 tracking-wider mb-4">
            CERCLE PRIVÉ
          </h1>
          <p className="text-gray-400 mb-6">Erreur de chargement</p>
          <div className="space-y-3">
            <button
              onClick={() => setShowDiagnostic(true)}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Diagnostic Technique
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              Recharger la page
            </button>
            <button
              onClick={() => {
                BlankPageDiagnostics.emergencyReset();
                window.location.reload();
              }}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Reset d'urgence
            </button>
          </div>
        </div>
        </div>
        {showDiagnostic && (
          <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            <DiagnosticPanel />
            <div className="fixed top-4 right-4">
              <button
                onClick={() => setShowDiagnostic(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
        <BlankPageDetector />
        <Toaster position="top-right" />
      </>
    );
  }

  // Attendre que l'app soit prête
  if (!appReady) {
    return <LoadingFallback />;
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
  if (!isUserLoggedIn || forceShowLogin) {
    return (
      <>
        <div className="relative">
          <LoginForm onLoginSuccess={handleLoginSuccess} />
          {forceShowLogin && isUserLoggedIn && (
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setForceShowLogin(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
              >
                Retour au site
              </button>
            </div>
          )}
        </div>
        <Toaster position="top-right" />
      </>
    );
  }

  // Admin panel (development only)
  if (showAdmin) {
    return (
      <>
        <AdminPanel onLogout={handleAdminLogout} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Admin login (development only)
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

  // Main site - show all sections
  return (
    <>
      <BlankPageDetector />
      <Navigation 
        onAdminClick={toggleAdmin}
        onLogout={handleLogout}
        onForceLogin={() => setForceShowLogin(true)}
      />
      <HeroSection />
      <NotreAdnSection />
      <ServicesSection />
      <OffMarketSection />
      <RechercheSection />
      <PropertyGallery />
      <VendreSection />
      <PWAInstallPrompt />
      <Chatbot />
      <ContactSection />
      {(showUpdateSlider && updateInfo?.available && (isPWA || isMobile)) && (
        <UpdateSlider onClose={() => setShowUpdateSlider(false)} />
      )}
      <Toaster position="top-right" />
    </>
  );
}

export default App;