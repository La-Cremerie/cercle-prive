import React, { useState, useEffect } from 'react';
import { Home, Plus, Edit, Trash2, Save, X, Eye, EyeOff, Copy, Upload, Download, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Property } from '../types/property';
import { useRealTimeSync } from '../hooks/useRealTimeSync';
import { ContentVersioningService } from '../services/contentVersioningService';
import toast from 'react-hot-toast';

const PropertyManagement: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(() => {
    const stored = localStorage.getItem('properties');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Données par défaut si aucune propriété stockée
    return [
      {
        id: '1',
        name: 'Villa Horizon',
        location: 'Cannes, Côte d\'Azur',
        price: '4 500 000 €',
        bedrooms: 5,
        bathrooms: 5,
        surface: 300,
        images: [
          'https://i.postimg.cc/wTqzXXrw/Whats-App-Image-2025-09-08-at-13-03-17-1.jpg'
        ],
        description: '',
        features: [],
        type: 'villa',
        status: 'disponible',
        yield: 220000,
        isVisible: true
      },
      {
        id: '2',
        name: 'Villa Azure',
        location: 'Saint-Maxime',
        price: '6 200 000 €',
        bedrooms: 5,
        bathrooms: 6,
        surface: 450,
        images: [
          'https://i.postimg.cc/XvbKDv07/Whats-App-Image-2025-09-08-at-13-05-36.jpg'
        ],
        description: '',
        features: [],
        type: 'villa',
        status: 'disponible',
        yield: 300000,
        isVisible: true
      },
      {
        id: '3',
        name: 'Bastide',
        location: 'Les Issambres',
        price: '6 900 000 €',
        bedrooms: 6,
        bathrooms: 6,
        surface: 550,
        images: [
          'https://i.postimg.cc/G3BGcDKS/Whats-App-Image-2025-09-08-at-13-05-37.jpg'
        ],
        description: '',
        features: [],
        type: 'penthouse',
        status: 'disponible',
        yield: 380000,
        isVisible: true
      },
      {
        id: '4',
        name: 'Villa traversante',
        location: 'Gassin',
        price: '5 950 000 €',
        bedrooms: 5,
        bathrooms: 4,
        surface: 300,
        images: [
          'https://i.postimg.cc/63Y9pDfg/Whats-App-Image-2025-09-08-at-13-03-17.jpg'
        ],
        description: '',
        features: [],
        type: 'villa',
        status: 'disponible',
        yield: 359996,
        isVisible: true
      },
      {
         id: '5',
         name: 'Villa cœur de village',
         location: 'Saint-Tropez',
         price: '8 900 000 €',
         bedrooms: 5,
         bathrooms: 4,
         surface: 380,
         images: [
           'https://i.postimg.cc/Qx993r8L/Whats-App-Image-2025-09-08-at-13-15-13.jpg'
         ],
         description: '',
         features: [],
         type: 'villa',
         status: 'disponible',
         yield: 450000,
         isVisible: true
       }
     ];
  });

  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<Partial<Property>>({});
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newFeature, setNewFeature] = useState('');

  const { broadcastChange } = useRealTimeSync();

  // Fonction de sauvegarde avec synchronisation automatique
  const saveProperties = async (updatedProperties: Property[]) => {
    try {
      // 1. Sauvegarder localement IMMÉDIATEMENT
      localStorage.setItem('properties', JSON.stringify(updatedProperties));
      setProperties(updatedProperties);
      
      // 2. Déclencher IMMÉDIATEMENT les événements de mise à jour
      console.log('📡 Diffusion immédiate des nouvelles propriétés');
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('propertiesReload'));
      window.dispatchEvent(new CustomEvent('adminPropertiesUpdate', { 
        detail: { properties: updatedProperties } 
      }));
      
      // 2. Synchronisation automatique vers Supabase et diffusion temps réel
      console.log('🔄 Synchronisation automatique des propriétés...');
      
      // Diffuser le changement via le système de sync temps réel
      await broadcastChange('properties', 'update', updatedProperties);
      
      // 3. Déclencher les événements de mise à jour globaux
      window.dispatchEvent(new CustomEvent('forceUpdate', { 
        detail: { 
          type: 'properties', 
          source: 'admin-modification',
          timestamp: Date.now() 
        } 
      }));
      
      console.log('✅ Propriétés synchronisées automatiquement');
      
    } catch (error) {
      console.error('❌ Erreur synchronisation automatique:', error);
      // Même en cas d'erreur, sauvegarder localement
      localStorage.setItem('properties', JSON.stringify(updatedProperties));
      setProperties(updatedProperties);
      
      // Déclencher quand même les événements locaux
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('propertiesReload'));
      
      toast.success('💾 Propriétés sauvegardées localement (synchronisation différée)', {
        duration: 4000,
        icon: '📦'
      });
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingProperty(null);
    setNewImageUrl('');
    setNewFeature('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.price) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      let updatedProperties: Property[];
      
      if (editingProperty) {
        // Modification d'une propriété existante
        updatedProperties = properties.map(p => 
          p.id === editingProperty.id 
            ? { ...editingProperty, ...formData } as Property
            : p
        );
        
        toast.success(`✅ ${formData.name || editingProperty.name} mis à jour et synchronisé automatiquement !`, {
          duration: 5000,
          icon: '🏠'
        });
      } else {
        // Nouvelle propriété
        const newProperty: Property = {
          id: crypto.randomUUID(),
          name: formData.name || '',
          location: formData.location || '',
          price: formData.price || '',
          bedrooms: formData.bedrooms || 1,
          bathrooms: formData.bathrooms || 1,
          surface: formData.surface || 100,
          images: formData.images || [],
          description: formData.description || '',
          features: formData.features || [],
          type: formData.type || 'villa',
          status: formData.status || 'disponible',
          yield: formData.yield,
          isVisible: formData.isVisible !== false
        };
        
        updatedProperties = [...properties, newProperty];
        
        toast.success(`✅ ${newProperty.name} ajouté et synchronisé automatiquement !`, {
          duration: 5000,
          icon: '🏠'
        });
      }

      // Sauvegarder avec synchronisation automatique
      await saveProperties(updatedProperties);
      
      setShowForm(false);
      resetForm();
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde de la propriété');
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData(property);
    setShowForm(true);
  };

  const handleDelete = async (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${property.name}" ?`)) {
      try {
        const updatedProperties = properties.filter(p => p.id !== propertyId);
        
        // Sauvegarder avec synchronisation automatique
        await saveProperties(updatedProperties);
        
        toast.success(`✅ ${property.name} supprimé et synchronisé automatiquement !`, {
          duration: 5000,
          icon: '🗑️'
        });
        
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleToggleVisibility = async (propertyId: string) => {
    try {
      const updatedProperties = properties.map(p => 
        p.id === propertyId 
          ? { ...p, isVisible: !p.isVisible }
          : p
      );
      
      const property = updatedProperties.find(p => p.id === propertyId);
      
      // Sauvegarder avec synchronisation automatique
      await saveProperties(updatedProperties);
      
      toast.success(`✅ ${property?.name} ${property?.isVisible ? 'affiché' : 'masqué'} et synchronisé automatiquement !`, {
        duration: 5000,
        icon: property?.isVisible ? '👁️' : '🙈'
      });
      
    } catch (error) {
      console.error('Erreur lors du changement de visibilité:', error);
      toast.error('Erreur lors du changement de visibilité');
    }
  };

  const handleDuplicate = async (property: Property) => {
    try {
      const duplicatedProperty: Property = {
        ...property,
        id: crypto.randomUUID(),
        name: `${property.name} (Copie)`,
        status: 'disponible'
      };
      
      const updatedProperties = [...properties, duplicatedProperty];
      
      // Sauvegarder avec synchronisation automatique
      await saveProperties(updatedProperties);
      
      toast.success(`✅ ${duplicatedProperty.name} créé et synchronisé automatiquement !`, {
        duration: 5000,
        icon: '📋'
      });
      
    } catch (error) {
      console.error('Erreur lors de la duplication:', error);
      toast.error('Erreur lors de la duplication');
    }
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

  // Publier toutes les données vers la version live
  const publishToLive = async () => {
    try {
      toast.loading('🚀 Publication vers version live...', { id: 'publish-live' });
      
      await ContentVersioningService.publishLocalDataToProduction();
      
      toast.success('🌐 Toutes les données publiées vers la version live !', { 
        id: 'publish-live',
        duration: 6000,
        icon: '🚀'
      });
      
    } catch (error) {
      console.error('Erreur publication live:', error);
      toast.error('Erreur lors de la publication vers la version live', { id: 'publish-live' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-gray-900 dark:text-white">
            Gestion des Biens Immobiliers
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {properties.length} bien(s) dans votre catalogue
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={publishToLive}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span>Publier Live</span>
          </button>
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
      </div>

      {/* Liste des propriétés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border-2 ${
              property.isVisible === false ? 'border-red-200 opacity-60' : 'border-transparent'
            }`}
          >
            <div className="relative">
              <img
                src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={property.name}
                className="w-full h-48 object-cover"
              />
              
              {/* Status badges */}
              <div className="absolute top-2 left-2 flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  property.status === 'disponible' 
                    ? 'bg-green-100 text-green-800'
                    : property.status === 'reserve'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {property.status === 'disponible' ? 'Disponible' : 
                   property.status === 'reserve' ? 'Réservé' : 'Vendu'}
                </span>
                
                {property.isVisible === false && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Masqué
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => handleToggleVisibility(property.id)}
                  className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                    property.isVisible === false
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                  title={property.isVisible === false ? 'Afficher' : 'Masquer'}
                >
                  {property.isVisible === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleEdit(property)}
                  className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 backdrop-blur-sm transition-colors"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDuplicate(property)}
                  className="p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 backdrop-blur-sm transition-colors"
                  title="Dupliquer"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 backdrop-blur-sm transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {property.name}
                </h3>
                <span className="text-lg font-medium text-yellow-600">
                  {property.price}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {property.location}
              </p>
              
              {/* Rendement */}
              {property.yield && property.yield > 0 && (
                <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <span className="text-sm text-green-600 font-medium">
                    Rendement : {property.yield.toLocaleString('fr-FR')} € / an
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex space-x-4">
                  <span>{property.bedrooms} ch.</span>
                  <span>{property.bathrooms} sdb</span>
                  <span>{property.surface}m²</span>
                </div>
                <span className="capitalize">{property.type}</span>
              </div>
            </div>
          </motion.div>
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
                    {editingProperty ? 'Modifier le bien' : 'Nouveau bien immobilier'}
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

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isVisible !== false}
                        onChange={(e) => setFormData(prev => ({ ...prev, isVisible: e.target.checked }))}
                        className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Visible sur le site
                      </span>
                    </label>
                  </div>
                </div>

                {/* Caractéristiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Chambres
                    </label>
                    <input
                      type="number"
                      value={formData.bedrooms || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Salles de bain
                    </label>
                    <input
                      type="number"
                      value={formData.bathrooms || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Surface (m²)
                    </label>
                    <input
                      type="number"
                      value={formData.surface || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, surface: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rendement annuel (€)
                    </label>
                    <input
                      type="number"
                      value={formData.yield || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, yield: parseInt(e.target.value) || undefined }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="180000"
                    />
                  </div>
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
                    Images (URLs)
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-3">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://images.pexels.com/..."
                      />
                      <button
                        type="button"
                        onClick={addImage}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(formData.images || []).map((image, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                          <img
                            src={image}
                            alt={`Image ${index + 1}`}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">
                            Image {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Caractéristiques */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Caractéristiques
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Piscine à débordement"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {(formData.features || []).map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                        >
                          <span>{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
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
                    <span>{editingProperty ? 'Modifier' : 'Créer'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyManagement;