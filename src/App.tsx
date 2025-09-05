import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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

  // Initialisation optimisée
  useEffect(() => {
    const performanceOptimizer = PerformanceOptimizer.getInstance();
    const errorBoundary = ErrorBoundaryManager.getInstance();
    
    console.log('🚀 Initialisation optimisée');
    
    // Vérifier les connexions
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    
    setIsUserLoggedIn(userLoggedIn);
    setIsAdminLoggedIn(adminLoggedIn);
    
    // Masquer le loader
    setTimeout(() => {
      setIsLoading(false);
      document.body.classList.add('app-ready');
      
      // Mesurer les performances
      setTimeout(() => {
        performanceOptimizer.measureWebVitals();
        console.log('📊 Métriques collectées');
      }, 1000);
    }, 800);
  }, []);

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

  // Loading state
  if (isLoading) {
    return null;
  }

  // Formulaire de connexion
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

  // Admin panel
  if (showAdmin && import.meta.env.DEV) {
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

  // Admin login
  if (showAdminLogin && import.meta.env.DEV) {
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

  // Application principale avec routage
  return (
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
  );
}

export default App;