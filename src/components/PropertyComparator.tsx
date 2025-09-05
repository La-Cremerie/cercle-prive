import React, { useState } from 'react';
import { GitCompare as Compare, X, Plus, Minus } from 'lucide-react';
import type { Property } from '../types/property';

interface PropertyComparatorProps {
  properties: Property[];
  onClose: () => void;
}

const PropertyComparator: React.FC<PropertyComparatorProps> = ({ properties, onClose }) => {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);

  const addProperty = (property: Property) => {
    if (selectedProperties.length < 3 && !selectedProperties.find(p => p.id === property.id)) {
      setSelectedProperties(prev => [...prev, property]);
    }
  };

  const removeProperty = (propertyId: string) => {
    setSelectedProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Comparateur de Biens
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Sélection des biens */}
          {selectedProperties.length < 3 && (
            <div className="mb-8">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Sélectionnez des biens à comparer (max 3)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties
                  .filter(p => !selectedProperties.find(sp => sp.id === p.id))
                  .map(property => (
                    <div key={property.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <img
                        src={property.images[0]}
                        alt={property.name}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                        {property.name}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {property.location}
                      </p>
                      <button
                        onClick={() => addProperty(property)}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Comparaison */}
          {selectedProperties.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                      Critères
                    </th>
                    {selectedProperties.map(property => (
                      <th key={property.id} className="text-center py-4 px-4">
                        <div className="space-y-2">
                          <img
                            src={property.images[0]}
                            alt={property.name}
                            className="w-20 h-16 object-cover rounded-md mx-auto"
                          />
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {property.name}
                          </div>
                          <button
                            onClick={() => removeProperty(property.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Prix</td>
                    {selectedProperties.map(property => (
                      <td key={property.id} className="py-3 px-4 text-center text-sm text-gray-700 dark:text-gray-300">
                        {property.price}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Localisation</td>
                    {selectedProperties.map(property => (
                      <td key={property.id} className="py-3 px-4 text-center text-sm text-gray-700 dark:text-gray-300">
                        {property.location}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Surface</td>
                    {selectedProperties.map(property => (
                      <td key={property.id} className="py-3 px-4 text-center text-sm text-gray-700 dark:text-gray-300">
                        {property.surface} m²
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Chambres</td>
                    {selectedProperties.map(property => (
                      <td key={property.id} className="py-3 px-4 text-center text-sm text-gray-700 dark:text-gray-300">
                        {property.bedrooms}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Salles de bain</td>
                    {selectedProperties.map(property => (
                      <td key={property.id} className="py-3 px-4 text-center text-sm text-gray-700 dark:text-gray-300">
                        {property.bathrooms}
                      </td>
                    ))}
                  </tr>
                  {selectedProperties.some(p => p.yield) && (
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Rendement annuel</td>
                      {selectedProperties.map(property => (
                        <td key={property.id} className="py-3 px-4 text-center text-sm text-gray-700 dark:text-gray-300">
                          {property.yield ? `${property.yield.toLocaleString('fr-FR')} €` : 'N/A'}
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PropertyComparator;