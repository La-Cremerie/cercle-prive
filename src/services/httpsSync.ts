// Service de synchronisation HTTPS sécurisé
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import toast from 'react-hot-toast';

export interface HTTPSSyncConfig {
  enforceHTTPS: boolean;
  validateSSL: boolean;
  secureWebSocket: boolean;
  corsEnabled: boolean;
  cacheStrategy: 'aggressive' | 'moderate' | 'minimal';
}

export class HTTPSSyncService {
  private static config: HTTPSSyncConfig = {
    enforceHTTPS: true,
    validateSSL: true,
    secureWebSocket: true,
    corsEnabled: true,
    cacheStrategy: 'moderate'
  };

  // 1. VÉRIFICATION HTTPS COMPLÈTE
  static async verifyHTTPSSetup(): Promise<{
    isHTTPS: boolean;
    hasValidSSL: boolean;
    mixedContentIssues: string[];
    securityHeaders: { [key: string]: string | null };
  }> {
    const results = {
      isHTTPS: location.protocol === 'https:',
      hasValidSSL: false,
      mixedContentIssues: [] as string[],
      securityHeaders: {} as { [key: string]: string | null }
    };

    try {
      // Test certificat SSL
      const response = await fetch(location.origin, { method: 'HEAD' });
      results.hasValidSSL = response.ok;

      // Vérifier headers de sécurité
      const securityHeaders = [
        'strict-transport-security',
        'content-security-policy',
        'x-frame-options',
        'x-content-type-options',
        'referrer-policy'
      ];

      securityHeaders.forEach(header => {
        results.securityHeaders[header] = response.headers.get(header);
      });

      // Détecter contenu mixte
      results.mixedContentIssues = this.detectMixedContent();

    } catch (error) {
      console.error('Erreur vérification HTTPS:', error);
    }

    return results;
  }

