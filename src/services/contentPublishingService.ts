import { supabase } from '../lib/supabase';
import { ContentVersioningService } from './contentVersioningService';
import toast from 'react-hot-toast';

export class ContentPublishingService {
  // Publier le contenu de Nicolas pour tous les utilisateurs
  static async publishNicolasContent(): Promise<void> {
    try {
      console.log('🚀 Publication du contenu de Nicolas en cours...');
      toast.loading('Publication du contenu en cours...', { id: 'publish-content' });

      const authorName = 'Nicolas';
      const authorEmail = 'nicolas.c@lacremerie.fr';

      // 1. Récupérer et publier le contenu du site
      const siteContent = localStorage.getItem('siteContent');
      if (siteContent) {
        await ContentVersioningService.saveContentVersion(
          JSON.parse(siteContent),
          authorName,
          authorEmail,
          'Publication officielle du contenu par Nicolas'
        );
        console.log('✅ Contenu du site publié');
      }

      // 2. Récupérer et publier les propriétés
      const properties = localStorage.getItem('properties');
      if (properties) {
        const propertiesData = JSON.parse(properties);
        for (const property of propertiesData) {
          await ContentVersioningService.savePropertyVersion(
            property,
            authorName,
            authorEmail,
            `Publication officielle de ${property.name} par Nicolas`
          );
        }
        console.log('✅ Propriétés publiées');
      }

      // 3. Récupérer et publier les images de présentation
      const heroImages = localStorage.getItem('presentationImages');
      if (heroImages) {
        await ContentVersioningService.savePresentationImagesVersion(
          'hero',
          JSON.parse(heroImages),
          authorName,
          authorEmail,
          'Publication officielle des images Hero par Nicolas'
        );
        console.log('✅ Images Hero publiées');
      }

      const conceptImages = localStorage.getItem('conceptImages');
      if (conceptImages) {
        await ContentVersioningService.savePresentationImagesVersion(
          'concept',
          JSON.parse(conceptImages),
          authorName,
          authorEmail,
          'Publication officielle des images Concept par Nicolas'
        );
        console.log('✅ Images Concept publiées');
      }

      // 4. Récupérer et publier les paramètres de design
      const designSettings = localStorage.getItem('designSettings');
      if (designSettings) {
        await ContentVersioningService.saveDesignSettingsVersion(
          JSON.parse(designSettings),
          authorName,
          authorEmail,
          'Publication officielle des paramètres de design par Nicolas'
        );
        console.log('✅ Paramètres de design publiés');
      }

      // 5. Forcer la synchronisation sur tous les clients
      await this.broadcastPublicationEvent();

      toast.success('🎉 Contenu de Nicolas publié avec succès !', { id: 'publish-content' });
      
      // 6. Recharger automatiquement pour voir les changements
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('❌ Erreur lors de la publication:', error);
      toast.error('Erreur lors de la publication du contenu', { id: 'publish-content' });
      throw error;
    }
  }

  // Vérifier si le contenu de Nicolas est disponible localement
  static checkNicolasContentAvailability(): {
    hasContent: boolean;
    hasSiteContent: boolean;
    hasProperties: boolean;
    hasImages: boolean;
    hasDesign: boolean;
    lastModified: string | null;
  } {
    const siteContent = localStorage.getItem('siteContent');
    const properties = localStorage.getItem('properties');
    const heroImages = localStorage.getItem('presentationImages');
    const conceptImages = localStorage.getItem('conceptImages');
    const designSettings = localStorage.getItem('designSettings');

    // Trouver la dernière modification
    const timestamps = [];
    if (siteContent) timestamps.push(new Date().toISOString()); // Pas de timestamp dans localStorage
    if (properties) timestamps.push(new Date().toISOString());
    if (heroImages) timestamps.push(new Date().toISOString());
    if (conceptImages) timestamps.push(new Date().toISOString());
    if (designSettings) timestamps.push(new Date().toISOString());

    const lastModified = timestamps.length > 0 ? timestamps.sort().pop() : null;

    return {
      hasContent: !!(siteContent || properties || heroImages || conceptImages || designSettings),
      hasSiteContent: !!siteContent,
      hasProperties: !!properties,
      hasImages: !!(heroImages || conceptImages),
      hasDesign: !!designSettings,
      lastModified
    };
  }

  // Diffuser l'événement de publication
  private static async broadcastPublicationEvent(): Promise<void> {
    try {
      // Utiliser le service de sync existant pour notifier tous les clients
      const { syncService } = await import('./realTimeSync');
      
      await syncService.broadcastChange({
        type: 'content',
        action: 'update',
        data: { published: true, author: 'Nicolas' },
        adminId: 'nicolas-admin',
        adminName: 'Nicolas'
      });

      console.log('📡 Événement de publication diffusé');
    } catch (error) {
      console.warn('⚠️ Erreur diffusion événement:', error);
    }
  }

  // Récupérer la dernière version publiée par Nicolas depuis Supabase
  static async getLatestNicolasVersion(): Promise<any> {
    try {
      const { data: contentVersions, error: contentError } = await supabase
        .from('site_content_versions')
        .select('*')
        .eq('author_email', 'nicolas.c@lacremerie.fr')
        .order('created_at', { ascending: false })
        .limit(1);

      if (contentError) throw contentError;

      return {
        content: contentVersions?.[0] || null,
        timestamp: contentVersions?.[0]?.created_at || null
      };
    } catch (error) {
      console.error('Erreur récupération version Nicolas:', error);
      return { content: null, timestamp: null };
    }
  }

  // Forcer la synchronisation depuis Supabase pour tous les utilisateurs
  static async forceSyncFromSupabase(): Promise<void> {
    try {
      console.log('🔄 Synchronisation forcée depuis Supabase...');
      
      // Utiliser le service de versioning pour synchroniser
      await ContentVersioningService.syncFromSupabaseToLocal();
      
      // Déclencher les événements de mise à jour
      window.dispatchEvent(new CustomEvent('forceUpdate', { 
        detail: { type: 'all', source: 'supabase' } 
      }));
      
      console.log('✅ Synchronisation forcée terminée');
    } catch (error) {
      console.error('❌ Erreur synchronisation forcée:', error);
      throw error;
    }
  }
}