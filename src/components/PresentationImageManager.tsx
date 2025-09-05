import React, { useState, useRef } from 'react';
import { Image, Upload, Link, Save, X, Eye, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

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
  
  const saveImages = () => {
    try {
      if (activeCategory === 'hero') {
        localStorage.setItem('presentationImages', JSON.stringify(images));
        // Déclencher un événement pour mettre à jour le hero
        window.dispatchEvent(new CustomEvent('presentationImageChanged', { 
          detail: images.find(img => img.isActive)?.url 
        }));
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
                placeholder="Nom de l'image"
              />
            </div>
            <button
              onClick={addImageFromUrl}
              className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-2"
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
                Maximum 100KB pour l'upload direct
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {uploadMethod === 'drive' && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Cliquez sur le bouton ci-dessous pour ajouter une image depuis Google Drive
              </p>
              <button
                onClick={handleGoogleDriveUpload}
                className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-2"
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
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Sauvegarder</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentImages.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden ${
                image.isActive ? 'ring-2 ring-yellow-500' : ''
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
                {image.isActive && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Active
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  {getTypeIcon(image.type)}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {getTypeLabel(image.type)}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 truncate">
                  {image.name}
                </h4>
                
                <div className="flex space-x-2">
                  {!image.isActive && (
                    <button
                      onClick={() => setActiveImage(image.id)}
                      className="flex-1 bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Activer</span>
                    </button>
                  )}
                  <button
                    onClick={() => deleteImage(image.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PresentationImageManager;