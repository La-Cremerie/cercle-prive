import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

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
      
      // Vérifier la configuration Supabase
      if (!this.isSupabaseConfigured()) {
        console.warn('⚠️ Supabase non configuré - utilisation du mode polling');
        this.startPollingFallback();
        return;
      }
      
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
            console.error('❌ Erreur de canal temps réel');
            this.handleConnectionError();
          } else if (status === 'CLOSED') {
            console.warn('⚠️ Canal temps réel fermé');
            this.isConnected = false;
          }
        });

    } catch (error) {
      console.error('❌ Erreur initialisation sync:', error);
      this.handleConnectionError();
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
    }
  }

  // Gestion des mises à jour d'utilisateurs
  private handleUsersUpdate(event: SyncEvent): void {
    // Recharger la liste des utilisateurs si on est dans l'admin
    window.dispatchEvent(new CustomEvent('usersUpdated', { detail: event }));
  }

  // Gestion des mises à jour de configuration
  private handleConfigUpdate(event: SyncEvent): void {
    if (event.data.type === 'email') {
      localStorage.setItem('emailSettings', JSON.stringify(event.data.settings));
    } else if (event.data.type === 'seo') {
      localStorage.setItem('seoSettings', JSON.stringify(event.data.settings));
    }
    
    window.dispatchEvent(new CustomEvent('configUpdated', { detail: event.data }));
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
    console.log('❌ Perte de connexion temps réel');
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`🔄 Reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts} dans ${delay}ms`);
      
      setTimeout(() => {
        this.initialize();
      }, delay);
    } else {
      console.error('❌ ÉCHEC connexion temps réel → Mode POLLING');
      this.startPollingFallback();
      
      if (this.isAdminUser()) {
        toast.error('🔴 HORS LIGNE - Mode dégradé activé', {
          duration: 5000,
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