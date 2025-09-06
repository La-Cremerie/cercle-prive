import React, { useState, useEffect } from 'react';
import { Activity, Clock, User, RefreshCw, Eye, RotateCcw, Download, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { ContentVersioningService, type SyncEvent } from '../services/contentVersioningService';
import toast from 'react-hot-toast';

const ContentSyncDashboard: React.FC = () => {
  const [syncEvents, setSyncEvents] = useState<SyncEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'content' | 'properties' | 'images' | 'design'>('all');

  const loadSyncEvents = async () => {
    try {
      setIsLoading(true);
      const events = await ContentVersioningService.getRecentSyncEvents(100);
      setSyncEvents(events);
    } catch (error) {
      toast.error('Erreur lors du chargement des événements');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSyncEvents();
  }, []);

  const filteredEvents = filter === 'all' 
    ? syncEvents 
    : syncEvents.filter(event => event.event_type === filter);

  const getEventIcon = (eventType: string, action: string) => {
    if (action === 'rollback') return <RotateCcw className="w-4 h-4 text-blue-500" />;
    
    switch (eventType) {
      case 'content': return <Eye className="w-4 h-4 text-green-500" />;
      case 'properties': return <Upload className="w-4 h-4 text-blue-500" />;
      case 'images': return <Download className="w-4 h-4 text-purple-500" />;
      case 'design': return <RefreshCw className="w-4 h-4 text-yellow-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEventTypeLabel = (eventType: string) => {
    switch (eventType) {
      case 'content': return 'Contenu';
      case 'properties': return 'Propriétés';
      case 'images': return 'Images';
      case 'design': return 'Design';
      default: return eventType;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'create': return 'Création';
      case 'update': return 'Modification';
      case 'delete': return 'Suppression';
      case 'rollback': return 'Restauration';
      default: return action;
    }
  };

  const migrateAllLocalData = async () => {
    if (window.confirm('Migrer toutes les données locales vers Supabase ? Cette action synchronise définitivement vos modifications.')) {
      try {
        const adminEmail = localStorage.getItem('currentAdminEmail') || 'nicolas.c@lacremerie.fr';
        const adminName = adminEmail.split('@')[0];
        
        await ContentVersioningService.migrateLocalDataToSupabase(adminName, adminEmail);
        await loadSyncEvents(); // Recharger les événements après migration
      } catch (error) {
        toast.error('Erreur lors de la migration complète');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-gray-900 dark:text-white">
            Tableau de Bord de Synchronisation
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Historique complet des modifications et synchronisation
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={migrateAllLocalData}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Migrer tout vers Supabase</span>
          </button>
          <button
            onClick={loadSyncEvents}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['content', 'properties', 'images', 'design'].map((type) => {
          const count = syncEvents.filter(event => event.event_type === type).length;
          return (
            <div key={type} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {getEventTypeLabel(type)}
                  </p>
                  <p className="text-2xl font-light text-gray-900 dark:text-white">
                    {count}
                  </p>
                </div>
                {getEventIcon(type, 'update')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtres */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filtrer par type :
          </span>
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'Tous' },
              { key: 'content', label: 'Contenu' },
              { key: 'properties', label: 'Propriétés' },
              { key: 'images', label: 'Images' },
              { key: 'design', label: 'Design' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  filter === key
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
            {filteredEvents.length} événement(s)
          </span>
        </div>
      </div>

      {/* Timeline des événements */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Historique des Modifications
          </h3>
        </div>

        {isLoading ? (
          <div className="px-6 py-12 text-center">
            <RefreshCw className="w-8 h-8 text-yellow-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">Chargement de l'historique...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
            Aucun événement trouvé
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getEventIcon(event.event_type, event.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {getEventTypeLabel(event.event_type)} - {getActionLabel(event.action)}
                      </span>
                      {event.version_number && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                          v{event.version_number}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{event.author_name} ({event.author_email})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(event.created_at).toLocaleString('fr-FR')}</span>
                      </div>
                    </div>
                    
                    {event.change_description && (
                      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        {event.change_description}
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Cible: {event.target_id}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentSyncDashboard;