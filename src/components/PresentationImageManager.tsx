import React, { useState, useRef } from 'react';
import { Image, Upload, Link, Save, X, Eye, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRealTimeSync } from '../hooks/useRealTimeSync';
import { ContentVersioningService } from '../services/contentVersioningService';

interface PresentationImage {
  id: string;
  url: string;
  name: string;
  type: 'url' | 'file' | 'drive';
  isActive: boolean;
}

const PresentationImageManager: React.FC = () => {
  const [images, setImages] = useState<PresentationImage[]>(() => {
    const stored = localStorage.getItem('presentationImages');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Image par défaut
    return [{
      id: '1',
      url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920',
      name: 'Image par défaut',
      type: 'url' as const,
      isActive: true
    }];
  });

  const [conceptImages, setConceptImages] = useState<PresentationImage[]>(() => {
    const stored = localStorage.getItem('conceptImages');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Image par défaut pour la section concept
    return [{
      id: '1',
      url: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
      name: 'Architecture moderne',
      type: 'url' as const,
      isActive: true
    }];
  });

  const [activeCategory, setActiveCategory] = useState<'hero' | 'concept'>('hero');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file' | 'drive'>('url');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageName, setNewImageName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { broadcastChange } = useRealTimeSync('image-manager');
  
  // Charger les images depuis Supabase au démarrage
  useEffect(() => {
    const loadImagesFromSupabase = async () => {
      try {
        const heroImagesFromSupabase = await ContentVersioningService.getCurrentPresentationImages('hero');
        const conceptImagesFromSupabase = await ContentVersioningService.getCurrentPresentationImages('concept');
        
        if (heroImagesFromSupabase.length > 0) {
          setImages(heroImagesFromSupabase);
          localStorage.setItem('presentationImages', JSON.stringify(heroImagesFromSupabase));
        }
        
        if (conceptImagesFromSupabase.length > 0) {
          setConceptImages(conceptImagesFromSupabase);
          localStorage.setItem('conceptImages', JSON.stringify(conceptImagesFromSupabase));
        }
      } catch (error) {
        console.warn('Erreur chargement images Supabase:', error);
      }
    };

    loadImagesFromSupabase();
  }, []);

  const saveImages = () => {
    try {
      // Sauvegarder dans Supabase avec versioning
      const saveToSupabase = async () => {
        try {
          const adminEmail = localStorage.getItem('currentAdminEmail') || 'nicolas.c@lacremerie.fr';
          const adminName = adminEmail.split('@')[0];
          
          const currentImages = activeCategory === 'hero' ? images : conceptImages;
          
          await ContentVersioningService.savePresentationImagesVersion(
            activeCategory,
            currentImages,
            adminName,
            adminEmail,
            `Modification des images ${activeCategory}`
          );
          
          console.log(`✅ Images ${activeCategory} sauvegardées dans Supabase avec versioning`);
        } catch (error) {
          console.warn('⚠️ Erreur sauvegarde Supabase, utilisation localStorage:', error);
        }
      };

      saveToSupabase();

      // Sauvegarder localement (fallback)
      if (activeCategory === 'hero') {
        localStorage.setItem('presentationImages', JSON.stringify(images));
        // Déclencher un événement pour mettre à jour le hero
        window.dispatchEvent(new CustomEvent('presentationImageChanged', { 
          detail: images.find(img => img.isActive)?.url 
        }));
        // Diffuser le changement en temps réel
        broadcastChange('images', 'update', {
          category: 'hero',
          images,
          activeImage: images.find(img => img.isActive)?.url
        });
      } else {
        localStorage.setItem('conceptImages', JSON.stringify(conceptImages));
        // Mettre à jour le contenu du site avec la nouvelle image
        const siteContent = JSON.parse(localStorage.getItem('siteContent') || '{}');
        const activeConceptImage = conceptImages.find(img => img.isActive);
        if (activeConceptImage) {
          siteContent.concept = {
            ...siteContent.concept,
            image: activeConceptImage.url
          };
          localStorage.setItem('siteContent', JSON.stringify(siteContent));
          window.dispatchEvent(new CustomEvent('contentUpdated', { detail: siteContent }));
          // Diffuser le changement en temps réel
          broadcastChange('images', 'update', {
            category: 'concept',
            images: conceptImages,
            activeImage: activeConceptImage.url
          });
        }
      }
      toast.success('Images sauvegardées');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        toast.error('Espace de stockage insuffisant. Utilisez des images plus petites ou des liens URL.');
      } else {
        toast.error('Erreur lors de la sauvegarde des images');
      }
    }
  };

  const addImageFromUrl = async () => {
    if (!newImageUrl.trim() || !newImageName.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      const newImage: PresentationImage = {
        id: Date.now().toString(),
        url: newImageUrl.trim(),
        name: newImageName.trim(),
        type: 'url',
        isActive: false
      };

      setCurrentImages(prev => [...prev, newImage]);
      setNewImageUrl('');
      setNewImageName('');
      toast.success('Image ajoutée depuis URL');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de l\'image');
    }
  };

  const getCurrentImages = () => activeCategory === 'hero' ? images : conceptImages;
  const setCurrentImages = activeCategory === 'hero' ? setImages : setConceptImages;

  const addImageFromUrl = async () => {
    if (!newImageUrl.trim() || !newImageName.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      const newImage: PresentationImage = {
        id: Date.now().toString(),
        url: newImageUrl.trim(),
        name: newImageName.trim(),
        type: 'url',
        isActive: false
      };

      setCurrentImages(prev => [...prev, newImage]);
      setNewImageUrl('');
      setNewImageName('');
      toast.success('Image ajoutée depuis URL');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de l\'image');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image');
      return;
    }

    // Vérifier la taille (max 10MB pour les images de présentation)
    if (file.size > 100 * 1024) {
      toast.error('L\'image ne doit pas dépasser 100KB pour l\'upload direct. Utilisez un lien URL ou Google Drive pour les images plus grandes.');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        
        const newImage: PresentationImage = {
          id: Date.now().toString(),
          url: dataUrl,
          name: file.name,
          type: 'file',
          isActive: false
        };

        setCurrentImages(prev => [...prev, newImage]);
        toast.success('Image uploadée depuis votre ordinateur');
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Erreur lors de l\'upload de l\'image');
    }
  };

  const handleGoogleDriveUpload = async () => {
    const driveUrl = prompt('Collez le lien de partage Google Drive de votre image :');
    if (!driveUrl) return;

    const imageName = prompt('Nom de l\'image :') || 'Image Google Drive';
    
    // Convertir le lien Google Drive en lien direct
    let directUrl = driveUrl;
    
    if (driveUrl.includes('drive.google.com/file/d/')) {
      const fileId = driveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }

    try {
      const newImage: PresentationImage = {
        id: Date.now().toString(),
        url: directUrl,
        name: imageName,
        type: 'drive',
        isActive: false
      };

      setCurrentImages(prev => [...prev, newImage]);
      toast.success('Image ajoutée depuis Google Drive');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de l\'image');
    }
  };

  const setActiveImage = (imageId: string) => {
    setCurrentImages(prev => prev.map(img => ({
      ...img,
      isActive: img.id === imageId
    })));
  };

  const deleteImage = (imageId: string) => {
    const currentImages = getCurrentImages();
    const imageToDelete = currentImages.find(img => img.id === imageId);
    if (imageToDelete?.isActive && currentImages.length > 1) {
      toast.error('Impossible de supprimer l\'image active. Sélectionnez d\'abord une autre image.');
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      setCurrentImages(prev => {
        const filtered = prev.filter(img => img.id !== imageId);
        // Si on supprime la dernière image, créer une image par défaut
        if (filtered.length === 0) {
          const defaultUrl = activeCategory === 'hero' 
            ? 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920'
            : 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800';
          return [{
            id: Date.now().toString(),
            url: defaultUrl,
            name: 'Image par défaut',
            type: 'url' as const,
            isActive: true
          }];
        }
        // Si on supprime l'image active, activer la première
        if (imageToDelete?.isActive) {
          filtered[0].isActive = true;
        }
        return filtered;
      });
      toast.success('Image supprimée');
    }
  };

  const getTypeIcon = (type: PresentationImage['type']) => {
    switch (type) {
      case 'url': return <Link className="w-4 h-4" />;
      case 'file': return <Upload className="w-4 h-4" />;
      case 'drive': return <Image className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: PresentationImage['type']) => {
    switch (type) {
      case 'url': return 'URL';
      case 'file': return 'Fichier';
      case 'drive': return 'Drive';
    }
  };

  const currentImages = getCurrentImages();
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-2">
          Images de Présentation
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez les images d'arrière-plan de votre site web
        </p>
      </div>

      {/* Sélecteur de catégorie */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Catégorie d'images
        </h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveCategory('hero')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeCategory === 'hero'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Page d'accueil (Hero)</span>
          </button>
          <button
            onClick={() => setActiveCategory('concept')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeCategory === 'concept'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Section Concept</span>
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {activeCategory === 'hero' 
            ? 'Images d\'arrière-plan pour la page d\'accueil'
            : 'Image illustrant la section Concept de votre site'
          }
        </p>
      </div>

      {/* Méthodes d'ajout */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Ajouter une nouvelle image - {activeCategory === 'hero' ? 'Page d\'accueil' : 'Section Concept'}
        </h3>

        {/* Sélecteur de méthode */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setUploadMethod('url')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition-colors ${
              uploadMethod === 'url'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Link className="w-4 h-4" />
            <span>Lien Internet</span>
          </button>
          <button
            onClick={() => setUploadMethod('file')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition-colors ${
              uploadMethod === 'file'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Mon Ordinateur</span>
          </button>
          <button
            onClick={() => setUploadMethod('drive')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition-colors ${
              uploadMethod === 'drive'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Google Drive</span>
          </button>
        </div>

        {/* Interface selon la méthode */}
        {uploadMethod === 'url' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL de l'image
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Ajoutez l'URL de votre image
              </p>
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://images.pexels.com/photos/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom de l'image
              </label>
              <input
                type="text"
                value={newImageName}
                onChange={(e) => setNewImageName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Nom descriptif de l'image"
              />
            </div>

            <button
              onClick={addImageFromUrl}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              <Link className="w-4 h-4" />
              <span>Ajouter depuis URL</span>
            </button>
          </div>
        )}

        {uploadMethod === 'file' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sélectionner un fichier
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Taille maximale : 100KB (pour les images plus grandes, utilisez un lien URL)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
              />
            </div>
          </div>
        )}

        {uploadMethod === 'drive' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Google Drive
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Partagez votre image sur Google Drive et collez le lien de partage
              </p>
              <button
                onClick={handleGoogleDriveUpload}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Image className="w-4 h-4" />
                <span>Ajouter depuis Google Drive</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Liste des images */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Images {activeCategory === 'hero' ? 'Page d\'accueil' : 'Section Concept'} ({currentImages.length})
          </h3>
          <button
            onClick={saveImages}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Sauvegarder</span>
          </button>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={async () => {
              try {
                const history = await ContentVersioningService.getVersionHistory('images', activeCategory);
                setVersionHistory(history);
                setShowVersionHistory(true);
              } catch (error) {
                toast.error('Erreur lors du chargement de l\'historique');
              }
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Historique</span>
          </button>
        </div>

        {currentImages.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Aucune image ajoutée pour cette catégorie
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentImages.map((image) => (
              <div
                key={image.id}
                className={`relative group rounded-lg overflow-hidden border-2 transition-colors ${
                  image.isActive
                    ? 'border-yellow-500 ring-2 ring-yellow-200'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="aspect-video relative">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  
                  {/* Overlay avec actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    {!image.isActive && (
                      <button
                        onClick={() => setActiveImage(image.id)}
                        className="px-3 py-1 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700 transition-colors"
                      >
                        Activer
                      </button>
                    )}
                    <button
                      onClick={() => deleteImage(image.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Badge actif */}
                  {image.isActive && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-600 text-white text-xs rounded-md font-medium">
                      Active
                    </div>
                  )}
                  
                  {/* Badge type */}
                  <div className="absolute top-2 right-2 flex items-center space-x-1 px-2 py-1 bg-black/70 text-white text-xs rounded-md">
                    {getTypeIcon(image.type)}
                    <span>{getTypeLabel(image.type)}</span>
                  </div>
                </div>
                
                <div className="p-3">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {image.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {image.url.length > 50 ? `${image.url.substring(0, 50)}...` : image.url}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal d'historique des versions d'images */}
      {showVersionHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  Historique des Images - {activeCategory === 'hero' ? 'Page d\'accueil' : 'Section Concept'}
                </h3>
                <button
                  onClick={() => setShowVersionHistory(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {versionHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  Aucun historique disponible
                </div>
              ) : (
                <div className="space-y-4">
                  {versionHistory.map((version) => (
                    <div
                      key={version.id}
                      className={`border rounded-lg p-4 ${
                        version.is_current
                          ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            version.is_current
                              ? 'bg-yellow-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}>
                            Version {version.version_number}
                          </span>
                          {version.is_current && (
                            <span className="text-sm text-yellow-600 font-medium">
                              (Version actuelle)
                            </span>
                          )}
                        </div>
                        {!version.is_current && (
                          <button
                            onClick={async () => {
                              try {
                                const adminEmail = localStorage.getItem('currentAdminEmail') || 'nicolas.c@lacremerie.fr';
                                const adminName = adminEmail.split('@')[0];
                                
                                await ContentVersioningService.rollbackToVersion('images', version.id, adminName, adminEmail);
                                
                                // Recharger les images
                                const updatedImages = await ContentVersioningService.getCurrentPresentationImages(activeCategory);
                                if (activeCategory === 'hero') {
                                  setImages(updatedImages);
                                  localStorage.setItem('presentationImages', JSON.stringify(updatedImages));
                                } else {
                                  setConceptImages(updatedImages);
                                  localStorage.setItem('conceptImages', JSON.stringify(updatedImages));
                                }
                                
                                setShowVersionHistory(false);
                              } catch (error) {
                                toast.error('Erreur lors de la restauration');
                              }
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            Restaurer
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Auteur:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {version.author_name} ({version.author_email})
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Date:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {new Date(version.created_at).toLocaleString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm mb-3">
                        <span className="text-gray-500 dark:text-gray-400">Images:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">
                          {version.images_data?.length || 0} image(s)
                        </span>
                      </div>
                      
                      {version.change_description && (
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Description:</span>
                          <span className="ml-2 text-gray-700 dark:text-gray-300">
                            {version.change_description}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PresentationImageManager;