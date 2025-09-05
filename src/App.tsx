import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import PropertiesSection from './components/PropertiesSection';
import NotreAdnSection from './components/NotreAdnSection';
import ContactSection from './components/ContactSection';
import VendreSection from './components/VendreSection';
import RechercheSection from './components/RechercheSection';
import OffMarketSection from './components/OffMarketSection';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import Chatbot from './components/Chatbot';

// Pages
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Hooks
import { useTheme } from './hooks/useTheme';
import { usePWA } from './hooks/usePWA';
import { useNotifications } from './hooks/useNotifications';

// Utils
import { DiagnosticsManager } from './utils/diagnostics';

function App() {
  const { theme } = useTheme();
  const { isInstallable, installPWA } = usePWA();
  const { showNotification } = useNotifications();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize diagnostics in development
    if (import.meta.env.DEV) {
      const diagnostics = DiagnosticsManager.getInstance();
      diagnostics.runFullDiagnostic().catch(console.error);
    }
  }, []);

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    showNotification('Connexion administrateur réussie', 'success');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminMode(false);
    showNotification('Déconnexion réussie', 'info');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <Router>
          <Header />
          <Navigation />
          
          {/* PWA Install Prompt */}
          {isInstallable && (
            <PWAInstallPrompt onInstall={installPWA} />
          )}

          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <HeroSection />
                  <ServicesSection />
                  <PropertiesSection />
                  <NotreAdnSection />
                  <VendreSection />
                  <RechercheSection />
                  <OffMarketSection />
                  <ContactSection />
                </>
              } />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={
                isAdminAuthenticated ? (
                  <AdminPanel onLogout={handleAdminLogout} />
                ) : (
                  <AdminLogin onLogin={handleAdminLogin} />
                )
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
          <Chatbot />
        </Router>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#374151',
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;