import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, AlertTriangle, RefreshCw, Eye, Clock, User } from 'lucide-react';
import { ContentPublishingService } from '../services/contentPublishingService';
import { ContentVersioningService } from '../services/contentVersioningService';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ContentPublisher: React.FC = () => {
  const [contentStatus, setContentStatus] = useState<any>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [latestVersion, setLatestVersion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkContentStatus = async () => {
    try {
      setIsLoading(true);
      
      // Vérifier le contenu local de Nicolas
      const localStatus = ContentPublishingService.checkNicolasContentAvailability();
      
      // Vérifier la dernière version publiée
      const latestPublished = await ContentPublishingService.getLatestNicolasVersion();
      
      setContentStatus(localStatus);
      setLatestVersion(latestPublished);
      
    } catch (error) {
      console.error('Erreur vérification statut:', error);
      toast.error('Erreur lors de la vérification du contenu');
    } finally {
      setIsLoading(false);
    }
  };

  const publishContent = async () => {
    if (!contentStatus?.hasContent) {
      toast.error('Aucun contenu de Nicolas trouvé à publier');
      return;
    }

    setIsPublishing(true);
    
    try {
      await ContentPublishingService.publishNicolasContent();
      
      // Recharger le statut après publication
      await checkContentStatus();
      
    } catch (error) {
      console.error('Erreur publication:', error);
      toast.error('Erreur lors de la publication');
    } finally {
      setIsPublishing(false);
    }
  };

  const forceSyncAll = async () => {
    try {
      toast.loading('Synchronisation forcée en cours...', { id: 'force-sync' });
      
      await ContentPublishingService.forceSyncFromSupabase();
      
      toast.success('Synchronisation terminée - rechargement...', { id: 'force-sync' });
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      toast.error('Erreur lors de la synchronisation', { id: 'force-sync' });
    }
  };

  useEffect(() => {
    checkContentStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="w-8 h-8 text-yellow-600 mx-auto mb-4 animate-spin" />
        <p className="text-gray-600 dark:text-gray-400">Vérification du contenu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-light text-gray-900 dark:text-white">
          Publication du Contenu de Nicolas
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Publier les modifications de nicolas.c@lacremerie.fr pour tous les utilisateurs
        </p>
      </div>

      {/* Statut du contenu local */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Contenu Local de Nicolas
        </h3>
        
        {!contentStatus?.hasContent ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun Contenu Local Trouvé
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Aucune modification de Nicolas n'a été détectée dans le stockage local.
            </p>
            <button
              onClick={forceSyncAll}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mx-auto"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Synchroniser depuis Supabase</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg border ${
                contentStatus.hasSiteContent 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}>
                <div className="flex items-center space-x-2">
                  <CheckCircle className={`w-5 h-5 ${contentStatus.hasSiteContent ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="font-medium">Contenu du Site</span>
                </div>
                <p className="text-sm mt-1">
                  {contentStatus.hasSiteContent ? 'Disponible' : 'Non modifié'}
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${
                contentStatus.hasProperties 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}>
                <div className="flex items-center space-x-2">
                  <CheckCircle className={`w-5 h-5 ${contentStatus.hasProperties ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="font-medium">Propriétés</span>
                </div>
                <p className="text-sm mt-1">
                  {contentStatus.hasProperties ? 'Disponibles' : 'Non modifiées'}
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${
                contentStatus.hasImages 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}>
                <div className="flex items-center space-x-2">
                  <CheckCircle className={`w-5 h-5 ${contentStatus.hasImages ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="font-medium">Images</span>
                </div>
                <p className="text-sm mt-1">
                  {contentStatus.hasImages ? 'Disponibles' : 'Non modifiées'}
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${
                contentStatus.hasDesign 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}>
                <div className="flex items-center space-x-2">
                  <CheckCircle className={`w-5 h-5 ${contentStatus.hasDesign ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="font-medium">Design</span>
                </div>
                <p className="text-sm mt-1">
                  {contentStatus.hasDesign ? 'Disponible' : 'Non modifié'}
                </p>
              </div>
            </div>

            {contentStatus.lastModified && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Dernière modification locale détectée</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dernière version publiée */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Dernière Version Publiée par Nicolas
        </h3>
        
        {!latestVersion?.content ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Aucune version publiée trouvée dans Supabase
          </div>
        ) : (
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-yellow-600" />
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Version {latestVersion.content.version_number}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {latestVersion.content.change_description || 'Aucune description'}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Publié
              </span>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span>Par: {latestVersion.content.author_name}</span>
                <span>Le: {new Date(latestVersion.content.created_at).toLocaleString('fr-FR')}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions de publication */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Actions de Publication
        </h3>
        
        <div className="space-y-4">
          {contentStatus?.hasContent ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={publishContent}
              disabled={isPublishing}
              className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className={`w-6 h-6 ${isPublishing ? 'animate-pulse' : ''}`} />
              <span className="text-lg">
                {isPublishing ? 'Publication en cours...' : 'Publier le Contenu de Nicolas'}
              </span>
            </motion.button>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Aucun contenu local à publier
            </div>
          )}

          <button
            onClick={forceSyncAll}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Synchroniser Tout depuis Supabase</span>
          </button>

          <button
            onClick={checkContentStatus}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <Eye className="w-5 h-5" />
            <span>Vérifier le Statut</span>
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h4 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-4">
          📋 Instructions de Publication
        </h4>
        <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
          <li><strong>1.</strong> Vérifiez que le contenu de Nicolas est disponible localement</li>
          <li><strong>2.</strong> Cliquez sur "Publier le Contenu de Nicolas" pour le rendre public</li>
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

export default ContentPublisher;