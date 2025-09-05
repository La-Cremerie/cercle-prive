import type { AdminUser } from '../types/admin';

export class AdminEmailService {
  private static VALIDATION_EMAIL = 'quentin@lacremerie.fr';

  static async sendAdminValidationRequest(newAdmin: AdminUser, createdBy: string): Promise<void> {
    try {
      // Pour l'instant, on simule l'envoi d'email
      // En production, vous pourriez utiliser un service comme SendGrid, Resend, etc.
      console.log(`Email de validation envoyé à ${this.VALIDATION_EMAIL}`);
      console.log(`Nouvel admin: ${newAdmin.prenom} ${newAdmin.nom} (${newAdmin.email})`);
      console.log(`Créé par: ${createdBy}`);
      
      // Simulation d'un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de validation:', error);
      throw new Error('Impossible d\'envoyer l\'email de validation');
    }
  }

  private static async getAdminInfo(adminId: string): Promise<AdminUser | null> {
    // Cette méthode pourrait être utilisée pour récupérer les infos du créateur
    // Pour l'instant, on retourne null
    return null;
  }
}