// Utilitaires d'optimisation de performance
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // Mesurer les Core Web Vitals
  measureWebVitals(): void {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.set('LCP', lastEntry.startTime);
          console.log('Performance - LCP:', lastEntry.startTime + 'ms');
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach(entry => {
            const fid = entry.processingStart - entry.startTime;
            this.metrics.set('FID', fid);
            console.log('Performance - FID:', fid + 'ms');
          });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.set('CLS', clsValue);
          console.log('Performance - CLS:', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('Performance Observer non supporté:', error);
      }
    }
  }

  // Optimiser le chargement des images
  optimizeImageLoading(): void {
    // Lazy loading natif pour les images
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback pour les navigateurs anciens
      images.forEach(img => {
        const imgElement = img as HTMLImageElement;
        if (imgElement.dataset.src) {
          imgElement.src = imgElement.dataset.src;
          imgElement.removeAttribute('data-src');
        }
      });
    }
  }

  // Précharger les ressources critiques
  preloadCriticalResources(): void {
    const criticalResources = [
      { href: 'https://images.pexels.com', rel: 'preconnect' },
      { href: 'https://fonts.googleapis.com', rel: 'preconnect' },
      { href: 'https://fonts.gstatic.com', rel: 'preconnect', crossorigin: 'anonymous' }
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = resource.rel;
      link.href = resource.href;
      if (resource.crossorigin) {
        link.crossOrigin = resource.crossorigin;
      }
      document.head.appendChild(link);
    });
  }

  // Optimiser les animations
  optimizeAnimations(): void {
    // Réduire les animations si l'utilisateur préfère moins de mouvement
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    }
  }

  // Nettoyer le localStorage périodiquement
  cleanupStorage(): void {
    try {
      const storageKeys = Object.keys(localStorage);
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 jours
      const now = Date.now();

      storageKeys.forEach(key => {
        if (key.startsWith('temp_') || key.startsWith('cache_')) {
          try {
            const item = JSON.parse(localStorage.getItem(key) || '{}');
            if (item.timestamp && (now - item.timestamp) > maxAge) {
              localStorage.removeItem(key);
              console.log('Storage nettoyé:', key);
            }
          } catch (error) {
            // Supprimer les items corrompus
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn('Erreur nettoyage storage:', error);
    }
  }

  // Surveiller les erreurs de ressources
  monitorResourceErrors(): void {
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        const target = event.target as HTMLElement;
        console.warn('Ressource échouée:', target.tagName, target.getAttribute('src') || target.getAttribute('href'));
        
        // Retry automatique pour les images
        if (target.tagName === 'IMG') {
          const img = target as HTMLImageElement;
          const originalSrc = img.src;
          
          setTimeout(() => {
            if (img.src === originalSrc) {
              console.log('Retry chargement image:', originalSrc);
              img.src = originalSrc + '?retry=' + Date.now();
            }
          }, 2000);
        }
      }
    }, true);
  }

  // Initialiser toutes les optimisations
  init(): void {
    console.log('Performance Optimizer: Initialisation');
    
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.runOptimizations();
      });
    } else {
      this.runOptimizations();
    }
  }

  private runOptimizations(): void {
    this.measureWebVitals();
    this.optimizeImageLoading();
    this.preloadCriticalResources();
    this.optimizeAnimations();
    this.monitorResourceErrors();
    
    // Nettoyage périodique
    setTimeout(() => {
      this.cleanupStorage();
    }, 5000);
  }

  // Obtenir les métriques collectées
  getMetrics(): Map<string, number> {
    return this.metrics;
  }
}

// Auto-initialisation
PerformanceOptimizer.getInstance().init();