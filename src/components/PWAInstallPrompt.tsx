import React from 'react';
import { Download, X, Smartphone, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../hooks/usePWA';

const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, installApp, canInstall, isInstalled, autoPromptShown } = usePWA();
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [showManualInstructions, setShowManualInstructions] = React.useState(false);
  const [showWelcomePrompt, setShowWelcomePrompt] = React.useState(false);
  const [showRefreshButton, setShowRefreshButton] = React.useState(false);

  // Détecter si l'app est installée et afficher le bouton refresh
  React.useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    setShowRefreshButton(isStandalone || isInWebAppiOS);
  }, []);

  const handleRefresh = () => {
    if ('serviceWorker' in navigator) {
      // Forcer la mise à jour du service worker
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.update();
        });
      });
    }
    
    // Vider le cache et recharger
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      }).then(() => {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  };
  React.useEffect(() => {
    // Vérifier si déjà installé
    if (isInstalled) {
      return;
    }

    // Vérifier si déjà dismissé pour cette session
    const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
    const alreadyShown = localStorage.getItem('pwa-auto-prompt-shown');
    
    if (dismissed) {
      return;
    }

    // Auto-prompt immédiat pour nouveaux visiteurs
    if (!alreadyShown && (isInstallable || canInstall)) {
      const timer = setTimeout(() => {
        setShowWelcomePrompt(true);
        setShowPrompt(true);
      }, 800); // Très rapide pour auto-prompt
      
      return () => clearTimeout(timer);
    } else if (isInstallable || canInstall) {
      // Prompt normal pour visiteurs récurrents
      setShowPrompt(true);
    }
  }, [isInstallable, canInstall, isInstalled, autoPromptShown]);

  const handleInstall = async () => {
    try {
      await installApp();
      setShowPrompt(false);
    } catch (error) {
      console.error('Erreur installation PWA:', error);
      // Afficher les instructions manuelles en cas d'échec
      setShowManualInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowManualInstructions(false);
    setShowWelcomePrompt(false);
    // Ne plus montrer pendant cette session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const handleManualInstall = () => {
    setShowManualInstructions(true);
    setShowPrompt(false);
  };

  // Ne pas montrer si déjà installé ou dismissé
  if (isInstalled || sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  return (
    <AnimatePresence>
      {/* Bouton de rafraîchissement pour PWA */}
      {showRefreshButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleRefresh}
          className="fixed top-4 right-4 w-12 h-12 bg-yellow-600 text-white rounded-full shadow-lg hover:bg-yellow-700 transition-colors z-40 flex items-center justify-center"
          title="Actualiser l'application"
        >
          <RefreshCw className="w-5 h-5" />
        </motion.button>
      )}

      {/* Prompt de bienvenue avec auto-installation */}
      {showWelcomePrompt && showPrompt && (isInstallable || canInstall) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-8 text-center shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-4">
              Bienvenue sur CERCLE PRIVÉ
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Installez notre application pour un accès rapide à nos biens de prestige 
              directement depuis votre écran d'accueil.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleInstall}
                className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
              >
                <Download className="w-5 h-5" />
                <span>Installer l'application</span>
              </button>
              
              <button
                onClick={handleManualInstall}
                className="w-full px-6 py-3 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors font-medium"
              >
                Instructions d'installation
              </button>
              
              <button
                onClick={handleDismiss}
                className="w-full px-6 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-sm"
              >
                Continuer sans installer
              </button>
            </div>
          </div>
        </motion.div>
      )}
      
      {showManualInstructions && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-600 p-6 z-50"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Installation manuelle
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p><strong>Sur Android :</strong> Menu → "Ajouter à l'écran d'accueil"</p>
                <p><strong>Sur iPhone :</strong> Partager → "Sur l'écran d'accueil"</p>
                <p><strong>Sur Desktop :</strong> Menu navigateur → "Installer CERCLE PRIVÉ"</p>
              </div>
              
              <button
                onClick={handleDismiss}
                className="mt-4 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm"
              >
                Fermer
              </button>
            </div>
            
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
      
      {showPrompt && !showWelcomePrompt && (isInstallable || canInstall) && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-600 p-6 z-50"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Installer l'app CERCLE PRIVÉ
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Accédez rapidement à nos biens de prestige depuis votre écran d'accueil
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleInstall}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span>Installer</span>
                </button>
                <button
                  onClick={handleManualInstall}
                  className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors text-sm"
                >
                  Instructions
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm"
                >
                  Plus tard
                </button>
              </div>
            </div>
            
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;