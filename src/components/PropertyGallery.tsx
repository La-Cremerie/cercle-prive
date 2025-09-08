import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, MapPin, Bed, Bath, Square, Eye, X, Plus, Calculator, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Property } from '../types/property';

// Utiliser les données depuis localStorage ou données par défaut
const getPropertiesFromStorage = () => {
  const stored = localStorage.getItem('properties');
  if (stored) {
    try {
      const properties = JSON.parse(stored);
      console.log('🏠 Propriétés chargées depuis localStorage:', properties.length);
      return properties;
    } catch (error) {
      console.error('❌ Erreur parsing propriétés localStorage:', error);
      return getDefaultProperties();
    }
  }
  
  return getDefaultProperties();
};

// Données par défaut séparées pour réutilisation
const getDefaultProperties = () => {
  console.log('📦 Utilisation des propriétés par défaut');
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
        'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: '',
      features: [],
      type: 'villa',
      status: 'disponible',
      yield: 220000
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
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: '',
      features: [],
      type: 'villa',
      status: 'disponible',
      yield: 300000
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
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: '',
      features: [],
      type: 'penthouse',
      status: 'disponible',
      yield: 380000
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
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: '',
      features: [],
      type: 'villa',
      status: 'disponible',
      yield: 359996
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
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Villa d\'exception au cœur du village de Saint-Tropez. Emplacement unique et prestations de luxe dans l\'un des lieux les plus prisés de la Côte d\'Azur.',
      features: ['Cœur de Saint-Tropez', 'Emplacement unique', 'Prestations luxe', 'Terrasse panoramique', 'Garage sécurisé'],
      type: 'villa',
      status: 'vendu',
      yield: 450000,
      isVisible: true
    },
    {
      id: '6',
      name: '',
      location: '',
      price: '',
      bedrooms: 0,
      bathrooms: 0,
      surface: 0,
      images: [
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: '',
      features: [],
      type: 'villa',
      status: 'vendu',
      yield: 0,
      isVisible: true
    }
  ];
};

