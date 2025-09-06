import { useState, useEffect } from 'react';

// Fonction pour détecter si l'app est en mode PWA
const detectPWA = () => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isInWebAppiOS = (window.navigator as any).standalone === true;
  return isStandalone || isInWebAppiOS;
};

// Fonction pour détecter si c'est un appareil mobile
const detectMobile = () => {
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

interface UpdateInfo {
  available: boolean;
  version: string;
  features: string[];
  critical: boolean;
}

export const useUpdateChecker = () => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [showUpdateSlider, setShowUpdateSlider] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isPWA] = useState(detectPWA());
  const [isMobile] = useState(detectMobile());

  const checkForUpdates = async () => {
    try {
      // Simulation de vérification de mise à jour
      // En production, vous feriez un appel API vers votre serveur
      const mockUpdate: UpdateInfo = {
        available: Math.random() > 0.7, // 30% de chance d'avoir une mise à jour
        version: '2.2.0',
        features: [
          'Amélioration des performances',
          'Nouvelles fonctionnalités de recherche',
          'Interface utilisateur optimisée',
          'Corrections de bugs'
        ],
        critical: Math.random() > 0.8 // 20% de chance d'être critique
      };

      setUpdateInfo(mockUpdate);
      setLastChecked(new Date());

      // Afficher le slider si mise à jour disponible
      if (mockUpdate.available) {
        // Délai avant affichage pour ne pas être intrusif
        setTimeout(() => {
          setShowUpdateSlider(true);
        }, mockUpdate.critical ? 1000 : 5000);
      }

      return mockUpdate;
    } catch (error) {
      console.error('Erreur lors de la vérification des mises à jour:', error);
      return null;
    }
  };

  const forceUpdate = async () => {
    try {
      // Vider tous les caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      // Mettre à jour le service worker
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.update())
        );
      }

      // Vider le localStorage des données temporaires
      const keysToKeep = ['userLoggedIn', 'userData', 'adminLoggedIn'];
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      // Recharger la page
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la mise à jour forcée:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const dismissUpdate = () => {
    setShowUpdateSlider(false);
    // Marquer comme dismissé pour cette session
    sessionStorage.setItem('updateDismissed', 'true');
  };

  // Vérification automatique au chargement
  useEffect(() => {
    const dismissed = sessionStorage.getItem('updateDismissed');
    if (!dismissed) {
      // Vérifier après 10 secondes pour laisser l'app se charger
      const timer = setTimeout(() => {
        checkForUpdates();
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Vérification périodique (toutes les 30 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      const dismissed = sessionStorage.getItem('updateDismissed');
      if (!dismissed) {
        checkForUpdates();
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, []);

  return {
    updateInfo,
    showUpdateSlider,
    setShowUpdateSlider,
    checkForUpdates,
    forceUpdate,
    dismissUpdate,
    lastChecked,
    isPWA,
    isMobile
  };
};