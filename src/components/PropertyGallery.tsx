import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, MapPin, Bed, Bath, Square, Eye, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Property } from '../types/property';
import PropertyComparator from './PropertyComparator';
import RentabilityCalculator from './RentabilityCalculator';
import PropertyAlerts from './PropertyAlerts';

// Utiliser les données depuis localStorage ou données par défaut
const getPropertiesFromStorage = () => {
  const stored = localStorage.getItem('properties');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Données par défaut
  return [
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
      type: 'villa',
      status: 'disponible',
      yield: 180000
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
      type: 'villa',
      status: 'disponible',
      yield: 248000
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
      type: 'penthouse',
      status: 'reserve',
      yield: 512000
    }
  ];
};

const PropertyGallery: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | 'villa' | 'appartement' | 'penthouse'>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [properties, setProperties] = useState(() => getPropertiesFromStorage());
  const [showComparator, setShowComparator] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  // Écouter les changements dans localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setProperties(getPropertiesFromStorage());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredProperties = filter === 'all' 
    ? properties 
    : properties.filter(p => p.type === filter);

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
          
          {/* Outils avancés */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setShowCalculator(true)}
              className="px-4 py-2 bg-white border-2 border-yellow-600 text-yellow-600 rounded-md hover:bg-yellow-50 transition-colors text-sm"
            >
              Calculateur de Rentabilité
            </button>
            <button
              onClick={() => setShowComparator(true)}
              className="px-4 py-2 bg-white border-2 border-yellow-600 text-yellow-600 rounded-md hover:bg-yellow-50 transition-colors text-sm"
            >
              Comparer les Biens
            </button>
            <button
              onClick={() => setShowAlerts(true)}
              className="px-4 py-2 bg-white border-2 border-yellow-600 text-yellow-600 rounded-md hover:bg-yellow-50 transition-colors text-sm"
            >
              Créer une Alerte
            </button>
          </div>
          
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
                  src={property.images[0]}
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
                
                {/* Rendement */}
                {property.yield && (
                  <div className="mb-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Rendement : <span className="font-medium text-green-600">{property.yield.toLocaleString('fr-FR')} € / an</span>
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
                      src={selectedProperty.images[currentImageIndex]}
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Ajouter à la comparaison (sera géré par le composant PropertyComparator)
                      }}
                      className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white backdrop-blur-sm transition-colors"
                      title="Ajouter à la comparaison"
                    >
                      <Plus className="w-4 h-4" />
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