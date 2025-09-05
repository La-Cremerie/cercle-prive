import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [autoPromptShown, setAutoPromptShown] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    // Vérifier si l'installation est possible
    const checkInstallability = () => {
      // Vérifier les critères PWA
      const hasManifest = document.querySelector('link[rel="manifest"]');
      const hasServiceWorker = 'serviceWorker' in navigator;
      const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
      
      setCanInstall(!!(hasManifest && hasServiceWorker && isHTTPS));
    };

    checkIfInstalled();
    checkInstallability();

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Écouter l'installation de l'app
    const handleAppInstalled = () => {
      console.log('PWA installée avec succès');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      localStorage.setItem('pwa-installed', 'true');
      localStorage.setItem('pwa-auto-prompt-shown', 'true');
    };

    // Auto-prompt immédiat si pas encore montré
    const autoPromptTimer = setTimeout(() => {
      const alreadyShown = localStorage.getItem('pwa-auto-prompt-shown');
      const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
      
      if (!isInstalled && !alreadyShown && !dismissed && !autoPromptShown) {
        setIsInstallable(true);
        setAutoPromptShown(true);
        localStorage.setItem('pwa-auto-prompt-shown', 'true');
        console.log('PWA: Auto-prompt déclenché');
      }
    }, 1500); // Prompt plus rapide

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      clearTimeout(autoPromptTimer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [canInstall, isInstalled, autoPromptShown]);

  const installApp = async () => {
    if (!deferredPrompt) return;

    try {
      console.log('PWA: Tentative d\'installation...');
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('PWA: Choix utilisateur:', outcome);
      if (outcome === 'accepted') {
        console.log('PWA: Installation acceptée');
        setIsInstallable(false);
        setDeferredPrompt(null);
      } else {
        console.log('PWA: Installation refusée');
      }
    } catch (error) {
      console.error('Erreur lors de l\'installation:', error);
      // Fallback: proposer l'installation manuelle
      alert('Pour installer l\'application :\n\n• Sur Android : Menu → "Ajouter à l\'écran d\'accueil"\n• Sur iOS : Partager → "Sur l\'écran d\'accueil"\n• Sur Desktop : Menu navigateur → "Installer CERCLE PRIVÉ"');
    }
  };

  return {
    isInstallable,
    isInstalled,
    installApp,
    canInstall,
    autoPromptShown
  };
};