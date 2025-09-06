import { supabase } from '../lib/supabase';
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
      
      // Synchroniser les données depuis Supabase au démarrage
      await ContentVersioningService.syncFromSupabaseToLocal();
      
      // Vérifier la configuration Supabase
      if (!this.isSupabaseConfigured()) {
        console.warn('⚠️ Supabase non configuré - synchronisation temps réel désactivée');
        this.isConnected = false;
        this.startPollingFallback();
        return;
      }
      
      try {
        // Créer le canal Supabase pour les événements temps réel
        this.channel = supabase
          .channel('admin_changes')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'user_registrations'
          }, (payload) => {
            console.log('📊 Changement utilisateur détecté:', payload);
            this.handleUserChange(payload);
          })
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
          .on('broadcast', { event: 'admin_change' }, (payload) => {
            console.log('📡 Événement admin reçu:', payload);
            this.handleSyncEvent(payload.payload as SyncEvent);
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              this.isConnected = true;
              this.reconnectAttempts = 0;
              console.log('✅ Synchronisation temps réel ACTIVE');
              
              // Notifier les utilisateurs admin
              if (this.isAdminUser()) {
                toast.success('🔄 Synchronisation temps réel ACTIVE', { 
                  id: 'sync-connected',
                  duration: 3000,
                  icon: '🟢'
                });
              }
            } else if (status === 'CHANNEL_ERROR') {
              console.warn('⚠️ Erreur de canal Supabase - passage en mode hors ligne');
              this.handleConnectionError();
            } else if (status === 'CLOSED') {
              console.warn('⚠️ Canal temps réel fermé');
              this.isConnected = false;
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
    if (payload.eventType === 'UPDATE' && payload.new?.is_current) {
      console.log('📝 Nouvelle version de contenu active');
      
      // Synchroniser depuis Supabase
      const newContent = await ContentVersioningService.getCurrentSiteContent();
      if (newContent) {
        localStorage.setItem('siteContent', JSON.stringify(newContent));
        window.dispatchEvent(new CustomEvent('contentUpdated', { detail: newContent }));
        
        // Notification pour les utilisateurs non-admin
        if (!this.isAdminUser()) {
          this.showMobileUpdateNotification('content');
        }
      }
    }
  }

  // Gérer les changements de version de propriétés
  private async handlePropertiesVersionChange(payload: any): Promise<void> {
    if (payload.eventType === 'UPDATE' && payload.new?.is_current) {
      console.log('🏠 Nouvelle version de propriétés active');
      
      // Synchroniser toutes les propriétés depuis Supabase
      const newProperties = await ContentVersioningService.getCurrentProperties();
      if (newProperties.length > 0) {
        localStorage.setItem('properties', JSON.stringify(newProperties));
        window.dispatchEvent(new Event('storage'));
        
        if (!this.isAdminUser()) {
          this.showMobileUpdateNotification('properties');
        }
      }
    }
  }

  // Gérer les changements de version d'images
  private async handleImagesVersionChange(payload: any): Promise<void> {
    if (payload.eventType === 'UPDATE' && payload.new?.is_current) {
      console.log('🖼️ Nouvelle version d\'images active');
      
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
        
        if (!this.isAdminUser()) {
          this.showMobileUpdateNotification('images');
        }
      }
    }
  }

  // Gérer les changements de version de design
  private async handleDesignVersionChange(payload: any): Promise<void> {
    if (payload.eventType === 'UPDATE' && payload.new?.is_current) {
      console.log('🎨 Nouvelle version de design active');
      
      const newDesignSettings = await ContentVersioningService.getCurrentDesignSettings();
      if (newDesignSettings) {
        localStorage.setItem('designSettings', JSON.stringify(newDesignSettings));
        window.dispatchEvent(new CustomEvent('designSettingsChanged', { detail: newDesignSettings }));
        
        // Appliquer les variables CSS
        const root = document.documentElement;
        if (newDesignSettings.colors) {
          Object.entries(newDesignSettings.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value as string);
          });
        }
        
        if (!this.isAdminUser()) {
          this.showMobileUpdateNotification('design');
        }
      }
    }
  }

  // Gérer les changements d'utilisateurs en temps réel
  private handleUserChange(payload: any): void {
    console.log('👤 Changement utilisateur:', payload);
    
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

  // Gérer les événements de synchronisation
  private handleSyncEvent(event: SyncEvent): void {
    console.log('📡 Événement sync reçu:', event);
    
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
        case 'config':
          this.handleConfigUpdate(event);
          break;
      }

      // Notifier tous les abonnés
      this.subscribers.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Erreur callback subscriber:', error);
        }
      });

      // Notification utilisateur (sauf pour l'admin qui a fait le changement)
      if (!this.isCurrentAdmin(event.adminId)) {
        this.showUpdateNotification(event);
      }

    } catch (error) {
      console.error('Erreur traitement événement sync:', error);
    }
  }

  // Diffuser un changement admin
  async broadcastChange(event: Omit<SyncEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: SyncEvent = {
      ...event,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    try {
      // Diffuser via Supabase
      if (this.isConnected && this.channel) {
        const result = await this.channel.send({
          type: 'broadcast',
          event: 'admin_change',
          payload: fullEvent
        });
        
        if (result === 'ok') {
          console.log('📤 Changement diffusé avec succès:', fullEvent.type);
        } else {
          console.warn('⚠️ Échec diffusion, utilisation du fallback');
          this.storeEventForPolling(fullEvent);
        }
      } else {
        console.log('📦 Stockage local (pas de connexion temps réel)');
        // Fallback: stocker localement pour le polling
        this.storeEventForPolling(fullEvent);
      }

      // Appliquer immédiatement en local
      this.handleSyncEvent(fullEvent);

    } catch (error) {
      console.error('Erreur diffusion changement:', error);
      // Fallback: stocker pour retry
      this.storeEventForPolling(fullEvent);
    }
  }

  // Gestion des mises à jour de contenu
  private handleContentUpdate(event: SyncEvent): void {
    if (event.action === 'update') {
      localStorage.setItem('siteContent', JSON.stringify(event.data));
      window.dispatchEvent(new CustomEvent('contentUpdated', { detail: event.data }));
      
      // Forcer le re-render des composants React
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
      this.forceComponentUpdate('images');
    } else if (event.data.category === 'concept') {
      localStorage.setItem('conceptImages', JSON.stringify(event.data.images));
      const siteContent = JSON.parse(localStorage.getItem('siteContent') || '{}');
      siteContent.concept = { ...siteContent.concept, image: event.data.activeImage };
      localStorage.setItem('siteContent', JSON.stringify(siteContent));
      window.dispatchEvent(new CustomEvent('contentUpdated', { detail: siteContent }));
      this.forceComponentUpdate('images');
    }
  }

  // Gestion des mises à jour de design
  private handleDesignUpdate(event: SyncEvent): void {
    if (event.action === 'update') {
      localStorage.setItem('designSettings', JSON.stringify(event.data));
      window.dispatchEvent(new CustomEvent('designSettingsChanged', { detail: event.data }));
      
      // Appliquer les variables CSS
      const root = document.documentElement;
      if (event.data.colors) {
        Object.entries(event.data.colors).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key}`, value as string);
        });
      }
      this.forceComponentUpdate('design');
    }
  }

  // Gestion des mises à jour d'utilisateurs
  private handleUsersUpdate(event: SyncEvent): void {
    // Recharger la liste des utilisateurs si on est dans l'admin
    window.dispatchEvent(new CustomEvent('usersUpdated', { detail: event }));
    this.forceComponentUpdate('users');
  }

  // Gestion des mises à jour de configuration
  private handleConfigUpdate(event: SyncEvent): void {
    if (event.data.type === 'email') {
      localStorage.setItem('emailSettings', JSON.stringify(event.data.settings));
    } else if (event.data.type === 'seo') {
      localStorage.setItem('seoSettings', JSON.stringify(event.data.settings));
    }
    
    window.dispatchEvent(new CustomEvent('configUpdated', { detail: event.data }));
    this.forceComponentUpdate('config');
  }

  // Forcer la mise à jour des composants React
  private forceComponentUpdate(type: string): void {
    // Déclencher un événement global pour forcer le re-render
    window.dispatchEvent(new CustomEvent('forceUpdate', { 
      detail: { type, timestamp: Date.now() } 
    }));
    
    // Notification visuelle pour les utilisateurs mobiles
    if (this.isMobileDevice() && !this.isAdminUser()) {
      this.showMobileUpdateNotification(type);
    }
  }

  // Détecter si c'est un appareil mobile
  private isMobileDevice(): boolean {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Notification spéciale pour mobile
  private showMobileUpdateNotification(type: string): void {
    const messages = {
      content: '📝 Contenu mis à jour',
      properties: '🏠 Nouveaux biens disponibles',
      images: '🖼️ Images mises à jour',
      design: '🎨 Apparence mise à jour',
      users: '👥 Données utilisateurs mises à jour',
      config: '⚙️ Configuration mise à jour'
    };

    const message = messages[type as keyof typeof messages] || '🔄 Mise à jour effectuée';
    
    // Toast spécial pour mobile avec durée plus longue
    toast.success(message, {
      duration: 4000,
      icon: '📱',
      style: {
        background: '#1F2937',
        color: '#F3F4F6',
        fontSize: '14px',
        padding: '12px 16px'
      }
    });
  }

  // S'abonner aux changements
  subscribe(id: string, callback: (event: SyncEvent) => void): void {
    this.subscribers.set(id, callback);
  }

  // Se désabonner
  unsubscribe(id: string): void {
    this.subscribers.delete(id);
  }

  // Afficher une notification de mise à jour
  private showUpdateNotification(event: SyncEvent): void {
    const messages = {
      content: 'Contenu mis à jour',
      properties: 'Biens immobiliers mis à jour',
      images: 'Images mises à jour',
      design: 'Design mis à jour',
      users: 'Utilisateurs mis à jour',
      config: 'Configuration mise à jour'
    };

    const message = messages[event.type] || 'Mise à jour effectuée';
    
    toast.success(`${message} par ${event.adminName}`, {
      duration: 3000,
      icon: '🔄'
    });
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

  // Vérifier si Supabase est configuré
  private isSupabaseConfigured(): boolean {
    try {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      return url && key && 
             url !== 'https://your-project.supabase.co' && 
             key !== 'your-anon-key';
    } catch {
      return false;
    }
  }

  // Fallback avec polling
  private startPollingFallback(): void {
    console.log('🔄 Mode POLLING activé (fallback)');
    
    const pollInterval = setInterval(() => {
      this.checkForStoredEvents();
    }, 5000); // Vérifier toutes les 5 secondes
    
    // Nettoyer l'intervalle si la connexion se rétablit
    const checkConnection = setInterval(() => {
      if (this.isConnected) {
        clearInterval(pollInterval);
        clearInterval(checkConnection);
        console.log('✅ Connexion rétablie, arrêt du polling');
      }
    }, 10000);
  }

  // Stocker un événement pour le polling
  private storeEventForPolling(event: SyncEvent): void {
    try {
      const stored = localStorage.getItem('pendingEvents') || '[]';
      const events = JSON.parse(stored);
      events.push(event);
      
      // Garder seulement les 50 derniers événements
      if (events.length > 50) {
        events.splice(0, events.length - 50);
      }
      
      localStorage.setItem('pendingEvents', JSON.stringify(events));
    } catch (error) {
      console.error('Erreur stockage événement:', error);
    }
  }

  // Vérifier les événements stockés
  private checkForStoredEvents(): void {
    try {
      const stored = localStorage.getItem('pendingEvents');
      if (!stored) return;
      
      const events = JSON.parse(stored);
      const lastProcessed = localStorage.getItem('lastProcessedEvent') || '0';
      
      events.forEach((event: SyncEvent) => {
        if (event.timestamp > lastProcessed) {
          this.handleSyncEvent(event);
          localStorage.setItem('lastProcessedEvent', event.timestamp);
        }
      });
    } catch (error) {
      console.error('Erreur vérification événements:', error);
    }
  }

  // Gérer les erreurs de connexion
  private handleConnectionError(): void {
    this.isConnected = false;
    console.log('⚠️ Passage en mode hors ligne');
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`🔄 Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts} dans ${delay}ms`);
      
      setTimeout(() => {
        this.initialize();
      }, delay);
    } else {
      console.warn('⚠️ Mode hors ligne permanent activé');
      this.startPollingFallback();
      
      if (this.isAdminUser()) {
        toast('🔴 Mode hors ligne activé', {
          duration: 3000,
          icon: '⚠️'
        });
      }
    }
  }

  // Nettoyer les ressources
  cleanup(): void {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.subscribers.clear();
    this.isConnected = false;
  }

  // Déconnecter manuellement
  disconnect(): void {
    console.log('🔴 Passage en mode hors ligne (manuel)');
    this.isConnected = false;
    
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    
    // Démarrer le mode polling comme fallback
    this.startPollingFallback();
  }

  // Reconnecter manuellement
  async reconnect(): Promise<void> {
    console.log('🟡 Passage en mode en ligne (manuel)');
    this.reconnectAttempts = 0; // Reset des tentatives
    
    // Nettoyer l'ancien canal si il existe
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
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
}

// Instance globale
export const syncService = RealTimeSyncService.getInstance();