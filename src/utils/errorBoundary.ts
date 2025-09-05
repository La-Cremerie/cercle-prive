// Gestionnaire d'erreurs global pour la stabilité
export class ErrorBoundaryManager {
  private static instance: ErrorBoundaryManager;
  private errorCount: number = 0;
  private maxErrors: number = 10;
  private criticalErrors: string[] = [];
  private recoveryAttempts: number = 0;
  private maxRecoveryAttempts: number = 3;

  static getInstance(): ErrorBoundaryManager {
    if (!ErrorBoundaryManager.instance) {
      ErrorBoundaryManager.instance = new ErrorBoundaryManager();
    }
    return ErrorBoundaryManager.instance;
  }

  init(): void {
    this.setupGlobalErrorHandling();
    this.setupUnhandledRejectionHandling();
    this.setupResourceErrorHandling();
    this.setupCriticalErrorDetection();
    this.setupAutomaticRecovery();
  }

  private setupGlobalErrorHandling(): void {
    window.addEventListener('error', (event) => {
      this.errorCount++;
      
      const errorInfo = {
        message: event.error?.message || event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      console.group('🚨 Erreur JavaScript Capturée');
      console.error('Message:', errorInfo.message);
      console.error('Fichier:', errorInfo.filename);
      console.error('Ligne:', errorInfo.lineno);
      console.error('Stack:', errorInfo.stack);
      console.groupEnd();

      // Sauvegarder l'erreur pour diagnostic
      this.saveErrorToStorage(errorInfo);

      // Si trop d'erreurs, proposer un refresh
      if (this.errorCount >= this.maxErrors) {
        this.handleCriticalErrorState();
      }

      // Empêcher l'affichage de l'erreur par défaut du navigateur
      event.preventDefault();
      
      // Détecter les erreurs critiques
      this.detectCriticalError(errorInfo);
    });
  }

  private setupUnhandledRejectionHandling(): void {
    window.addEventListener('unhandledrejection', (event) => {
      console.warn('🔄 Promise rejetée:', event.reason);
      
      const errorInfo = {
        type: 'unhandledrejection',
        reason: event.reason?.toString() || 'Unknown',
        timestamp: new Date().toISOString(),
        url: window.location.href
      };

      this.saveErrorToStorage(errorInfo);
      
      // Empêcher l'affichage de l'erreur
      event.preventDefault();
      
      // Traiter les promesses rejetées critiques
      this.handleCriticalRejection(event.reason);
    });
  }

  private setupResourceErrorHandling(): void {
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        const target = event.target as HTMLElement;
        const resourceType = target.tagName.toLowerCase();
        const resourceUrl = target.getAttribute('src') || target.getAttribute('href') || '';

        console.warn(`📦 Erreur ressource ${resourceType}:`, resourceUrl);

        // Tentative de récupération automatique
        this.handleResourceError(target, resourceType, resourceUrl);
      }
    }, true);
  }

  // Détecter les erreurs critiques qui causent des pages blanches
  private setupCriticalErrorDetection(): void {
    const criticalErrorPatterns = [
      /Cannot read prop/i,
      /undefined is not a function/i,
      /Failed to fetch/i,
      /Network request failed/i,
      /Loading chunk \d+ failed/i,
      /Script error/i,
      /Non-Error promise rejection captured/i
    ];

    window.addEventListener('error', (event) => {
      const errorMessage = event.error?.message || event.message || '';
      
      const isCritical = criticalErrorPatterns.some(pattern => 
        pattern.test(errorMessage)
      );
      
      if (isCritical) {
        this.criticalErrors.push(errorMessage);
        console.error('🚨 Erreur critique détectée:', errorMessage);
        
        // Déclencher la récupération automatique
        this.triggerAutomaticRecovery();
      }
    });
  }

  // Système de récupération automatique
  private setupAutomaticRecovery(): void {
    // Surveiller l'état de l'application
    const checkApplicationHealth = () => {
      const rootElement = document.getElementById('root');
      const hasContent = rootElement && rootElement.children.length > 0;
      const hasReactRoot = !!document.querySelector('[data-reactroot]');
      
      return hasContent || hasReactRoot;
    };

    // Vérification périodique
    const healthCheckInterval = setInterval(() => {
      if (!checkApplicationHealth() && this.criticalErrors.length > 0) {
        console.warn('⚠️ Application non responsive détectée');
        this.triggerAutomaticRecovery();
      }
    }, 10000); // Vérifier toutes les 10 secondes

    // Nettoyer l'intervalle après 5 minutes
    setTimeout(() => {
      clearInterval(healthCheckInterval);
    }, 5 * 60 * 1000);
  }

  // Déclencher la récupération automatique
  private triggerAutomaticRecovery(): void {
    if (this.recoveryAttempts >= this.maxRecoveryAttempts) {
      console.error('🚨 Nombre maximum de tentatives de récupération atteint');
      this.showEmergencyInterface();
      return;
    }

    this.recoveryAttempts++;
    console.log(`🔄 Tentative de récupération automatique ${this.recoveryAttempts}/${this.maxRecoveryAttempts}`);

    // Stratégies de récupération progressives
    switch (this.recoveryAttempts) {
      case 1:
        this.softRecovery();
        break;
      case 2:
        this.mediumRecovery();
        break;
      case 3:
        this.hardRecovery();
        break;
      default:
        this.showEmergencyInterface();
    }
  }

  // Récupération douce (nettoyage léger)
  private softRecovery(): void {
    console.log('🧹 Récupération douce...');
    
    try {
      // Nettoyer les données temporaires
      const tempKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('temp_') || key.startsWith('cache_')
      );
      
      tempKeys.forEach(key => localStorage.removeItem(key));
      
      // Recharger après un délai
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Erreur récupération douce:', error);
      this.triggerAutomaticRecovery();
    }
  }

  // Récupération moyenne (nettoyage des paramètres)
  private mediumRecovery(): void {
    console.log('🔧 Récupération moyenne...');
    
    try {
      // Sauvegarder les données utilisateur importantes
      const userData = localStorage.getItem('userData');
      const userLoggedIn = localStorage.getItem('userLoggedIn');
      
      // Nettoyer tout sauf les données utilisateur
      localStorage.clear();
      
      // Restaurer les données utilisateur
      if (userData) localStorage.setItem('userData', userData);
      if (userLoggedIn) localStorage.setItem('userLoggedIn', userLoggedIn);
      
      // Nettoyer les caches
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }
      
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      
    } catch (error) {
      console.error('Erreur récupération moyenne:', error);
      this.triggerAutomaticRecovery();
    }
  }

  // Récupération forte (reset complet)
  private hardRecovery(): void {
    console.log('💥 Récupération forte...');
    
    try {
      // Reset complet
      localStorage.clear();
      sessionStorage.clear();
      
      // Nettoyer tous les caches
      if ('caches' in window) {
        caches.keys().then(names => {
          Promise.all(names.map(name => caches.delete(name)));
        });
      }
      
      // Forcer le rechargement sans cache
      setTimeout(() => {
        window.location.href = window.location.href + '?recovery=' + Date.now();
      }, 1000);
      
    } catch (error) {
      console.error('Erreur récupération forte:', error);
      this.showEmergencyInterface();
    }
  }

  // Interface d'urgence
  private showEmergencyInterface(): void {
    console.log('🚨 Affichage interface d\'urgence');
    
    const emergencyHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #111827 0%, #1F2937 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        font-family: system-ui, sans-serif;
        color: white;
      ">
        <div style="text-align: center; max-width: 500px; padding: 2rem;">
          <h1 style="color: #D97706; font-size: 2.5rem; margin-bottom: 1rem; font-weight: 300;">
            CERCLE PRIVÉ
          </h1>
          <h2 style="color: #EF4444; font-size: 1.2rem; margin-bottom: 1rem;">
            Problème Technique Détecté
          </h2>
          <p style="color: #9CA3AF; margin-bottom: 2rem; line-height: 1.6;">
            Notre système a détecté un problème technique. Nous proposons plusieurs solutions pour résoudre ce problème rapidement.
          </p>
          <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
            <button onclick="window.location.reload()" style="
              background: #D97706;
              color: white;
              border: none;
              padding: 1rem 2rem;
              border-radius: 0.5rem;
              cursor: pointer;
              font-size: 1rem;
              font-weight: 500;
            ">
              🔄 Actualiser la page
            </button>
            <button onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload();" style="
              background: #1F2937;
              color: #D97706;
              border: 1px solid #D97706;
              padding: 1rem 2rem;
              border-radius: 0.5rem;
              cursor: pointer;
              font-size: 1rem;
              font-weight: 500;
            ">
              🧹 Vider le cache et actualiser
            </button>
            <a href="mailto:nicolas.c@lacremerie.fr?subject=Problème technique urgent - Page blanche&body=Bonjour,%0A%0AJe rencontre un problème de page blanche sur le site CERCLE PRIVÉ.%0A%0AInformations techniques:%0A- URL: ${window.location.href}%0A- Navigateur: ${navigator.userAgent}%0A- Heure: ${new Date().toLocaleString('fr-FR')}%0A%0AMerci de votre aide." style="
              background: transparent;
              color: #9CA3AF;
              border: 1px solid #4B5563;
              padding: 1rem 2rem;
              border-radius: 0.5rem;
              text-decoration: none;
              font-size: 1rem;
              font-weight: 500;
              display: inline-block;
            ">
              📧 Contacter le support technique
            </a>
          </div>
          <p style="color: #6B7280; font-size: 0.8rem;">
            Erreurs détectées: ${this.criticalErrors.length} | Tentatives: ${this.recoveryAttempts}/${this.maxRecoveryAttempts}
          </p>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', emergencyHTML);
  }

  // Détecter les erreurs critiques
  private detectCriticalError(errorInfo: any): void {
    const criticalPatterns = [
      'Cannot read prop',
      'undefined is not a function',
      'Failed to fetch',
      'Loading chunk',
      'Script error'
    ];

    const isCritical = criticalPatterns.some(pattern => 
      errorInfo.message.includes(pattern)
    );

    if (isCritical) {
      this.criticalErrors.push(errorInfo.message);
      
      // Si trop d'erreurs critiques, déclencher la récupération
      if (this.criticalErrors.length >= 3) {
        this.triggerAutomaticRecovery();
      }
    }
  }

  // Gérer les rejets de promesse critiques
  private handleCriticalRejection(reason: any): void {
    const reasonStr = reason?.toString() || 'Unknown rejection';
    
    if (reasonStr.includes('Loading') || reasonStr.includes('fetch') || reasonStr.includes('network')) {
      this.criticalErrors.push(reasonStr);
      console.warn('🔄 Rejet critique de promesse:', reasonStr);
    }
  }

  // Obtenir le statut de santé
  getHealthStatus(): any {
    return {
      errorCount: this.errorCount,
      criticalErrors: this.criticalErrors.length,
      recoveryAttempts: this.recoveryAttempts,
      isHealthy: this.errorCount < this.maxErrors && this.criticalErrors.length < 3
    };
  }
  private handleResourceError(element: HTMLElement, type: string, url: string): void {
    switch (type) {
      case 'img':
        this.handleImageError(element as HTMLImageElement, url);
        break;
      case 'script':
        this.handleScriptError(element as HTMLScriptElement, url);
        break;
      case 'link':
        this.handleStyleError(element as HTMLLinkElement, url);
        break;
    }
  }

  private handleImageError(img: HTMLImageElement, originalUrl: string): void {
    // Fallback vers une image placeholder
    const placeholderSvg = `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#f3f4f6"/>
        <text x="200" y="150" text-anchor="middle" fill="#9ca3af" font-family="system-ui">
          Image temporairement indisponible
        </text>
      </svg>
    `)}`;
    
    img.src = placeholderSvg;
    img.alt = 'Image temporairement indisponible';
    
    // Retry après un délai
    setTimeout(() => {
      if (img.src === placeholderSvg) {
        img.src = originalUrl + '?retry=' + Date.now();
      }
    }, 5000);
  }

  private handleScriptError(script: HTMLScriptElement, url: string): void {
    console.error('Script échoué:', url);
    // En production, vous pourriez charger un script de fallback
  }

  private handleStyleError(link: HTMLLinkElement, url: string): void {
    console.error('CSS échoué:', url);
    // En production, vous pourriez charger un CSS de fallback
  }

  private saveErrorToStorage(errorInfo: any): void {
    try {
      const errors = JSON.parse(localStorage.getItem('errorLog') || '[]');
      errors.push(errorInfo);
      
      // Garder seulement les 50 dernières erreurs
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50);
      }
      
      localStorage.setItem('errorLog', JSON.stringify(errors));
    } catch (storageError) {
      console.warn('Impossible de sauvegarder l\'erreur:', storageError);
    }
  }

  private handleCriticalErrorState(): void {
    console.error('🚨 État critique: Trop d\'erreurs détectées');
    
    // Proposer un refresh après un délai
    setTimeout(() => {
      if (confirm('Le site a rencontré plusieurs erreurs. Souhaitez-vous actualiser la page ?')) {
        window.location.reload();
      }
    }, 2000);
  }

  // Obtenir le rapport d'erreurs
  getErrorReport(): any[] {
    try {
      return JSON.parse(localStorage.getItem('errorLog') || '[]');
    } catch (error) {
      return [];
    }
  }

  // Nettoyer le log d'erreurs
  clearErrorLog(): void {
    localStorage.removeItem('errorLog');
    this.errorCount = 0;
  }
}

// Auto-initialisation
ErrorBoundaryManager.getInstance().init();