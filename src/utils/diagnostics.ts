// Comprehensive diagnostic utilities for blank page issues
export class BlankPageDiagnostics {
  private static errorLog: any[] = [];
  private static diagnosticResults: any = {};

  // 1. FRONTEND CODE DIAGNOSTICS
  static async checkFrontendIssues(): Promise<any> {
    const results = {
      jsErrors: [],
      cssIssues: [],
      htmlStructure: true,
      reactMounting: false,
      bundleLoading: true
    };

    try {
      // Check for JavaScript errors
      const errorCount = this.errorLog.length;
      results.jsErrors = this.errorLog.slice(-5); // Last 5 errors

      // Check if React is mounted
      const rootElement = document.getElementById('root');
      results.reactMounting = rootElement && rootElement.children.length > 0;

      // Check CSS loading
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
      results.cssIssues = Array.from(stylesheets).filter(sheet => {
        try {
          return !sheet.sheet || sheet.sheet.cssRules.length === 0;
        } catch {
          return true;
        }
      }).map(sheet => sheet.getAttribute('href'));

      // Check bundle loading
      const scripts = document.querySelectorAll('script[src]');
      results.bundleLoading = scripts.length > 0;

    } catch (error) {
      console.error('Frontend diagnostic error:', error);
    }

    return results;
  }

