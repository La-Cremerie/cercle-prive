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
                placeholder="Villa moderne Cannes"
              />
            </div>
            <button
              onClick={addImageFromUrl}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              <Link className="w-4 h-4" />
              <span>Ajouter l'image</span>
            </button>
          </div>
        )}

        {uploadMethod === 'file' && (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center space-x-3 px-4 py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-yellow-500 transition-colors"
            >
              <Upload className="w-12 h-12 text-gray-400" />
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">
                  Cliquez pour sélectionner une image
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-500 mt-2 space-y-1">
                  <p>JPG, PNG, WebP (max 100KB)</p>
                  <p className="text-xs">Pour des images plus grandes, utilisez un lien URL ou Google Drive</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {uploadMethod === 'drive' && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                📋 Comment obtenir un lien Google Drive :
              </h4>
              <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>1. Uploadez votre image sur Google Drive</li>
                <li>2. Clic droit sur l'image → "Obtenir le lien"</li>
                <li>3. Changez les permissions en "Visible par tous"</li>
                <li>4. Copiez et collez le lien</li>
              </ol>
            </div>
            <button
              onClick={handleGoogleDriveUpload}
              className="w-full flex items-center justify-center space-x-3 px-4 py-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Image className="w-6 h-6" />
              <span>Ajouter depuis Google Drive</span>
            </button>
          </div>
        )}
      </div>

      {/* Liste des images */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Images disponibles ({currentImages.length}) - {activeCategory === 'hero' ? 'Page d\'accueil' : 'Section Concept'}
          </h3>
          <button
            onClick={saveImages}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
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
              className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                image.isActive 
                  ? 'border-yellow-500 shadow-lg' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
                
                {/* Badge actif */}
                {image.isActive && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    ✓ Active
                  </div>
                )}

                {/* Type badge */}
                <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                  {getTypeIcon(image.type)}
                  <span>{getTypeLabel(image.type)}</span>
                </div>

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  {!image.isActive && (
                    <button
                      onClick={() => setActiveImage(image.id)}
                      className="p-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors"
                      title="Définir comme image active"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteImage(image.id)}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    title="Supprimer l'image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Informations */}
              <div className="p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1 truncate">
                  {image.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getTypeLabel(image.type)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {currentImages.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Aucune image de présentation</p>
            <p className="text-sm">Ajoutez votre première image ci-dessus</p>
          </div>
        )}
      </div>

      {/* Aperçu de l'image active */}
      {currentImages.find(img => img.isActive) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Aperçu de l'image active - {activeCategory === 'hero' ? 'Page d\'accueil' : 'Section Concept'}
          </h3>
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={currentImages.find(img => img.isActive)?.url}
              alt="Aperçu"
              className="w-full h-64 object-cover"
            />
            {activeCategory === 'hero' && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h4 className="text-2xl font-light mb-2">
                    l'excellence immobilière en toute discrétion
                  </h4>
                  <p className="text-sm opacity-90">
                    Aperçu de votre page d'accueil
                  </p>
                </div>
              </div>
            )}
            {activeCategory === 'concept' && (
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-md">
                <p className="text-sm">
                  Image de la section Concept
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PresentationImageManager;