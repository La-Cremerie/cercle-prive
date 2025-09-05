/**
 * Script principal pour le site web statique
 * Fonctionnalités : navigation mobile, formulaires, animations, performance
 */

// ===== UTILITAIRES =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Debounce function pour optimiser les performances
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// ===== NAVIGATION MOBILE =====
class MobileNavigation {
  constructor() {
    this.navToggle = $('.nav-toggle');
    this.navMenu = $('.nav-menu');
    this.navLinks = $$('.nav-link');
    
    this.init();
  }
  
  init() {
    if (this.navToggle && this.navMenu) {
      this.navToggle.addEventListener('click', () => this.toggleMenu());
      
      // Fermer le menu lors du clic sur un lien
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });
      
      // Fermer le menu avec Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
          this.closeMenu();
        }
      });
      
      // Fermer le menu lors du clic à l'extérieur
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav') && this.navMenu.classList.contains('active')) {
          this.closeMenu();
        }
      });
    }
  }
  
  toggleMenu() {
    const isActive = this.navMenu.classList.contains('active');
    
    if (isActive) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
  
  openMenu() {
    this.navMenu.classList.add('active');
    this.navToggle.classList.add('active');
    this.navToggle.setAttribute('aria-expanded', 'true');
    
    // Empêcher le scroll du body
    document.body.style.overflow = 'hidden';
  }
  
  closeMenu() {
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
    this.navToggle.setAttribute('aria-expanded', 'false');
    
    // Restaurer le scroll du body
    document.body.style.overflow = '';
  }
}

// ===== FORMULAIRE DE CONTACT =====
class ContactForm {
  constructor() {
    this.form = $('#contactForm');
    this.submitBtn = this.form?.querySelector('button[type="submit"]');
    this.btnText = this.submitBtn?.querySelector('.btn-text');
    this.btnLoading = this.submitBtn?.querySelector('.btn-loading');
    
    this.init();
  }
  
  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      
      // Validation en temps réel
      const inputs = this.form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearError(input));
      });
    }
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }
    
    this.setLoading(true);
    
    try {
      // Simulation d'envoi (remplacer par votre logique d'envoi réelle)
      await this.simulateFormSubmission();
      
      this.showSuccess();
      this.form.reset();
    } catch (error) {
      this.showError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      this.setLoading(false);
    }
  }
  
  validateForm() {
    const requiredFields = this.form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = $(`#${fieldName}-error`);
    
    let isValid = true;
    let errorMessage = '';
    
    // Validation selon le type de champ
    switch (fieldName) {
      case 'name':
        if (!value) {
          errorMessage = 'Le nom est requis';
          isValid = false;
        } else if (value.length < 2) {
          errorMessage = 'Le nom doit contenir au moins 2 caractères';
          isValid = false;
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errorMessage = 'L\'email est requis';
          isValid = false;
        } else if (!emailRegex.test(value)) {
          errorMessage = 'Format d\'email invalide';
          isValid = false;
        }
        break;
        
      case 'subject':
        if (!value) {
          errorMessage = 'Veuillez sélectionner un sujet';
          isValid = false;
        }
        break;
        
      case 'message':
        if (!value) {
          errorMessage = 'Le message est requis';
          isValid = false;
        } else if (value.length < 10) {
          errorMessage = 'Le message doit contenir au moins 10 caractères';
          isValid = false;
        }
        break;
        
      case 'consent':
        if (!field.checked) {
          errorMessage = 'Vous devez accepter d\'être contacté';
          isValid = false;
        }
        break;
    }
    
    // Afficher ou masquer l'erreur
    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.style.display = isValid ? 'none' : 'block';
    }
    
    // Styling du champ
    field.classList.toggle('error', !isValid);
    
    return isValid;
  }
  
  clearError(field) {
    const errorElement = $(`#${field.name}-error`);
    if (errorElement) {
      errorElement.style.display = 'none';
    }
    field.classList.remove('error');
  }
  
  setLoading(loading) {
    if (this.submitBtn && this.btnText && this.btnLoading) {
      this.submitBtn.disabled = loading;
      this.btnText.style.display = loading ? 'none' : 'inline';
      this.btnLoading.style.display = loading ? 'inline' : 'none';
    }
  }
  
  async simulateFormSubmission() {
    // Simulation d'un délai d'envoi
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }
  
  showSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
      <div class="success-content">
        <span class="success-icon">✅</span>
        <p>Message envoyé avec succès ! Nous vous répondrons sous 24h.</p>
      </div>
    `;
    
    this.form.parentNode.insertBefore(successMessage, this.form);
    
    // Supprimer le message après 5 secondes
    setTimeout(() => {
      successMessage.remove();
    }, 5000);
  }
  
  showError(message) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message-global';
    errorMessage.innerHTML = `
      <div class="error-content">
        <span class="error-icon">❌</span>
        <p>${message}</p>
      </div>
    `;
    
    this.form.parentNode.insertBefore(errorMessage, this.form);
    
    // Supprimer le message après 5 secondes
    setTimeout(() => {
      errorMessage.remove();
    }, 5000);
  }
}

// ===== ANIMATIONS AU SCROLL =====
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        this.observerOptions
      );
      
      // Observer les éléments à animer
      const animatedElements = $$('.feature-card, .value-card, .team-member, .service-card, .project-card, .article-card');
      animatedElements.forEach(el => this.observer.observe(el));
    }
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        this.observer.unobserve(entry.target);
      }
    });
  }
}

// ===== COMPTEUR ANIMÉ =====
class AnimatedCounter {
  constructor() {
    this.counters = $$('.stat-number[data-target]');
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window && this.counters.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      });
      
      this.counters.forEach(counter => observer.observe(counter));
    }
  }
  
  animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000; // 2 secondes
    const step = target / (duration / 16); // 60 FPS
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  }
}

// ===== FILTRAGE PORTFOLIO =====
class PortfolioFilter {
  constructor() {
    this.filterButtons = $$('.filter-btn');
    this.projectCards = $$('.project-card');
    
    this.init();
  }
  
  init() {
    if (this.filterButtons.length > 0) {
      this.filterButtons.forEach(btn => {
        btn.addEventListener('click', () => this.handleFilter(btn));
      });
    }
  }
  
  handleFilter(activeBtn) {
    const filter = activeBtn.dataset.filter;
    
    // Mettre à jour les boutons actifs
    this.filterButtons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
    
    // Filtrer les projets
    this.projectCards.forEach(card => {
      const category = card.dataset.category;
      const shouldShow = filter === 'all' || category === filter;
      
      if (shouldShow) {
        card.style.display = 'block';
        card.style.animation = 'fadeInUp 0.5s ease-out';
      } else {
        card.style.display = 'none';
      }
    });
  }
}

// ===== OPTIMISATION DES PERFORMANCES =====
class PerformanceOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    // Lazy loading pour les images
    this.setupLazyLoading();
    
    // Préchargement des pages importantes
    this.preloadCriticalPages();
    
    // Optimisation du scroll
    this.optimizeScrollEvents();
  }
  
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      });
      
      // Observer les images avec data-src
      $$('img[data-src]').forEach(img => imageObserver.observe(img));
    }
  }
  
  preloadCriticalPages() {
    // Précharger les pages importantes au survol des liens
    $$('a[href$=".html"]').forEach(link => {
      link.addEventListener('mouseenter', () => {
        const href = link.getAttribute('href');
        if (href && !link.dataset.preloaded) {
          const linkElement = document.createElement('link');
          linkElement.rel = 'prefetch';
          linkElement.href = href;
          document.head.appendChild(linkElement);
          link.dataset.preloaded = 'true';
        }
      }, { once: true });
    });
  }
  
  optimizeScrollEvents() {
    // Throttle scroll events pour améliorer les performances
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
  
  updateScrollPosition() {
    const scrolled = window.pageYOffset;
    const header = $('.header');
    
    if (header) {
      if (scrolled > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }
}

// ===== ACCESSIBILITÉ =====
class AccessibilityEnhancer {
  constructor() {
    this.init();
  }
  
  init() {
    // Améliorer la navigation au clavier
    this.enhanceKeyboardNavigation();
    
    // Gérer les annonces pour les lecteurs d'écran
    this.setupScreenReaderAnnouncements();
    
    // Améliorer le contraste au focus
    this.enhanceFocusVisibility();
  }
  
  enhanceKeyboardNavigation() {
    // Navigation au clavier dans les menus
    const navLinks = $$('.nav-link');
    navLinks.forEach((link, index) => {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (index + 1) % navLinks.length;
          navLinks[nextIndex].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (index - 1 + navLinks.length) % navLinks.length;
          navLinks[prevIndex].focus();
        }
      });
    });
  }
  
  setupScreenReaderAnnouncements() {
    // Créer une zone d'annonces pour les lecteurs d'écran
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.id = 'announcer';
    document.body.appendChild(announcer);
  }
  
  announce(message) {
    const announcer = $('#announcer');
    if (announcer) {
      announcer.textContent = message;
    }
  }
  
  enhanceFocusVisibility() {
    // Améliorer la visibilité du focus pour l'accessibilité
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }
}

// ===== GESTION DES ERREURS =====
class ErrorHandler {
  constructor() {
    this.init();
  }
  
  init() {
    // Gérer les erreurs JavaScript globales
    window.addEventListener('error', (e) => {
      console.error('Erreur JavaScript:', e.error);
      this.logError('JavaScript Error', e.error.message, e.filename, e.lineno);
    });
    
    // Gérer les erreurs de ressources (images, scripts, etc.)
    window.addEventListener('error', (e) => {
      if (e.target !== window) {
        console.warn('Erreur de ressource:', e.target.src || e.target.href);
        this.handleResourceError(e.target);
      }
    }, true);
  }
  
  logError(type, message, file, line) {
    // En production, vous pourriez envoyer ces erreurs à un service de monitoring
    console.group(`🚨 ${type}`);
    console.error('Message:', message);
    console.error('Fichier:', file);
    console.error('Ligne:', line);
    console.groupEnd();
  }
  
  handleResourceError(element) {
    if (element.tagName === 'IMG') {
      // Image de fallback pour les images cassées
      element.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE3MCAyMDBIMjMwTDIwMCAxNTBaIiBmaWxsPSIjOUNBM0FGIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNDAiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
      element.alt = 'Image non disponible';
    }
  }
}

// ===== PERFORMANCE MONITORING =====
class PerformanceMonitor {
  constructor() {
    this.init();
  }
  
  init() {
    // Mesurer les Core Web Vitals
    this.measureWebVitals();
    
    // Surveiller les ressources lentes
    this.monitorSlowResources();
  }
  
  measureWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime);
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
      console.log('CLS:', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }
  
  monitorSlowResources() {
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource');
      resources.forEach(resource => {
        if (resource.duration > 1000) { // Plus de 1 seconde
          console.warn('Ressource lente détectée:', resource.name, `${resource.duration}ms`);
        }
      });
    });
  }
}

// ===== SMOOTH SCROLL POUR LES ANCRES =====
class SmoothScroll {
  constructor() {
    this.init();
  }
  
  init() {
    // Gérer les liens d'ancrage
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        
        const target = $(href);
        if (target) {
          e.preventDefault();
          this.scrollToElement(target);
        }
      });
    });
  }
  
  scrollToElement(element) {
    const headerHeight = $('.header')?.offsetHeight || 0;
    const targetPosition = element.offsetTop - headerHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialiser tous les modules
  new MobileNavigation();
  new ContactForm();
  new ScrollAnimations();
  new AnimatedCounter();
  new PortfolioFilter();
  new PerformanceOptimizer();
  new AccessibilityEnhancer();
  new ErrorHandler();
  new SmoothScroll();
  
  // Marquer la page comme chargée
  document.body.classList.add('loaded');
  
  console.log('🚀 Site web initialisé avec succès');
});

// ===== GESTION DU THÈME (OPTIONNEL) =====
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }
  
  init() {
    // Appliquer le thème sauvegardé
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    
    // Écouter les changements de préférence système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
  
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
  
  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}

// ===== UTILITAIRES POUR LE DÉVELOPPEMENT =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  // Mode développement - ajouter des outils de debug
  console.log('🔧 Mode développement activé');
  
  // Afficher les informations de performance
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`⚡ Page chargée en ${loadTime}ms`);
    }, 100);
  });
}