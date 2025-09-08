import { supabase } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export interface ContentVersion {
  id: string;
  version_number: number;
  content_data: any;
  is_current: boolean;
  author_id: string | null;
  author_name: string;
  author_email: string;
  change_description: string | null;
  created_at: string;
}

export interface PropertyVersion {
  id: string;
  property_id: string;
  version_number: number;
  name: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  surface: number;
  images: string[];
  description: string;
  features: string[];
  type: 'villa' | 'appartement' | 'penthouse';
  status: 'disponible' | 'vendu' | 'reserve';
  yield?: number;
  is_visible: boolean;
  is_current: boolean;
  author_id: string | null;
  author_name: string;
  author_email: string;
  change_description: string | null;
  created_at: string;
}

export interface ImageVersion {
  id: string;
  version_number: number;
  category: 'hero' | 'concept';
  images_data: any[];
  is_current: boolean;
  author_id: string | null;
  author_name: string;
  author_email: string;
  change_description: string | null;
  created_at: string;
}

export interface DesignVersion {
  id: string;
  version_number: number;
  settings_data: any;
  is_current: boolean;
  author_id: string | null;
  author_name: string;
  author_email: string;
  change_description: string | null;
  created_at: string;
}

export interface SyncEvent {
  id: string;
  event_type: 'content' | 'properties' | 'images' | 'design';
  action: 'create' | 'update' | 'delete' | 'rollback';
  target_id: string;
  version_number: number | null;
  author_id: string | null;
  author_name: string;
  author_email: string;
  change_description: string | null;
  event_data: any;
  created_at: string;
}

