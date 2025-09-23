// Service d'envoi d'emails automatiques
export class EmailService {
  private static readonly RECIPIENTS = {
    primary: 'nicolas.c@lacremerie.fr',
    bcc: 'quentin@lacremerie.fr'
  };

  // Obtenir l'adresse IP de l'utilisateur
  private static async getUserIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'IP:', error);
      return 'IP non disponible';
    }
  }

  // Obtenir les informations du navigateur
  private static getBrowserInfo(): string {
    return navigator.userAgent || 'Navigateur non identifié';
  }

  // Envoyer un email générique
  private static async sendEmail(subject: string, content: string): Promise<boolean> {
    try {
      // Simulation d'envoi d'email - À remplacer par votre service d'email réel
      console.log('📧 Email envoyé:', {
        to: this.RECIPIENTS.primary,
        bcc: this.RECIPIENTS.bcc,
        subject,
        content,
        timestamp: new Date().toISOString()
      });

      // Ici vous intégreriez votre service d'email (SendGrid, Mailgun, etc.)
      // const response = await fetch('/api/send-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     to: this.RECIPIENTS.primary,
      //     bcc: this.RECIPIENTS.bcc,
      //     subject,
      //     html: content
      //   })
      // });
      // return response.ok;

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return false;
    }
  }

  // Notification de connexion avec IP
  static async sendConnectionNotification(userInfo: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  }): Promise<boolean> {
    const userIP = await this.getUserIP();
    const browserInfo = this.getBrowserInfo();
    const timestamp = new Date().toLocaleString('fr-FR');

    const subject = `🔐 Nouvelle connexion - ${userInfo.prenom} ${userInfo.nom}`;
    const content = `
      <h2>Nouvelle connexion détectée</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>👤 Informations utilisateur :</h3>
        <ul>
          <li><strong>Nom :</strong> ${userInfo.nom}</li>
          <li><strong>Prénom :</strong> ${userInfo.prenom}</li>
          <li><strong>Email :</strong> ${userInfo.email}</li>
          <li><strong>Téléphone :</strong> ${userInfo.telephone}</li>
        </ul>
        
        <h3>🌐 Informations de connexion :</h3>
        <ul>
          <li><strong>Adresse IP :</strong> ${userIP}</li>
          <li><strong>Date/Heure :</strong> ${timestamp}</li>
          <li><strong>Navigateur :</strong> ${browserInfo}</li>
          <li><strong>URL :</strong> ${window.location.href}</li>
        </ul>
      </div>
    `;

    return this.sendEmail(subject, content);
  }

  // Notification de recherche immobilière
  static async sendSearchNotification(searchData: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    type: string;
    budget: string;
    localisation: string;
    surface?: string;
    chambres?: string;
    message?: string;
  }): Promise<boolean> {
    const userIP = await this.getUserIP();
    const timestamp = new Date().toLocaleString('fr-FR');

    const subject = `🔍 Nouvelle recherche immobilière - ${searchData.prenom} ${searchData.nom}`;
    const content = `
      <h2>Nouvelle demande de recherche immobilière</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>👤 Contact :</h3>
        <ul>
          <li><strong>Nom :</strong> ${searchData.nom}</li>
          <li><strong>Prénom :</strong> ${searchData.prenom}</li>
          <li><strong>Email :</strong> ${searchData.email}</li>
          <li><strong>Téléphone :</strong> ${searchData.telephone}</li>
          <li><strong>IP :</strong> ${userIP}</li>
        </ul>
        
        <h3>🏠 Critères de recherche :</h3>
        <ul>
          <li><strong>Type :</strong> ${searchData.type}</li>
          <li><strong>Budget :</strong> ${searchData.budget}</li>
          <li><strong>Localisation :</strong> ${searchData.localisation}</li>
          ${searchData.surface ? `<li><strong>Surface :</strong> ${searchData.surface}</li>` : ''}
          ${searchData.chambres ? `<li><strong>Chambres :</strong> ${searchData.chambres}</li>` : ''}
        </ul>
        
        ${searchData.message ? `
          <h3>💬 Message :</h3>
          <p style="background: white; padding: 15px; border-radius: 4px;">${searchData.message}</p>
        ` : ''}
        
        <p><small>Reçu le ${timestamp}</small></p>
      </div>
    `;

    return this.sendEmail(subject, content);
  }

  // Notification de demande de vente
  static async sendSaleNotification(saleData: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    typeBien: string;
    localisation: string;
    surface: string;
    chambres?: string;
    prix?: string;
    description?: string;
  }): Promise<boolean> {
    const userIP = await this.getUserIP();
    const timestamp = new Date().toLocaleString('fr-FR');

    const subject = `💰 Nouvelle demande de vente - ${saleData.prenom} ${saleData.nom}`;
    const content = `
      <h2>Nouvelle demande de vente immobilière</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>👤 Propriétaire :</h3>
        <ul>
          <li><strong>Nom :</strong> ${saleData.nom}</li>
          <li><strong>Prénom :</strong> ${saleData.prenom}</li>
          <li><strong>Email :</strong> ${saleData.email}</li>
          <li><strong>Téléphone :</strong> ${saleData.telephone}</li>
          <li><strong>IP :</strong> ${userIP}</li>
        </ul>
        
        <h3>🏠 Bien à vendre :</h3>
        <ul>
          <li><strong>Type :</strong> ${saleData.typeBien}</li>
          <li><strong>Localisation :</strong> ${saleData.localisation}</li>
          <li><strong>Surface :</strong> ${saleData.surface}</li>
          ${saleData.chambres ? `<li><strong>Chambres :</strong> ${saleData.chambres}</li>` : ''}
          ${saleData.prix ? `<li><strong>Prix souhaité :</strong> ${saleData.prix}</li>` : ''}
        </ul>
        
        ${saleData.description ? `
          <h3>📝 Description :</h3>
          <p style="background: white; padding: 15px; border-radius: 4px;">${saleData.description}</p>
        ` : ''}
        
        <p><small>Reçu le ${timestamp}</small></p>
      </div>
    `;

    return this.sendEmail(subject, content);
  }

  // Notification de demande de rendez-vous
  static async sendAppointmentNotification(appointmentData: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    date: string;
    time: string;
    message?: string;
  }): Promise<boolean> {
    const userIP = await this.getUserIP();
    const timestamp = new Date().toLocaleString('fr-FR');

    const subject = `📅 Nouvelle demande de RDV - ${appointmentData.prenom} ${appointmentData.nom}`;
    const content = `
      <h2>Nouvelle demande de rendez-vous</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>👤 Client :</h3>
        <ul>
          <li><strong>Nom :</strong> ${appointmentData.nom}</li>
          <li><strong>Prénom :</strong> ${appointmentData.prenom}</li>
          <li><strong>Email :</strong> ${appointmentData.email}</li>
          <li><strong>Téléphone :</strong> ${appointmentData.telephone}</li>
          <li><strong>IP :</strong> ${userIP}</li>
        </ul>
        
        <h3>📅 Rendez-vous souhaité :</h3>
        <ul>
          <li><strong>Date :</strong> ${appointmentData.date}</li>
          <li><strong>Heure :</strong> ${appointmentData.time}</li>
        </ul>
        
        ${appointmentData.message ? `
          <h3>💬 Message :</h3>
          <p style="background: white; padding: 15px; border-radius: 4px;">${appointmentData.message}</p>
        ` : ''}
        
        <p><small>Demande reçue le ${timestamp}</small></p>
      </div>
    `;

    return this.sendEmail(subject, content);
  }

  // Notification de contact général
  static async sendContactNotification(contactData: {
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    sujet: string;
    message: string;
  }): Promise<boolean> {
    const userIP = await this.getUserIP();
    const timestamp = new Date().toLocaleString('fr-FR');

    const subject = `📞 Nouveau contact - ${contactData.sujet}`;
    const content = `
      <h2>Nouveau message de contact</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>👤 Expéditeur :</h3>
        <ul>
          <li><strong>Nom :</strong> ${contactData.nom}</li>
          <li><strong>Prénom :</strong> ${contactData.prenom}</li>
          <li><strong>Email :</strong> ${contactData.email}</li>
          ${contactData.telephone ? `<li><strong>Téléphone :</strong> ${contactData.telephone}</li>` : ''}
          <li><strong>IP :</strong> ${userIP}</li>
        </ul>
        
        <h3>📧 Message :</h3>
        <p><strong>Sujet :</strong> ${contactData.sujet}</p>
        <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
          ${contactData.message}
        </div>
        
        <p><small>Reçu le ${timestamp}</small></p>
      </div>
    `;

    return this.sendEmail(subject, content);
  }

  // Email de bienvenue
  static async sendWelcomeEmail(userInfo: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  }): Promise<boolean> {
    const userIP = await this.getUserIP();
    const timestamp = new Date().toLocaleString('fr-FR');

    const subject = `🎉 Bienvenue ${userInfo.prenom} - Inscription confirmée`;
    const content = `
      <h2>Nouvel utilisateur inscrit</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>👤 Nouvel utilisateur :</h3>
        <ul>
          <li><strong>Nom :</strong> ${userInfo.nom}</li>
          <li><strong>Prénom :</strong> ${userInfo.prenom}</li>
          <li><strong>Email :</strong> ${userInfo.email}</li>
          <li><strong>Téléphone :</strong> ${userInfo.telephone}</li>
          <li><strong>IP d'inscription :</strong> ${userIP}</li>
          <li><strong>Date d'inscription :</strong> ${timestamp}</li>
        </ul>
      </div>
    `;

    return this.sendEmail(subject, content);
  }
}