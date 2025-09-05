import React from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../hooks/usePWA';

const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, installApp } = usePWA();
  const [showPrompt, setShowPrompt] = React.useState(false);

  React.useEffect(() => {
    if (isInstallable) {
      // Attendre un peu avant de montrer le prompt
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  const handleInstall = async () => {
    await installApp();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Ne plus montrer pendant cette session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Ne pas montrer si déjà dismissé dans cette session
  if (sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && isInstallable && (
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
                Installer l'app OFF MARKET
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