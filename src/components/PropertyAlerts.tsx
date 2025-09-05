import React, { useState } from 'react';
import { Bell, X, Save, MapPin, Euro, Home } from 'lucide-react';

interface PropertyAlertsProps {
  onClose: () => void;
}

interface AlertCriteria {
  id: string;
  name: string;
  location: string;
  maxPrice: string;
  minBedrooms: number;
  minSurface: string;
  propertyType: string;
  isActive: boolean;
}

const PropertyAlerts: React.FC<PropertyAlertsProps> = ({ onClose }) => {
  const [alerts, setAlerts] = useState<AlertCriteria[]>(() => {
    const stored = localStorage.getItem('propertyAlerts');
    return stored ? JSON.parse(stored) : [];
  });

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    maxPrice: '',
    minBedrooms: 1,
    minSurface: '',
    propertyType: 'all'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    const newAlert: AlertCriteria = {
      id: Date.now().toString(),
      ...formData,
      isActive: true
    };

    const updatedAlerts = [...alerts, newAlert];
    setAlerts(updatedAlerts);
    localStorage.setItem('propertyAlerts', JSON.stringify(updatedAlerts));
    
    alert('Alerte créée avec succès');
    
    // Reset form
    setFormData({
      name: '',
      location: '',
      maxPrice: '',
      minBedrooms: 1,
      minSurface: '',
      propertyType: 'all'
    });
  };

  const toggleAlert = (alertId: string) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    );
    setAlerts(updatedAlerts);
    localStorage.setItem('propertyAlerts', JSON.stringify(updatedAlerts));
    alert('Alerte mise à jour');
  };

  const deleteAlert = (alertId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
      const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
      setAlerts(updatedAlerts);
      localStorage.setItem('propertyAlerts', JSON.stringify(updatedAlerts));
      alert('Alerte supprimée');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-yellow-600" />
              <h3 className="text-xl font-medium text-gray-900">
                Alertes Immobilières
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Formulaire de création d'alerte */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Créer une nouvelle alerte
            </h4>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'alerte *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                  placeholder="Villa Cannes avec vue mer"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localisation *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                    placeholder="Cannes, Saint-Tropez..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix maximum (€)
                  </label>
                  <input
                    type="text"
                    value={formData.maxPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxPrice: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                    placeholder="5 000 000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chambres minimum
                  </label>
                  <select
                    value={formData.minBedrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, minBedrooms: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surface minimum (m²)
                  </label>
                  <input
                    type="text"
                    value={formData.minSurface}
                    onChange={(e) => setFormData(prev => ({ ...prev, minSurface: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                    placeholder="200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de bien
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="all">Tous types</option>
                  <option value="villa">Villa</option>
                  <option value="appartement">Appartement</option>
                  <option value="penthouse">Penthouse</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>Créer l'alerte</span>
              </button>
            </form>
          </div>

          {/* Liste des alertes existantes */}
          {alerts.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Vos alertes actives ({alerts.filter(a => a.isActive).length})
              </h4>
              
              <div className="space-y-4">
                {alerts.map(alert => (
                  <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">
                        {alert.name}
                      </h5>
                      <div className="flex items-center space-x-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={alert.isActive}
                            onChange={() => toggleAlert(alert.id)}
                            className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                          />
                          <span className="text-sm text-gray-600">Active</span>
                        </label>
                        <button
                          onClick={() => deleteAlert(alert.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{alert.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Euro className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Max {alert.maxPrice}€</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Home className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{alert.minBedrooms}+ ch.</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">{alert.minSurface}+ m²</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyAlerts;