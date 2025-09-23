// Service d'envoi d'emails automatiques avec détection IP réelle
export class EmailService {
  // Configuration EmailJS - À REMPLACER par vos vraies clés
  private static readonly EMAILJS_CONFIG = {
    USER_ID: 'YOUR_EMAILJS_USER_ID',        // Remplacez par votre User ID
    SERVICE_ID: 'YOUR_EMAILJS_SERVICE_ID',  // Remplacez par votre Service ID
    TEMPLATE_ID: 'YOUR_EMAILJS_TEMPLATE_ID' // Remplacez par votre Template ID
  };

  // Destinataires des emails
  private static readonly EMAIL_RECIPIENTS = {
    NICOLAS: 'nicolas.c@lacremerie.fr',
    QUENTIN: 'quentin@lacremerie.fr'
  };

  // Cache des IPs déjà vues pour éviter les doublons
  private static seenIPs = new Set<string>();

  // Obtenir l'adresse IP réelle de l'utilisateur
  private static async getRealUserIP(): Promise<string> {
    try {
      // Essayer plusieurs services d'IP pour plus de fiabilité
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
            
            // Extraire l'IP selon le format de réponse
            const ip = data.ip || data.query || data.origin;
            if (ip && this.isValidIP(ip)) {
              console.log(`✅ IP obtenue via ${service}:`, ip);
              return ip;
            }
          }
        } catch (error) {
          console.warn(`⚠️ Service IP ${service} indisponible:`, error);
          continue;
        }
      }

      // Fallback si tous les services échouent
      console.warn('⚠️ Impossible d\'obtenir l\'IP réelle - utilisation fallback');
      return 'IP non disponible';
    } catch (error) {
      console.error('❌ Erreur récupération IP:', error);
      return 'Erreur IP';
    }
  }

  // Valider le format d'une adresse IP
  private static isValidIP(ip: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  // Obtenir des informations géographiques sur l'IP
  private static async getIPGeolocation(ip: string): Promise<any> {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      if (response.ok) {
        const data = await response.json();
        return {
          country: data.country_name || 'Inconnu',
          city: data.city || 'Inconnu',
          region: data.region || 'Inconnu',
          isp: data.org || 'Inconnu',
          timezone: data.timezone || 'Inconnu'
        };
      }
    } catch (error) {
      console.warn('⚠️ Impossible d\'obtenir la géolocalisation:', error);
    }
    
    return {
      country: 'Inconnu',
      city: 'Inconnu', 
      region: 'Inconnu',
      isp: 'Inconnu',
      timezone: 'Inconnu'
    };
  }

  // Vérifier si l'IP est nouvelle ou connue
  private static isNewIP(ip: string): boolean {
    // Récupérer les IPs déjà vues depuis le stockage
    const storedIPs = localStorage.getItem('knownIPs');
    const knownIPs = storedIPs ? JSON.parse(storedIPs) : [];
    
    return !knownIPs.includes(ip);
  }

  // Marquer une IP comme vue
  private static markIPAsSeen(ip: string): void {
    const storedIPs = localStorage.getItem('knownIPs');
    const knownIPs = storedIPs ? JSON.parse(storedIPs) : [];
    
    if (!knownIPs.includes(ip)) {
      knownIPs.push(ip);
      localStorage.setItem('knownIPs', JSON.stringify(knownIPs));
      this.seenIPs.add(ip);
    }
  }

  // Envoyer un email via EmailJS
  private static async sendEmailViaEmailJS(templateParams: any): Promise<boolean> {
    // Vérifier si EmailJS est configuré
    if (this.EMAILJS_CONFIG.USER_ID === 'YOUR_EMAILJS_USER_ID') {
      console.warn('⚠️ EmailJS non configuré - email non envoyé');
      return false;
    }

    try {
      // Charger EmailJS dynamiquement
      const emailjs = await import('@emailjs/browser');
      
      const result = await emailjs.default.send(
        this.EMAILJS_CONFIG.SERVICE_ID,
        this.EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        this.EMAILJS_CONFIG.USER_ID
      );

      if (result.status === 200) {
        console.log('✅ Email envoyé avec succès via EmailJS');
        return true;
      } else {
        console.error('❌ Erreur EmailJS:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur envoi EmailJS:', error);
      return false;
    }
  }

  // Envoyer un email de notification de connexion avec IP
  static async sendConnectionNotification(userData: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  }): Promise<boolean> {
    try {
      console.log('📧 Envoi notification de connexion...');
      
      // Obtenir l'IP réelle de l'utilisateur
      const userIP = await this.getRealUserIP();
      const isNewIP = this.isNewIP(userIP);
      const geoInfo = await this.getIPGeolocation(userIP);
      
      // Marquer l'IP comme vue
      this.markIPAsSeen(userIP);
      
      const templateParams = {
        subject: isNewIP ? '🚨 NOUVELLE CONNEXION - Nouvelle IP' : '🔄 CONNEXION - IP Connue',
        email_subject: isNewIP ? 
          `🚨 ALERTE: Nouvelle connexion depuis une nouvelle adresse IP` :
          `🔄 Connexion depuis une adresse IP connue`,
        user_nom: userData.nom,
        user_prenom: userData.prenom,
        user_email: userData.email,
        user_telephone: userData.telephone,
        user_ip: userIP,
        ip_status: isNewIP ? 'NOUVELLE IP' : 'IP CONNUE',
        ip_country: geoInfo.country,
        ip_city: geoInfo.city,
        ip_region: geoInfo.region,
        ip_isp: geoInfo.isp,
        ip_timezone: geoInfo.timezone,
        timestamp: new Date().toLocaleString('fr-FR', {
          timeZone: 'Europe/Paris',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        website_url: window.location.origin,
        message_content: `
📍 DÉTAILS DE LA CONNEXION :
• Statut IP: ${isNewIP ? '🚨 NOUVELLE ADRESSE IP' : '✅ Adresse IP connue'}
• Adresse IP: ${userIP}
• Localisation: ${geoInfo.city}, ${geoInfo.region}, ${geoInfo.country}
• Fournisseur: ${geoInfo.isp}
• Fuseau horaire: ${geoInfo.timezone}

👤 INFORMATIONS UTILISATEUR :
• Nom complet: ${userData.prenom} ${userData.nom}
• Email: ${userData.email}
• Téléphone: ${userData.telephone}

${isNewIP ? 
  '🚨 ATTENTION: Cette connexion provient d\'une nouvelle adresse IP qui n\'avait jamais été vue auparavant.' :
  '✅ Cette connexion provient d\'une adresse IP déjà connue du système.'
}
        `,
        to_email: this.EMAIL_RECIPIENTS.NICOLAS,
        cc_email: this.EMAIL_RECIPIENTS.QUENTIN
      };

      // Tenter l'envoi via EmailJS
      const emailSent = await this.sendEmailViaEmailJS(templateParams);
      
      if (emailSent) {
        console.log(`✅ Email de connexion envoyé (${isNewIP ? 'NOUVELLE IP' : 'IP CONNUE'})`);
        
        // Stocker l'email envoyé pour historique
        this.storeEmailRecord('connection', templateParams, 'sent');
        
        return true;
      } else {
        console.warn('⚠️ Échec EmailJS - stockage pour envoi manuel');
        this.storeEmailRecord('connection', templateParams, 'pending');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Erreur notification connexion:', error);
      return false;
    }
  }

  // Envoyer un email de recherche immobilière
  static async sendSearchNotification(searchData: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    message?: string;
  }): Promise<boolean> {
    try {
      const userIP = await this.getRealUserIP();
      const geoInfo = await this.getIPGeolocation(userIP);
      
      const templateParams = {
        subject: '🔍 NOUVELLE RECHERCHE IMMOBILIÈRE',
        email_subject: '🔍 Nouvelle demande de recherche immobilière',
        user_nom: searchData.nom,
        user_prenom: searchData.prenom,
        user_email: searchData.email,
        user_telephone: searchData.telephone,
        user_ip: userIP,
        timestamp: new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
        website_url: window.location.origin,
        message_content: `
🔍 NOUVELLE DEMANDE DE RECHERCHE IMMOBILIÈRE

👤 CLIENT :
• Nom: ${searchData.prenom} ${searchData.nom}
• Email: ${searchData.email}
• Téléphone: ${searchData.telephone}

📍 INFORMATIONS CONNEXION :
• IP: ${userIP}
• Localisation: ${geoInfo.city}, ${geoInfo.country}

💬 MESSAGE DU CLIENT :
${searchData.message || 'Aucun message spécifique'}

🎯 ACTION REQUISE : Contacter ce prospect pour définir ses critères de recherche.
        `,
        to_email: this.EMAIL_RECIPIENTS.NICOLAS,
        cc_email: this.EMAIL_RECIPIENTS.QUENTIN
      };

      const emailSent = await this.sendEmailViaEmailJS(templateParams);
      
      if (emailSent) {
        console.log('✅ Email de recherche envoyé');
        this.storeEmailRecord('search', templateParams, 'sent');
        return true;
      } else {
        this.storeEmailRecord('search', templateParams, 'pending');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Erreur notification recherche:', error);
      return false;
    }
  }

  // Envoyer un email de demande de vente
  static async sendSaleNotification(saleData: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    message?: string;
  }): Promise<boolean> {
    try {
      const userIP = await this.getRealUserIP();
      const geoInfo = await this.getIPGeolocation(userIP);
      
      const templateParams = {
        subject: '💰 NOUVELLE DEMANDE DE VENTE',
        email_subject: '💰 Nouvelle demande d\'estimation/vente',
        user_nom: saleData.nom,
        user_prenom: saleData.prenom,
        user_email: saleData.email,
        user_telephone: saleData.telephone,
        user_ip: userIP,
        timestamp: new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
        website_url: window.location.origin,
        message_content: `
💰 NOUVELLE DEMANDE DE VENTE/ESTIMATION

👤 PROPRIÉTAIRE :
• Nom: ${saleData.prenom} ${saleData.nom}
• Email: ${saleData.email}
• Téléphone: ${saleData.telephone}

📍 INFORMATIONS CONNEXION :
• IP: ${userIP}
• Localisation: ${geoInfo.city}, ${geoInfo.country}

💬 DÉTAILS DE LA DEMANDE :
${saleData.message || 'Demande d\'estimation de bien immobilier'}

🎯 ACTION REQUISE : Contacter ce propriétaire pour organiser une estimation.
        `,
        to_email: this.EMAIL_RECIPIENTS.NICOLAS,
        cc_email: this.EMAIL_RECIPIENTS.QUENTIN
      };

      const emailSent = await this.sendEmailViaEmailJS(templateParams);
      
      if (emailSent) {
        console.log('✅ Email de vente envoyé');
        this.storeEmailRecord('sale', templateParams, 'sent');
        return true;
      } else {
        this.storeEmailRecord('sale', templateParams, 'pending');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Erreur notification vente:', error);
      return false;
    }
  }

  // Envoyer un email de prise de rendez-vous
  static async sendAppointmentNotification(appointmentData: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    selectedDate: Date;
    selectedTime: string;
    message?: string;
  }): Promise<boolean> {
    try {
      const userIP = await this.getRealUserIP();
      const geoInfo = await this.getIPGeolocation(userIP);
      
      const templateParams = {
        subject: '📅 NOUVEAU RENDEZ-VOUS DEMANDÉ',
        email_subject: '📅 Nouvelle demande de rendez-vous',
        user_nom: appointmentData.nom,
        user_prenom: appointmentData.prenom,
        user_email: appointmentData.email,
        user_telephone: appointmentData.telephone,
        user_ip: userIP,
        timestamp: new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
        website_url: window.location.origin,
        message_content: `
📅 NOUVELLE DEMANDE DE RENDEZ-VOUS

👤 CLIENT :
• Nom: ${appointmentData.prenom} ${appointmentData.nom}
• Email: ${appointmentData.email}
• Téléphone: ${appointmentData.telephone}

📍 INFORMATIONS CONNEXION :
• IP: ${userIP}
• Localisation: ${geoInfo.city}, ${geoInfo.country}

🗓️ RENDEZ-VOUS SOUHAITÉ :
• Date: ${appointmentData.selectedDate.toLocaleDateString('fr-FR')}
• Heure: ${appointmentData.selectedTime}

💬 MESSAGE DU CLIENT :
${appointmentData.message || 'Aucun message spécifique'}

🎯 ACTION REQUISE : Confirmer ce rendez-vous avec le client.
        `,
        to_email: this.EMAIL_RECIPIENTS.NICOLAS,
        cc_email: this.EMAIL_RECIPIENTS.QUENTIN
      };

      const emailSent = await this.sendEmailViaEmailJS(templateParams);
      
      if (emailSent) {
        console.log('✅ Email de RDV envoyé');
        this.storeEmailRecord('appointment', templateParams, 'sent');
        return true;
      } else {
        this.storeEmailRecord('appointment', templateParams, 'pending');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Erreur notification RDV:', error);
      return false;
    }
  }

  // Envoyer un email de contact général
  static async sendContactNotification(contactData: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    message?: string;
  }): Promise<boolean> {
    try {
      const userIP = await this.getRealUserIP();
      const geoInfo = await this.getIPGeolocation(userIP);
      
      const templateParams = {
        subject: '📞 NOUVEAU MESSAGE DE CONTACT',
        email_subject: '📞 Nouveau message de contact',
        user_nom: contactData.nom,
        user_prenom: contactData.prenom,
        user_email: contactData.email,
        user_telephone: contactData.telephone,
        user_ip: userIP,
        timestamp: new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
        website_url: window.location.origin,
        message_content: `
📞 NOUVEAU MESSAGE DE CONTACT

👤 CONTACT :
• Nom: ${contactData.prenom} ${contactData.nom}
• Email: ${contactData.email}
• Téléphone: ${contactData.telephone}

📍 INFORMATIONS CONNEXION :
• IP: ${userIP}
• Localisation: ${geoInfo.city}, ${geoInfo.country}

💬 MESSAGE :
${contactData.message || 'Message de contact général'}

🎯 ACTION REQUISE : Répondre à cette demande de contact.
        `,
        to_email: this.EMAIL_RECIPIENTS.NICOLAS,
        cc_email: this.EMAIL_RECIPIENTS.QUENTIN
      };

      const emailSent = await this.sendEmailViaEmailJS(templateParams);
      
      if (emailSent) {
        console.log('✅ Email de contact envoyé');
        this.storeEmailRecord('contact', templateParams, 'sent');
        return true;
      } else {
        this.storeEmailRecord('contact', templateParams, 'pending');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Erreur notification contact:', error);
      return false;
    }
  }

  // Envoyer un email de bienvenue à l'utilisateur
  static async sendWelcomeEmail(userData: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  }): Promise<boolean> {
    try {
      const userIP = await this.getRealUserIP();
      const isNewIP = this.isNewIP(userIP);
      
      // Envoyer d'abord la notification aux admins
      await this.sendConnectionNotification(userData);
      
      // Puis envoyer l'email de bienvenue à l'utilisateur (optionnel)
      console.log(`📧 Email de bienvenue préparé pour ${userData.email}`);
      
      return true;
    } catch (error) {
      console.error('❌ Erreur email de bienvenue:', error);
      return false;
    }
  }

  // Stocker un enregistrement d'email pour historique
  private static storeEmailRecord(type: string, templateParams: any, status: 'sent' | 'pending' | 'failed'): void {
    try {
      const emailRecord = {
        id: Date.now().toString(),
        type,
        status,
        timestamp: new Date().toISOString(),
        recipient: templateParams.to_email,
        subject: templateParams.subject,
        userInfo: {
          nom: templateParams.user_nom,
          prenom: templateParams.user_prenom,
          email: templateParams.user_email,
          ip: templateParams.user_ip
        }
      };

      const storedEmails = localStorage.getItem('emailHistory');
      const emailHistory = storedEmails ? JSON.parse(storedEmails) : [];
      emailHistory.push(emailRecord);
      
      // Garder seulement les 100 derniers emails
      if (emailHistory.length > 100) {
        emailHistory.splice(0, emailHistory.length - 100);
      }
      
      localStorage.setItem('emailHistory', JSON.stringify(emailHistory));
      
    } catch (error) {
      console.error('❌ Erreur stockage email:', error);
    }
  }

  // Récupérer l'historique des emails
  static getEmailHistory(): any[] {
    try {
      const stored = localStorage.getItem('emailHistory');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Récupérer les emails en attente
  static getPendingEmails(): any[] {
    return this.getEmailHistory().filter(email => email.status === 'pending');
  }

  // Récupérer les IPs connues
  static getKnownIPs(): string[] {
    try {
      const stored = localStorage.getItem('knownIPs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Statistiques des connexions par IP
  static getIPStatistics(): { [ip: string]: number } {
    const history = this.getEmailHistory();
    const ipStats: { [ip: string]: number } = {};
    
    history.forEach(email => {
      const ip = email.userInfo?.ip;
      if (ip && ip !== 'IP non disponible') {
        ipStats[ip] = (ipStats[ip] || 0) + 1;
      }
    });
    
    return ipStats;
  }

  // Tester la configuration EmailJS
  static async testEmailConfiguration(): Promise<boolean> {
    if (this.EMAILJS_CONFIG.USER_ID === 'YOUR_EMAILJS_USER_ID') {
      console.warn('⚠️ EmailJS non configuré');
      return false;
    }

    try {
      const testParams = {
        subject: '🧪 TEST CONFIGURATION EMAILJS',
        email_subject: 'Test de configuration EmailJS',
        user_nom: 'Test',
        user_prenom: 'Configuration',
        user_email: 'test@example.com',
        user_telephone: '0123456789',
        user_ip: await this.getRealUserIP(),
        timestamp: new Date().toLocaleString('fr-FR'),
        website_url: window.location.origin,
        message_content: 'Ceci est un email de test pour vérifier la configuration EmailJS.',
        to_email: this.EMAIL_RECIPIENTS.NICOLAS,
        cc_email: this.EMAIL_RECIPIENTS.QUENTIN
      };

      return await this.sendEmailViaEmailJS(testParams);
    } catch (error) {
      console.error('❌ Erreur test EmailJS:', error);
      return false;
    }
  }
}