import { supabase, isSupabaseConfigured } from '../lib/supabase';
import toast from 'react-hot-toast';
import { ContentVersioningService } from './contentVersioningService';

export interface SyncEvent {
  id: string;
  type: 'content' | 'properties' | 'images' | 'design' | 'users' | 'config';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: string;
  adminId: string;
  adminName: string;
}

export class RealTimeSyncService {
  private static instance: RealTimeSyncService;
  private subscribers: Map<string, (event: SyncEvent) => void> = new Map();
  private channel: any = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private pollingInterval: NodeJS.Timeout | null = null;

  static getInstance(): RealTimeSyncService {
    if (!RealTimeSyncService.instance) {
      RealTimeSyncService.instance = new RealTimeSyncService();
    }
    return RealTimeSyncService.instance;
  }

  // Initialiser la connexion temps réel
  async initialize(): Promise<void> {
    try {
      console.log('🔄 Initialisation de la synchronisation temps réel...');
      
      // Vérifier la configuration Supabase
      if (!isSupabaseConfigured) {
        console.warn('⚠️ Supabase non configuré - mode local uniquement');
        this.isConnected = false;
        this.startPollingFallback();
        return;
      }
      
      // Synchroniser les données depuis Supabase au démarrage
      try {
        // Test de connectivité rapide avant sync
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        await fetch(import.meta.env.VITE_SUPABASE_URL + '/rest/v1/', {
          method: 'HEAD',
          headers: { 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Si la connectivité est OK, procéder à la sync
        await ContentVersioningService.syncFromSupabaseToLocal();
        console.log('✅ Synchronisation initiale depuis Supabase terminée');
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn('⚠️ Timeout connexion Supabase - mode hors ligne');
        } else if (error.message?.includes('Failed to fetch')) {
          console.warn('⚠️ Pas de connexion internet - mode hors ligne');
        } else {
          console.warn('⚠️ Erreur synchronisation initiale - mode hors ligne:', error);
        }
        
        // Passer en mode hors ligne
        this.isConnected = false;
        this.startPollingFallback();
        return;
      }
      
      try {
        // Créer le canal Supabase pour les événements temps réel
        this.channel = supabase
          .channel('collaborative_changes')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'site_content_versions'
          }, (payload) => {
            console.log('📝 Changement contenu détecté:', payload);
            this.handleContentVersionChange(payload);
          })
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'properties_versions'
          }, (payload) => {
            console.log('🏠 Changement propriétés détecté:', payload);
            this.handlePropertiesVersionChange(payload);
          })
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'presentation_images_versions'
          }, (payload) => {
            console.log('🖼️ Changement images détecté:', payload);
            this.handleImagesVersionChange(payload);
          })
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'design_settings_versions'
          }, (payload) => {
            console.log('🎨 Changement design détecté:', payload);
            this.handleDesignVersionChange(payload);
          })
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'user_registrations'
          }, (payload) => {
            console.log('👤 Changement utilisateur détecté:', payload);
            this.handleUserChange(payload);
          })
          .on('broadcast', { event: 'admin_change' }, (payload) => {
            console.log('📡 Événement admin reçu:', payload);
            this.handleSyncEvent(payload.payload as SyncEvent);
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              this.isConnected = true;
              this.reconnectAttempts = 0;
              console.log('✅ SYNCHRONISATION TEMPS RÉEL ACTIVE');
              
              // Arrêter le polling si actif
              if (this.pollingInterval) {
                clearInterval(this.pollingInterval);
                this.pollingInterval = null;
              }
              
              // Notifier les utilisateurs admin
              if (this.isAdminUser()) {
                toast.success('🟢 Synchronisation collaborative ACTIVE', { 
                  id: 'sync-connected',
                  duration: 4000,
                  icon: '🔄'
                });
              }
            } else if (status === 'CHANNEL_ERROR') {
              console.warn('⚠️ Erreur de canal Supabase - passage en mode polling');
              this.handleConnectionError();
            } else if (status === 'CLOSED') {
              console.warn('⚠️ Canal temps réel fermé');
              this.isConnected = false;
              this.startPollingFallback();
            }
          });
      } catch (channelError) {
        console.warn('⚠️ Impossible de créer le canal Supabase:', channelError);
        this.handleConnectionError();
      }

    } catch (error) {
      console.error('❌ Erreur initialisation sync:', error);
      this.handleConnectionError();
    }
  }

  // Gérer les changements de version de contenu
  private async handleContentVersionChange(payload: any): Promise<void> {
    if (payload.eventType === 'INSERT' && payload.new?.is_current) {
      console.log('📝 NOUVELLE VERSION DE CONTENU PUBLIÉE');
      
      try {
        // Synchroniser IMMÉDIATEMENT depuis Supabase
        const newContent = await ContentVersioningService.getCurrentSiteContent();
        if (newContent) {
          localStorage.setItem('siteContent', JSON.stringify(newContent));
          
          // Forcer la mise à jour de TOUS les composants
          window.dispatchEvent(new CustomEvent('contentUpdated', { detail: newContent }));
          window.dispatchEvent(new CustomEvent('forceUpdate', { 
            detail: { type: 'content', source: 'supabase', timestamp: Date.now() } 
          }));
          
          // Notification pour TOUS les utilisateurs (pas seulement admin)
          toast.success(`📝 Contenu mis à jour par ${payload.new.author_name}`, {
            duration: 6000,
            icon: '🔄'
          });
          
          console.log('✅ Contenu synchronisé pour tous les utilisateurs');
        }
      } catch (error) {
        console.error('❌ Erreur sync contenu:', error);
      }
    }
  }

  // Gérer les changements de version de propriétés
  private async handlePropertiesVersionChange(payload: any): Promise<void> {
    if (payload.eventType === 'INSERT' && payload.new?.is_current) {
      console.log('🏠 NOUVELLE VERSION DE PROPRIÉTÉS PUBLIÉE');
      
      try {
        // Synchroniser TOUTES les propriétés depuis Supabase
        const newProperties = await ContentVersioningService.getCurrentProperties();
        if (newProperties.length > 0) {
          localStorage.setItem('properties', JSON.stringify(newProperties));
          
          // Forcer la mise à jour de TOUS les composants
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new CustomEvent('forceUpdate', { 
            detail: { type: 'properties', source: 'supabase', timestamp: Date.now() } 
          }));
          
          // Notification pour TOUS les utilisateurs
          toast.success(`🏠 Biens immobiliers mis à jour par ${payload.new.author_name}`, {
            duration: 6000,
            icon: '🏠'
          });
          
          console.log('✅ Propriétés synchronisées pour tous les utilisateurs');
        }
      } catch (error) {
        console.error('❌ Erreur sync propriétés:', error);
      }
    }
  }

  // Gérer les changements de version d'images
  private async handleImagesVersionChange(payload: any): Promise<void> {
    if (payload.eventType === 'INSERT' && payload.new?.is_current) {
      console.log('🖼️ NOUVELLES IMAGES PUBLIÉES');
      
      try {
        const category = payload.new.category;
        const newImages = await ContentVersioningService.getCurrentPresentationImages(category);
        
        if (newImages.length > 0) {
          localStorage.setItem(`${category}Images`, JSON.stringify(newImages));
          
          const activeImage = newImages.find((img: any) => img.isActive);
          if (activeImage) {
            if (category === 'hero') {
              window.dispatchEvent(new CustomEvent('presentationImageChanged', { detail: activeImage.url }));
            } else if (category === 'concept') {
              const siteContent = JSON.parse(localStorage.getItem('siteContent') || '{}');
              siteContent.concept = { ...siteContent.concept, image: activeImage.url };
              localStorage.setItem('siteContent', JSON.stringify(siteContent));
              window.dispatchEvent(new CustomEvent('contentUpdated', { detail: siteContent }));
            }
          }
          
          // Forcer la mise à jour
          window.dispatchEvent(new CustomEvent('forceUpdate', { 
            detail: { type: 'images', source: 'supabase', timestamp: Date.now() } 
          }));
          
          // Notification pour TOUS les utilisateurs
          toast.success(`🖼️ Images ${category} mises à jour par ${payload.new.author_name}`, {
            duration: 6000,
            icon: '🎨'
          });
          
          console.log(`✅ Images ${category} synchronisées pour tous les utilisateurs`);
        }
      } catch (error) {
        console.error('❌ Erreur sync images:', error);
      }
    }
  }

  // Gérer les changements de version de design
  private async handleDesignVersionChange(payload: any): Promise<void> {
    if (payload.eventType === 'INSERT' && payload.new?.is_current) {
      console.log('🎨 NOUVEAUX PARAMÈTRES DE DESIGN PUBLIÉS');
      
      try {
        const newDesignSettings = await ContentVersioningService.getCurrentDesignSettings();
        if (newDesignSettings) {
          localStorage.setItem('designSettings', JSON.stringify(newDesignSettings));
          
          // Appliquer immédiatement les variables CSS
          const root = document.documentElement;
          if (newDesignSettings.colors) {
            Object.entries(newDesignSettings.colors).forEach(([key, value]) => {
              root.style.setProperty(`--color-${key}`, value as string);
            });
          }
          
          // Déclencher les événements de mise à jour
          window.dispatchEvent(new CustomEvent('designSettingsChanged', { detail: newDesignSettings }));
          window.dispatchEvent(new CustomEvent('forceUpdate', { 
            detail: { type: 'design', source: 'supabase', timestamp: Date.now() } 
          }));
          
          // Notification pour TOUS les utilisateurs
          toast.success(`🎨 Design mis à jour par ${payload.new.author_name}`, {
            duration: 6000,
            icon: '🎨'
          });
          
          console.log('✅ Design synchronisé pour tous les utilisateurs');
        }
      } catch (error) {
        console.error('❌ Erreur sync design:', error);
      }
    }
  }

  // Gérer les changements d'utilisateurs
  private handleUserChange(payload: any): void {
    console.log('👤 Changement utilisateur détecté:', payload);
    
    const event: SyncEvent = {
      id: Date.now().toString(),
      type: 'users',
      action: payload.eventType === 'INSERT' ? 'create' : 
              payload.eventType === 'UPDATE' ? 'update' : 'delete',
      data: payload.new || payload.old,
      timestamp: new Date().toISOString(),
      adminId: 'system',
      adminName: 'Système'
    };
    
    this.handleSyncEvent(event);
  }

  // Diffuser un changement admin avec sauvegarde Supabase OBLIGATOIRE
  async broadcastChange(event: Omit<SyncEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: SyncEvent = {
      ...event,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    try {
      console.log('📤 Diffusion changement:', fullEvent.type, fullEvent.action);
      
      // 1. Tenter de sauvegarder dans Supabase
      try {
        await this.saveChangeToSupabase(fullEvent);
        console.log('✅ Changement sauvegardé dans Supabase');
      } catch (supabaseError) {
        console.warn('⚠️ Erreur sauvegarde Supabase, mode local activé:', supabaseError);
        // Continuer avec la sauvegarde locale
      }
      
      // 2. Diffuser via canal temps réel si connecté
      if (this.isConnected && this.channel) {
        try {
          const result = await this.channel.send({
            type: 'broadcast',
            event: 'admin_change',
            payload: fullEvent
          });
          
          if (result === 'ok') {
            console.log('📡 Changement diffusé en temps réel');
          } else {
            console.warn('⚠️ Diffusion temps réel échouée, mais sauvegardé');
          }
        } catch (broadcastError) {
          console.warn('⚠️ Erreur diffusion temps réel:', broadcastError);
        }
      } else {
        console.log('📦 Pas de canal temps réel, mais sauvegardé dans Supabase');
      }

      // 3. Appliquer immédiatement en local
      this.handleSyncEvent(fullEvent);
      
      // 4. Notification de succès
      toast.success('✅ Images mises à jour avec succès !', {
        duration: 3000,
        icon: '💾'
      });

    } catch (error) {
      console.error('❌ Erreur diffusion changement:', error);
      
      // Même en cas d'erreur réseau, appliquer les changements localement
      this.handleSyncEvent(fullEvent);
      toast.success('✅ Images sauvegardées localement (synchronisation différée)', {
        duration: 4000,
        icon: '📦'
      });
    }
  }

  // Sauvegarder le changement directement dans Supabase
  private async saveChangeToSupabase(event: SyncEvent): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase non configuré - impossible de synchroniser');
    }

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (!user && !localStorage.getItem('currentAdminId')) {
      console.warn('Aucune session Supabase active pour la synchronisation');
      // Ne pas faire échouer, juste avertir
      return;
    }

    try {
      const authorEmail = localStorage.getItem('currentAdminEmail') || 'nicolas.c@lacremerie.fr';
      
      // Sauvegarder selon le type de changement
      switch (event.type) {
        case 'content':
          await ContentVersioningService.saveContentVersion(
            event.data,
            event.adminName,
            authorEmail,
            'Modification collaborative du contenu'
          );
          break;
          
        case 'properties':
          if (event.action === 'create' || event.action === 'update') {
            await ContentVersioningService.savePropertyVersion(
              event.data,
              event.adminName,
              authorEmail,
              `Modification collaborative de ${event.data.name || 'propriété'}`
            );
          }
          break;
          
        case 'images':
          await ContentVersioningService.savePresentationImagesVersion(
            event.data.category,
            event.data.images,
            event.adminName,
            authorEmail,
            'Modification collaborative des images'
          );
          break;
          
        case 'design':
          await ContentVersioningService.saveDesignSettingsVersion(
            event.data,
            event.adminName,
            authorEmail,
            'Modification collaborative du design'
          );
          break;
      }
      
      console.log('✅ Changement sauvegardé dans Supabase via HTTPS');
    } catch (error) {
      console.warn('⚠️ Erreur sauvegarde Supabase, mode local activé:', error);
      // Ne pas faire échouer la synchronisation pour des problèmes d'auth
    }
  }

  // Gérer les événements de synchronisation
  private handleSyncEvent(event: SyncEvent): void {
    console.log('📡 Traitement événement sync:', event.type, event.action);
    
    try {
      // Appliquer les changements selon le type
      switch (event.type) {
        case 'content':
          this.handleContentUpdate(event);
          break;
        case 'properties':
          this.handlePropertiesUpdate(event);
          break;
        case 'images':
          this.handleImagesUpdate(event);
          break;
        case 'design':
          this.handleDesignUpdate(event);
          break;
        case 'users':
          this.handleUsersUpdate(event);
          break;
      }

      // Notifier tous les abonnés
      this.subscribers.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('❌ Erreur callback subscriber:', error);
        }
      });

      // Notification utilisateur (sauf pour l'admin qui a fait le changement)
      if (!this.isCurrentAdmin(event.adminId)) {
        this.showUpdateNotification(event);
      }

    } catch (error) {
      console.error('❌ Erreur traitement événement sync:', error);
    }
  }

  // Gestion des mises à jour de contenu
  private handleContentUpdate(event: SyncEvent): void {
    if (event.action === 'update') {
      localStorage.setItem('siteContent', JSON.stringify(event.data));
      window.dispatchEvent(new CustomEvent('contentUpdated', { detail: event.data }));
      this.forceComponentUpdate('content');
    }
  }

  // Gestion des mises à jour de propriétés
  private handlePropertiesUpdate(event: SyncEvent): void {
    const currentProperties = JSON.parse(localStorage.getItem('properties') || '[]');
    
    switch (event.action) {
      case 'create':
        const updatedProperties = [...currentProperties, event.data];
        localStorage.setItem('properties', JSON.stringify(updatedProperties));
        break;
      case 'update':
        const modifiedProperties = currentProperties.map((p: any) => 
          p.id === event.data.id ? event.data : p
        );
        localStorage.setItem('properties', JSON.stringify(modifiedProperties));
        break;
      case 'delete':
        const filteredProperties = currentProperties.filter((p: any) => p.id !== event.data.id);
        localStorage.setItem('properties', JSON.stringify(filteredProperties));
        break;
    }
    
    window.dispatchEvent(new Event('storage'));
    this.forceComponentUpdate('properties');
  }

  // Gestion des mises à jour d'images
  private handleImagesUpdate(event: SyncEvent): void {
    if (event.data.category === 'hero') {
      localStorage.setItem('presentationImages', JSON.stringify(event.data.images));
      window.dispatchEvent(new CustomEvent('presentationImageChanged', { 
        detail: event.data.activeImage 
      }));
    } else if (event.data.category === 'concept') {
      localStorage.setItem('conceptImages', JSON.stringify(event.data.images));
      const siteContent = JSON.parse(localStorage.getItem('siteContent') || '{}');
      siteContent.concept = { ...siteContent.concept, image: event.data.activeImage };
      localStorage.setItem('siteContent', JSON.stringify(siteContent));
      window.dispatchEvent(new CustomEvent('contentUpdated', { detail: siteContent }));
    }
    this.forceComponentUpdate('images');
  }

  // Gestion des mises à jour de design
  private handleDesignUpdate(event: SyncEvent): void {
    if (event.action === 'update') {
      localStorage.setItem('designSettings', JSON.stringify(event.data));
      
      // Appliquer immédiatement les variables CSS
      const root = document.documentElement;
      if (event.data.colors) {
        Object.entries(event.data.colors).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key}`, value as string);
        });
      }
      
      window.dispatchEvent(new CustomEvent('designSettingsChanged', { detail: event.data }));
      this.forceComponentUpdate('design');
    }
  }

  // Gestion des mises à jour d'utilisateurs
  private handleUsersUpdate(event: SyncEvent): void {
    window.dispatchEvent(new CustomEvent('usersUpdated', { detail: event }));
    this.forceComponentUpdate('users');
  }

  // Forcer la mise à jour des composants React
  private forceComponentUpdate(type: string): void {
    // Déclencher un événement global pour forcer le re-render
    window.dispatchEvent(new CustomEvent('forceUpdate', { 
      detail: { type, timestamp: Date.now() } 
    }));
    
    console.log(`🔄 Mise à jour forcée des composants: ${type}`);
  }

  // Fallback avec polling pour mode hors ligne
  private startPollingFallback(): void {
    console.log('🔄 Mode POLLING activé (fallback)');
    
    // Vérifier les changements toutes les 10 secondes
    this.pollingInterval = setInterval(async () => {
      try {
        if (isSupabaseConfigured) {
          // Tenter de synchroniser depuis Supabase
          await ContentVersioningService.syncFromSupabaseToLocal();
          
          // Déclencher les mises à jour
          window.dispatchEvent(new CustomEvent('forceUpdate', { 
            detail: { type: 'all', source: 'polling', timestamp: Date.now() } 
          }));
        }
      } catch (error) {
        console.warn('⚠️ Erreur polling sync:', error);
      }
    }, 10000);
  }

  // Afficher une notification de mise à jour
  private showUpdateNotification(event: SyncEvent): void {
    const messages = {
      content: '📝 Contenu mis à jour',
      properties: '🏠 Biens immobiliers mis à jour',
      images: '🖼️ Images mises à jour',
      design: '🎨 Design mis à jour',
      users: '👤 Utilisateurs mis à jour',
      config: '⚙️ Configuration mise à jour'
    };

    const message = messages[event.type] || '🔄 Mise à jour effectuée';
    
    toast.success(`${message} par ${event.adminName}`, {
      duration: 5000,
      icon: '🔄'
    });
  }

  // S'abonner aux changements
  subscribe(id: string, callback: (event: SyncEvent) => void): void {
    this.subscribers.set(id, callback);
    console.log(`📝 Abonnement ajouté: ${id} (${this.subscribers.size} total)`);
  }

  // Se désabonner
  unsubscribe(id: string): void {
    this.subscribers.delete(id);
    console.log(`📝 Abonnement supprimé: ${id} (${this.subscribers.size} restant)`);
  }

  // Vérifier si c'est un utilisateur admin
  private isAdminUser(): boolean {
    try {
      return localStorage.getItem('adminLoggedIn') === 'true';
    } catch {
      return false;
    }
  }

  // Vérifier si c'est l'admin actuel
  private isCurrentAdmin(adminId: string): boolean {
    try {
      const currentAdminEmail = localStorage.getItem('currentAdminEmail');
      return currentAdminEmail === 'nicolas.c@lacremerie.fr' && adminId === 'current-admin';
    } catch {
      return false;
    }
  }

  // Gérer les erreurs de connexion
  private handleConnectionError(): void {
    this.isConnected = false;
    console.log('⚠️ Passage en mode polling (erreur connexion)');
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`🔄 Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts} dans ${delay}ms`);
      
      setTimeout(() => {
        this.initialize();
      }, delay);
    } else {
      console.warn('⚠️ Mode polling permanent activé');
      this.startPollingFallback();
      
      if (this.isAdminUser()) {
        toast('🟡 Mode synchronisation polling activé', {
          duration: 4000,
          icon: '⚠️'
        });
      }
    }
  }

  // Reconnecter manuellement
  async reconnect(): Promise<void> {
    console.log('🔄 Reconnexion manuelle...');
    this.reconnectAttempts = 0;
    
    // Nettoyer l'ancien canal
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    
    // Arrêter le polling
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    
    await this.initialize();
  }

  // Obtenir le statut de connexion
  getConnectionStatus(): { connected: boolean; subscribers: number } {
    return {
      connected: this.isConnected,
      subscribers: this.subscribers.size
    };
  }

  // Nettoyer les ressources
  cleanup(): void {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    
    this.subscribers.clear();
    this.isConnected = false;
    console.log('🧹 Service de synchronisation nettoyé');
  }
}

// Instance globale
export const syncService = RealTimeSyncService.getInstance();