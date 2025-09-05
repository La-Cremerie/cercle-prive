import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Eye, Clock, MapPin, Smartphone } from 'lucide-react';
import type { UserRegistration } from '../types/database';

interface AdvancedAnalyticsProps {
  users: UserRegistration[];
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ users }) => {
  // Données simulées pour les analytics avancées
  const conversionData = [
    { name: 'Visiteurs', value: 2847, color: '#3B82F6' },
    { name: 'Inscriptions', value: users.length, color: '#10B981' },
    { name: 'Contacts', value: Math.floor(users.length * 0.3), color: '#F59E0B' },
    { name: 'Rendez-vous', value: Math.floor(users.length * 0.15), color: '#EF4444' }
  ];

  const geographicData = [
    { region: 'Île-de-France', inscriptions: Math.floor(users.length * 0.4) },
    { region: 'PACA', inscriptions: Math.floor(users.length * 0.25) },
    { region: 'Auvergne-Rhône-Alpes', inscriptions: Math.floor(users.length * 0.15) },
    { region: 'Nouvelle-Aquitaine', inscriptions: Math.floor(users.length * 0.1) },
    { region: 'Autres', inscriptions: Math.floor(users.length * 0.1) }
  ];

  const deviceData = [
    { device: 'Desktop', value: 65, color: '#8B5CF6' },
    { device: 'Mobile', value: 30, color: '#06B6D4' },
    { device: 'Tablet', value: 5, color: '#84CC16' }
  ];

  const pageViewsData = [
    { page: 'Accueil', vues: 1250, temps: '2:45' },
    { page: 'Nos Produits', vues: 890, temps: '3:20' },
    { page: 'Concept', vues: 650, temps: '2:10' },
    { page: 'Services', vues: 420, temps: '1:55' }
  ];

  const trafficSourceData = [
    { source: 'Recherche Google', visitors: 45, color: '#4285F4' },
    { source: 'Direct', visitors: 30, color: '#34A853' },
    { source: 'Réseaux sociaux', visitors: 15, color: '#EA4335' },
    { source: 'Référencement', visitors: 10, color: '#FBBC04' }
  ];

  const COLORS = ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A'];

  return (
    <div className="space-y-8">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Taux de conversion</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">
                {users.length > 0 ? ((users.length / 2847) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-green-600">
            +12% vs mois dernier
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Visiteurs uniques</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">2,847</p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-blue-600">
            +8% vs mois dernier
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Temps moyen</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">2:34</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
          <div className="mt-2 text-xs text-purple-600">
            +15% vs mois dernier
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mobile</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">30%</p>
            </div>
            <Smartphone className="w-8 h-8 text-orange-500" />
          </div>
          <div className="mt-2 text-xs text-orange-600">
            +5% vs mois dernier
          </div>
        </div>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Entonnoir de conversion */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Entonnoir de Conversion
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="#D97706" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sources de trafic */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Sources de Trafic
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trafficSourceData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="visitors"
                label={({ source, visitors }) => `${source}: ${visitors}%`}
              >
                {trafficSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analyse géographique et appareils */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Répartition géographique */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-yellow-600" />
            Répartition Géographique
          </h3>
          <div className="space-y-4">
            {geographicData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{item.region}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: `${(item.inscriptions / users.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                    {item.inscriptions}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Types d'appareils */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Types d'Appareils
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ device, value }) => `${device}: ${value}%`}
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pages populaires */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Pages les Plus Visitées
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Page
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Vues
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Temps moyen
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody>
              {pageViewsData.map((page, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{page.page}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{page.vues.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{page.temps}</td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: `${(page.vues / 1250) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;