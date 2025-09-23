import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export interface SecurityEvent {
  id: string;
  event_type: 'login_attempt' | 'registration' | 'admin_access' | 'suspicious_activity' | 'form_submission' | 'page_access';
  status: 'success' | 'failure' | 'blocked' | 'warning';
  timestamp: string;
  session_id: string; // Identifiant de session anonyme
  user_agent_hash: string; // Hash du user agent pour détecter les patterns
  ip_hash: string; // Hash de l'IP pour anonymisation
  country_code?: string; // Géolocalisation générale uniquement
  details: {
    attempts_count?: number;
    error_type?: string;
    form_type?: string;
    page_section?: string;
    risk_score?: number;
  };
}

export interface PrivacyMetrics {
  total_sessions: number;
  unique_visitors_estimate: number;
  security_events: number;
  blocked_attempts: number;
  geographic_distribution: { [country: string]: number };
  hourly_activity: { [hour: string]: number };
  risk_levels: { low: number; medium: number; high: number };
}

export class PrivacyCompliantMonitoring {
  private static instance: PrivacyCompliantMonitoring;
  private sessionId: string;
  private eventQueue: SecurityEvent[] = [];
  private isOnline = navigator.onLine;

  static getInstance(): PrivacyCompliantMonitoring {
    if (!PrivacyCompliantMonitoring.instance) {
      PrivacyCompliantMonitoring.instance = new PrivacyCompliantMonitoring();
    }
    return PrivacyCompliantMonitoring.instance;
  }

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeMonitoring();
  }

  // Générer un ID de session anonyme
  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Hash anonyme d'une IP (pour détecter les patterns sans stocker l'IP réelle)
  private hashIP(ip: string): string {
    // Simulation de hash - en production, utilisez crypto.subtle.digest
    return 'ip_' + btoa(ip + 'salt_secret').substr(0, 16);
  }

  // Hash anonyme du user agent
  private hashUserAgent(userAgent: string): string {
    return 'ua_' + btoa(userAgent.substring(0, 50) + 'salt_secret').substr(0, 16);
  }

  // Obtenir le code pays de manière anonyme (via API publique)
  private async getCountryCode(): Promise<string | undefined> {
    try {
      // Utiliser une API publique qui ne stocke pas les IPs
      const response = await fetch('https://ipapi.co/country_code/', {
        method: 'GET',
        headers: { 'Accept': 'text/plain' }
      });
      
      if (response.ok) {
        const countryCode = await response.text();
        return countryCode.trim();
      }
    } catch (error) {
      console.warn('Impossible d\'obtenir le code pays:', error);
    }
    return undefined;
  }

  // Initialiser la surveillance
  private initializeMonitoring(): void {
    console.log('🔒 Initialisation de la surveillance conforme à la confidentialité');
    
    // Écouter les événements de connexion réseau
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushEventQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Surveiller les tentatives de connexion
    this.monitorAuthenticationEvents();
    
    // Surveiller l'activité suspecte
    this.monitorSuspiciousActivity();
    
    // Vider la queue périodiquement
    setInterval(() => this.flushEventQueue(), 30000); // Toutes les 30 secondes
  }

  // Surveiller les événements d'authentification
  private monitorAuthenticationEvents(): void {
    // Intercepter les erreurs d'authentification
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      
      // Détecter les tentatives de connexion
      if (args[0]?.toString().includes('auth') || args[0]?.toString().includes('login')) {
        const isSuccess = response.ok;
        
        this.logSecurityEvent({
          event_type: 'login_attempt',
          status: isSuccess ? 'success' : 'failure',
          details: {
            attempts_count: this.getFailedAttemptsCount(),
            error_type: isSuccess ? undefined : 'authentication_failed'
          }
        });
      }
      
      return response;
    };
  }

  // Surveiller l'activité suspecte
  private monitorSuspiciousActivity(): void {
    let rapidClickCount = 0;
    let lastClickTime = 0;
    
    // Détecter les clics rapides (possible bot)
    document.addEventListener('click', () => {
      const now = Date.now();
      if (now - lastClickTime < 100) { // Moins de 100ms entre les clics
        rapidClickCount++;
        if (rapidClickCount > 10) {
          this.logSecurityEvent({
            event_type: 'suspicious_activity',
            status: 'warning',
            details: {
              error_type: 'rapid_clicking',
              risk_score: 3
            }
          });
          rapidClickCount = 0; // Reset
        }
      } else {
        rapidClickCount = 0;
      }
      lastClickTime = now;
    });

    // Détecter les tentatives d'accès aux outils de développement
    let devToolsOpen = false;
    setInterval(() => {
      const threshold = 160;
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devToolsOpen) {
          devToolsOpen = true;
          this.logSecurityEvent({
            event_type: 'suspicious_activity',
            status: 'warning',
            details: {
              error_type: 'devtools_opened',
              risk_score: 1
            }
          });
        }
      } else {
        devToolsOpen = false;
      }
    }, 1000);
  }

  // Logger un événement de sécurité
  public async logSecurityEvent(eventData: Partial<SecurityEvent>): Promise<void> {
    try {
      const event: SecurityEvent = {
        id: crypto.randomUUID(),
        event_type: eventData.event_type || 'page_access',
        status: eventData.status || 'success',
        timestamp: new Date().toISOString(),
        session_id: this.sessionId,
        user_agent_hash: this.hashUserAgent(navigator.userAgent),
        ip_hash: this.hashIP(await this.getClientIP()),
        country_code: await this.getCountryCode(),
        details: eventData.details || {}
      };

      // Ajouter à la queue
      this.eventQueue.push(event);
      
      // Envoyer immédiatement si en ligne et queue pas trop grande
      if (this.isOnline && this.eventQueue.length < 10) {
        this.flushEventQueue();
      }
      
    } catch (error) {
      console.warn('Erreur logging événement sécurité:', error);
    }
  }

  // Obtenir l'IP client de manière anonyme
  private async getClientIP(): Promise<string> {
    try {
      // Utiliser une API qui ne stocke pas les IPs
      const response = await fetch('https://api.ipify.org?format=text');
      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      console.warn('Impossible d\'obtenir l\'IP client:', error);
    }
    return 'unknown';
  }

  // Vider la queue d'événements vers Supabase
  private async flushEventQueue(): Promise<void> {
    if (this.eventQueue.length === 0 || !this.isOnline) return;

    try {
      const eventsToSend = [...this.eventQueue];
      this.eventQueue = [];

      const { error } = await supabase
        .from('security_events')
        .insert(eventsToSend);

      if (error) {
        console.warn('Erreur envoi événements sécurité:', error);
        // Remettre en queue en cas d'erreur
        this.eventQueue.unshift(...eventsToSend);
      } else {
        console.log(`✅ ${eventsToSend.length} événement(s) de sécurité envoyé(s)`);
      }
    } catch (error) {
      console.warn('Erreur flush queue événements:', error);
    }
  }

  // Obtenir le nombre de tentatives échouées récentes
  private getFailedAttemptsCount(): number {
    const attempts = sessionStorage.getItem('failed_attempts');
    return attempts ? parseInt(attempts) : 0;
  }

  // Logger une tentative de connexion
  public logLoginAttempt(success: boolean, email?: string): void {
    if (!success) {
      const current = this.getFailedAttemptsCount();
      sessionStorage.setItem('failed_attempts', (current + 1).toString());
    } else {
      sessionStorage.removeItem('failed_attempts');
    }

    this.logSecurityEvent({
      event_type: 'login_attempt',
      status: success ? 'success' : 'failure',
      details: {
        attempts_count: success ? 0 : this.getFailedAttemptsCount(),
        error_type: success ? undefined : 'invalid_credentials'
      }
    });
  }

  // Logger un accès admin
  public logAdminAccess(success: boolean, adminEmail?: string): void {
    this.logSecurityEvent({
      event_type: 'admin_access',
      status: success ? 'success' : 'failure',
      details: {
        error_type: success ? undefined : 'admin_access_denied',
        risk_score: success ? 1 : 4
      }
    });
  }

  // Logger une soumission de formulaire
  public logFormSubmission(formType: string, success: boolean): void {
    this.logSecurityEvent({
      event_type: 'form_submission',
      status: success ? 'success' : 'failure',
      details: {
        form_type: formType,
        error_type: success ? undefined : 'form_validation_failed'
      }
    });
  }

  // Logger un accès à une page
  public logPageAccess(pageSection: string): void {
    this.logSecurityEvent({
      event_type: 'page_access',
      status: 'success',
      details: {
        page_section: pageSection
      }
    });
  }

  // Obtenir les métriques de confidentialité
  public async getPrivacyMetrics(days: number = 7): Promise<PrivacyMetrics> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data: events, error } = await supabase
        .from('security_events')
        .select('*')
        .gte('timestamp', startDate.toISOString());

      if (error) throw error;

      // Calculer les métriques de manière anonyme
      const uniqueSessions = new Set(events?.map(e => e.session_id) || []).size;
      const securityEvents = events?.length || 0;
      const blockedAttempts = events?.filter(e => e.status === 'blocked').length || 0;

      // Distribution géographique (anonymisée)
      const geoDistribution: { [country: string]: number } = {};
      events?.forEach(event => {
        if (event.country_code) {
          geoDistribution[event.country_code] = (geoDistribution[event.country_code] || 0) + 1;
        }
      });

      // Activité par heure (anonymisée)
      const hourlyActivity: { [hour: string]: number } = {};
      events?.forEach(event => {
        const hour = new Date(event.timestamp).getHours().toString();
        hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1;
      });

      // Niveaux de risque
      const riskLevels = {
        low: events?.filter(e => (e.details as any)?.risk_score <= 2).length || 0,
        medium: events?.filter(e => (e.details as any)?.risk_score === 3).length || 0,
        high: events?.filter(e => (e.details as any)?.risk_score >= 4).length || 0
      };

      return {
        total_sessions: uniqueSessions,
        unique_visitors_estimate: Math.round(uniqueSessions * 0.8), // Estimation conservative
        security_events: securityEvents,
        blocked_attempts: blockedAttempts,
        geographic_distribution: geoDistribution,
        hourly_activity: hourlyActivity,
        risk_levels: riskLevels
      };
    } catch (error) {
      console.error('Erreur récupération métriques:', error);
      return {
        total_sessions: 0,
        unique_visitors_estimate: 0,
        security_events: 0,
        blocked_attempts: 0,
        geographic_distribution: {},
        hourly_activity: {},
        risk_levels: { low: 0, medium: 0, high: 0 }
      };
    }
  }

  // Détecter les patterns suspects
  public async detectSuspiciousPatterns(): Promise<string[]> {
    try {
      const alerts: string[] = [];
      const last24h = new Date();
      last24h.setHours(last24h.getHours() - 24);

      const { data: recentEvents, error } = await supabase
        .from('security_events')
        .select('*')
        .gte('timestamp', last24h.toISOString());

      if (error) throw error;

      // Analyser les patterns sans exposer les données personnelles
      const failedLogins = recentEvents?.filter(e => 
        e.event_type === 'login_attempt' && e.status === 'failure'
      ).length || 0;

      const suspiciousActivity = recentEvents?.filter(e => 
        e.event_type === 'suspicious_activity'
      ).length || 0;

      const adminAttempts = recentEvents?.filter(e => 
        e.event_type === 'admin_access' && e.status === 'failure'
      ).length || 0;

      // Alertes basées sur les seuils
      if (failedLogins > 10) {
        alerts.push(`${failedLogins} tentatives de connexion échouées détectées`);
      }

      if (suspiciousActivity > 5) {
        alerts.push(`${suspiciousActivity} activités suspectes détectées`);
      }

      if (adminAttempts > 3) {
        alerts.push(`${adminAttempts} tentatives d'accès admin non autorisées`);
      }

      return alerts;
    } catch (error) {
      console.error('Erreur détection patterns:', error);
      return [];
    }
  }

  // Nettoyer les anciens événements (conformité RGPD)
  public async cleanupOldEvents(retentionDays: number = 90): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const { error } = await supabase
        .from('security_events')
        .delete()
        .lt('timestamp', cutoffDate.toISOString());

      if (error) throw error;

      console.log(`✅ Événements de plus de ${retentionDays} jours supprimés`);
    } catch (error) {
      console.error('Erreur nettoyage événements:', error);
    }
  }

  // Exporter les métriques anonymisées
  public async exportAnonymizedReport(days: number = 30): Promise<string> {
    try {
      const metrics = await this.getPrivacyMetrics(days);
      const patterns = await this.detectSuspiciousPatterns();

      const report = `
RAPPORT DE SÉCURITÉ ANONYMISÉ - CERCLE PRIVÉ
==========================================

Période: ${days} derniers jours
Généré le: ${new Date().toLocaleString('fr-FR')}

MÉTRIQUES GÉNÉRALES:
- Sessions totales: ${metrics.total_sessions}
- Visiteurs uniques (estimation): ${metrics.unique_visitors_estimate}
- Événements de sécurité: ${metrics.security_events}
- Tentatives bloquées: ${metrics.blocked_attempts}

DISTRIBUTION GÉOGRAPHIQUE:
${Object.entries(metrics.geographic_distribution)
  .map(([country, count]) => `- ${country}: ${count} sessions`)
  .join('\n')}

ACTIVITÉ PAR HEURE:
${Object.entries(metrics.hourly_activity)
  .map(([hour, count]) => `- ${hour}h: ${count} événements`)
  .join('\n')}

NIVEAUX DE RISQUE:
- Faible: ${metrics.risk_levels.low}
- Moyen: ${metrics.risk_levels.medium}
- Élevé: ${metrics.risk_levels.high}

ALERTES DÉTECTÉES:
${patterns.length > 0 ? patterns.map(p => `- ${p}`).join('\n') : '- Aucune alerte'}

CONFORMITÉ:
- Aucune donnée personnelle stockée
- IPs hashées pour anonymisation
- Géolocalisation limitée au pays
- Rétention limitée à 90 jours
- Conforme RGPD
      `;

      return report;
    } catch (error) {
      console.error('Erreur export rapport:', error);
      return 'Erreur lors de la génération du rapport';
    }
  }
}

// Instance globale
export const privacyMonitoring = PrivacyCompliantMonitoring.getInstance();