  // 2. DÉTECTION CONTENU MIXTE
  private static detectMixedContent(): string[] {
    const issues: string[] = [];

    // Vérifier images
    document.querySelectorAll('img').forEach(img => {
      if (img.src && img.src.startsWith('http://')) {
        issues.push(`Image HTTP: ${img.src}`);
      }
    });

    // Vérifier scripts
    document.querySelectorAll('script[src]').forEach(script => {
      if (script.src && script.src.startsWith('http://')) {
        issues.push(`Script HTTP: ${script.src}`);
      }
    });

    // Vérifier CSS
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      if (link.href && link.href.startsWith('http://')) {
        issues.push(`CSS HTTP: ${link.href}`);
      }
    });

    // Vérifier localStorage
    Object.keys(localStorage).forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value && value.includes('http://')) {
          issues.push(`LocalStorage ${key}: Contient des URLs HTTP`);
        }
      } catch (error) {
        // Ignorer les erreurs de parsing
      }
    });

    return issues;
  }

  // 3. CORRECTION AUTOMATIQUE CONTENU MIXTE
  static async fixMixedContent(): Promise<string[]> {
    const fixes: string[] = [];

    try {
      // Corriger images
      document.querySelectorAll('img[src^="http://"]').forEach(img => {
        const httpsUrl = img.src.replace('http://', 'https://');
        img.src = httpsUrl;
        fixes.push(`Image corrigée: ${httpsUrl}`);
      });

      // Corriger liens
      document.querySelectorAll('a[href^="http://"]').forEach(link => {
        const httpsUrl = link.href.replace('http://', 'https://');
        link.href = httpsUrl;
        fixes.push(`Lien corrigé: ${httpsUrl}`);
      });

      // Corriger localStorage
      const storageKeys = ['siteContent', 'properties', 'presentationImages', 'conceptImages'];
      
      for (const key of storageKeys) {
        try {
          const data = localStorage.getItem(key);
          if (data && data.includes('http://')) {
            const httpsData = data.replace(/http:\/\//g, 'https://');
            localStorage.setItem(key, httpsData);
            fixes.push(`LocalStorage ${key} converti en HTTPS`);
          }
        } catch (error) {
          console.warn(`Erreur correction ${key}:`, error);
        }
      }

      // Déclencher mise à jour des composants
      window.dispatchEvent(new CustomEvent('httpsFixed', { detail: { fixes } }));

    } catch (error) {
      console.error('Erreur correction contenu mixte:', error);
    }

    return fixes;
  }

  // 4. CONFIGURATION CANAL TEMPS RÉEL SÉCURISÉ
  static async setupSecureRealtimeChannel(): Promise<boolean> {
    if (!isSupabaseConfigured) {
      console.warn('Supabase non configuré - canal temps réel indisponible');
      return false;
    }

    try {
      // Vérifier que Supabase utilise HTTPS
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl.startsWith('https://')) {
        throw new Error('URL Supabase doit être en HTTPS');
      }

      // Test de connexion sécurisée
      const { data, error } = await supabase
        .from('user_registrations')
        .select('count')
        .limit(1);

      if (error) {
        throw new Error(`Erreur connexion Supabase: ${error.message}`);
      }

      console.log('✅ Canal temps réel sécurisé configuré');
      return true;

    } catch (error) {
      console.error('❌ Erreur configuration canal sécurisé:', error);
      return false;
    }
  }

  // 5. SYNCHRONISATION FORCÉE HTTPS
  static async forceSyncAllContent(): Promise<void> {
    try {
      console.log('🔄 Synchronisation forcée HTTPS en cours...');
      
      // 1. Corriger le contenu mixte
      const fixes = await this.fixMixedContent();
      console.log(`✅ ${fixes.length} correction(s) contenu mixte`);

      // 2. Synchroniser depuis Supabase si configuré
      if (isSupabaseConfigured) {
        const { ContentVersioningService } = await import('./contentVersioningService');
        await ContentVersioningService.syncFromSupabaseToLocal();
        console.log('✅ Synchronisation Supabase terminée');
      }

      // 3. Forcer mise à jour de tous les composants
      const events = ['contentUpdated', 'storage', 'presentationImageChanged', 'designSettingsChanged'];
      events.forEach(eventName => {
        window.dispatchEvent(new CustomEvent(eventName, { 
          detail: { source: 'https-sync', timestamp: Date.now() } 
        }));
      });

      // 4. Notification de succès
      toast.success('🔒 Synchronisation HTTPS terminée avec succès !', {
        duration: 5000,
        icon: '🔄'
      });

    } catch (error) {
      console.error('❌ Erreur synchronisation forcée:', error);
      toast.error('❌ Erreur lors de la synchronisation HTTPS');
      throw error;
    }
  }

  // 6. VALIDATION CONTINUE HTTPS
  static startHTTPSValidation(): void {
    // Vérifier périodiquement les problèmes HTTPS
    setInterval(async () => {
      try {
        const verification = await this.verifyHTTPSSetup();
        
        if (!verification.isHTTPS) {
          console.warn('⚠️ Site non HTTPS détecté');
          this.forceHTTPSRedirect();
        }

        if (verification.mixedContentIssues.length > 0) {
          console.warn('⚠️ Contenu mixte détecté:', verification.mixedContentIssues);
          await this.fixMixedContent();
        }

      } catch (error) {
        console.error('Erreur validation HTTPS:', error);
      }
    }, 30000); // Vérification toutes les 30 secondes
  }

  // 7. REDIRECTION HTTPS FORCÉE
  private static forceHTTPSRedirect(): void {
    if (location.protocol === 'http:') {
      console.log('🔄 Redirection HTTPS forcée');
      location.href = location.href.replace('http://', 'https://');
    }
  }

  // 8. CONFIGURATION HEADERS SÉCURITÉ
  static getSecurityHeaders(): { [key: string]: string } {
    return {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Content-Security-Policy': 'upgrade-insecure-requests; default-src \'self\' https: data: blob:; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https:; style-src \'self\' \'unsafe-inline\' https:; img-src \'self\' data: https: blob:; connect-src \'self\' https: wss:;',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
  }

  // 9. TEST DE PERFORMANCE HTTPS
  static async measureHTTPSPerformance(): Promise<{
    sslHandshakeTime: number;
    firstByteTime: number;
    totalLoadTime: number;
    certificateValid: boolean;
  }> {
    const startTime = performance.now();
    
    try {
      const response = await fetch(location.origin + '/manifest.json', {
        cache: 'no-cache'
      });
      
      const endTime = performance.now();
      
      return {
        sslHandshakeTime: Math.round((endTime - startTime) * 0.3), // Estimation
        firstByteTime: Math.round(endTime - startTime),
        totalLoadTime: Math.round(endTime - startTime),
        certificateValid: response.ok
      };
    } catch (error) {
      return {
        sslHandshakeTime: -1,
        firstByteTime: -1,
        totalLoadTime: -1,
        certificateValid: false
      };
    }
  }

  // 10. DIAGNOSTIC COMPLET
  static async runCompleteDiagnostic(): Promise<any> {
    console.log('🔍 Diagnostic HTTPS complet en cours...');
    
    const diagnostic = {
      timestamp: new Date().toISOString(),
      https: await this.verifyHTTPSSetup(),
      performance: await this.measureHTTPSPerformance(),
      supabase: isSupabaseConfigured,
      recommendations: [] as string[]
    };

    // Générer des recommandations
    if (!diagnostic.https.isHTTPS) {
      diagnostic.recommendations.push('Forcer la redirection HTTPS');
    }

    if (!diagnostic.https.hasValidSSL) {
      diagnostic.recommendations.push('Vérifier le certificat SSL');
    }

    if (diagnostic.https.mixedContentIssues.length > 0) {
      diagnostic.recommendations.push('Corriger le contenu mixte');
    }

    if (!diagnostic.supabase) {
      diagnostic.recommendations.push('Configurer Supabase pour la synchronisation');
    }

    if (!diagnostic.https.securityHeaders['strict-transport-security']) {
      diagnostic.recommendations.push('Ajouter les headers de sécurité HTTPS');
    }

    return diagnostic;
  }
}

// Initialisation automatique
if (typeof window !== 'undefined') {
  // Démarrer la validation HTTPS
  HTTPSSyncService.startHTTPSValidation();
  
  // Écouter les événements de correction HTTPS
  window.addEventListener('httpsFixed', (event: CustomEvent) => {
    console.log('🔒 Corrections HTTPS appliquées:', event.detail.fixes);
  });
}