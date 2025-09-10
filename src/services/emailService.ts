import toast from 'react-hot-toast';
import type { UserRegistration } from '../types/database';

export class EmailService {
  static getEmailSettings() {
    const settings = localStorage.getItem('emailSettings');
    return settings ? JSON.parse(settings) : {
      autoReply: true,
      welcomeEmail: true,
      adminNotification: true,
      emailTemplate: `Bonjour {prenom} {nom},

Merci pour votre inscription sur OFF MARKET.

Nous sommes ravis de vous compter parmi nos clients privilégiés. Vous recevrez prochainement des informations exclusives sur nos biens immobiliers de prestige en off-market.

Notre équipe vous contactera sous peu pour discuter de vos projets immobiliers.

Cordialement,
L'équipe OFF MARKET

---
Ce message a été envoyé automatiquement. Pour toute question, contactez-nous à nicolas.c@lacremerie.fr`
    };
  }

  private static replaceTemplateVariables(template: string, user: UserRegistration): string {
    return template
      .replace(/{prenom}/g, user.prenom)
      .replace(/{nom}/g, user.nom)
      .replace(/{email}/g, user.email)
      .replace(/{telephone}/g, user.telephone);
  }

  static async sendWelcomeEmail(user: UserRegistration): Promise<void> {
    const settings = this.getEmailSettings();
    
    if (!settings.welcomeEmail) {
      return;
    }

    try {
      // Simulation d'envoi d'email (en production, utilisez un service comme SendGrid, Mailgun, etc.)
      const emailContent = this.replaceTemplateVariables(settings.emailTemplate, user);
      
      // Ici vous intégreriez votre service d'email réel
      console.log('Envoi email de bienvenue à:', user.email);
      console.log('Contenu:', emailContent);
      
      // Simulation d'un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Email de bienvenue envoyé à ${user.prenom} ${user.nom}`);
    } catch (error) {
      console.error('Erreur envoi email:', error);
      toast.error('Erreur lors de l\'envoi de l\'email de bienvenue');
    }
  }

  static async sendAdminNotification(user: UserRegistration): Promise<void> {
    const settings = this.getEmailSettings();
    
    if (!settings.adminNotification) {
      return;
    }

    try {
      // Email de notification pour l'admin
      const adminEmail = 'nicolas.c@lacremerie.fr';
      const subject = `OFF MARKET - Nouvelle inscription - ${user.prenom} ${user.nom}`;
      const content = `
Nouvelle inscription sur le site OFF MARKET :

Nom : ${user.nom}
Prénom : ${user.prenom}
Email : ${user.email}
Téléphone : ${user.telephone}
Date : ${user.created_at ? new Date(user.created_at).toLocaleString('fr-FR') : 'Non disponible'}

---
Notification automatique du système
      `;

      console.log('Envoi notification admin à:', adminEmail);
      console.log('Sujet:', subject);
      console.log('Contenu:', content);
      
      // Simulation d'un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Notification admin envoyée');
    } catch (error) {
      console.error('Erreur notification admin:', error);
      toast.error('Erreur lors de l\'envoi de la notification admin');
    }
  }

  static async sendTestEmail(email: string): Promise<void> {
    try {
      const testUser: UserRegistration = {
        id: 'test-id',
        nom: 'Test',
        prenom: 'Utilisateur',
        email: email,
        telephone: '01 23 45 67 89',
        created_at: new Date().toISOString()
      };

      await this.sendWelcomeEmail(testUser);
    } catch (error) {
      console.error('Erreur test email:', error);
      toast.error('Erreur lors de l\'envoi de l\'email de test');
    }
  }

  static async sendContactNotification(contactData: any): Promise<void> {
    const settings = this.getEmailSettings();
    
    if (!settings.adminNotification) {
      console.log('Admin notifications disabled');
      return;
    }

    try {
      // Email de notification pour Nicolas
      const adminEmail = 'nicolas.c@lacremerie.fr';
      const subject = `CERCLE PRIVÉ - Nouveau message de contact - ${contactData.prenom} ${contactData.nom}`;
      const content = `
Nouveau message de contact sur le site CERCLE PRIVÉ :

Nom : ${contactData.nom}
Prénom : ${contactData.prenom}
Email : ${contactData.email}
Téléphone : ${contactData.telephone || 'Non renseigné'}

Message :
${contactData.message}

Date : ${new Date().toLocaleString('fr-FR')}

---
Notification automatique du système CERCLE PRIVÉ
      `;

      console.log('Envoi notification contact à Nicolas:', adminEmail);
      console.log('Sujet:', subject);
      console.log('Contenu:', content);
      
      // Simulation d'un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('📧 Notification envoyée à Nicolas');
    } catch (error) {
      console.error('Erreur notification contact:', error);
      toast.error('Erreur lors de l\'envoi de la notification');
    }
  }
}