import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, X, Smartphone, Monitor, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface UpdateSliderProps {
  onClose?: () => void;
}

const UpdateSlider: React.FC<UpdateSliderProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [updateType, setUpdateType] = useState<'app' | 'mobile' | 'both'>('both');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateComplete, setUpdateComplete] = useState(false);

  // Détecter si c'est une PWA installée
  const [isPWA, setIsPWA] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Détecter PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    setIsPWA(isStandalone || isInWebAppiOS);

    // Détecter mobile
    setIsMobile(window.innerWidth <= 768);

    // Auto-show après 2 secondes si PWA ou mobile
    if (isStandalone || isInWebAppiOS || window.innerWidth <= 768) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    setUpdateProgress(0);

    try {
      // Simulation du processus de mise à jour
      const steps = [
        { message: 'Vérification des mises à jour...', progress: 20 },
        { message: 'Téléchargement des nouvelles données...', progress: 40 },
        { message: 'Mise à jour du cache...', progress: 60 },
        { message: 'Optimisation des performances...', progress: 80 },
        { message: 'Finalisation...', progress: 100 }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setUpdateProgress(step.progress);
        toast.loading(step.message, { id: 'update-progress' });
      }

      // Vider les caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      // Forcer la mise à jour du service worker
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.update())
        );
      }

      toast.dismiss('update-progress');
      setUpdateComplete(true);
      toast.success('Mise à jour terminée !');

      // Auto-reload après 2 secondes
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      toast.dismiss('update-progress');
      toast.error('Erreur lors de la mise à jour');
      setIsUpdating(false);
      setUpdateProgress(0);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-4 left-4 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40 flex items-center justify-center md:hidden"
        title="Vérifier les mises à jour"
      >
        <RefreshCw className="w-5 h-5" />
      </button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-2xl"
      >
        <div className="px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Mise à jour disponible</h3>
                <p className="text-blue-200 text-sm">
                  {isPWA ? 'Application' : 'Version mobile'} - Nouvelle version
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Type de mise à jour */}
          <div className="mb-6">
            <p className="text-sm text-blue-200 mb-3">Type de mise à jour :</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setUpdateType('app')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  updateType === 'app'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-blue-200 hover:bg-white/15'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Application PWA</span>
              </button>
              <button
                onClick={() => setUpdateType('mobile')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  updateType === 'mobile'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-blue-200 hover:bg-white/15'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Version mobile</span>
              </button>
              <button
                onClick={() => setUpdateType('both')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  updateType === 'both'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-blue-200 hover:bg-white/15'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Complète</span>
              </button>
            </div>
          </div>

          {/* Informations de mise à jour */}
          <div className="mb-6 p-4 bg-white/10 rounded-lg">
            <h4 className="font-medium mb-2">Nouveautés de cette version :</h4>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• Amélioration des performances</li>
              <li>• Nouvelles fonctionnalités de recherche</li>
              <li>• Interface utilisateur optimisée</li>
              <li>• Corrections de bugs</li>
            </ul>
          </div>

          {/* Barre de progression */}
          {isUpdating && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-200">Mise à jour en cours...</span>
                <span className="text-sm text-white font-medium">{updateProgress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${updateProgress}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Message de succès */}
          {updateComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-lg flex items-center space-x-3"
            >
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <h4 className="font-medium text-green-100">Mise à jour terminée !</h4>
                <p className="text-sm text-green-200">Rechargement automatique dans 2 secondes...</p>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            {!updateComplete && (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <Download className={`w-5 h-5 ${isUpdating ? 'animate-spin' : ''}`} />
                  <span>{isUpdating ? 'Mise à jour...' : 'Mettre à jour maintenant'}</span>
                </button>
                <button
                  onClick={handleClose}
                  disabled={isUpdating}
                  className="px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  Plus tard
                </button>
              </>
            )}
            
            {updateComplete && (
              <button
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Recharger maintenant</span>
              </button>
            )}
          </div>

          {/* Informations techniques */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-xs text-blue-300">
              <span>Version actuelle: 2.1.0</span>
              <span>Nouvelle version: 2.2.0</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdateSlider;