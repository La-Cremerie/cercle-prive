// Système de diagnostic avancé pour résoudre les pages blanches
export class DiagnosticsManager {
  private static instance: DiagnosticsManager;
  private diagnosticResults: Map<string, any> = new Map();
  private isRunning: boolean = false;

  static getInstance(): DiagnosticsManager {
    if (!DiagnosticsManager.instance) {
      DiagnosticsManager.instance = new DiagnosticsManager();
    }
    return DiagnosticsManager.instance;
  }

  // Diagnostic complet de l'état de l'application
  async runFullDiagnostic(): Promise<any> {
    if (this.isRunning) {
      console.warn('🔄 Diagnostic déjà en cours...');
      return this.diagnosticResults;
    }

    this.isRunning = true;
    console.log('🔍 Démarrage du diagnostic complet...');

    try {
      const results = {
        timestamp: new Date().toISOString(),
        browser: this.getBrowserInfo(),
        performance: await this.checkPerformance(),
        network: await this.checkNetworkConnectivity(),
        storage: this.checkStorageHealth(),
        dom: this.checkDOMState(),
        react: this.checkReactState(),
        resources: await this.checkCriticalResources(),
        errors: this.getErrorHistory()
      };

      this.diagnosticResults.set('lastDiagnostic', results);
      console.log('📊 Diagnostic terminé:', results);
      
      return results;
    } catch (error) {
      console.error('❌ Erreur pendant le diagnostic:', error);
      return { error: error.message };
    } finally {
      this.isRunning = false;
    }
  }

