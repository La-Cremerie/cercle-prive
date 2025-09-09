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
          'https://i.postimg.cc/wTqzXXrw/Whats-App-Image-2025-09-08-at-13-03-17-1.jpg',
          'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
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
       name: 'Villa Azurée',
        location: 'Saint-Maxime',
        price: '6 200 000 €',
        bedrooms: 5,
        bathrooms: 6,
        surface: 450,
        images: [
          'https://i.postimg.cc/XvbKDv07/Whats-App-Image-2025-09-08-at-13-05-36.jpg',
          'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
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
          'https://i.postimg.cc/G3BGcDKS/Whats-App-Image-2025-09-08-at-13-05-37.jpg',
          'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'
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
          'https://i.postimg.cc/63Y9pDfg/Whats-App-Image-2025-09-08-at-13-03-17.jpg',
          'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        description: '',
        features: [],
        type: 'villa',
        status: 'disponible',
        yield: 360000,
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
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative">
              {property.images && property.images.length > 0 && (
                <img
                  src={property.images[0]}
                  alt={property.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => handleToggleVisibility(property.id)}
                  className={`p-1 rounded-full ${
                    property.isVisible
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}
                  title={property.isVisible ? 'Masquer' : 'Afficher'}
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
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {property.name}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  property.status === 'disponible'
                    ? 'bg-green-100 text-green-800'
                    : property.status === 'vendu'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {property.status}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {property.location}
              </p>
              
              <p className="text-xl font-bold text-yellow-600 mb-3">
                {property.price}
              </p>
              
              <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="text-center">
                  <div className="font-semibold">{property.bedrooms}</div>
                  <div>Chambres</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{property.bathrooms}</div>
                  <div>SDB</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{property.surface}m²</div>
                  <div>Surface</div>
                </div>
              </div>
              
              {property.yield && (
                <div className="mb-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    Rendement: {property.yield.toLocaleString()} € / an
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(property)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
                
                <button
                  onClick={() => handleDuplicate(property)}
                  className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  title="Dupliquer"
                >
                  <Copy className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleDelete(property.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PropertyManagement;