  // 2. BACKEND/SERVER DIAGNOSTICS
  static async checkBackendConnectivity(): Promise<any> {
    const results = {
      serverResponse: false,
      apiEndpoints: [],
      supabaseConnection: false,
      networkStatus: navigator.onLine
    };

    try {
      // Test main server response
      const response = await fetch(window.location.origin, { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      results.serverResponse = response.ok;

      // Test Supabase connection
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey && 
          supabaseUrl !== 'https://your-project.supabase.co' && 
          supabaseKey !== 'your-anon-key') {
        try {
          const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            }
          });
          results.supabaseConnection = supabaseResponse.ok;
        } catch {
          results.supabaseConnection = false;
        }
      }

    } catch (error) {
      console.error('Backend diagnostic error:', error);
    }

    return results;
  }

  // 3. DATABASE CONNECTIVITY DIAGNOSTICS
  static async checkDatabaseIssues(): Promise<any> {
    const results = {
      localStorageWorking: false,
      supabaseQueries: false,
      dataIntegrity: true,
      migrationStatus: 'unknown'
    };

    try {
      // Test localStorage
      localStorage.setItem('diagnostic-test', 'test');
      results.localStorageWorking = localStorage.getItem('diagnostic-test') === 'test';
      localStorage.removeItem('diagnostic-test');

      // Test Supabase queries (if configured)
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (supabaseUrl && supabaseUrl !== 'https://your-project.supabase.co') {
        try {
          // Import Supabase client dynamically to avoid errors if not configured
          const { supabase } = await import('../lib/supabase');
          const { data, error } = await supabase.from('user_registrations').select('count').limit(1);
          results.supabaseQueries = !error;
        } catch {
          results.supabaseQueries = false;
        }
      }

      // Check data integrity in localStorage
      const criticalKeys = ['userLoggedIn', 'userData', 'siteContent', 'properties'];
      for (const key of criticalKeys) {
        try {
          const value = localStorage.getItem(key);
          if (value && value.startsWith('{')) {
            JSON.parse(value);
          }
        } catch {
          results.dataIntegrity = false;
          break;
        }
      }

    } catch (error) {
      console.error('Database diagnostic error:', error);
    }

    return results;
  }

  // 4. BROWSER COMPATIBILITY DIAGNOSTICS
  static checkBrowserCompatibility(): any {
    const results = {
      browserSupported: true,
      missingFeatures: [],
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    // Check for required features
    const requiredFeatures = [
      { name: 'localStorage', check: () => typeof Storage !== 'undefined' },
      { name: 'fetch', check: () => typeof fetch !== 'undefined' },
      { name: 'Promise', check: () => typeof Promise !== 'undefined' },
      { name: 'IntersectionObserver', check: () => 'IntersectionObserver' in window },
      { name: 'serviceWorker', check: () => 'serviceWorker' in navigator }
    ];

    requiredFeatures.forEach(feature => {
      if (!feature.check()) {
        results.missingFeatures.push(feature.name);
        results.browserSupported = false;
      }
    });

    return results;
  }

  // 5. NETWORK AND LOADING DIAGNOSTICS
  static async checkNetworkAndLoading(): Promise<any> {
    const results = {
      connectionSpeed: 'unknown',
      resourceLoadTimes: [],
      failedResources: [],
      cacheStatus: 'unknown'
    };

    try {
      // Check connection speed (rough estimate)
      const startTime = performance.now();
      await fetch(window.location.origin + '/favicon.ico', { cache: 'no-cache' });
      const loadTime = performance.now() - startTime;
      
      if (loadTime < 100) results.connectionSpeed = 'fast';
      else if (loadTime < 500) results.connectionSpeed = 'medium';
      else results.connectionSpeed = 'slow';

      // Check resource loading
      const resources = performance.getEntriesByType('resource');
      results.resourceLoadTimes = resources.map(resource => ({
        name: resource.name,
        duration: Math.round(resource.duration),
        failed: resource.duration === 0
      }));

      results.failedResources = results.resourceLoadTimes
        .filter(r => r.failed)
        .map(r => r.name);

      // Check cache status
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        results.cacheStatus = `${cacheNames.length} cache(s) active`;
      }

    } catch (error) {
      console.error('Network diagnostic error:', error);
    }

    return results;
  }

  // 6. USER PERMISSIONS AND AUTHENTICATION DIAGNOSTICS
  static checkAuthenticationIssues(): any {
    const results = {
      userLoggedIn: false,
      adminLoggedIn: false,
      userData: null,
      sessionValid: false,
      permissionIssues: []
    };

    try {
      // Check user login status
      results.userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      results.adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';

      // Check user data integrity
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          results.userData = JSON.parse(userData);
          results.sessionValid = true;
        } catch {
          results.permissionIssues.push('Corrupted user data');
        }
      }

      // Check for permission-related issues
      if (!results.userLoggedIn && !results.adminLoggedIn) {
        results.permissionIssues.push('No valid session found');
      }

    } catch (error) {
      console.error('Authentication diagnostic error:', error);
      results.permissionIssues.push('Authentication system error');
    }

    return results;
  }

  // COMPREHENSIVE DIAGNOSTIC RUNNER
  static async runFullDiagnostic(): Promise<any> {
    console.log('🔍 Running comprehensive diagnostic...');
    
    const diagnostic = {
      timestamp: new Date().toISOString(),
      frontend: await this.checkFrontendIssues(),
      backend: await this.checkBackendConnectivity(),
      database: await this.checkDatabaseIssues(),
      browser: this.checkBrowserCompatibility(),
      network: await this.checkNetworkAndLoading(),
      authentication: this.checkAuthenticationIssues()
    };

    this.diagnosticResults = diagnostic;
    return diagnostic;
  }

  // ERROR LOGGING
  static logError(error: any, context: string = 'unknown') {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      context,
      message: error.message || error.toString(),
      stack: error.stack,
      url: window.location.href
    };
    
    this.errorLog.push(errorEntry);
    
    // Keep only last 50 errors
    if (this.errorLog.length > 50) {
      this.errorLog = this.errorLog.slice(-50);
    }
    
    // Store in localStorage for persistence
    try {
      localStorage.setItem('errorLog', JSON.stringify(this.errorLog));
    } catch {
      // Ignore storage errors
    }
  }

  // AUTOMATIC FIXES
  static async runAutomaticFixes(): Promise<string[]> {
    const fixes: string[] = [];

    try {
      // Fix 1: Clear corrupted localStorage data
      const corruptedKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            const value = localStorage.getItem(key);
            if (value && value.startsWith('{')) {
              JSON.parse(value);
            }
          } catch {
            corruptedKeys.push(key);
          }
        }
      }

      if (corruptedKeys.length > 0) {
        corruptedKeys.forEach(key => localStorage.removeItem(key));
        fixes.push(`Removed ${corruptedKeys.length} corrupted localStorage entries`);
      }

      // Fix 2: Clear old caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => !name.includes('v3'));
        
        for (const cacheName of oldCaches) {
          await caches.delete(cacheName);
        }
        
        if (oldCaches.length > 0) {
          fixes.push(`Cleared ${oldCaches.length} outdated caches`);
        }
      }

      // Fix 3: Reset problematic settings
      const problematicKeys = ['temp_', 'cache_', 'debug_'];
      let removedCount = 0;
      
      Object.keys(localStorage).forEach(key => {
        if (problematicKeys.some(prefix => key.startsWith(prefix))) {
          localStorage.removeItem(key);
          removedCount++;
        }
      });

      if (removedCount > 0) {
        fixes.push(`Removed ${removedCount} temporary settings`);
      }

      // Fix 4: Ensure critical data exists
      if (!localStorage.getItem('userLoggedIn')) {
        localStorage.setItem('userLoggedIn', 'false');
        fixes.push('Reset user login status');
      }

    } catch (error) {
      console.error('Auto-fix error:', error);
    }

    return fixes;
  }

  // EMERGENCY RESET
  static emergencyReset(): void {
    try {
      // Keep only essential user data
      const essentialData: { [key: string]: string } = {};
      const essentialKeys = ['userLoggedIn', 'userData'];
      
      essentialKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) essentialData[key] = value;
      });

      // Clear everything
      localStorage.clear();
      sessionStorage.clear();

      // Restore essential data
      Object.entries(essentialData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      // Clear all caches
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }

      console.log('Emergency reset completed');
    } catch (error) {
      console.error('Emergency reset error:', error);
    }
  }

  // GET DIAGNOSTIC REPORT
  static generateReport(): string {
    const report = `
DIAGNOSTIC REPORT - CERCLE PRIVÉ
================================

Timestamp: ${new Date().toLocaleString('fr-FR')}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}

SUMMARY:
- Errors detected: ${this.errorLog.length}
- Last diagnostic: ${this.diagnosticResults.timestamp || 'Not run'}

RECENT ERRORS:
${this.errorLog.slice(-5).map((error, i) => 
  `${i+1}. ${error.message} (${error.context}) - ${error.timestamp}`
).join('\n')}

RECOMMENDATIONS:
${this.errorLog.length === 0 ? 
  '✅ No critical errors detected' : 
  '⚠️ Contact technical support with this report'
}
    `;

    return report;
  }
}

// Initialize error logging
window.addEventListener('error', (event) => {
  BlankPageDiagnostics.logError(event.error || event, 'window.error');
});

window.addEventListener('unhandledrejection', (event) => {
  BlankPageDiagnostics.logError(event.reason, 'unhandled.promise');
});