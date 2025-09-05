// Gestionnaire d'erreurs global pour la stabilité
export class ErrorBoundaryManager {
  private static instance: ErrorBoundaryManager;
  private errorCount: number = 0;
  private maxErrors: number = 10;

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