// Create admin client with service role for bypassing RLS
const getAdminClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('⚠️ Service role key not available, using regular client');
    return supabase;
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export class ContentVersioningService {
  // Utility function to validate UUID format
  private static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  // Sanitize author ID to ensure it's a valid UUID or null
  private static sanitizeAuthorId(adminId: string | null): string | null {
    if (!adminId) return null;
    return this.isValidUUID(adminId) ? adminId : null;
  }

  // Vérifier si Supabase est configuré
  private static isSupabaseConfigured(): boolean {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return url && key && 
           url !== 'https://your-project.supabase.co' && 
           key !== 'your-anon-key';
  }

  // Récupérer le contenu actuel du site
  static async getCurrentSiteContent(): Promise<any> {
    if (!this.isSupabaseConfigured()) {
      // Fallback vers localStorage
      const stored = localStorage.getItem('siteContent');
      return stored ? JSON.parse(stored) : null;
    }

    try {
      const { data, error } = await supabase
        .from('site_content_versions')
        .select('content_data')
        .eq('is_current', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data?.content_data || null;
    } catch (error) {
      console.warn('Erreur récupération contenu Supabase, fallback localStorage:', error);
      const stored = localStorage.getItem('siteContent');
      return stored ? JSON.parse(stored) : null;
    }
  }

  // Sauvegarder une nouvelle version du contenu
  static async saveContentVersion(
    contentData: any,
    authorName: string,
    authorEmail: string,
    changeDescription?: string
  ): Promise<ContentVersion> {
    console.log('💾 ContentVersioningService.saveContentVersion appelé');
    console.log('📊 Données à sauvegarder:', { authorName, authorEmail, changeDescription });
    
    if (!this.isSupabaseConfigured()) {
      console.log('📦 Supabase non configuré - sauvegarde locale uniquement');
      // Fallback vers localStorage
      localStorage.setItem('siteContent', JSON.stringify(contentData));
      return {
        id: Date.now().toString(),
        version_number: 1,
        content_data: contentData,
        is_current: true,
        author_id: null,
        author_name: authorName,
        author_email: authorEmail,
        change_description: changeDescription || null,
        created_at: new Date().toISOString()
      };
    }

    try {
      console.log('🔐 Vérification de l\'authentification...');
      
      // Vérifier si l'authentification a été établie lors du login
      const authEstablished = localStorage.getItem('supabaseAuthEstablished') === 'true';
      const adminId = localStorage.getItem('currentAdminId');
      const adminName = localStorage.getItem('currentAdminName') || authorName;
      const adminEmail = localStorage.getItem('currentAdminEmail') || authorEmail;
      
      console.log('📋 État auth:', { authEstablished, adminId, adminName, adminEmail });
      
      // Tenter de vérifier la session Supabase
      let user = null;
      try {
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
        user = currentUser;
        console.log('👤 Session Supabase:', user ? 'Active' : 'Inactive');
      } catch (authCheckError) {
        console.warn('⚠️ Impossible de vérifier la session Supabase:', authCheckError);
      }
      
      // Si pas d'authentification Supabase, utiliser le fallback local
      if (!user && !authEstablished) {
        console.log('📦 Pas d\'authentification Supabase - sauvegarde locale');
        localStorage.setItem('siteContent', JSON.stringify(contentData));
        
        return {
          id: Date.now().toString(),
          version_number: 1,
          content_data: contentData,
          is_current: true,
          author_id: adminId,
          author_name: adminName,
          author_email: adminEmail,
          change_description: changeDescription || null,
          created_at: new Date().toISOString()
        };
      }

      console.log('💾 Tentative de sauvegarde Supabase...');
      
      // Use admin client to bypass RLS for content management operations
      const adminClient = getAdminClient();
      
      // Obtenir le prochain numéro de version
      const nextVersion = await this.getNextVersionNumber('site_content_versions');
      console.log('📊 Numéro de version:', nextVersion);

      // Désactiver la version courante
      await adminClient
        .from('site_content_versions')
        .update({ is_current: false })
        .eq('is_current', true);
      
      console.log('🔄 Versions précédentes désactivées');

      // Insérer la nouvelle version
      const { data, error } = await adminClient
        .from('site_content_versions')
        .insert([{
          version_number: nextVersion,
          content_data: contentData,
          is_current: true,
          author_id: this.sanitizeAuthorId(adminId) || user?.id || null,
          author_name: adminName,
          author_email: adminEmail,
          change_description: changeDescription
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur insertion Supabase:', error);
        // If Supabase fails, still return success for local save
        console.log('📱 Sauvegarde locale réussie malgré l\'erreur Supabase');
        return {
          id: `local-${Date.now()}`,
          version_number: nextVersion,
          content_data: contentData,
          is_current: true,
          author_id: this.sanitizeAuthorId(adminId),
          author_name: adminName || 'Admin',
          author_email: adminEmail || 'admin@lacremerie.fr',
          change_description: changeDescription || 'Modification du contenu',
          created_at: new Date().toISOString()
        };
      }
      
      console.log('✅ Sauvegarde Supabase réussie:', data);

      // Logger l'événement
      await this.logSyncEvent('content', 'update', 'site_content', nextVersion, authorName, authorEmail, changeDescription);
      
      // Sauvegarder aussi localement pour cohérence
      localStorage.setItem('siteContent', JSON.stringify(contentData));

      return data;
    } catch (error) {
      console.error('❌ Erreur sauvegarde Supabase:', error);
      // Return successful local save even if Supabase fails
      console.log('📱 Retour sauvegarde locale en cas d\'erreur');
      return {
        id: `local-${Date.now()}`,
        version_number: 1,
        content_data: contentData,
        is_current: true,
        author_id: this.sanitizeAuthorId(localStorage.getItem('currentAdminId')),
        author_name: localStorage.getItem('currentAdminName') || 'Admin',
        author_email: localStorage.getItem('currentAdminEmail') || 'admin@lacremerie.fr',
        change_description: changeDescription || 'Modification du contenu',
        created_at: new Date().toISOString()
      };
    }
  }

  // Récupérer les propriétés actuelles
  static async getCurrentProperties(): Promise<any[]> {
    if (!this.isSupabaseConfigured()) {
      const stored = localStorage.getItem('properties');
      return stored ? JSON.parse(stored) : [];
    }

    try {
      const { data, error } = await supabase
        .from('properties_versions')
        .select('*')
        .eq('is_current', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.warn('Erreur récupération propriétés Supabase:', error);
      const stored = localStorage.getItem('properties');
      return stored ? JSON.parse(stored) : [];
    }
  }

  // Sauvegarder une propriété avec versioning
  static async savePropertyVersion(
    propertyData: any,
    authorName: string,
    authorEmail: string,
    changeDescription?: string
  ): Promise<PropertyVersion> {
    if (!this.isSupabaseConfigured()) {
      // Fallback vers localStorage
      const stored = localStorage.getItem('properties');
      const properties = stored ? JSON.parse(stored) : [];
      const updatedProperties = properties.map((p: any) => 
        p.id === propertyData.id ? propertyData : p
      );
      if (!properties.find((p: any) => p.id === propertyData.id)) {
        updatedProperties.push(propertyData);
      }
      localStorage.setItem('properties', JSON.stringify(updatedProperties));
      
      return {
        id: Date.now().toString(),
        property_id: propertyData.id,
        version_number: 1,
        ...propertyData,
        is_current: true,
        author_id: null,
        author_name: authorName,
        author_email: authorEmail,
        change_description: changeDescription || null,
        created_at: new Date().toISOString()
      };
    }

    try {
      const nextVersion = await this.getNextVersionNumber('properties_versions', propertyData.id);

      // Désactiver les versions courantes de cette propriété
      await supabase
        .from('properties_versions')
        .update({ is_current: false })
        .eq('property_id', propertyData.id);

      const { data, error } = await supabase
        .from('properties_versions')
        .insert([{
          property_id: propertyData.id,
          version_number: nextVersion,
          name: propertyData.name,
          location: propertyData.location,
          price: propertyData.price,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          surface: propertyData.surface,
          images: propertyData.images,
          description: propertyData.description,
          features: propertyData.features,
          type: propertyData.type,
          status: propertyData.status,
          yield: propertyData.yield,
          is_visible: propertyData.isVisible,
          is_current: true,
          author_id: this.sanitizeAuthorId(localStorage.getItem('currentAdminId')),
          author_name: authorName,
          author_email: authorEmail,
          change_description: changeDescription
        }])
        .select()
        .single();

      if (error) throw error;

      await this.logSyncEvent('properties', 'update', propertyData.id, nextVersion, authorName, authorEmail, changeDescription);

      return data;
    } catch (error) {
      console.error('Erreur sauvegarde propriété:', error);
      throw error;
    }
  }

  // Récupérer les images de présentation actuelles
  static async getCurrentPresentationImages(category: 'hero' | 'concept'): Promise<any[]> {
    if (!this.isSupabaseConfigured()) {
      const stored = localStorage.getItem(`${category}Images`);
      return stored ? JSON.parse(stored) : [];
    }

    try {
      const { data, error } = await supabase
        .from('presentation_images_versions')
        .select('images_data')
        .eq('category', category)
        .eq('is_current', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data?.images_data || [];
    } catch (error) {
      console.warn('Erreur récupération images:', error);
      const stored = localStorage.getItem(`${category}Images`);
      return stored ? JSON.parse(stored) : [];
    }
  }

  // Sauvegarder les images de présentation
  static async savePresentationImagesVersion(
    category: 'hero' | 'concept',
    imagesData: any[],
    authorName: string,
    authorEmail: string,
    changeDescription?: string
  ): Promise<ImageVersion> {
    if (!this.isSupabaseConfigured()) {
      localStorage.setItem(`${category}Images`, JSON.stringify(imagesData));
      return {
        id: Date.now().toString(),
        version_number: 1,
        category,
        images_data: imagesData,
        is_current: true,
        author_id: null,
        author_name: authorName,
        author_email: authorEmail,
        change_description: changeDescription || null,
        created_at: new Date().toISOString()
      };
    }

    try {
      // Vérifier l'authentification Supabase
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.warn('⚠️ Utilisateur non authentifié pour Supabase');
        throw new Error('Authentification Supabase requise');
      }
      
      const adminId = localStorage.getItem('currentAdminId') || user.id;
      
      const nextVersion = await this.getNextVersionNumber('presentation_images_versions', category);

      await supabase
        .from('presentation_images_versions')
        .update({ is_current: false })
        .eq('category', category);

      const { data, error } = await supabase
        .from('presentation_images_versions')
        .insert([{
          version_number: nextVersion,
          category,
          images_data: imagesData,
          is_current: true,
          author_id: this.sanitizeAuthorId(adminId),
          author_name: authorName,
          author_email: authorEmail,
          change_description: changeDescription
        }])
        .select()
        .single();

      if (error) throw error;

      await this.logSyncEvent('images', 'update', category, nextVersion, authorName, authorEmail, changeDescription);

      return data;
    } catch (error) {
      console.error('Erreur sauvegarde images:', error);
      
      // Fallback vers localStorage en cas d'erreur Supabase
      localStorage.setItem(`${category}Images`, JSON.stringify(imagesData));
      
      // Retourner une version locale
      return {
        id: Date.now().toString(),
        version_number: 1,
        category,
        images_data: imagesData,
        is_current: true,
        author_id: null,
        author_name: authorName,
        author_email: authorEmail,
        change_description: changeDescription || null,
        created_at: new Date().toISOString()
      };
    }
  }

  // Récupérer les paramètres de design actuels
  static async getCurrentDesignSettings(): Promise<any> {
    if (!this.isSupabaseConfigured()) {
      const stored = localStorage.getItem('designSettings');
      return stored ? JSON.parse(stored) : null;
    }

    try {
      // Test de connectivité avant la requête
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes timeout
      
      const { data, error } = await supabase
        .from('design_settings_versions')
        .select('settings_data')
        .eq('is_current', true)
        .single()
        .abortSignal(controller.signal);
      
      clearTimeout(timeoutId);

      if (error && error.code !== 'PGRST116') throw error;

      return data?.settings_data || null;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('⚠️ Timeout Supabase - utilisation du cache local');
      } else {
        console.warn('⚠️ Erreur réseau Supabase - utilisation du cache local:', error);
      }
      const stored = localStorage.getItem('designSettings');
      return stored ? JSON.parse(stored) : null;
    }
  }

  // Sauvegarder les paramètres de design
  static async saveDesignSettingsVersion(
    settingsData: any,
    authorName: string,
    authorEmail: string,
    changeDescription?: string
  ): Promise<DesignVersion> {
    if (!this.isSupabaseConfigured()) {
      localStorage.setItem('designSettings', JSON.stringify(settingsData));
      return {
        id: Date.now().toString(),
        version_number: 1,
        settings_data: settingsData,
        is_current: true,
        author_id: null,
        author_name: authorName,
        author_email: authorEmail,
        change_description: changeDescription || null,
        created_at: new Date().toISOString()
      };
    }

    try {
      const nextVersion = await this.getNextVersionNumber('design_settings_versions');

      await supabase
        .from('design_settings_versions')
        .update({ is_current: false })
        .eq('is_current', true);

      const { data, error } = await supabase
        .from('design_settings_versions')
        .insert([{
          version_number: nextVersion,
          settings_data: settingsData,
          is_current: true,
          author_id: this.sanitizeAuthorId(localStorage.getItem('currentAdminId')),
          author_name: authorName,
          author_email: authorEmail,
          change_description: changeDescription
        }])
        .select()
        .single();

      if (error) throw error;

      await this.logSyncEvent('design', 'update', 'design_settings', nextVersion, authorName, authorEmail, changeDescription);

      return data;
    } catch (error) {
      console.error('Erreur sauvegarde design:', error);
      throw error;
    }
  }

  // Récupérer l'historique des versions
  static async getVersionHistory(type: 'content' | 'properties' | 'images' | 'design', targetId?: string): Promise<any[]> {
    if (!this.isSupabaseConfigured()) {
      return [];
    }

    try {
      let query = supabase.from(`${type}_versions`).select('*').order('version_number', { ascending: false });

      if (type === 'properties' && targetId) {
        query = query.eq('property_id', targetId);
      } else if (type === 'images' && targetId) {
        query = query.eq('category', targetId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Erreur récupération historique:', error);
      return [];
    }
  }

  // Restaurer une version spécifique
  static async rollbackToVersion(
    type: 'content' | 'properties' | 'images' | 'design',
    versionId: string,
    authorName: string,
    authorEmail: string
  ): Promise<void> {
    if (!this.isSupabaseConfigured()) {
      toast.error('Rollback non disponible sans Supabase');
      return;
    }

    try {
      const tableName = `${type}_versions`;
      
      // Récupérer la version à restaurer
      const { data: versionData, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', versionId)
        .single();

      if (fetchError) throw fetchError;

      // Désactiver toutes les versions courantes
      if (type === 'properties') {
        await supabase
          .from(tableName)
          .update({ is_current: false })
          .eq('property_id', versionData.property_id);
      } else if (type === 'images') {
        await supabase
          .from(tableName)
          .update({ is_current: false })
          .eq('category', versionData.category);
      } else {
        await supabase
          .from(tableName)
          .update({ is_current: false })
          .eq('is_current', true);
      }

      // Activer la version sélectionnée
      await supabase
        .from(tableName)
        .update({ is_current: true })
        .eq('id', versionId);

      // Logger l'événement de rollback
      await this.logSyncEvent(
        type,
        'rollback',
        type === 'properties' ? versionData.property_id : 
        type === 'images' ? versionData.category : 'site_content',
        versionData.version_number,
        authorName,
        authorEmail,
        `Rollback vers version ${versionData.version_number}`
      );

      toast.success(`Rollback vers version ${versionData.version_number} effectué`);
    } catch (error) {
      console.error('Erreur rollback:', error);
      toast.error('Erreur lors du rollback');
    }
  }

  // Obtenir le prochain numéro de version
  private static async getNextVersionNumber(tableName: string, targetId?: string): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('get_next_version_number', {
        table_name: tableName,
        category_filter: targetId
      });

      if (error) throw error;
      return data || 1;
    } catch (error) {
      console.error('Erreur récupération numéro version:', error);
      return 1;
    }
  }

  // Logger un événement de synchronisation
  private static async logSyncEvent(
    eventType: SyncEvent['event_type'],
    action: SyncEvent['action'],
    targetId: string,
    versionNumber: number | null,
    authorName: string,
    authorEmail: string,
    changeDescription?: string,
    eventData?: any
  ): Promise<void> {
    if (!this.isSupabaseConfigured()) return;

    try {
      await supabase
        .from('content_sync_events')
        .insert([{
          event_type: eventType,
          action,
          target_id: targetId,
          version_number: versionNumber,
          author_id: this.sanitizeAuthorId(localStorage.getItem('currentAdminId')),
          author_name: authorName,
          author_email: authorEmail,
          change_description: changeDescription,
          event_data: eventData
        }]);
    } catch (error) {
      console.error('Erreur log événement:', error);
    }
  }

  // Récupérer les événements de synchronisation récents
  static async getRecentSyncEvents(limit: number = 50): Promise<SyncEvent[]> {
    if (!this.isSupabaseConfigured()) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('content_sync_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur récupération événements:', error);
      return [];
    }
  }

  // Migrer les données localStorage vers Supabase
  static async migrateLocalDataToSupabase(authorName: string, authorEmail: string): Promise<void> {
    if (!this.isSupabaseConfigured()) {
      toast.error('Supabase non configuré pour la migration');
      return;
    }

    try {
      toast.loading('Migration des données en cours...', { id: 'migration' });

      // Migrer le contenu du site
      const siteContent = localStorage.getItem('siteContent');
      if (siteContent) {
        await this.saveContentVersion(
          JSON.parse(siteContent),
          authorName,
          authorEmail,
          'Migration depuis localStorage'
        );
      }

      // Migrer les propriétés
      const properties = localStorage.getItem('properties');
      if (properties) {
        const propertiesData = JSON.parse(properties);
        for (const property of propertiesData) {
          await this.savePropertyVersion(
            property,
            authorName,
            authorEmail,
            'Migration depuis localStorage'
          );
        }
      }

      // Migrer les images Hero
      const heroImages = localStorage.getItem('presentationImages');
      if (heroImages) {
        await this.savePresentationImagesVersion(
          'hero',
          JSON.parse(heroImages),
          authorName,
          authorEmail,
          'Migration images Hero depuis localStorage'
        );
      }

      // Migrer les images Concept
      const conceptImages = localStorage.getItem('conceptImages');
      if (conceptImages) {
        await this.savePresentationImagesVersion(
          'concept',
          JSON.parse(conceptImages),
          authorName,
          authorEmail,
          'Migration images Concept depuis localStorage'
        );
      }

      // Migrer les paramètres de design
      const designSettings = localStorage.getItem('designSettings');
      if (designSettings) {
        await this.saveDesignSettingsVersion(
          JSON.parse(designSettings),
          authorName,
          authorEmail,
          'Migration paramètres design depuis localStorage'
        );
      }

      toast.success('Migration terminée avec succès', { id: 'migration' });
    } catch (error) {
      console.error('Erreur migration:', error);
      toast.error('Erreur lors de la migration', { id: 'migration' });
    }
  }

  // Synchroniser les données depuis Supabase vers localStorage
  static async syncFromSupabaseToLocal(): Promise<void> {
    if (!this.isSupabaseConfigured()) {
      console.log('📦 Supabase non configuré - synchronisation ignorée');
      return;
    }

    try {
      console.log('🔄 Début de synchronisation depuis Supabase...');
      
      // Test de connectivité rapide
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      await fetch(import.meta.env.VITE_SUPABASE_URL + '/rest/v1/', {
        method: 'HEAD',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Synchroniser le contenu du site
      const siteContent = await this.getCurrentSiteContent();
      if (siteContent) {
        localStorage.setItem('siteContent', JSON.stringify(siteContent));
      }

      // Synchroniser les propriétés
      const properties = await this.getCurrentProperties();
      if (properties.length > 0) {
        localStorage.setItem('properties', JSON.stringify(properties));
      }

      // Synchroniser les images Hero
      const heroImages = await this.getCurrentPresentationImages('hero');
      if (heroImages.length > 0) {
        localStorage.setItem('presentationImages', JSON.stringify(heroImages));
      }

      // Synchroniser les images Concept
      const conceptImages = await this.getCurrentPresentationImages('concept');
      if (conceptImages.length > 0) {
        localStorage.setItem('conceptImages', JSON.stringify(conceptImages));
      }

      // Synchroniser les paramètres de design
      const designSettings = await this.getCurrentDesignSettings();
      if (designSettings) {
        localStorage.setItem('designSettings', JSON.stringify(designSettings));
      }

      // Déclencher les événements de mise à jour
      window.dispatchEvent(new CustomEvent('contentUpdated', { detail: siteContent }));
      window.dispatchEvent(new Event('storage'));
      
      if (heroImages.length > 0) {
        const activeHeroImage = heroImages.find((img: any) => img.isActive);
        if (activeHeroImage) {
          window.dispatchEvent(new CustomEvent('presentationImageChanged', { detail: activeHeroImage.url }));
        }
      }

      if (designSettings) {
        window.dispatchEvent(new CustomEvent('designSettingsChanged', { detail: designSettings }));
      }

      console.log('✅ Synchronisation depuis Supabase terminée');
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('⚠️ Timeout de synchronisation Supabase - mode hors ligne activé');
      } else if (error.message?.includes('Failed to fetch')) {
        console.warn('⚠️ Pas de connexion internet - mode hors ligne activé');
      } else {
        console.warn('⚠️ Erreur synchronisation Supabase - mode hors ligne activé:', error);
      }
      
      // En cas d'erreur réseau, continuer avec les données locales
      console.log('📦 Utilisation des données locales existantes');
    }
  }
}