const PropertyGallery: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | 'villa' | 'appartement' | 'penthouse'>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [properties, setProperties] = useState(() => getPropertiesFromStorage());

  // Écouter les changements dans localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('🏠 PropertyGallery: Changement détecté, rechargement des propriétés...');
      const newProperties = getPropertiesFromStorage();
      console.log('🔄 Nouvelles propriétés chargées:', newProperties.length);
      setProperties(newProperties);
    };

    const handleForceUpdate = (event: CustomEvent) => {
      if (event.detail?.type === 'properties') {
        console.log('🏠 PropertyGallery: Mise à jour forcée des propriétés');
        const newProperties = getPropertiesFromStorage();
        console.log('⚡ Propriétés mises à jour:', newProperties.length);
        setProperties(newProperties);
        
        // Notification visuelle pour l'utilisateur final
        if (event.detail?.source === 'admin-modification') {
          import('react-hot-toast').then(({ default: toast }) => {
            toast.success('🔄 Catalogue mis à jour en temps réel !', {
              duration: 3000,
              icon: '✨'
            });
          }).catch(() => {
            console.log('✨ Catalogue mis à jour en temps réel !');
          });
        }
      } else if (event.detail?.type === 'all') {
        console.log('🔄 PropertyGallery: Mise à jour globale');
        const newProperties = getPropertiesFromStorage();
        setProperties(newProperties);
      }
    };

    // Nouveau gestionnaire pour forcer le rechargement immédiat
    const handleImmediateReload = () => {
      console.log('⚡ PropertyGallery: Rechargement immédiat des propriétés');
      const newProperties = getPropertiesFromStorage();
      setProperties(newProperties);
    };

    // Gestionnaire pour les modifications admin
    const handleAdminUpdate = (event: CustomEvent) => {
      console.log('👨‍💼 PropertyGallery: Modification admin détectée:', event.detail);
      if (event.detail?.properties) {
        console.log('📊 Nouvelles propriétés depuis admin:', event.detail.properties.length);
        setProperties(event.detail.properties);
        localStorage.setItem('properties', JSON.stringify(event.detail.properties));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('forceUpdate', handleForceUpdate as EventListener);
    window.addEventListener('propertiesReload', handleImmediateReload);
    window.addEventListener('adminPropertiesUpdate', handleAdminUpdate as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('forceUpdate', handleForceUpdate as EventListener);
      window.removeEventListener('propertiesReload', handleImmediateReload);
      window.removeEventListener('adminPropertiesUpdate', handleAdminUpdate as EventListener);
    };
  }, []);

  // Vérifier et charger les propriétés au montage
  useEffect(() => {
    console.log('🏠 PropertyGallery: Vérification des propriétés au montage');
    const currentProperties = getPropertiesFromStorage();
    
    if (currentProperties.length !== properties.length) {
      console.log('🔄 Mise à jour nécessaire des propriétés');
      setProperties(currentProperties);
    }
    
    // Vérifier périodiquement les mises à jour
    const interval = setInterval(() => {
      const latestProperties = getPropertiesFromStorage();
      if (JSON.stringify(latestProperties) !== JSON.stringify(properties)) {
        console.log('🔄 Propriétés mises à jour automatiquement');
        setProperties(latestProperties);
      }
    }, 5000); // Vérifier toutes les 5 secondes
    
    return () => clearInterval(interval);
  }, [properties]);

  const filteredProperties = filter === 'all' 
    ? properties.filter(p => p.isVisible !== false)
    : properties.filter(p => p.type === filter && p.isVisible !== false);

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  const nextImage = () => {
    if (selectedProperty) {
      setCurrentImageIndex((prev) => 
        prev === selectedProperty.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProperty) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProperty.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <section id="galerie-biens" className="py-20 lg:py-32 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-light text-yellow-600 tracking-wide mb-8">
            ACHETER
          </h2>
          
          {/* Filtres */}
          <div className="flex justify-center space-x-4 mb-8">
            {[
              { key: 'all', label: 'Tous' },
              { key: 'villa', label: 'Villas' },
              { key: 'penthouse', label: 'Penthouses' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-6 py-2 rounded-full text-sm font-light transition-colors ${
                  filter === key
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des propriétés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative overflow-hidden">
                <img
                  src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={property.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Status Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${
                  property.status === 'disponible' 
                    ? 'bg-green-100 text-green-800'
                    : property.status === 'reserve'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {property.status === 'disponible' ? 'Disponible' : 
                   property.status === 'reserve' ? 'Réservé' : 'Vendu'}
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(property.id);
                    }}
                    className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                      favorites.has(property.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.has(property.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProperty(property);
                      setCurrentImageIndex(0);
                    }}
                    className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white backdrop-blur-sm transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-light text-gray-900 dark:text-white">
                    {property.name}
                  </h3>
                  <span className="text-lg font-medium text-yellow-600">
                    {property.price}
                  </span>
                </div>
                
                {/* Rendement */}
                {property.yield && property.yield > 0 && (
                  <div className="mb-3">
                    <span className="text-sm text-green-600 font-medium">
                      Rendement : {property.yield.toLocaleString('fr-FR')} € / an
                    </span>
                  </div>
                )}
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
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
            </motion.div>
          ))}
        </div>

        {/* Modal de détail */}
        <AnimatePresence>
          {selectedProperty && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedProperty(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  {/* Image carousel */}
                  <div className="relative h-96">
                    <img
                      src={selectedProperty.images && selectedProperty.images.length > 0 ? selectedProperty.images[currentImageIndex] : 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'}
                      alt={selectedProperty.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {selectedProperty.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white transition-colors"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white transition-colors"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}

                    {/* Image indicators */}
                    {selectedProperty.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {selectedProperty.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Close button */}
                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-2">
                        {selectedProperty.name}
                      </h2>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span>{selectedProperty.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-medium text-yellow-600 mb-2">
                        {selectedProperty.price}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        selectedProperty.status === 'disponible' 
                          ? 'bg-green-100 text-green-800'
                          : selectedProperty.status === 'reserve'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedProperty.status === 'disponible' ? 'Disponible' : 
                         selectedProperty.status === 'reserve' ? 'Réservé' : 'Vendu'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Rendement dans le modal */}
                  {selectedProperty.yield && (
                    <div className="text-center mt-4">
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="text-sm text-green-700 dark:text-green-300 mb-1">
                          Rendement locatif estimé
                        </div>
                        <div className="text-xl font-medium text-green-600">
                          {selectedProperty.yield.toLocaleString('fr-FR')} € / an
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Soit {Math.round(selectedProperty.yield / 12).toLocaleString('fr-FR')} € / mois
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Caractéristiques */}
                  <div className="grid grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-center">
                      <Bed className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-light text-gray-900 dark:text-white">
                        {selectedProperty.bedrooms}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Chambres
                      </div>
                    </div>
                    <div className="text-center">
                      <Bath className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-light text-gray-900 dark:text-white">
                        {selectedProperty.bathrooms}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Salles de bain
                      </div>
                    </div>
                    <div className="text-center">
                      <Square className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-light text-gray-900 dark:text-white">
                        {selectedProperty.surface}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        m²
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                      Description
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {selectedProperty.description}
                    </p>
                  </div>

                  {/* Caractéristiques spéciales */}
                  <div className="mb-8">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                      Caractéristiques
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedProperty.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></div>
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => toggleFavorite(selectedProperty.id)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-colors ${
                        favorites.has(selectedProperty.id)
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${favorites.has(selectedProperty.id) ? 'fill-current' : ''}`} />
                      <span>{favorites.has(selectedProperty.id) ? 'Retiré des favoris' : 'Ajouter aux favoris'}</span>
                    </button>
                    <a
                      href="mailto:nicolas.c@lacremerie.fr?subject=Demande d'information - Villa Horizon"
                      className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-md hover:bg-yellow-700 transition-colors text-center font-medium"
                    >
                      Demander des informations
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default PropertyGallery;