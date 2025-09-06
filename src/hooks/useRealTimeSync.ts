import { useEffect, useRef } from 'react';
import { syncService, type SyncEvent } from '../services/realTimeSync';

export const useRealTimeSync = (
  componentId: string,
  onSyncEvent?: (event: SyncEvent) => void
) => {
  const isInitialized = useRef(false);

  useEffect(() => {
    // Initialiser le service une seule fois
    if (!isInitialized.current) {
      syncService.initialize();
      isInitialized.current = true;
    }

    // S'abonner aux événements si callback fourni
    if (onSyncEvent) {
      syncService.subscribe(componentId, onSyncEvent);
    }

    // Cleanup
    return () => {
      if (onSyncEvent) {
        syncService.unsubscribe(componentId);
      }
    };
  }, [componentId, onSyncEvent]);

  // Fonction pour diffuser un changement
  const broadcastChange = async (
    type: SyncEvent['type'],
    action: SyncEvent['action'],
    data: any
  ) => {
    const adminEmail = localStorage.getItem('currentAdminEmail') || 'nicolas.c@lacremerie.fr';
    const adminName = adminEmail.split('@')[0];

    await syncService.broadcastChange({
      type,
      action,
      data,
      adminId: 'current-admin',
      adminName
    });
  };

  return {
    broadcastChange,
    connectionStatus: syncService.getConnectionStatus()
  };
};