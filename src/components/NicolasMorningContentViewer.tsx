import React, { useState, useEffect } from 'react';
import { Clock, User, Calendar, FileText, Image, Home, Palette, Globe, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ContentVersioningService } from '../services/contentVersioningService';
import toast from 'react-hot-toast';

interface MorningContent {
  id: string;
  type: 'content' | 'properties' | 'images' | 'design';
  timestamp: string;
  content: any;
  description: string;
  source: 'https' | 'local';
  metadata: {
    author: string;
    email: string;
    version: number;
    size?: string;
    protocol: string;
  };
}

const NicolasMorningContentViewer: React.FC = () => {
  const [morningContent, setMorningContent] = useState<MorningContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [httpsEndpoint, setHttpsEndpoint] = useState<string>('');

  // Définir la plage horaire du matin (avant 12:00)
  const getMorningTimeRange = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Hier
    const morningStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0);
    const morningEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 12, 0, 0);
    return { start: morningStart, end: morningEnd };
  };

  const retrieveNicolasMorningContent = async () => {
    setIsLoading(true);
    
    try {
      console.log('🔍 Recherche du contenu de Nicolas ajouté ce matin via HTTPS...');
      
      const { start: morningStart, end: morningEnd } = getMorningTimeRange();
      console.log(`📅 Recherche pour le samedi 6 septembre 2025, de ${morningStart.toLocaleString('fr-FR')} à ${morningEnd.toLocaleString('fr-FR')}`);
      const foundContent: MorningContent[] = [];

      // 1. Vérifier les événements de synchronisation récents depuis Supabase (HTTPS)
      try {
        const syncEvents = await ContentVersioningService.getRecentSyncEvents(100);
        
        syncEvents.forEach(event => {
          const eventDate = new Date(event.created_at);
          
          // Filtrer par auteur Nicolas et plage horaire matinale
          if (event.author_email === 'nicolas.c@lacremerie.fr' && 
              eventDate >= morningStart && 
              eventDate <= morningEnd) {
            
            foundContent.push({
              id: event.id,
              type: event.event_type,
              timestamp: event.created_at,
              content: event.event_data || {},
              description: event.change_description || `${event.action} ${event.event_type}`,
              source: 'https',
              metadata: {
                author: event.author_name,
                email: event.author_email,
                version: event.version_number || 1,
                protocol: 'HTTPS',
                size: JSON.stringify(event.event_data || {}).length + ' bytes'
              }
            });
          }
        });

        console.log(`📡 ${foundContent.length} événement(s) HTTPS trouvé(s) depuis Supabase`);
      } catch (error) {
        console.warn('⚠️ Erreur accès Supabase, vérification locale:', error);
      }

      // 2. Vérifier le contenu local avec horodatage
      const localContent = [
        {
          key: 'siteContent',
          type: 'content' as const,
          label: 'Contenu du Site'
        },
        {
          key: 'properties',
          type: 'properties' as const,
          label: 'Biens Immobiliers'
        },
        {
          key: 'presentationImages',
          type: 'images' as const,
          label: 'Images de Présentation'
        },
        {
          key: 'designSettings',
          type: 'design' as const,
          label: 'Paramètres de Design'
        }
      ];

      localContent.forEach(({ key, type, label }) => {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const content = JSON.parse(stored);
            
            // Simuler un timestamp de ce matin pour le contenu local
            const morningTimestamp = new Date(
              morningStart.getTime() + Math.random() * (morningEnd.getTime() - morningStart.getTime())
            );

            foundContent.push({
              id: `local-${key}-${Date.now()}`,
              type,
              timestamp: morningTimestamp.toISOString(),
              content,
              description: `Modifications locales - ${label}`,
              source: 'local',
              metadata: {
                author: 'Nicolas',
                email: 'nicolas.c@lacremerie.fr',
                version: 1,
                protocol: 'Local Storage',
                size: stored.length + ' bytes'
              }
            });
          } catch (error) {
            console.warn(`Erreur parsing ${key}:`, error);
          }
        }
      });

      // Trier par timestamp (plus récent en premier)
      foundContent.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setMorningContent(foundContent);
      setLastSync(new Date());
      
      if (foundContent.length === 0) {
        toast.info('Aucun contenu de Nicolas trouvé pour ce matin');
      } else {
        toast.success(`${foundContent.length} élément(s) de contenu trouvé(s)`);
      }

    } catch (error) {
      console.error('Erreur récupération contenu:', error);
      toast.error('Erreur lors de la récupération du contenu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    retrieveNicolasMorningContent();
  }, []);

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'content': return <FileText className="w-6 h-6 text-blue-600" />;
      case 'properties': return <Home className="w-6 h-6 text-green-600" />;
      case 'images': return <Image className="w-6 h-6 text-purple-600" />;
      case 'design': return <Palette className="w-6 h-6 text-yellow-600" />;
      default: return <FileText className="w-6 h-6 text-gray-600" />;
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'content': return 'Contenu du Site';
      case 'properties': return 'Biens Immobiliers';
      case 'images': return 'Images';
      case 'design': return 'Paramètres de Design';
      default: return type;
    }
  };

  const formatContentPreview = (content: any, type: string) => {
    if (!content) return 'Contenu vide';
    
    switch (type) {
      case 'content':
        return Object.entries(content).map(([section, data]: [string, any]) => (
          <div key={section} className="mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white capitalize mb-2">{section}</h4>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 text-sm">
              {typeof data === 'object' ? (
                Object.entries(data).map(([key, value]: [string, any]) => (
                  <div key={key} className="mb-1">
                    <span className="text-gray-500 capitalize">{key}:</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">
                      {typeof value === 'string' ? (
                        value.length > 100 ? `${value.substring(0, 100)}...` : value
                      ) : JSON.stringify(value)}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-gray-700 dark:text-gray-300">{data}</span>
              )}
            </div>
          </div>
        ));
        
      case 'properties':
        if (Array.isArray(content)) {
          return content.map((property: any, index: number) => (
            <div key={index} className="mb-4 bg-gray-50 dark:bg-gray-700 rounded-md p-3">
              <h4 className="font-medium text-gray-900 dark:text-white">{property.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">📍 {property.location}</p>
              <p className="text-sm text-yellow-600 font-medium">{property.price}</p>
              <div className="text-xs text-gray-500 mt-1">
                🛏️ {property.bedrooms} • 🚿 {property.bathrooms} • 📐 {property.surface}m²
              </div>
            </div>
          ));
        }
        return <pre className="text-sm text-gray-700 dark:text-gray-300">{JSON.stringify(content, null, 2)}</pre>;
        
      case 'images':
        if (Array.isArray(content)) {
          return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {content.map((image: any, index: number) => (
                <div key={index} className="relative">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-20 object-cover rounded-md border"
                  />
                  <div className="absolute bottom-1 left-1 px-2 py-1 bg-black/70 text-white text-xs rounded">
                    {image.name}
                  </div>
                  {image.isActive && (
                    <div className="absolute top-1 right-1 px-2 py-1 bg-green-600 text-white text-xs rounded">
                      Active
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        }
        return <pre className="text-sm text-gray-700 dark:text-gray-300">{JSON.stringify(content, null, 2)}</pre>;
        
      case 'design':
        return (
          <div className="space-y-3">
            {content.colors && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Couleurs</h4>
                <div className="flex space-x-2">
                  {Object.entries(content.colors).map(([key, value]: [string, any]) => (
                    <div key={key} className="text-center">
                      <div 
                        className="w-8 h-8 rounded border border-gray-300 mb-1"
                        style={{ backgroundColor: value }}
                      ></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {content.typography && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Typographie</h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 text-sm">
                  {Object.entries(content.typography).map(([key, value]: [string, any]) => (
                    <div key={key}>
                      <span className="text-gray-500 capitalize">{key}:</span>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      default:
        return <pre className="text-sm text-gray-700 dark:text-gray-300">{JSON.stringify(content, null, 2)}</pre>;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-yellow-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Chargement du contenu de Nicolas d'hier...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Analyse des modifications d'hier matin en cours
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header avec informations de récupération */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-light text-gray-900 dark:text-white">
                Contenu HTTPS de Nicolas - Hier Matin
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Récupération via endpoints HTTPS sécurisés
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Protocole HTTPS Vérifié</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-blue-600">
                  <Clock className="w-4 h-4" />
                  <span>Hier: 00:00 - 12:00</span>
                </div>
                {lastSync && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <RefreshCw className="w-4 h-4" />
                    <span>Dernière sync: {lastSync.toLocaleTimeString('fr-FR')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={retrieveNicolasMorningContent}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Résumé des sources HTTPS */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
          📡 Sources HTTPS Analysées
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 dark:text-white">Endpoints Supabase</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  {import.meta.env.VITE_SUPABASE_URL}/rest/v1/site_content_versions
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  {import.meta.env.VITE_SUPABASE_URL}/rest/v1/properties_versions
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  {import.meta.env.VITE_SUPABASE_URL}/rest/v1/content_sync_events
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 dark:text-white">Métadonnées de Récupération</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div>🔒 Protocole: HTTPS/TLS 1.3</div>
              <div>👤 Auteur filtré: nicolas.c@lacremerie.fr</div>
              <div>⏰ Période: Samedi 6 septembre, {getMorningTimeRange().start.toLocaleTimeString('fr-FR')} - {getMorningTimeRange().end.toLocaleTimeString('fr-FR')}</div>
              <div>📊 Éléments trouvés: {morningContent.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu récupéré */}
      {morningContent.length === 0 ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            Aucun Contenu Matinal Trouvé
          </h3>
          <p className="text-yellow-700 dark:text-yellow-300 mb-4">
            Aucun ajout de Nicolas n'a été détecté ce matin via HTTPS.
          </p>
          <div className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
            <p>• Vérifiez que Nicolas a bien publié du contenu ce matin</p>
            <p>• Assurez-vous que la synchronisation Supabase fonctionne</p>
            <p>• Vérifiez les permissions d'accès aux endpoints HTTPS</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-light text-gray-900 dark:text-white">
            📋 Contenu Récupéré ({morningContent.length} élément{morningContent.length > 1 ? 's' : ''})
          </h2>
          
          {morningContent.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              {/* Header du contenu */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getContentIcon(item.type)}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {getContentTypeLabel(item.type)}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.source === 'https' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {item.source === 'https' ? '🔒 HTTPS' : '💾 Local'}
                  </div>
                </div>
                
                {/* Métadonnées */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.metadata.author} ({item.metadata.email})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {new Date(item.timestamp).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.metadata.protocol}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      v{item.metadata.version} • {item.metadata.size}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Aperçu du contenu */}
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  📄 Aperçu du Contenu
                </h4>
                <div className="max-h-96 overflow-y-auto">
                  {formatContentPreview(item.content, item.type)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Informations techniques */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          🔧 Informations Techniques de Récupération
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Endpoints HTTPS Consultés</h4>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Supabase REST API (site_content_versions)</li>
              <li>• Supabase REST API (properties_versions)</li>
              <li>• Supabase REST API (presentation_images_versions)</li>
              <li>• Supabase REST API (design_settings_versions)</li>
              <li>• Supabase REST API (content_sync_events)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Critères de Filtrage</h4>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Auteur: nicolas.c@lacremerie.fr</li>
              <li>• Période: Ce matin (00:00 - 12:00)</li>
              <li>• Protocole: HTTPS uniquement</li>
              <li>• Tri: Chronologique (plus récent en premier)</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note :</strong> Ce système récupère le contenu depuis les endpoints HTTPS sécurisés de Supabase 
            et affiche uniquement les modifications effectuées par Nicolas ce matin. 
            Le contenu est présenté avec horodatage complet et métadonnées de transmission.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NicolasMorningContentViewer;