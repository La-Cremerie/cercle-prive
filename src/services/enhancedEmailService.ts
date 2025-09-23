// Enhanced Email Service with comprehensive error handling and retry logic
import { EmailService } from './emailService';

export class EnhancedEmailService extends EmailService {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAYS = [1000, 3000, 5000]; // Progressive delays
  private static emailMetrics = {
    totalSent: 0,
    totalFailed: 0,
    averageResponseTime: 0,
    lastSuccessfulSend: null as string | null
  };

  // Enhanced email sending with retry logic and comprehensive error handling
  static async sendEmailWithRetry(
    emailType: 'connection' | 'search' | 'sale' | 'contact' | 'appointment',
    userData: any,
    additionalData?: any
  ): Promise<boolean> {
    const startTime = performance.now();
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      try {
        console.log(`📧 Tentative d'envoi ${attempt + 1}/${this.MAX_RETRIES} pour ${emailType}`);
        
        let result = false;
        
        switch (emailType) {
          case 'connection':
            result = await this.sendConnectionNotification(userData);
            break;
          case 'search':
            result = await this.sendSearchNotification(userData);
            break;
          case 'sale':
            result = await this.sendSaleNotification(userData);
            break;
          case 'contact':
            result = await this.sendContactNotification(userData);
            break;
          case 'appointment':
            result = await this.sendAppointmentNotification({
              ...userData,
              ...additionalData
            });
            break;
        }

        if (result) {
          const responseTime = performance.now() - startTime;
          this.updateMetrics(true, responseTime);
          console.log(`✅ Email ${emailType} envoyé avec succès (tentative ${attempt + 1})`);
          return true;
        } else {
          throw new Error(`Email ${emailType} failed - service returned false`);
        }

      } catch (error) {
        lastError = error as Error;
        console.warn(`⚠️ Tentative ${attempt + 1} échouée:`, error.message);
        
        // Wait before retry (except on last attempt)
        if (attempt < this.MAX_RETRIES - 1) {
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAYS[attempt]));
        }
      }
    }

    // All retries failed
    this.updateMetrics(false, performance.now() - startTime);
    this.logFailedEmail(emailType, userData, lastError);
    
    console.error(`❌ Email ${emailType} échoué après ${this.MAX_RETRIES} tentatives`);
    return false;
  }

  // Update email metrics
  private static updateMetrics(success: boolean, responseTime: number): void {
    if (success) {
      this.emailMetrics.totalSent++;
      this.emailMetrics.lastSuccessfulSend = new Date().toISOString();
      
      // Update average response time
      const currentAvg = this.emailMetrics.averageResponseTime;
      const totalEmails = this.emailMetrics.totalSent;
      this.emailMetrics.averageResponseTime = 
        (currentAvg * (totalEmails - 1) + responseTime) / totalEmails;
    } else {
      this.emailMetrics.totalFailed++;
    }

    // Store metrics
    localStorage.setItem('emailMetrics', JSON.stringify(this.emailMetrics));
  }

  // Log failed email for manual review
  private static logFailedEmail(emailType: string, userData: any, error: Error | null): void {
    try {
      const failedEmail = {
        id: Date.now().toString(),
        type: emailType,
        userData: {
          nom: userData.nom,
          prenom: userData.prenom,
          email: userData.email,
          telephone: userData.telephone
        },
        error: error?.message || 'Unknown error',
        timestamp: new Date().toISOString(),
        retryCount: this.MAX_RETRIES,
        status: 'failed_permanently'
      };

      const failedEmails = JSON.parse(localStorage.getItem('failedEmails') || '[]');
      failedEmails.push(failedEmail);
      
      // Keep only last 50 failed emails
      if (failedEmails.length > 50) {
        failedEmails.splice(0, failedEmails.length - 50);
      }
      
      localStorage.setItem('failedEmails', JSON.stringify(failedEmails));
      
      console.error('📝 Email échec permanent enregistré:', failedEmail.id);
    } catch (logError) {
      console.error('Erreur logging email échoué:', logError);
    }
  }

  // Get email system health status
  static getSystemHealth(): any {
    try {
      const metrics = JSON.parse(localStorage.getItem('emailMetrics') || '{}');
      const queue = JSON.parse(localStorage.getItem('emailQueue') || '[]');
      const failedEmails = JSON.parse(localStorage.getItem('failedEmails') || '[]');
      
      const totalEmails = metrics.totalSent + metrics.totalFailed;
      const successRate = totalEmails > 0 ? (metrics.totalSent / totalEmails) * 100 : 0;
      
      return {
        successRate: Math.round(successRate),
        totalSent: metrics.totalSent || 0,
        totalFailed: metrics.totalFailed || 0,
        averageResponseTime: Math.round(metrics.averageResponseTime || 0),
        queueLength: queue.length,
        permanentFailures: failedEmails.length,
        lastSuccessfulSend: metrics.lastSuccessfulSend,
        status: successRate >= 90 ? 'excellent' : 
                successRate >= 70 ? 'good' : 
                successRate >= 50 ? 'warning' : 'critical'
      };
    } catch {
      return {
        successRate: 0,
        totalSent: 0,
        totalFailed: 0,
        averageResponseTime: 0,
        queueLength: 0,
        permanentFailures: 0,
        lastSuccessfulSend: null,
        status: 'unknown'
      };
    }
  }

  // Test email configuration with comprehensive checks
  static async testEmailConfigurationComprehensive(): Promise<any> {
    const test = {
      configurationValid: false,
      serviceReachable: false,
      authenticationWorking: false,
      templateValid: false,
      ipDetectionWorking: false,
      overallStatus: 'unknown',
      details: {}
    };

    try {
      // Test 1: Configuration validity
      test.configurationValid = this.EMAILJS_CONFIG.USER_ID !== 'YOUR_EMAILJS_USER_ID';
      
      // Test 2: Service reachability
      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'OPTIONS'
        });
        test.serviceReachable = response.ok || response.status === 405;
      } catch {
        test.serviceReachable = false;
      }

      // Test 3: Authentication (if configured)
      if (test.configurationValid) {
        try {
          const testResult = await this.testEmailConfiguration();
          test.authenticationWorking = testResult;
        } catch {
          test.authenticationWorking = false;
        }
      }

      // Test 4: Template validity
      test.templateValid = this.EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_EMAILJS_TEMPLATE_ID';

      // Test 5: IP detection
      try {
        const ip = await (this as any).getRealUserIP();
        test.ipDetectionWorking = ip && ip !== 'IP non disponible';
      } catch {
        test.ipDetectionWorking = false;
      }

      // Overall status
      const passedTests = [
        test.configurationValid,
        test.serviceReachable,
        test.authenticationWorking,
        test.templateValid,
        test.ipDetectionWorking
      ].filter(Boolean).length;

      test.overallStatus = passedTests >= 4 ? 'excellent' :
                         passedTests >= 3 ? 'good' :
                         passedTests >= 2 ? 'warning' : 'critical';

      test.details = {
        passedTests,
        totalTests: 5,
        configurationNeeded: !test.configurationValid,
        networkIssues: !test.serviceReachable,
        authenticationIssues: test.configurationValid && !test.authenticationWorking
      };

    } catch (error) {
      test.overallStatus = 'error';
      test.details = { error: error.message };
    }

    return test;
  }

  // Comprehensive email system reset
  static resetEmailSystem(): void {
    try {
      // Clear all email-related data
      const emailKeys = [
        'emailQueue',
        'emailHistory', 
        'emailErrorLog',
        'emailMetrics',
        'failedEmails',
        'emailSuccessLog',
        'knownIPs',
        'emailOperationLogs'
      ];

      emailKeys.forEach(key => localStorage.removeItem(key));
      
      // Reset metrics
      this.emailMetrics = {
        totalSent: 0,
        totalFailed: 0,
        averageResponseTime: 0,
        lastSuccessfulSend: null
      };

      console.log('🔄 Système email réinitialisé complètement');
    } catch (error) {
      console.error('Erreur reset système email:', error);
    }
  }

  // Get comprehensive email statistics
  static getEmailStatistics(): any {
    try {
      const metrics = JSON.parse(localStorage.getItem('emailMetrics') || '{}');
      const history = JSON.parse(localStorage.getItem('emailHistory') || '[]');
      const queue = JSON.parse(localStorage.getItem('emailQueue') || '[]');
      const failed = JSON.parse(localStorage.getItem('failedEmails') || '[]');
      const knownIPs = JSON.parse(localStorage.getItem('knownIPs') || '[]');

      // Calculate statistics
      const last24h = history.filter((email: any) => {
        const emailTime = new Date(email.timestamp);
        const now = new Date();
        return (now.getTime() - emailTime.getTime()) < 24 * 60 * 60 * 1000;
      });

      const emailsByType = history.reduce((acc: any, email: any) => {
        acc[email.type] = (acc[email.type] || 0) + 1;
        return acc;
      }, {});

      return {
        totalEmails: history.length,
        emailsLast24h: last24h.length,
        pendingInQueue: queue.length,
        permanentFailures: failed.length,
        knownIPsCount: knownIPs.length,
        emailsByType,
        successRate: metrics.totalSent && metrics.totalFailed ? 
          Math.round((metrics.totalSent / (metrics.totalSent + metrics.totalFailed)) * 100) : 0,
        averageResponseTime: Math.round(metrics.averageResponseTime || 0),
        lastSuccessfulSend: metrics.lastSuccessfulSend
      };
    } catch {
      return {
        totalEmails: 0,
        emailsLast24h: 0,
        pendingInQueue: 0,
        permanentFailures: 0,
        knownIPsCount: 0,
        emailsByType: {},
        successRate: 0,
        averageResponseTime: 0,
        lastSuccessfulSend: null
      };
    }
  }
}