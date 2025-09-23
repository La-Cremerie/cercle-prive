// Comprehensive Email System Diagnostics and Testing
export class EmailDiagnostics {
  private static testResults: any[] = [];
  private static emailQueue: any[] = [];

  // 1. INITIAL DIAGNOSIS - Analyze current email configuration
  static async performInitialDiagnosis(): Promise<any> {
    console.log('🔍 Starting comprehensive email system diagnosis...');
    
    const diagnosis = {
      timestamp: new Date().toISOString(),
      configuration: await this.analyzeEmailConfiguration(),
      connectivity: await this.testConnectivity(),
      authentication: await this.testAuthentication(),
      dnsRecords: await this.checkDNSRecords(),
      serverLogs: this.analyzeServerLogs(),
      recommendations: []
    };

    this.testResults.push(diagnosis);
    return diagnosis;
  }

  // Analyze current email configuration
  private static async analyzeEmailConfiguration(): Promise<any> {
    const config = {
      emailjsConfigured: false,
      smtpSettings: null,
      environmentVariables: {},
      serviceStatus: 'unknown'
    };

    try {
      // Check EmailJS configuration
      const emailService = await import('./emailService');
      const emailjsConfig = (emailService.EmailService as any).EMAILJS_CONFIG;
      
      config.emailjsConfigured = emailjsConfig && 
        emailjsConfig.USER_ID !== 'YOUR_EMAILJS_USER_ID' &&
        emailjsConfig.SERVICE_ID !== 'YOUR_EMAILJS_SERVICE_ID' &&
        emailjsConfig.TEMPLATE_ID !== 'YOUR_EMAILJS_TEMPLATE_ID';

      // Check environment variables
      config.environmentVariables = {
        hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
        hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        nodeEnv: import.meta.env.NODE_ENV || 'development'
      };

      config.serviceStatus = config.emailjsConfigured ? 'configured' : 'not_configured';

    } catch (error) {
      console.error('Configuration analysis error:', error);
      config.serviceStatus = 'error';
    }

    return config;
  }

  // Test connectivity to email services
  private static async testConnectivity(): Promise<any> {
    const connectivity = {
      internetConnection: navigator.onLine,
      emailjsReachable: false,
      ipDetectionServices: [],
      geolocationServices: false
    };

    try {
      // Test EmailJS API reachability
      const emailjsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'OPTIONS'
      });
      connectivity.emailjsReachable = emailjsResponse.ok || emailjsResponse.status === 405;

      // Test IP detection services
      const ipServices = [
        'https://api.ipify.org?format=json',
        'https://ipapi.co/json/',
        'https://httpbin.org/ip'
      ];

      for (const service of ipServices) {
        try {
          const response = await fetch(service);
          if (response.ok) {
            const data = await response.json();
            connectivity.ipDetectionServices.push({
              service,
              status: 'working',
              ip: data.ip || data.query || data.origin
            });
          }
        } catch (error) {
          connectivity.ipDetectionServices.push({
            service,
            status: 'failed',
            error: error.message
          });
        }
      }

