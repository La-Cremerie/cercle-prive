import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Import direct du LoginForm pour éviter le lazy loading
const LoginForm = React.lazy(() => import('./components/LoginForm'));

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [mainSiteLoaded, setMainSiteLoaded] = useState(false);
  
  // Admin states only in development
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Composants du site principal (chargés après login)
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

  // Chargement ultra-rapide de l'état initial
  useEffect(() => {
    // Vérification synchrone ultra-rapide
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    const adminLoggedIn = isDevelopment ? localStorage.getItem('adminLoggedIn') : null;
    
    if (userLoggedIn === 'true') {
      setIsLoggedIn(true);
      // Démarrer le chargement du site principal immédiatement
      loadMainSite();
    }
    
    if (isDevelopment && adminLoggedIn === 'true') {
      setIsAdminLoggedIn(true);
    }
    
    // Initialisation terminée immédiatement
    setIsInitializing(false);
  }, []);

  // Chargement optimisé du site principal
  const loadMainSite = async () => {
    if (mainSiteLoaded || MainSiteComponents) return;
    
    try {
      // Chargement en parallèle avec Promise.allSettled pour éviter qu'une erreur bloque tout
      const mainImports = await Promise.allSettled([
        import('./components/Navigation'),
        import('./components/HeroSection'),
        import('./components/NotreAdnSection'),
        import('./components/ServicesSection'),
        import('./components/OffMarketSection'),
        import('./components/RechercheSection'),
        import('./components/PropertyGallery'),
        import('./components/VendreSection'),
        import('./components/PWAInstallPrompt')
      ]);

      // Extraire les composants réussis
      const successfulImports = mainImports
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value);

      // Vérifier que tous les composants essentiels sont chargés
      if (successfulImports.length < 9) {
        console.error('Certains composants n\'ont pas pu être chargés');
        // Forcer un rechargement si des composants manquent
        window.location.reload();
        return;
      }

      // Chargement conditionnel des composants admin
      let adminImports: any[] = [];
      if (isDevelopment) {
        try {
          const adminImportResults = await Promise.allSettled([
            import('./components/Chatbot'),
            import('./components/AdminLogin'),
            import('./components/AdminPanel')
          ]);
          
          adminImports = adminImportResults
            .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
            .map(result => result.value);
        } catch (error) {
          console.warn('Composants admin non disponibles:', error);
        }
      }

      // Construire l'objet des composants
      const components: any = {
        Navigation: successfulImports[0].default,
        HeroSection: successfulImports[1].default,
        NotreAdnSection: successfulImports[2].default,
        ServicesSection: successfulImports[3].default,
        OffMarketSection: successfulImports[4].default,
        RechercheSection: successfulImports[5].default,
        PropertyGallery: successfulImports[6].default,
        VendreSection: successfulImports[7].default,
        PWAInstallPrompt: successfulImports[8].default
      };
      
      // Ajouter les composants admin si disponibles
      if (isDevelopment && adminImports.length >= 3) {
        components.Chatbot = adminImports[0].default;
        components.AdminLogin = adminImports[1].default;
        components.AdminPanel = adminImports[2].default;
      }

      setMainSiteComponents(components);
      setMainSiteLoaded(true);
    } catch (error) {
      console.error('Erreur lors du chargement du site:', error);
      // En cas d'erreur critique, forcer un rechargement
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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

  // Écran de chargement initial ultra-rapide
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-yellow-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-light text-white tracking-wider">CERCLE PRIVÉ</h2>
          <p className="text-gray-400 text-sm mt-2">Initialisation...</p>
        </div>
      </div>
    );
  }

  // Login avec Suspense pour éviter la page blanche
  if (!isLoggedIn) {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-yellow-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-light text-white tracking-wider">CERCLE PRIVÉ</h2>
            <p className="text-gray-400 text-sm mt-2">Chargement du formulaire...</p>
          </div>
        </div>
      }>
        <>
          <LoginForm onLoginSuccess={handleLoginSuccess} />
          <Toaster position="top-right" />
        </>
      </React.Suspense>
    );
  }

  // Chargement du site principal
  if (!mainSiteLoaded || !MainSiteComponents) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-yellow-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-light text-white mb-2 tracking-wider">
            CERCLE PRIVÉ
          </h2>
          <p className="text-gray-400 font-light">Chargement de votre espace privé...</p>
        </div>
      </div>
    );
  }

  // Afficher l'admin login si demandé (développement uniquement)
  if (isDevelopment && showAdminLogin && MainSiteComponents.AdminLogin) {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-yellow-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-light text-white tracking-wider">CERCLE PRIVÉ</h2>
          </div>
        </div>
      }>
        <>
          <MainSiteComponents.AdminLogin 
            onLoginSuccess={handleAdminLoginSuccess}
            onBack={handleBackFromAdminLogin}
          />
          <Toaster position="top-right" />
        </>
      </React.Suspense>
    );
  }

  // Afficher le panel admin si connecté (développement uniquement)
  if (isDevelopment && showAdmin && MainSiteComponents.AdminPanel) {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-yellow-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-light text-white tracking-wider">CERCLE PRIVÉ</h2>
          </div>
        </div>
      }>
        <>
          <MainSiteComponents.AdminPanel onLogout={handleAdminLogout} />
          <Toaster position="top-right" />
        </>
      </React.Suspense>
    );
  }

  // Afficher le site principal
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-yellow-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-light text-white mb-2 tracking-wider">
            CERCLE PRIVÉ
          </h2>
          <p className="text-gray-400 font-light">Chargement du site...</p>
        </div>
      </div>
    }>
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
    </React.Suspense>
  );
}

export default App;