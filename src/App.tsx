import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import LoginForm from './components/LoginForm';

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingMainSite, setIsLoadingMainSite] = useState(false);
  const [mainSiteLoaded, setMainSiteLoaded] = useState(false);
  
  // Admin states only in development
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Lazy load main site components only after login
  const [MainSiteComponents, setMainSiteComponents] = useState<{
    Navigation: React.ComponentType<any>;
    HeroSection: React.ComponentType;
    NotreAdnSection: React.ComponentType;
    ServicesSection: React.ComponentType;
    OffMarketSection: React.ComponentType;
    RechercheSection: React.ComponentType;
    PropertyGallery: React.ComponentType;
    VendreSection: React.ComponentType;
    PWAInstallPrompt: React.ComponentType;
    Chatbot?: React.ComponentType;
    AdminLogin?: React.ComponentType<any>;
    AdminPanel?: React.ComponentType<any>;
  } | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    if (userLoggedIn === 'true') {
      setIsLoggedIn(true);
      loadMainSite();
    }
    
    // Check admin login only in development
    if (isDevelopment) {
      const adminLoggedIn = localStorage.getItem('adminLoggedIn');
      if (adminLoggedIn === 'true') {
        setIsAdminLoggedIn(true);
      }
    }
  }, []);

  const loadMainSite = async () => {
    if (mainSiteLoaded) return;
    
    setIsLoadingMainSite(true);
    
    try {
      // Charger tous les composants principaux en parallèle
      const [
        Navigation,
        HeroSection,
        NotreAdnSection,
        ServicesSection,
        OffMarketSection,
        RechercheSection,
        PropertyGallery,
        VendreSection,
        PWAInstallPrompt,
        // Composants conditionnels pour le développement
        ...(isDevelopment ? [
          import('./components/Chatbot'),
          import('./components/AdminLogin'),
          import('./components/AdminPanel')
        ] : [])
      ] = await Promise.all([
        import('./components/Navigation'),
        import('./components/HeroSection'),
        import('./components/NotreAdnSection'),
        import('./components/ServicesSection'),
        import('./components/OffMarketSection'),
        import('./components/RechercheSection'),
        import('./components/PropertyGallery'),
        import('./components/VendreSection'),
        import('./components/PWAInstallPrompt'),
        // Composants conditionnels pour le développement
        ...(isDevelopment ? [
          import('./components/Chatbot'),
          import('./components/AdminLogin'),
          import('./components/AdminPanel')
        ] : [])
      ]);

      setMainSiteComponents({
        Navigation: Navigation.default,
        HeroSection: HeroSection.default,
        NotreAdnSection: NotreAdnSection.default,
        ServicesSection: ServicesSection.default,
        OffMarketSection: OffMarketSection.default,
        RechercheSection: RechercheSection.default,
        PropertyGallery: PropertyGallery.default,
        VendreSection: VendreSection.default,
        PWAInstallPrompt: PWAInstallPrompt.default,
        ...(isDevelopment && {
          Chatbot: (await import('./components/Chatbot')).default,
          AdminLogin: (await import('./components/AdminLogin')).default,
          AdminPanel: (await import('./components/AdminPanel')).default
        })
      });

      setMainSiteLoaded(true);
    } catch (error) {
      console.error('Erreur lors du chargement du site:', error);
    } finally {
      setIsLoadingMainSite(false);
    }
  };

  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
    await loadMainSite();
  };

  const toggleAdmin = () => {
    // Admin access only in development
    if (!isDevelopment || !MainSiteComponents?.AdminLogin || !MainSiteComponents?.AdminPanel) {
      console.log('Admin panel not available');
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

  // Afficher uniquement le formulaire de login si pas connecté
  if (!isLoggedIn) {
    return (
      <>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Afficher l'écran de chargement pendant le chargement du site principal
  if (isLoadingMainSite || !mainSiteLoaded || !MainSiteComponents) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-light text-white mb-2 tracking-wider">
            CERCLE PRIVÉ
          </h2>
          <p className="text-gray-400 font-light">
            Chargement de votre espace privé...
          </p>
        </div>
      </div>
    );
  }

  // Afficher l'admin login si demandé (développement uniquement)
  if (isDevelopment && showAdminLogin && MainSiteComponents.AdminLogin) {
    return (
      <>
        <MainSiteComponents.AdminLogin 
          onLoginSuccess={handleAdminLoginSuccess}
          onBack={handleBackFromAdminLogin}
        />
        <Toaster position="top-right" />
      </>
    );
  }

  // Afficher le panel admin si connecté (développement uniquement)
  if (isDevelopment && showAdmin && MainSiteComponents.AdminPanel) {
    return (
      <>
        <MainSiteComponents.AdminPanel onLogout={handleAdminLogout} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Afficher le site principal
  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <MainSiteComponents.Navigation onAdminClick={isDevelopment ? toggleAdmin : undefined} />
        <MainSiteComponents.HeroSection />
        <MainSiteComponents.NotreAdnSection />
        <MainSiteComponents.ServicesSection />
        <MainSiteComponents.OffMarketSection />
        <MainSiteComponents.RechercheSection />
        <MainSiteComponents.PropertyGallery />
        <MainSiteComponents.VendreSection />
        {/* Chatbot only in development */}
        {isDevelopment && MainSiteComponents.Chatbot && (
          <MainSiteComponents.Chatbot />
        )}
        <MainSiteComponents.PWAInstallPrompt />
      </div>
      <Toaster position="top-right" />
    </>
  );
}

export default App;