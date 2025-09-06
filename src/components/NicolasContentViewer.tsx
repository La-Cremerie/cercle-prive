import React, { useState, useEffect } from 'react';
import { User, Calendar, Eye, FileText, Image, Home, Palette, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { ContentVersioningService } from '../services/contentVersioningService';
import { ContentPublishingService } from '../services/contentPublishingService';
import toast from 'react-hot-toast';

interface NicolasContent {
  siteContent: any;
  properties: any[];
  heroImages: any[];
  conceptImages: any[];
  designSettings: any;
  lastModified: string | null;
  isPublished: boolean;
}

const NicolasContentViewer: React.FC = () => {
  const [nicolasContent, setNicolasContent] = useState<NicolasContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedVersion, setPublishedVersion] = useState<any>(null);

  const loadNicolasContent = async () => {
    try {
      setIsLoading(true);
      
      // 1. Vérifier le contenu local de Nicolas
      const localStatus = ContentPublishingService.checkNicolasContentAvailability();
      
      // 2. Récupérer le contenu depuis localStorage
      const siteContent = localStorage.getItem('siteContent');
      const properties = localStorage.getItem('properties');
      const heroImages = localStorage.getItem('presentationImages');
      const conceptImages = localStorage.getItem('conceptImages');
      const designSettings = localStorage.getItem('designSettings');
      
      // 3. Vérifier la dernière version publiée
      const latestPublished = await ContentPublishingService.getLatestNicolasVersion();
      
      const content: NicolasContent = {
        siteContent: siteContent ? JSON.parse(siteContent) : null,
        properties: properties ? JSON.parse(properties) : [],
        heroImages: heroImages ? JSON.parse(heroImages) : [],
        conceptImages: conceptImages ? JSON.parse(conceptImages) : [],
        designSettings: designSettings ? JSON.parse(designSettings) : null,
        lastModified: localStatus.lastModified,
        isPublished: !!latestPublished.content
      };
      
      setNicolasContent(content);
      setPublishedVersion(latestPublished);
      
    } catch (error) {
      console.error('Erreur chargement contenu Nicolas:', error);
      toast.error('Erreur lors du chargement du contenu');
    } finally {
      setIsLoading(false);
    }
  };

  const publishContent = async () => {
    if (!nicolasContent) return;
    
    setIsPublishing(true);
    
    try {
      await ContentPublishingService.publishNicolasContent();
      
      // Recharger le statut après publication
      await loadNicolasContent();
      
      toast.success('🎉 Contenu de Nicolas publié avec succès !');
      
    } catch (error) {
      console.error('Erreur publication:', error);
      toast.error('Erreur lors de la publication');
    } finally {
      setIsPublishing(false);
    }
  };

  useEffect(() => {
    loadNicolasContent();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-yellow-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Chargement du contenu de Nicolas...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Analyse des modifications en cours
          </p>
        </div>
      </div>
    );
  }

  if (!nicolasContent) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-4">
            Aucun Contenu Trouvé
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Aucune modification de Nicolas n'a été détectée dans le système.
          </p>
          <button
            onClick={loadNicolasContent}
            className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Recharger</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header avec identification utilisateur */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-2xl font-light text-gray-900 dark:text-white">
                Contenu Web de Nicolas
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                nicolas.c@lacremerie.fr
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                  nicolasContent.isPublished 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {nicolasContent.isPublished ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  <span>{nicolasContent.isPublished ? 'Publié' : 'En attente de publication'}</span>
                </div>
                {nicolasContent.lastModified && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Modifié récemment</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {!nicolasContent.isPublished && (
            <button
              onClick={publishContent}
              disabled={isPublishing}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Eye className={`w-5 h-5 ${isPublishing ? 'animate-pulse' : ''}`} />
              <span>{isPublishing ? 'Publication...' : 'Publier pour Tous'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Résumé du contenu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contenu du Site</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">
                {nicolasContent.siteContent ? '✅' : '❌'}
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {nicolasContent.siteContent ? 'Modifié' : 'Non modifié'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Biens Immobiliers</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">
                {nicolasContent.properties.length}
              </p>
            </div>
            <Home className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Propriétés configurées
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Images</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">
                {nicolasContent.heroImages.length + nicolasContent.conceptImages.length}
              </p>
            </div>
            <Image className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Hero + Concept
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Design</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">
                {nicolasContent.designSettings ? '✅' : '❌'}
              </p>
            </div>
            <Palette className="w-8 h-8 text-yellow-600" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {nicolasContent.designSettings ? 'Personnalisé' : 'Par défaut'}
          </p>
        </div>
      </div>

      {/* Contenu du site */}
      {nicolasContent.siteContent && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-3 text-blue-600" />
            Contenu du Site Web
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(nicolasContent.siteContent).map(([section, content]: [string, any]) => (
              <div key={section} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 capitalize">
                  {section}
                </h3>
                <div className="space-y-2 text-sm">
                  {typeof content === 'object' ? (
                    Object.entries(content).map(([key, value]: [string, any]) => (
                      <div key={key}>
                        <span className="text-gray-500 dark:text-gray-400 capitalize">{key}:</span>
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                          {typeof value === 'string' ? (
                            value.length > 100 ? `${value.substring(0, 100)}...` : value
                          ) : (
                            JSON.stringify(value)
                          )}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300">{content}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Biens immobiliers */}
      {nicolasContent.properties.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6 flex items-center">
            <Home className="w-6 h-6 mr-3 text-green-600" />
            Biens Immobiliers ({nicolasContent.properties.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nicolasContent.properties.map((property: any, index: number) => (
              <div key={property.id || index} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                {property.images && property.images[0] && (
                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    {property.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    📍 {property.location}
                  </p>
                  <p className="text-lg font-medium text-yellow-600 mb-2">
                    {property.price}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>🛏️ {property.bedrooms}</span>
                    <span>🚿 {property.bathrooms}</span>
                    <span>📐 {property.surface}m²</span>
                  </div>
                  {property.yield && (
                    <p className="text-sm text-green-600 mt-2">
                      Rendement: {property.yield.toLocaleString('fr-FR')} €/an
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Images de présentation */}
      {(nicolasContent.heroImages.length > 0 || nicolasContent.conceptImages.length > 0) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6 flex items-center">
            <Image className="w-6 h-6 mr-3 text-purple-600" />
            Images de Présentation
          </h2>
          
          <div className="space-y-6">
            {nicolasContent.heroImages.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Images Hero (Page d'accueil) - {nicolasContent.heroImages.length}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {nicolasContent.heroImages.map((image: any, index: number) => (
                    <div key={image.id || index} className="relative">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                      {image.isActive && (
                        <div className="absolute top-1 left-1 px-2 py-1 bg-green-600 text-white text-xs rounded">
                          Active
                        </div>
                      )}
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                        {image.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {nicolasContent.conceptImages.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Images Concept - {nicolasContent.conceptImages.length}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {nicolasContent.conceptImages.map((image: any, index: number) => (
                    <div key={image.id || index} className="relative">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                      {image.isActive && (
                        <div className="absolute top-1 left-1 px-2 py-1 bg-green-600 text-white text-xs rounded">
                          Active
                        </div>
                      )}
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                        {image.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Paramètres de design */}
      {nicolasContent.designSettings && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6 flex items-center">
            <Palette className="w-6 h-6 mr-3 text-yellow-600" />
            Paramètres de Design
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Couleurs */}
            {nicolasContent.designSettings.colors && (
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Palette de Couleurs</h3>
                <div className="space-y-2">
                  {Object.entries(nicolasContent.designSettings.colors).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex items-center space-x-3">
                      <div 
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: value }}
                      ></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {key}: {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Typographie */}
            {nicolasContent.designSettings.typography && (
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Typographie</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(nicolasContent.designSettings.typography).map(([key, value]: [string, any]) => (
                    <div key={key}>
                      <span className="text-gray-500 dark:text-gray-400 capitalize">{key}:</span>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Version publiée actuelle */}
      {publishedVersion?.content && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h2 className="text-xl font-medium text-green-800 dark:text-green-200 mb-4 flex items-center">
            <CheckCircle className="w-6 h-6 mr-3" />
            Version Publiée Actuelle
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-green-600 dark:text-green-400 font-medium">Version:</span>
              <span className="ml-2 text-green-800 dark:text-green-200">
                {publishedVersion.content.version_number}
              </span>
            </div>
            <div>
              <span className="text-green-600 dark:text-green-400 font-medium">Auteur:</span>
              <span className="ml-2 text-green-800 dark:text-green-200">
                {publishedVersion.content.author_name}
              </span>
            </div>
            <div>
              <span className="text-green-600 dark:text-green-400 font-medium">Date:</span>
              <span className="ml-2 text-green-800 dark:text-green-200">
                {new Date(publishedVersion.content.created_at).toLocaleString('fr-FR')}
              </span>
            </div>
          </div>
          
          {publishedVersion.content.change_description && (
            <div className="mt-3">
              <span className="text-green-600 dark:text-green-400 font-medium">Description:</span>
              <span className="ml-2 text-green-700 dark:text-green-300">
                {publishedVersion.content.change_description}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
          Actions Disponibles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={loadNicolasContent}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Actualiser</span>
          </button>
          
          {!nicolasContent.isPublished && (
            <button
              onClick={publishContent}
              disabled={isPublishing}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Eye className={`w-5 h-5 ${isPublishing ? 'animate-pulse' : ''}`} />
              <span>{isPublishing ? 'Publication...' : 'Publier Maintenant'}</span>
            </button>
          )}
          
          <button
            onClick={async () => {
              try {
                await ContentPublishingService.forceSyncFromSupabase();
                toast.success('Synchronisation forcée terminée');
                setTimeout(() => window.location.reload(), 1500);
              } catch (error) {
                toast.error('Erreur lors de la synchronisation');
              }
            }}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Sync Supabase</span>
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-4">
          📋 Instructions de Publication
        </h3>
        <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
          <li><strong>1.</strong> Vérifiez que le contenu de Nicolas est complet et prêt</li>
          <li><strong>2.</strong> Cliquez sur "Publier pour Tous" pour rendre le contenu public</li>
          <li><strong>3.</strong> Le contenu sera automatiquement synchronisé sur tous les appareils</li>
          <li><strong>4.</strong> Tous les utilisateurs verront immédiatement les modifications</li>
        </ol>
        
        <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-800/30 rounded-md">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note :</strong> Une fois publié, le contenu sera visible par tous les utilisateurs, 
            même ceux qui visitent le site pour la première fois ou après avoir vidé leur cache.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NicolasContentViewer;