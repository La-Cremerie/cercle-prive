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
      
      // Créer le canal Supabase pour les événements temps réel
      this.channel = supabase
        .channel('admin_changes')
        .on('broadcast', { event: 'admin_change' }, (payload) => {
          this.handleSyncEvent(payload.payload as SyncEvent);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            console.log('✅ Synchronisation temps réel connectée');
            
            // Notifier les utilisateurs admin
            if (this.isAdminUser()) {
              toast.success('Synchronisation temps réel activée', { 
                id: 'sync-connected',
                duration: 2000 
              });
            }
          } else if (status === 'CHANNEL_ERROR') {
            this.handleConnectionError();
          }
        });

      // Fallback avec polling si Supabase n'est pas disponible
      if (!this.isSupabaseConfigured()) {
        this.startPollingFallback();
      }

    } catch (error) {
      console.error('❌ Erreur initialisation sync:', error);
      this.handleConnectionError();
    }
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
        await this.channel.send({
          type: 'broadcast',
          event: 'admin_change',
          payload: fullEvent
        });
        console.log('📤 Changement diffusé:', fullEvent);
      } else {
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
    return localStorage.getItem('adminLoggedIn') === 'true';
  }

  // Vérifier si c'est l'admin actuel
  private isCurrentAdmin(adminId: string): boolean {
    const currentAdminEmail = localStorage.getItem('currentAdminEmail');
    return currentAdminEmail === 'nicolas.c@lacremerie.fr' && adminId === 'current-admin';
  }

  // Vérifier si Supabase est configuré
  private isSupabaseConfigured(): boolean {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return url && key && 
           url !== 'https://your-project.supabase.co' && 
           key !== 'your-anon-key';
  }

  // Fallback avec polling
  private startPollingFallback(): void {
    console.log('🔄 Démarrage du polling fallback...');
    
    setInterval(() => {
      this.checkForStoredEvents();
    }, 5000); // Vérifier toutes les 5 secondes
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
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`🔄 Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts} dans ${delay}ms`);
      
      setTimeout(() => {
        this.initialize();
      }, delay);
    } else {
      console.error('❌ Échec de connexion temps réel, passage en mode polling');
      this.startPollingFallback();
      
      if (this.isAdminUser()) {
        toast.error('Synchronisation temps réel indisponible, mode dégradé activé', {
          duration: 5000
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