  // Informations sur le navigateur
  private getBrowserInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      }
    };
  }

  // Vérification des performances
  private async checkPerformance(): Promise<any> {
    const results: any = {
      timing: {},
      memory: {},
      vitals: {}
    };

    // Navigation Timing
    if (performance.timing) {
      const timing = performance.timing;
      results.timing = {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
        domInteractive: timing.domInteractive - timing.navigationStart
      };
    }

    // Memory (si disponible)
    if ('memory' in performance) {
      results.memory = {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      };
    }

    // Core Web Vitals (si disponible)
    if ('PerformanceObserver' in window) {
      try {
        const vitals = await this.measureWebVitals();
        results.vitals = vitals;
      } catch (error) {
        results.vitals = { error: 'Non supporté' };
      }
    }

    return results;
  }

  // Mesurer les Core Web Vitals
  private measureWebVitals(): Promise<any> {
    return new Promise((resolve) => {
      const vitals: any = {};
      let completed = 0;
      const total = 3;

      const checkComplete = () => {
        completed++;
        if (completed >= total) {
          resolve(vitals);
        }
      };

      // LCP
      try {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.startTime;
          checkComplete();
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        vitals.lcp = 'Non supporté';
        checkComplete();
      }

      // FID
      try {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach(entry => {
            vitals.fid = entry.processingStart - entry.startTime;
          });
          checkComplete();
        }).observe({ entryTypes: ['first-input'] });
      } catch (e) {
        vitals.fid = 'Non supporté';
        checkComplete();
      }

      // CLS
      try {
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          vitals.cls = clsValue;
          checkComplete();
        }).observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        vitals.cls = 'Non supporté';
        checkComplete();
      }

      // Timeout de sécurité
      setTimeout(() => {
        resolve(vitals);
      }, 5000);
    });
  }

  // Vérification de la connectivité réseau
  private async checkNetworkConnectivity(): Promise<any> {
    const results: any = {
      online: navigator.onLine,
      connection: {},
      latency: null
    };

    // Connection API (si disponible)
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      results.connection = {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData
      };
    }

    // Test de latence
    try {
      const start = performance.now();
      await fetch('/manifest.json', { method: 'HEAD', cache: 'no-cache' });
      results.latency = performance.now() - start;
    } catch (error) {
      results.latency = 'Erreur de connectivité';
    }

    return results;
  }

  // Vérification de l'état du stockage
  private checkStorageHealth() {
    const results: any = {
      localStorage: { available: false, quota: null, usage: null },
      sessionStorage: { available: false },
      indexedDB: { available: false }
    };

    // LocalStorage
    try {
      // Check if localStorage is available
      if (typeof Storage === 'undefined' || typeof localStorage === 'undefined') {
        results.localStorage.error = 'localStorage not supported';
        return results;
      }
      
      // Check if localStorage is available
      if (typeof Storage === 'undefined' || typeof localStorage === 'undefined') {
        results.localStorage.error = 'localStorage not supported';
        return results;
      }
      
      localStorage.setItem('diagnostic-test', 'test');
      localStorage.removeItem('diagnostic-test');
      results.localStorage.available = true;

      // Estimation de l'usage
      let totalSize = 0;
      try {
        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key)) {
            totalSize += (localStorage[key] || '').length;
          }
            totalSize += (localStorage[key] || '').length;
          }
        }
        results.localStorage.usage = totalSize;
      } catch (storageError) {
        results.localStorage.usage = 'Erreur de calcul';
      }

      // Quota (estimation)
      if (typeof navigator !== 'undefined' && 
          'storage' in navigator && 
          navigator.storage && 
          'estimate' in navigator.storage) {
        navigator.storage.estimate().then(estimate => {
          results.localStorage.quota = estimate.quota;
        }).catch(() => {
          results.localStorage.quota = 'Non disponible';
        });
      }
    } catch (error) {
      results.localStorage.error = error instanceof Error ? error.message : 'Erreur inconnue';
    }

    // SessionStorage
    try {
      if (typeof sessionStorage === 'undefined') {
        results.sessionStorage.error = 'sessionStorage not supported';
      } else {
      sessionStorage.setItem('diagnostic-test', 'test');
      sessionStorage.removeItem('diagnostic-test');
      results.sessionStorage.available = true;
      }
    } catch (error) {
      results.sessionStorage.error = error instanceof Error ? error.message : 'Erreur inconnue';
    }

    // IndexedDB
    try {
      results.indexedDB.available = typeof window !== 'undefined' && 'indexedDB' in window;
    } catch (error) {
      results.indexedDB.error = error instanceof Error ? error.message : 'Erreur inconnue';
    }

    return results;
  }

  // Vérification de l'état du DOM
  private checkDOMState() {
    return {
      readyState: document.readyState,
      rootElement: {
        exists: !!document.getElementById('root'),
        hasChildren: document.getElementById('root')?.children.length || 0,
        innerHTML: document.getElementById('root')?.innerHTML.length || 0
      },
      scripts: document.scripts.length,
      stylesheets: document.styleSheets.length,
      images: document.images.length
    };
  }

  // Vérification de l'état de React
  private checkReactState() {
    // Safely check for React availability
    let reactAvailable = false;
    let reactDOMAvailable = false;
    let reactVersion = 'Non disponible';
    
    try {
      // Check if React is available globally
      reactAvailable = typeof window !== 'undefined' && 
                      (typeof (window as any).React !== 'undefined' || 
                       typeof React !== 'undefined');
      reactVersion = reactAvailable ? 
                    ((window as any).React?.version || 'Version inconnue') : 
                    'Non disponible';
    } catch (error) {
      reactAvailable = false;
    }
    
    try {
      // Check if ReactDOM is available globally
      reactDOMAvailable = typeof window !== 'undefined' && 
                         (typeof (window as any).ReactDOM !== 'undefined' || 
                          typeof ReactDOM !== 'undefined');
    } catch (error) {
      reactDOMAvailable = false;
    }
    
    // Safely check for React availability
    let reactAvailable = false;
    let reactDOMAvailable = false;
    let reactVersion = 'Non disponible';
    
    try {
      // Check if React is available globally
      reactAvailable = typeof window !== 'undefined' && 
                      (typeof (window as any).React !== 'undefined' || 
                       typeof React !== 'undefined');
      reactVersion = reactAvailable ? 
                    ((window as any).React?.version || 'Version inconnue') : 
                    'Non disponible';
    } catch (error) {
      reactAvailable = false;
    }
    
    try {
      // Check if ReactDOM is available globally
      reactDOMAvailable = typeof window !== 'undefined' && 
                         (typeof (window as any).ReactDOM !== 'undefined' || 
                          typeof ReactDOM !== 'undefined');
    } catch (error) {
      reactDOMAvailable = false;
    }
    
    return {
      reactAvailable,
      reactDOMAvailable,
      reactVersion,
      reactRootMounted: !!document.querySelector('[data-reactroot]') || 
                       document.getElementById('root')?.children.length > 0,
      reactDevTools: !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__
    };
  }

  // Vérification des ressources critiques
  private async checkCriticalResources(): Promise<any> {
    const criticalResources = [
      '/manifest.json',
      '/icon-192.png',
      '/icon-512.png',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=100'
    ];

    const results: any = {};

    for (const resource of criticalResources) {
      try {
        const response = await fetch(resource, { method: 'HEAD' });
        results[resource] = {
          status: response.status,
          ok: response.ok,
          headers: {
            contentType: response.headers.get('content-type'),
            contentLength: response.headers.get('content-length'),
            lastModified: response.headers.get('last-modified')
          }
        };
      } catch (error) {
        results[resource] = {
          error: error.message,
          ok: false
        };
      }
    }

    return results;
  }

  // Historique des erreurs
  private getErrorHistory() {
    try {
      // Safely check localStorage availability
      if (typeof localStorage === 'undefined') {
        return { error: 'localStorage non disponible' };
      }
      
      // Safely check localStorage availability
      if (typeof localStorage === 'undefined') {
        return { error: 'localStorage non disponible' };
      }
      
      const errorLog = localStorage.getItem('errorLog');
      const errors = errorLog ? JSON.parse(errorLog) : [];
      
      return {
        totalErrors: errors.length,
        recentErrors: errors.slice(-5),
        errorTypes: this.categorizeErrors(errors)
      };
    } catch (error) {
      return { error: 'Impossible de lire l\'historique' };
    }
  }

  // Catégoriser les erreurs
  private categorizeErrors(errors: any[]) {
    const categories: any = {};
    
    errors.forEach(error => {
      const type = error.type || 'unknown';
      categories[type] = (categories[type] || 0) + 1;
    });

    return categories;
  }

  // Générer un rapport de diagnostic
  generateReport(): string {
    const lastDiagnostic = this.diagnosticResults.get('lastDiagnostic');
    
    if (!lastDiagnostic) {
      return 'Aucun diagnostic disponible. Exécutez runFullDiagnostic() d\'abord.';
    }

    return `
# RAPPORT DE DIAGNOSTIC - CERCLE PRIVÉ

## 📊 Résumé Exécutif
- **Date :** ${new Date(lastDiagnostic.timestamp).toLocaleString('fr-FR')}
- **Navigateur :** ${lastDiagnostic.browser.userAgent.split(' ')[0]}
- **Statut général :** ${this.getOverallHealth(lastDiagnostic)}

## 🌐 Connectivité
- **En ligne :** ${lastDiagnostic.network.online ? '✅' : '❌'}
- **Latence :** ${lastDiagnostic.network.latency}ms
- **Type de connexion :** ${lastDiagnostic.network.connection.effectiveType || 'Non disponible'}

## ⚡ Performance
- **DOM Interactive :** ${lastDiagnostic.performance.timing.domInteractive}ms
- **Chargement complet :** ${lastDiagnostic.performance.timing.loadComplete}ms
- **LCP :** ${lastDiagnostic.performance.vitals.lcp || 'N/A'}ms

## 🗄️ Stockage
- **LocalStorage :** ${lastDiagnostic.storage.localStorage.available ? '✅' : '❌'}
- **Usage :** ${lastDiagnostic.storage.localStorage.usage} caractères
- **SessionStorage :** ${lastDiagnostic.storage.sessionStorage.available ? '✅' : '❌'}

## ⚛️ React
- **React monté :** ${lastDiagnostic.react.reactRootMounted ? '✅' : '❌'}
- **Version :** ${lastDiagnostic.react.reactVersion}
- **DevTools :** ${lastDiagnostic.react.reactDevTools ? '✅' : '❌'}

## 🚨 Erreurs
- **Total :** ${lastDiagnostic.errors.totalErrors}
- **Récentes :** ${lastDiagnostic.errors.recentErrors.length}
- **Types :** ${Object.keys(lastDiagnostic.errors.errorTypes).join(', ')}

## 📦 Ressources Critiques
${Object.entries(lastDiagnostic.resources).map(([resource, status]: [string, any]) => 
  `- **${resource}:** ${status.ok ? '✅' : '❌'} (${status.status || status.error})`
).join('\n')}
    `;
  }

  // Évaluer la santé générale
  private getOverallHealth(diagnostic: any): string {
    let score = 0;
    let total = 0;

    // Connectivité (25%)
    if (diagnostic.network.online) score += 25;
    total += 25;

    // React (25%)
    if (diagnostic.react.reactRootMounted) score += 25;
    total += 25;

    // Stockage (25%)
    if (diagnostic.storage.localStorage.available) score += 25;
    total += 25;

    // Ressources (25%)
    const resourcesOk = Object.values(diagnostic.resources).filter((r: any) => r.ok).length;
    const totalResources = Object.keys(diagnostic.resources).length;
    score += (resourcesOk / totalResources) * 25;
    total += 25;

    const percentage = Math.round((score / total) * 100);
    
    if (percentage >= 90) return '🟢 Excellent';
    if (percentage >= 70) return '🟡 Bon';
    if (percentage >= 50) return '🟠 Moyen';
    return '🔴 Critique';
  }

  // Solutions automatiques
  async autoFix(): Promise<string[]> {
    const fixes: string[] = [];
    const diagnostic = await this.runFullDiagnostic();

    // Fix 1: Nettoyer le localStorage corrompu
    if (diagnostic.storage.localStorage.available) {
      try {
        const corruptedKeys = this.findCorruptedStorageKeys();
        if (corruptedKeys.length > 0) {
          corruptedKeys.forEach(key => localStorage.removeItem(key));
          fixes.push(`🧹 Supprimé ${corruptedKeys.length} clé(s) corrompue(s) du localStorage`);
        }
      } catch (error) {
        fixes.push('❌ Impossible de nettoyer le localStorage');
      }
    }

    // Fix 2: Vider les caches obsolètes
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => !name.includes('v3'));
        
        for (const cacheName of oldCaches) {
          await caches.delete(cacheName);
        }
        
        if (oldCaches.length > 0) {
          fixes.push(`🗑️ Supprimé ${oldCaches.length} cache(s) obsolète(s)`);
        }
      } catch (error) {
        fixes.push('❌ Impossible de nettoyer les caches');
      }
    }

    // Fix 3: Réinitialiser les paramètres corrompus
    try {
      const settingsKeys = ['designSettings', 'siteContent', 'emailSettings'];
      let resetCount = 0;
      
      settingsKeys.forEach(key => {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            JSON.parse(value); // Test de validité JSON
          }
        } catch (error) {
          localStorage.removeItem(key);
          resetCount++;
        }
      });
      
      if (resetCount > 0) {
        fixes.push(`⚙️ Réinitialisé ${resetCount} paramètre(s) corrompu(s)`);
      }
    } catch (error) {
      fixes.push('❌ Impossible de vérifier les paramètres');
    }

    return fixes;
  }

  // Trouver les clés corrompues dans le localStorage
  private findCorruptedStorageKeys(): string[] {
    const corruptedKeys: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const value = localStorage.getItem(key);
          if (value && value.startsWith('{')) {
            JSON.parse(value); // Test de validité JSON
          }
        } catch (error) {
          corruptedKeys.push(key);
        }
        results.localStorage.usage = totalSize;
      } catch (storageError) {
        results.localStorage.usage = 'Erreur de calcul';
      }
    }
    
    return corruptedKeys;
  }

  // Exporter le diagnostic pour support technique
  exportDiagnostic(): string {
    const diagnostic = this.diagnosticResults.get('lastDiagnostic');
    if (!diagnostic) {
      return 'Aucun diagnostic disponible';
    }

    return JSON.stringify(diagnostic, null, 2);
  }

  // Réinitialisation d'urgence
  emergencyReset(): void {
    console.log('🚨 Réinitialisation d\'urgence...');
    
    try {
      // Nettoyer tout le stockage
      localStorage.clear();
      
      // Nettoyer les caches
      if (typeof navigator !== 'undefined' && 
          'storage' in navigator && 
          navigator.storage && 
          'estimate' in navigator.storage) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        }).catch(() => {
          results.localStorage.quota = 'Non disponible';
        });
      }
      
      results.localStorage.error = error instanceof Error ? error.message : 'Erreur inconnue';
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      // Forcer le rechargement même en cas d'erreur
      window.location.href = window.location.href;
    }
  }
}

      if (typeof sessionStorage === 'undefined') {
        results.sessionStorage.error = 'sessionStorage not supported';
      } else {
// Auto-initialisation pour diagnostic automatique
      }
if (typeof window !== 'undefined') {
      results.sessionStorage.error = error instanceof Error ? error.message : 'Erreur inconnue';
  window.addEventListener('error', () => {
    setTimeout(() => {
      DiagnosticsManager.getInstance().runFullDiagnostic();
    }, 2000);
      results.indexedDB.available = typeof window !== 'undefined' && 'indexedDB' in window;
  
      results.indexedDB.error = error instanceof Error ? error.message : 'Erreur inconnue';
  if (import.meta.env.DEV) {
    (window as any).diagnostics = DiagnosticsManager.getInstance();
    console.log('🔧 Outils de diagnostic disponibles via window.diagnostics');
  }
}