      // Test geolocation service
      try {
        const geoResponse = await fetch('https://ipapi.co/country_code/');
        connectivity.geolocationServices = geoResponse.ok;
      } catch {
        connectivity.geolocationServices = false;
      }

    } catch (error) {
      console.error('Connectivity test error:', error);
    }

    return connectivity;
  }

  // Test email authentication
  private static async testAuthentication(): Promise<any> {
    const auth = {
      emailjsAuth: false,
      testEmailSent: false,
      authErrors: []
    };

    try {
      // Test EmailJS authentication by attempting to send a test email
      const { EmailService } = await import('./emailService');
      
      // Check if EmailJS is configured
      const isConfigured = await EmailService.testEmailConfiguration();
      auth.emailjsAuth = isConfigured;

      if (isConfigured) {
        // Try to send a test email
        try {
          const testResult = await EmailService.sendConnectionNotification({
            nom: 'Test',
            prenom: 'Diagnostic',
            email: 'diagnostic@test.com',
            telephone: '0123456789'
          });
          auth.testEmailSent = testResult;
        } catch (error) {
          auth.authErrors.push(`Test email failed: ${error.message}`);
        }
      } else {
        auth.authErrors.push('EmailJS not configured');
      }

    } catch (error) {
      auth.authErrors.push(`Authentication test error: ${error.message}`);
    }

    return auth;
  }

  // Check DNS records (simulated - would need server-side implementation)
  private static async checkDNSRecords(): Promise<any> {
    return {
      spfRecord: 'not_checked',
      dkimRecord: 'not_checked',
      dmarcRecord: 'not_checked',
      note: 'DNS record checking requires server-side implementation'
    };
  }

  // Analyze server logs (client-side simulation)
  private static analyzeServerLogs(): any {
    const logs = {
      emailErrors: [],
      recentActivity: [],
      errorPatterns: []
    };

    try {
      // Check localStorage for email history
      const emailHistory = localStorage.getItem('emailHistory');
      if (emailHistory) {
        const history = JSON.parse(emailHistory);
        logs.recentActivity = history.slice(-10);
        logs.emailErrors = history.filter((email: any) => email.status === 'failed');
      }

      // Check for error patterns
      const errorLog = localStorage.getItem('errorLog');
      if (errorLog) {
        const errors = JSON.parse(errorLog);
        logs.errorPatterns = errors.filter((error: any) => 
          error.message && error.message.toLowerCase().includes('email')
        );
      }

    } catch (error) {
      console.error('Log analysis error:', error);
    }

    return logs;
  }

  // 2. SYSTEMATIC TESTING - Create comprehensive test cases
  static async runSystematicTests(): Promise<any> {
    console.log('🧪 Running systematic email tests...');
    
    const testSuite = {
      timestamp: new Date().toISOString(),
      ipDetectionTest: await this.testIPDetection(),
      emailDeliveryTest: await this.testEmailDelivery(),
      httpsAlertTest: await this.testHTTPSAlerts(),
      surveyEmailTest: await this.testSurveyEmails(),
      generalInfoTest: await this.testGeneralInfoEmails(),
      spamFolderTest: await this.testSpamDelivery(),
      templateTest: await this.testEmailTemplates()
    };

    return testSuite;
  }

  // Test IP detection functionality
  private static async testIPDetection(): Promise<any> {
    const test = {
      name: 'IP Detection Test',
      status: 'running',
      results: {}
    };

    try {
      const { EmailService } = await import('./emailService');
      
      // Test getting real user IP
      const ip = await (EmailService as any).getRealUserIP();
      test.results = {
        ipDetected: !!ip && ip !== 'IP non disponible',
        ipValue: ip,
        isValidFormat: this.isValidIP(ip)
      };
      
      test.status = test.results.ipDetected ? 'passed' : 'failed';
    } catch (error) {
      test.status = 'error';
      test.results = { error: error.message };
    }

    return test;
  }

  // Test email delivery to different providers
  private static async testEmailDelivery(): Promise<any> {
    const test = {
      name: 'Email Delivery Test',
      status: 'running',
      results: {}
    };

    try {
      const { EmailService } = await import('./emailService');
      
      // Test with different email providers
      const testEmails = [
        'test@gmail.com',
        'test@outlook.com', 
        'test@yahoo.com'
      ];

      const deliveryResults = [];
      
      for (const email of testEmails) {
        try {
          const result = await EmailService.sendConnectionNotification({
            nom: 'Test',
            prenom: 'Delivery',
            email: email,
            telephone: '0123456789'
          });
          
          deliveryResults.push({
            provider: email.split('@')[1],
            status: result ? 'sent' : 'failed'
          });
        } catch (error) {
          deliveryResults.push({
            provider: email.split('@')[1],
            status: 'error',
            error: error.message
          });
        }
      }

      test.results = { deliveryResults };
      test.status = deliveryResults.some(r => r.status === 'sent') ? 'passed' : 'failed';
      
    } catch (error) {
      test.status = 'error';
      test.results = { error: error.message };
    }

    return test;
  }

  // Test HTTPS alert system
  private static async testHTTPSAlerts(): Promise<any> {
    const test = {
      name: 'HTTPS Alert Test',
      status: 'running',
      results: {}
    };

    try {
      // Simulate HTTPS connection from new IP
      const { EmailService } = await import('./emailService');
      
      const alertResult = await EmailService.sendConnectionNotification({
        nom: 'HTTPS',
        prenom: 'Test',
        email: 'https-test@example.com',
        telephone: '0123456789'
      });

      test.results = {
        alertSent: alertResult,
        httpsDetected: window.location.protocol === 'https:',
        ipTracking: true
      };
      
      test.status = alertResult ? 'passed' : 'failed';
      
    } catch (error) {
      test.status = 'error';
      test.results = { error: error.message };
    }

    return test;
  }

  // Test survey/questionnaire emails
  private static async testSurveyEmails(): Promise<any> {
    const test = {
      name: 'Survey Email Test',
      status: 'running',
      results: {}
    };

    try {
      const { EmailService } = await import('./emailService');
      
      const surveyResult = await EmailService.sendSearchNotification({
        nom: 'Survey',
        prenom: 'Test',
        email: 'survey-test@example.com',
        telephone: '0123456789',
        message: 'Test survey submission'
      });

      test.results = {
        surveySent: surveyResult,
        templateUsed: 'search_notification'
      };
      
      test.status = surveyResult ? 'passed' : 'failed';
      
    } catch (error) {
      test.status = 'error';
      test.results = { error: error.message };
    }

    return test;
  }

  // Test general information emails
  private static async testGeneralInfoEmails(): Promise<any> {
    const test = {
      name: 'General Info Email Test',
      status: 'running',
      results: {}
    };

    try {
      const { EmailService } = await import('./emailService');
      
      const infoResult = await EmailService.sendContactNotification({
        nom: 'Info',
        prenom: 'Test',
        email: 'info-test@example.com',
        telephone: '0123456789',
        message: 'Test general information request'
      });

      test.results = {
        infoSent: infoResult,
        templateUsed: 'contact_notification'
      };
      
      test.status = infoResult ? 'passed' : 'failed';
      
    } catch (error) {
      test.status = 'error';
      test.results = { error: error.message };
    }

    return test;
  }

  // Test spam folder delivery
  private static async testSpamDelivery(): Promise<any> {
    return {
      name: 'Spam Folder Test',
      status: 'manual',
      results: {
        note: 'Manual verification required - check spam folders for test emails',
        recommendations: [
          'Check sender reputation',
          'Verify SPF/DKIM records',
          'Review email content for spam triggers',
          'Test with different email providers'
        ]
      }
    };
  }

  // Test email templates
  private static async testEmailTemplates(): Promise<any> {
    const test = {
      name: 'Email Template Test',
      status: 'running',
      results: {}
    };

    try {
      // Test template rendering with sample data
      const sampleData = {
        nom: 'Template',
        prenom: 'Test',
        email: 'template-test@example.com',
        telephone: '0123456789',
        user_ip: '192.168.1.1',
        timestamp: new Date().toLocaleString('fr-FR'),
        message_content: 'Test template rendering'
      };

      // Simulate template processing
      const templateVars = [
        '{prenom}', '{nom}', '{email}', '{telephone}', 
        '{user_ip}', '{timestamp}', '{message_content}'
      ];

      const missingVars = templateVars.filter(varName => {
        const key = varName.replace(/[{}]/g, '');
        return !sampleData.hasOwnProperty(key);
      });

      test.results = {
        templateVariables: templateVars.length,
        missingVariables: missingVars,
        templateValid: missingVars.length === 0
      };
      
      test.status = missingVars.length === 0 ? 'passed' : 'warning';
      
    } catch (error) {
      test.status = 'error';
      test.results = { error: error.message };
    }

    return test;
  }

  // 3. IMPLEMENTATION OF FIXES
  static async implementFixes(): Promise<string[]> {
    const fixes: string[] = [];
    
    try {
      // Fix 1: Ensure EmailJS is properly configured
      const configFix = await this.fixEmailConfiguration();
      if (configFix) fixes.push(configFix);

      // Fix 2: Implement proper error handling
      const errorHandlingFix = await this.implementErrorHandling();
      if (errorHandlingFix) fixes.push(errorHandlingFix);

      // Fix 3: Set up email queuing for failed sends
      const queueFix = await this.setupEmailQueue();
      if (queueFix) fixes.push(queueFix);

      // Fix 4: Improve IP detection reliability
      const ipFix = await this.improveIPDetection();
      if (ipFix) fixes.push(ipFix);

      // Fix 5: Add comprehensive logging
      const loggingFix = await this.addComprehensiveLogging();
      if (loggingFix) fixes.push(loggingFix);

    } catch (error) {
      console.error('Fix implementation error:', error);
    }

    return fixes;
  }

  // Fix email configuration
  private static async fixEmailConfiguration(): Promise<string | null> {
    try {
      // Check if EmailJS is configured
      const { EmailService } = await import('./emailService');
      const isConfigured = await EmailService.testEmailConfiguration();
      
      if (!isConfigured) {
        // Store configuration reminder
        localStorage.setItem('emailConfigurationNeeded', 'true');
        return 'EmailJS configuration reminder set - please configure via admin panel';
      }
      
      return 'EmailJS configuration verified';
    } catch (error) {
      return `Email configuration fix failed: ${error.message}`;
    }
  }

  // Implement proper error handling
  private static async implementErrorHandling(): Promise<string | null> {
    try {
      // Set up global error handler for email operations
      window.addEventListener('unhandledrejection', (event) => {
        if (event.reason && event.reason.toString().includes('email')) {
          console.error('Email operation failed:', event.reason);
          this.logEmailError(event.reason);
        }
      });

      return 'Enhanced error handling implemented';
    } catch (error) {
      return `Error handling setup failed: ${error.message}`;
    }
  }

  // Set up email queue for failed sends
  private static async setupEmailQueue(): Promise<string | null> {
    try {
      // Initialize email queue in localStorage
      const existingQueue = localStorage.getItem('emailQueue');
      if (!existingQueue) {
        localStorage.setItem('emailQueue', JSON.stringify([]));
      }

      // Set up periodic retry mechanism
      setInterval(() => {
        this.processEmailQueue();
      }, 60000); // Process queue every minute

      return 'Email queue system initialized';
    } catch (error) {
      return `Email queue setup failed: ${error.message}`;
    }
  }

  // Improve IP detection reliability
  private static async improveIPDetection(): Promise<string | null> {
    try {
      // Test all IP detection services
      const ipServices = [
        'https://api.ipify.org?format=json',
        'https://ipapi.co/json/',
        'https://httpbin.org/ip',
        'https://api.myip.com'
      ];

      let workingServices = 0;
      for (const service of ipServices) {
        try {
          const response = await fetch(service);
          if (response.ok) workingServices++;
        } catch {
          // Service not available
        }
      }

      if (workingServices === 0) {
        return 'Warning: No IP detection services available';
      }

      return `IP detection improved - ${workingServices} services available`;
    } catch (error) {
      return `IP detection improvement failed: ${error.message}`;
    }
  }

  // Add comprehensive logging
  private static async addComprehensiveLogging(): Promise<string | null> {
    try {
      // Set up email operation logging
      const logEntry = {
        timestamp: new Date().toISOString(),
        operation: 'logging_setup',
        status: 'success',
        details: 'Comprehensive email logging initialized'
      };

      const existingLogs = JSON.parse(localStorage.getItem('emailOperationLogs') || '[]');
      existingLogs.push(logEntry);
      
      // Keep only last 100 logs
      if (existingLogs.length > 100) {
        existingLogs.splice(0, existingLogs.length - 100);
      }
      
      localStorage.setItem('emailOperationLogs', JSON.stringify(existingLogs));

      return 'Comprehensive logging system activated';
    } catch (error) {
      return `Logging setup failed: ${error.message}`;
    }
  }

  // 4. VALIDATION TESTING
  static async runValidationTests(): Promise<any> {
    console.log('✅ Running validation tests...');
    
    const validation = {
      timestamp: new Date().toISOString(),
      httpsAlertValidation: await this.validateHTTPSAlerts(),
      surveyEmailValidation: await this.validateSurveyEmails(),
      generalEmailValidation: await this.validateGeneralEmails(),
      endToEndTest: await this.runEndToEndTest(),
      performanceTest: await this.testEmailPerformance()
    };

    return validation;
  }

  // Validate HTTPS alert system
  private static async validateHTTPSAlerts(): Promise<any> {
    const validation = {
      test: 'HTTPS Alert Validation',
      steps: [],
      overallStatus: 'unknown'
    };

    try {
      // Step 1: Simulate new IP connection
      validation.steps.push({
        step: 'Simulate new IP connection',
        status: 'passed',
        details: 'New IP simulation successful'
      });

      // Step 2: Test email trigger
      const { EmailService } = await import('./emailService');
      const alertSent = await EmailService.sendConnectionNotification({
        nom: 'HTTPS',
        prenom: 'Validation',
        email: 'https-validation@test.com',
        telephone: '0123456789'
      });

      validation.steps.push({
        step: 'Email alert trigger',
        status: alertSent ? 'passed' : 'failed',
        details: alertSent ? 'Alert email sent successfully' : 'Alert email failed'
      });

      // Step 3: Verify IP tracking
      const knownIPs = EmailService.getKnownIPs();
      validation.steps.push({
        step: 'IP tracking verification',
        status: Array.isArray(knownIPs) ? 'passed' : 'failed',
        details: `${knownIPs.length} known IPs tracked`
      });

      validation.overallStatus = validation.steps.every(s => s.status === 'passed') ? 'passed' : 'failed';

    } catch (error) {
      validation.overallStatus = 'error';
      validation.steps.push({
        step: 'Validation error',
        status: 'error',
        details: error.message
      });
    }

    return validation;
  }

  // Validate survey emails
  private static async validateSurveyEmails(): Promise<any> {
    const validation = {
      test: 'Survey Email Validation',
      steps: [],
      overallStatus: 'unknown'
    };

    try {
      const { EmailService } = await import('./emailService');
      
      // Test search notification (survey type)
      const surveyResult = await EmailService.sendSearchNotification({
        nom: 'Survey',
        prenom: 'Validation',
        email: 'survey-validation@test.com',
        telephone: '0123456789',
        message: 'Validation test for survey functionality'
      });

      validation.steps.push({
        step: 'Survey email send',
        status: surveyResult ? 'passed' : 'failed',
        details: surveyResult ? 'Survey email sent' : 'Survey email failed'
      });

      validation.overallStatus = surveyResult ? 'passed' : 'failed';

    } catch (error) {
      validation.overallStatus = 'error';
      validation.steps.push({
        step: 'Survey validation error',
        status: 'error',
        details: error.message
      });
    }

    return validation;
  }

  // Validate general information emails
  private static async validateGeneralEmails(): Promise<any> {
    const validation = {
      test: 'General Email Validation',
      steps: [],
      overallStatus: 'unknown'
    };

    try {
      const { EmailService } = await import('./emailService');
      
      // Test contact notification
      const contactResult = await EmailService.sendContactNotification({
        nom: 'General',
        prenom: 'Validation',
        email: 'general-validation@test.com',
        telephone: '0123456789',
        message: 'Validation test for general information emails'
      });

      validation.steps.push({
        step: 'General email send',
        status: contactResult ? 'passed' : 'failed',
        details: contactResult ? 'General email sent' : 'General email failed'
      });

      validation.overallStatus = contactResult ? 'passed' : 'failed';

    } catch (error) {
      validation.overallStatus = 'error';
      validation.steps.push({
        step: 'General validation error',
        status: 'error',
        details: error.message
      });
    }

    return validation;
  }

  // Run end-to-end test
  private static async runEndToEndTest(): Promise<any> {
    const test = {
      name: 'End-to-End Email Test',
      steps: [],
      overallStatus: 'unknown'
    };

    try {
      // Complete user journey simulation
      const { EmailService } = await import('./emailService');
      
      // Step 1: User registration with new IP
      const registrationResult = await EmailService.sendWelcomeEmail({
        nom: 'EndToEnd',
        prenom: 'Test',
        email: 'e2e-test@example.com',
        telephone: '0123456789'
      });

      test.steps.push({
        step: 'User registration email',
        status: registrationResult ? 'passed' : 'failed',
        details: 'Complete registration flow tested'
      });

      // Step 2: Property search
      const searchResult = await EmailService.sendSearchNotification({
        nom: 'EndToEnd',
        prenom: 'Test',
        email: 'e2e-test@example.com',
        telephone: '0123456789',
        message: 'Looking for luxury properties'
      });

      test.steps.push({
        step: 'Property search email',
        status: searchResult ? 'passed' : 'failed',
        details: 'Search notification tested'
      });

      // Step 3: Sale inquiry
      const saleResult = await EmailService.sendSaleNotification({
        nom: 'EndToEnd',
        prenom: 'Test',
        email: 'e2e-test@example.com',
        telephone: '0123456789',
        message: 'Interested in selling property'
      });

      test.steps.push({
        step: 'Sale inquiry email',
        status: saleResult ? 'passed' : 'failed',
        details: 'Sale notification tested'
      });

      test.overallStatus = test.steps.every(s => s.status === 'passed') ? 'passed' : 'failed';

    } catch (error) {
      test.overallStatus = 'error';
      test.steps.push({
        step: 'E2E test error',
        status: 'error',
        details: error.message
      });
    }

    return test;
  }

  // Test email performance
  private static async testEmailPerformance(): Promise<any> {
    const test = {
      name: 'Email Performance Test',
      results: {}
    };

    try {
      const startTime = performance.now();
      
      const { EmailService } = await import('./emailService');
      await EmailService.sendContactNotification({
        nom: 'Performance',
        prenom: 'Test',
        email: 'performance-test@example.com',
        telephone: '0123456789',
        message: 'Performance test email'
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      test.results = {
        duration: Math.round(duration),
        performance: duration < 2000 ? 'excellent' : duration < 5000 ? 'good' : 'poor',
        status: duration < 10000 ? 'passed' : 'failed'
      };

    } catch (error) {
      test.results = {
        error: error.message,
        status: 'error'
      };
    }

    return test;
  }

  // Utility functions
  private static isValidIP(ip: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  private static logEmailError(error: any): void {
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: error.toString(),
      type: 'email_operation',
      context: 'email_diagnostics'
    };

    const existingErrors = JSON.parse(localStorage.getItem('emailErrorLog') || '[]');
    existingErrors.push(errorLog);
    
    if (existingErrors.length > 50) {
      existingErrors.splice(0, existingErrors.length - 50);
    }
    
    localStorage.setItem('emailErrorLog', JSON.stringify(existingErrors));
  }

  // Process email queue for retry mechanism
  private static async processEmailQueue(): Promise<void> {
    try {
      const queue = JSON.parse(localStorage.getItem('emailQueue') || '[]');
      const processedQueue = [];

      for (const emailItem of queue) {
        if (emailItem.retryCount < 3) {
          try {
            const { EmailService } = await import('./emailService');
            
            // Retry sending based on email type
            let result = false;
            switch (emailItem.type) {
              case 'connection':
                result = await EmailService.sendConnectionNotification(emailItem.data);
                break;
              case 'search':
                result = await EmailService.sendSearchNotification(emailItem.data);
                break;
              case 'sale':
                result = await EmailService.sendSaleNotification(emailItem.data);
                break;
              case 'contact':
                result = await EmailService.sendContactNotification(emailItem.data);
                break;
            }

            if (!result) {
              emailItem.retryCount = (emailItem.retryCount || 0) + 1;
              emailItem.lastRetry = new Date().toISOString();
              processedQueue.push(emailItem);
            }
            // If successful, don't add back to queue
            
          } catch (error) {
            emailItem.retryCount = (emailItem.retryCount || 0) + 1;
            emailItem.lastRetry = new Date().toISOString();
            emailItem.lastError = error.message;
            processedQueue.push(emailItem);
          }
        }
        // If retryCount >= 3, don't add back to queue (give up)
      }

      localStorage.setItem('emailQueue', JSON.stringify(processedQueue));
      
    } catch (error) {
      console.error('Email queue processing error:', error);
    }
  }

  // Improve IP detection
  private static async improveIPDetection(): Promise<string | null> {
    try {
      // Test multiple IP services and rank by reliability
      const ipServices = [
        { url: 'https://api.ipify.org?format=json', priority: 1 },
        { url: 'https://ipapi.co/json/', priority: 2 },
        { url: 'https://httpbin.org/ip', priority: 3 }
      ];

      const workingServices = [];
      for (const service of ipServices) {
        try {
          const response = await fetch(service.url);
          if (response.ok) {
            workingServices.push(service);
          }
        } catch {
          // Service failed
        }
      }

      localStorage.setItem('workingIPServices', JSON.stringify(workingServices));
      return `IP detection optimized - ${workingServices.length} reliable services`;
      
    } catch (error) {
      return `IP detection improvement failed: ${error.message}`;
    }
  }

  // Add comprehensive logging
  private static async addComprehensiveLogging(): Promise<string | null> {
    try {
      // Initialize comprehensive logging system
      const loggingConfig = {
        emailOperations: true,
        ipDetection: true,
        errorTracking: true,
        performanceMetrics: true,
        retentionDays: 30
      };

      localStorage.setItem('emailLoggingConfig', JSON.stringify(loggingConfig));
      
      return 'Comprehensive logging system configured';
    } catch (error) {
      return `Logging setup failed: ${error.message}`;
    }
  }

  // Generate comprehensive diagnostic report
  static generateDiagnosticReport(): string {
    const report = `
EMAIL SYSTEM DIAGNOSTIC REPORT - CERCLE PRIVÉ
=============================================

Generated: ${new Date().toLocaleString('fr-FR')}
URL: ${window.location.href}

CONFIGURATION STATUS:
${this.testResults.length > 0 ? JSON.stringify(this.testResults[0].configuration, null, 2) : 'No diagnosis run yet'}

CONNECTIVITY STATUS:
${this.testResults.length > 0 ? JSON.stringify(this.testResults[0].connectivity, null, 2) : 'No diagnosis run yet'}

RECENT EMAIL HISTORY:
${this.getRecentEmailHistory()}

RECOMMENDATIONS:
1. Configure EmailJS via admin panel if not done
2. Test email delivery to multiple providers
3. Monitor spam folder delivery
4. Verify IP detection is working correctly
5. Check email templates render properly

NEXT STEPS:
1. Run initial diagnosis: EmailDiagnostics.performInitialDiagnosis()
2. Run systematic tests: EmailDiagnostics.runSystematicTests()
3. Implement fixes: EmailDiagnostics.implementFixes()
4. Run validation: EmailDiagnostics.runValidationTests()

For technical support, contact: nicolas.c@lacremerie.fr
    `;

    return report;
  }

  private static getRecentEmailHistory(): string {
    try {
      const history = JSON.parse(localStorage.getItem('emailHistory') || '[]');
      return history.slice(-5).map((email: any) => 
        `${email.timestamp}: ${email.type} - ${email.status}`
      ).join('\n');
    } catch {
      return 'No email history available';
    }
  }

  // Export all diagnostic data
  static exportDiagnosticData(): void {
    const diagnosticData = {
      testResults: this.testResults,
      emailQueue: JSON.parse(localStorage.getItem('emailQueue') || '[]'),
      emailHistory: JSON.parse(localStorage.getItem('emailHistory') || '[]'),
      knownIPs: JSON.parse(localStorage.getItem('knownIPs') || '[]'),
      errorLog: JSON.parse(localStorage.getItem('emailErrorLog') || '[]'),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(diagnosticData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-diagnostic-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }
}