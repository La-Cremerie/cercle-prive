import { useEffect, useRef } from 'react';
import { syncService, type SyncEvent } from '../services/realTimeSync';

export const useRealTimeSync = (
  componentId: string,
  onSyncEvent?: (event: SyncEvent) => void
) => {
  const isInitialized = useRef(false);

  useEffect(() => {
    // Initialiser le service de manière sécurisée
    if (!isInitialized.current) {
      try {
        syncService.initialize();
        isInitialized.current = true;
      } catch (error) {
        console.warn('Erreur initialisation sync service:', error);
      }
    }

    // S'abonner aux événements si callback fourni
    if (onSyncEvent) {
      try {
        syncService.subscribe(componentId, onSyncEvent);
      } catch (error) {
        console.warn('Erreur abonnement sync:', error);
      }
    }

    // Cleanup
    return () => {
      if (onSyncEvent) {
        try {
          syncService.unsubscribe(componentId);
        } catch (error) {
          console.warn('Erreur désabonnement sync:', error);
        }
      }
    };
  }, [componentId, onSyncEvent]);

  // Fonction pour diffuser un changement
  const broadcastChange = async (
    type: SyncEvent['type'],
    action: SyncEvent['action'],
    data: any
  ) => {
    try {
      const adminEmail = localStorage.getItem('currentAdminEmail') || 'nicolas.c@lacremerie.fr';
      const adminName = adminEmail.split('@')[0];

      await syncService.broadcastChange({
        type,
        action,
        data,
        adminId: 'current-admin',
        adminName
      });
    } catch (error) {
      console.warn('Erreur broadcast change:', error);
    }
  };

  return {
    broadcastChange,
    connectionStatus: (() => {
      try {
        return syncService.getConnectionStatus();
      } catch {
        return { connected: false, subscribers: 0 };
      }
    })()
  };
};