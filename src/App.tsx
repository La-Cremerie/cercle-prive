import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginForm from './components/LoginForm';
import { DiagnosticsManager } from './utils/diagnostics';

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

// Pages
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Layout pour les pages avec navigation
const PageLayout: React.FC<{ children: React.ReactNode; showAdmin?: boolean; onAdminClick?: () => void }> = ({ 
  children, 
  showAdmin = false, 
  onAdminClick 
}) => (
  <div className="min-h-screen bg-white dark:bg-gray-900">
    <Navigation onAdminClick={onAdminClick} />
    <main>{children}</main>
    <Footer />
    {showAdmin && <Chatbot />}
    <PWAInstallPrompt />
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fonctions de gestion
  const handleLoginSuccess = () => {
    setIsUserLoggedIn(true);
  };

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

  // Initialisation avec diagnostic automatique
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initialisation avec diagnostic automatique');
        
        // Diagnostic automatique
        const diagnostics = DiagnosticsManager.getInstance();
        const diagnostic = await diagnostics.runFullDiagnostic();
        
        // Vérifier l'état de santé
        if (diagnostic.error) {
          throw new Error(`Diagnostic échoué: ${diagnostic.error}`);
        }
        
        // Auto-fix des problèmes détectés
        const fixes = await diagnostics.autoFix();
        if (fixes.length > 0) {
          console.log('🔧 Corrections automatiques appliquées:', fixes);
        }
        
        // Vérifier les connexions utilisateur
        let userLoggedIn = false;
        let adminLoggedIn = false;
        
        try {
          userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
          adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        } catch (storageError) {
          console.warn('⚠️ Erreur localStorage:', storageError);
          // Continuer avec les valeurs par défaut
        }
        
        setIsUserLoggedIn(userLoggedIn);
        setIsAdminLoggedIn(adminLoggedIn);
        
        // Masquer le loader avec délai de sécurité
        setTimeout(() => {
          setIsLoading(false);
          document.body.classList.add('app-loaded');
          console.log('✅ Application initialisée avec succès');
        }, 1000);
        
      } catch (error) {
        console.error('❌ Erreur critique lors de l\'initialisation:', error);
        setHasError(true);
        setErrorMessage(error instanceof Error ? error.message : 'Erreur inconnue');
        setIsLoading(false);
        
        // Déclencher la récupération d'urgence
        setTimeout(() => {
          DiagnosticsManager.getInstance().emergencyReset();
        }, 5000);
      }
    };

    initializeApp();
  }, []);

  // Gestion d'erreur de rendu
  useEffect(() => {
    const handleRenderError = (error: Error) => {
      console.error('🚨 Erreur de rendu React:', error);
      setHasError(true);
      setErrorMessage(error.message);
    };

    // Capturer les erreurs de rendu React
    window.addEventListener('error', (event) => {
      if (event.error && event.error.stack && event.error.stack.includes('React')) {
        handleRenderError(event.error);
      }
    });
  }, []);

  // Interface d'erreur critique
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8 text-center">
          <div className="text-6xl mb-4">🚨</div>
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Problème Technique
          </h2>
          <p className="text-gray-600 mb-6">
            Une erreur technique a été détectée. Nous travaillons à la résoudre.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 transition-colors font-medium"
            >
              Actualiser la page
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              Vider le cache et actualiser
            </button>
            <a
              href={"mailto:nicolas.c@lacremerie.fr?subject=Erreur technique critique&body=Erreur détectée: " + encodeURIComponent(errorMessage)}
              className="block w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors font-medium text-center"
            >
              Contacter le support
            </a>
          </div>
          {import.meta.env.DEV && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-gray-500 text-sm">
                Détails techniques
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                {errorMessage}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  // Loading state avec diagnostic
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-light text-yellow-600 mb-4 tracking-wider">
            CERCLE PRIVÉ
          </h1>
          <div className="w-8 h-8 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">
            Diagnostic et chargement en cours...
          </p>
        </div>
      </div>
    );
  }

  // Wrapper avec gestion d'erreur
  const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    try {
      return <>{children}</>;
    } catch (error) {
      console.error('🚨 Erreur dans AppWrapper:', error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Erreur de rendu');
      return null;
    }
  };

  try {
    // Formulaire de connexion
    if (!isUserLoggedIn) {
      return (
        <AppWrapper>
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
        </AppWrapper>
      );
    }

    // Admin panel
    if (showAdmin && import.meta.env.DEV) {
      return (
        <AppWrapper>
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
        </AppWrapper>
      );
    }

    // Admin login
    if (showAdminLogin && import.meta.env.DEV) {
      return (
        <AppWrapper>
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
        </AppWrapper>
      );
    }

    // Application principale avec routage
    return (
      <AppWrapper>
        <Router>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
            <Routes>
              {/* Page d'accueil */}
              <Route path="/" element={
                <PageLayout showAdmin={import.meta.env.DEV} onAdminClick={toggleAdmin}>
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
                  {import.meta.env.DEV && <Chatbot />}
                  <PWAInstallPrompt />
                </PageLayout>
              } />
              
              {/* Pages statiques converties */}
              <Route path="/about" element={
                <PageLayout showAdmin={import.meta.env.DEV} onAdminClick={toggleAdmin}>
                  <About />
                </PageLayout>
              } />
              
              <Route path="/services" element={
                <PageLayout showAdmin={import.meta.env.DEV} onAdminClick={toggleAdmin}>
                  <Services />
                </PageLayout>
              } />
              
              <Route path="/portfolio" element={
                <PageLayout showAdmin={import.meta.env.DEV} onAdminClick={toggleAdmin}>
                  <Portfolio />
                </PageLayout>
              } />
              
              <Route path="/blog" element={
                <PageLayout showAdmin={import.meta.env.DEV} onAdminClick={toggleAdmin}>
                  <Blog />
                </PageLayout>
              } />
              
              <Route path="/contact" element={
                <PageLayout showAdmin={import.meta.env.DEV} onAdminClick={toggleAdmin}>
                  <Contact />
                </PageLayout>
              } />
              
              {/* Page 404 */}
              <Route path="/404" element={
                <PageLayout showAdmin={import.meta.env.DEV} onAdminClick={toggleAdmin}>
                  <NotFound />
                </PageLayout>
              } />
              
              {/* Redirection pour toutes les autres routes */}
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>

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
        </Router>
      </AppWrapper>
    );
    
  } catch (error) {
    console.error('❌ Erreur critique dans App:', error);
    setHasError(true);
    setErrorMessage(error instanceof Error ? error.message : 'Erreur de rendu critique');
    return null;
  }
}

export default App;