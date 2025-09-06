import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Home, MapPin, Bed, Bath, Square, Upload, Link, Image, Copy, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRealTimeSync } from '../hooks/useRealTimeSync';
import { ContentVersioningService } from '../services/contentVersioningService';

interface Property {
  id: string;
  name: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  surface: number;
  images: string[];
  description: string;
  features: string[];
  type: 'villa' | 'appartement' | 'penthouse';
  status: 'disponible' | 'vendu' | 'reserve';
  yield?: number;
}

const PropertyManagement: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(() => {
    const stored = localStorage.getItem('properties');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Données par défaut
    const defaultProperties = [
      {
        id: '1',
        name: 'Villa Horizon',
        location: 'Cannes, Côte d\'Azur',
        price: '4 500 000 €',
        bedrooms: 6,
        bathrooms: 4,
        surface: 450,
        images: [
          'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        description: 'Villa d\'exception avec vue panoramique sur la mer Méditerranée. Architecture contemporaine et finitions haut de gamme.',
        features: ['Piscine à débordement', 'Vue mer panoramique', 'Garage 3 voitures', 'Jardin paysager'],
        type: 'villa' as const,
        status: 'disponible' as const,
        yield: 180000,
        isVisible: true
      },
      {
        id: '2',
        name: 'Villa Azure',
        location: 'Saint-Tropez',
        price: '6 200 000 €',
        bedrooms: 8,
        bathrooms: 6,
        surface: 600,
        images: [
          'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        description: 'Propriété d\'exception dans un domaine privé sécurisé. Design architectural unique.',
        features: ['Domaine privé', 'Spa privé', 'Court de tennis', 'Héliport'],
        type: 'villa' as const,
        status: 'disponible' as const,
        yield: 248000,
        isVisible: true
      },
      {
        id: '3',
        name: 'Penthouse Élégance',
        location: 'Monaco, Monte-Carlo',
        price: '12 800 000 €',
        bedrooms: 4,
        bathrooms: 3,
        surface: 280,
        images: [
          'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        description: 'Penthouse exceptionnel au cœur de Monaco avec terrasse panoramique.',
        features: ['Terrasse 200m²', 'Vue mer et ville', 'Concierge 24h/24', 'Parking privé'],
        type: 'penthouse' as const,
        status: 'reserve' as const,
        yield: 512000,
        isVisible: true
      }
    ];
    
    localStorage.setItem('properties', JSON.stringify(defaultProperties));
    return defaultProperties;
  });

  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<Partial<Property>>({
    name: '',
    location: '',
    price: '',
    bedrooms: 1,
    bathrooms: 1,
    surface: 0,
    images: [],
    description: '',
    features: [],
    type: 'villa',
    status: 'disponible',
    yield: 0,
    isVisible: true
  });
  const [newFeature, setNewFeature] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file' | 'drive'>('url');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { broadcastChange } = useRealTimeSync('property-management');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [selectedPropertyHistory, setSelectedPropertyHistory] = useState<string | null>(null);
  const [versionHistory, setVersionHistory] = useState<any[]>([]);

  // Charger les propriétés depuis Supabase au démarrage
  useEffect(() => {
    const loadPropertiesFromSupabase = async () => {
      try {
        const supabaseProperties = await ContentVersioningService.getCurrentProperties();
        if (supabaseProperties.length > 0) {
          setProperties(supabaseProperties);
          localStorage.setItem('properties', JSON.stringify(supabaseProperties));
        }
      } catch (error) {
        console.warn('Erreur chargement propriétés Supabase:', error);
      }
    };

    loadPropertiesFromSupabase();
  }, []);

  // Écouter les changements dans localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('properties');
      if (stored) {
        setProperties(JSON.parse(stored));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      price: '',
      bedrooms: 1,
      bathrooms: 1,
      surface: 0,
      images: [],
      description: '',
      features: [],
      type: 'villa',
      status: 'disponible',
      isVisible: true
    });
    setNewFeature('');
    setNewImageUrl('');
    setEditingProperty(null);
  };
  const showPropertyHistory = async (propertyId: string) => {
    setSelectedPropertyHistory(propertyId);
    try {
      const history = await ContentVersioningService.getVersionHistory('properties', propertyId);
      setVersionHistory(history);
      setShowVersionHistory(true);
    } catch (error) {
      toast.error('Erreur lors du chargement de l\'historique');
    }
  };

  const rollbackPropertyToVersion = async (versionId: string, versionNumber: number) => {
    if (window.confirm(`Restaurer la propriété à la version ${versionNumber} ?`)) {
      try {
        const adminEmail = localStorage.getItem('currentAdminEmail') || 'nicolas.c@lacremerie.fr';
        const adminName = adminEmail.split('@')[0];
        
        await ContentVersioningService.rollbackToVersion('properties', versionId, adminName, adminEmail);
        
        // Recharger les propriétés
        const updatedProperties = await ContentVersioningService.getCurrentProperties();
        setProperties(updatedProperties);
        localStorage.setItem('properties', JSON.stringify(updatedProperties));
        window.dispatchEvent(new Event('storage'));
        
        setShowVersionHistory(false);
      } catch (error) {
        toast.error('Erreur lors de la restauration');
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner un fichier image');
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 100 * 1024) {
        toast.error('L\'image ne doit pas dépasser 100KB pour éviter les problèmes de stockage');
        return;
      }

      // Convertir en base64 pour stockage local
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), base64String]
        }));
        toast.success('Image ajoutée avec succès');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoogleDriveLink = () => {
    const driveUrl = prompt('Collez le lien de partage Google Drive de votre image :');
    if (driveUrl) {
      // Convertir le lien Google Drive en lien direct
      let directUrl = driveUrl;
      
      // Si c'est un lien de partage Google Drive, le convertir
      if (driveUrl.includes('drive.google.com/file/d/')) {
        const fileId = driveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
        if (fileId) {
          directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        }
      }
      
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), directUrl]
      }));
      toast.success('Image Google Drive ajoutée');
    }
  };


  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData(property);
    setShowForm(true);
  };

  const handleDuplicate = (property: Property) => {
    const duplicatedProperty = {
      ...property,
      id: Date.now().toString(),
      name: `${property.name} (Copie)`,
      status: 'disponible' as const
    };
    
    const updatedProperties = [...properties, duplicatedProperty];
    try {
      setProperties(updatedProperties);
      localStorage.setItem('properties', JSON.stringify(updatedProperties));
      window.dispatchEvent(new Event('storage'));
      toast.success(`Bien "${property.name}" dupliqué avec succès`);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        toast.error('Espace de stockage insuffisant pour dupliquer ce bien.');
      } else {
        toast.error('Erreur lors de la duplication');
      }
    }
  };

  const handleDelete = (propertyId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) {
      const updatedProperties = properties.filter(p => p.id !== propertyId);
      setProperties(updatedProperties);
      localStorage.setItem('properties', JSON.stringify(updatedProperties));
      // Diffuser le changement en temps réel
      broadcastChange('properties', 'delete', { id: propertyId });
      window.dispatchEvent(new Event('storage'));
      toast.success('Bien supprimé avec succès');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.price) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const propertyData: Property = {
      id: editingProperty?.id || Date.now().toString(),
      name: formData.name!,
      location: formData.location!,
      price: formData.price!,
      bedrooms: formData.bedrooms || 1,
      bathrooms: formData.bathrooms || 1,
      surface: formData.surface || 0,
      images: formData.images || [],
      description: formData.description || '',
      features: formData.features || [],
      type: formData.type || 'villa',
      status: formData.status || 'disponible',
      yield: formData.yield || 0,
      isVisible: formData.isVisible !== false
    };

    // Sauvegarder dans Supabase avec versioning
    const saveToSupabase = async () => {
      try {
        const adminEmail = localStorage.getItem('currentAdminEmail') || 'nicolas.c@lacremerie.fr';
        const adminName = adminEmail.split('@')[0];
        
        await ContentVersioningService.savePropertyVersion(
          propertyData,
          adminName,
          adminEmail,
          editingProperty ? `Modification de ${propertyData.name}` : `Création de ${propertyData.name}`
        );
        
        console.log('✅ Propriété sauvegardée dans Supabase avec versioning');
      } catch (error) {
        console.warn('⚠️ Erreur sauvegarde Supabase, utilisation localStorage:', error);
      }
    };

    saveToSupabase();

    if (editingProperty) {
      const updatedProperties = properties.map(p => p.id === editingProperty.id ? propertyData : p);
      try {
        setProperties(updatedProperties);
        localStorage.setItem('properties', JSON.stringify(updatedProperties));
        // Diffuser le changement en temps réel
        broadcastChange('properties', 'update', propertyData);
        toast.success('Bien modifié avec succès');
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          toast.error('Espace de stockage insuffisant. Utilisez des images plus petites ou des liens externes.');
        } else {
          toast.error('Erreur lors de la sauvegarde');
        }
        return;
      }
    } else {
      const updatedProperties = [...properties, propertyData];
      try {
        setProperties(updatedProperties);
        localStorage.setItem('properties', JSON.stringify(updatedProperties));
        // Diffuser le changement en temps réel
        broadcastChange('properties', 'create', propertyData);
        toast.success('Nouveau bien ajouté avec succès');
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          toast.error('Espace de stockage insuffisant. Utilisez des images plus petites ou des liens externes.');
        } else {
          toast.error('Erreur lors de la sauvegarde');
        }
        return;
      }
    }

    // Déclencher un événement pour synchroniser avec la galerie
    window.dispatchEvent(new Event('storage'));
    setShowForm(false);
    resetForm();
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'disponible': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'reserve': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'vendu': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header avec bouton d'ajout */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-gray-900 dark:text-white">
            Gestion des Biens Immobiliers
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {properties.length} bien(s) dans votre catalogue
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter un bien</span>
        </button>
      </div>

      {/* Liste des biens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="relative">
              <img
                src={property.images[0] || 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={property.name}
                className="w-full h-48 object-cover"
              />
              
              {/* Status Badge */}
              <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                {property.status === 'disponible' ? 'Disponible' : 
                 property.status === 'reserve' ? 'Réservé' : 'Vendu'}
              </div>
              
              {/* Visibility Badge */}
              <div className={`absolute top-3 left-20 px-2 py-1 rounded-full text-xs font-medium ${
                property.isVisible 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {property.isVisible ? 'Visible' : 'Masqué'}
              </div>

              {/* Actions */}
              <div className="absolute top-3 right-3 flex space-x-2">
                <button
                  onClick={() => handleEdit(property)}
                  className="p-2 bg-white/90 text-gray-700 rounded-full hover:bg-white transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDuplicate(property)}
                  className="p-2 bg-white/90 text-blue-600 rounded-full hover:bg-white transition-colors"
                  title="Dupliquer ce bien"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => showPropertyHistory(property.id)}
                  className="p-2 bg-white/90 text-purple-600 rounded-full hover:bg-white transition-colors"
                  title="Voir l'historique"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="p-2 bg-white/90 text-red-600 rounded-full hover:bg-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {/* Toggle visibility button */}
              <div className="absolute bottom-3 right-3">
                <button
                  onClick={() => {
                    const updatedProperties = properties.map(p => 
                      p.id === property.id 
                        ? { ...p, isVisible: !p.isVisible }
                        : p
                    );
                    setProperties(updatedProperties);
                    localStorage.setItem('properties', JSON.stringify(updatedProperties));
                    window.dispatchEvent(new Event('storage'));
                    toast.success(`Bien ${property.isVisible ? 'masqué' : 'rendu visible'}`);
                  }}
                  className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                    property.isVisible
                      ? 'bg-green-500/80 text-white hover:bg-green-600'
                      : 'bg-red-500/80 text-white hover:bg-red-600'
                  }`}
                  title={property.isVisible ? 'Masquer ce bien' : 'Rendre visible ce bien'}
                >
                  {property.isVisible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {property.name}
              </h3>
              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>
              <div className="text-xl font-medium text-yellow-600 mb-3">
                {property.price}
              </div>
              
              {/* Rendement */}
              {property.yield && property.yield > 0 && (
                <div className="mb-3">
                  <span className="text-sm text-green-600 font-medium">
                    {property.yield.toLocaleString('fr-FR')} € / an
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="w-4 h-4 mr-1" />
                    <span>{property.surface}m²</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de formulaire */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    {editingProperty ? 'Modifier le bien' : 'Ajouter un nouveau bien'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom du bien *
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Villa Horizon"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Localisation *
                    </label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Cannes, Côte d'Azur"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prix *
                    </label>
                    <input
                      type="text"
                      value={formData.price || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="4 500 000 €"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type de bien
                    </label>
                    <select
                      value={formData.type || 'villa'}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Property['type'] }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="villa">Villa</option>
                      <option value="appartement">Appartement</option>
                      <option value="penthouse">Penthouse</option>
                    </select>
                  </div>
                </div>

                {/* Caractéristiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Chambres
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.bedrooms || 1}
                      onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Salles de bain
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.bathrooms || 1}
                      onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rendement annuel (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.yield || 0}
                      onChange={(e) => setFormData(prev => ({ ...prev, yield: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="180000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Surface (m²)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.surface || 0}
                      onChange={(e) => setFormData(prev => ({ ...prev, surface: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Statut */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Statut
                  </label>
                  <select
                    value={formData.status || 'disponible'}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Property['status'] }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="reserve">Réservé</option>
                    <option value="vendu">Vendu</option>
                  </select>
                </div>
                
                {/* Visibilité */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Visibilité sur le site
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="visibility"
                        value="visible"
                        checked={formData.isVisible !== false}
                        onChange={() => setFormData(prev => ({ ...prev, isVisible: true }))}
                        className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Visible</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="visibility"
                        value="hidden"
                        checked={formData.isVisible === false}
                        onChange={() => setFormData(prev => ({ ...prev, isVisible: false }))}
                        className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Masqué</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Les biens masqués n'apparaîtront pas sur le site public
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Description détaillée du bien..."
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Images
                  </label>
                  <div className="space-y-3">
                    {/* Méthodes d'ajout d'images */}
                    <div className="flex space-x-2 mb-4">
                      <button
                        type="button"
                        onClick={() => setUploadMethod('url')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition-colors ${
                          uploadMethod === 'url'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <Link className="w-4 h-4" />
                        <span>URL</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadMethod('file')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition-colors ${
                          uploadMethod === 'file'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <Upload className="w-4 h-4" />
                        <span>Fichier</span>
                      </button>
                      <button
                        type="button"
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

                    {/* Interface selon la méthode choisie */}
                    {uploadMethod === 'url' && (
                      <div className="flex space-x-3">
                        <input
                          type="url"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="https://images.pexels.com/photos/..."
                        />
                        <button
                          type="button"
                          onClick={addImage}
                          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {uploadMethod === 'file' && (
                      <div className="space-y-3">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex items-center justify-center space-x-3 px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-yellow-500 transition-colors"
                        >
                          <Upload className="w-8 h-8 text-gray-400" />
                          <div className="text-center">
                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                              Cliquez pour sélectionner une image
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              JPG, PNG, WebP (max 100KB)
                            </p>
                          </div>
                        </button>
                      </div>
                    )}

                    {uploadMethod === 'drive' && (
                      <div className="space-y-3">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                            Comment obtenir un lien Google Drive :
                          </h4>
                          <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                            <li>1. Uploadez votre image sur Google Drive</li>
                            <li>2. Clic droit → "Obtenir le lien"</li>
                            <li>3. Changez les permissions en "Visible par tous"</li>
                            <li>4. Copiez le lien et collez-le ci-dessous</li>
                          </ol>
                        </div>
                        <button
                          type="button"
                          onClick={handleGoogleDriveLink}
                          className="w-full flex items-center justify-center space-x-3 px-4 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Image className="w-5 h-5" />
                          <span>Ajouter depuis Google Drive</span>
                        </button>
                      </div>
                    )}
                    </div>
                    
                    {formData.images && formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {/* Indicateur du type d'image */}
                            <div className="absolute bottom-1 left-1 px-2 py-1 bg-black/70 text-white text-xs rounded">
                              {image.startsWith('data:') ? 'Fichier' : 
                               image.includes('drive.google.com') ? 'Drive' : 'URL'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {formData.images && formData.images.length > 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formData.images.length} image(s) ajoutée(s)
                      </p>
                    )}
                </div>

                {/* Caractéristiques */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Caractéristiques spéciales
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Piscine à débordement, Vue mer panoramique..."
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {formData.features && formData.features.length > 0 && (
                      <div className="space-y-2">
                        {formData.features.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingProperty ? 'Modifier' : 'Ajouter'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal d'historique des versions de propriété */}
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
                  Historique des Versions - Propriété
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
                  Aucun historique disponible pour cette propriété
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
                          <span className="text-sm text-gray-900 dark:text-white font-medium">
                            {version.name}
                          </span>
                          {version.is_current && (
                            <span className="text-sm text-yellow-600 font-medium">
                              (Version actuelle)
                            </span>
                          )}
                        </div>
                        {!version.is_current && (
                          <button
                            onClick={() => rollbackPropertyToVersion(version.id, version.version_number)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            Restaurer
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Prix:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{version.price}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Localisation:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{version.location}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Statut:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{version.status}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                      
                      {version.change_description && (
                        <div className="mt-3 text-sm">
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

export default PropertyManagement;