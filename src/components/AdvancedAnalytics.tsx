import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Eye, Clock, MapPin, Smartphone, Globe, MousePointer, Activity } from 'lucide-react';
import type { UserRegistration } from '../types/database';

interface AdvancedAnalyticsProps {
  users: UserRegistration[];
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ users }) => {
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 0,
    pageViews: 0,
    bounceRate: 0,
    avgSessionDuration: 0
  });

  // Simulation de données en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        activeUsers: Math.floor(Math.random() * 15) + 5,
        pageViews: Math.floor(Math.random() * 50) + 100,
        bounceRate: Math.floor(Math.random() * 20) + 25,
        avgSessionDuration: Math.floor(Math.random() * 120) + 180
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Données simulées pour les analytics avancées
  const conversionData = [
    { name: 'Visiteurs', value: 2847, color: '#3B82F6', percentage: 100 },
    { name: 'Pages vues', value: 8542, color: '#10B981', percentage: 300 },
    { name: 'Inscriptions', value: users.length, color: '#F59E0B', percentage: Math.round((users.length / 2847) * 100) },
    { name: 'Contacts qualifiés', value: Math.floor(users.length * 0.3), color: '#EF4444', percentage: Math.round((users.length * 0.3 / 2847) * 100) }
  ];

  const geographicData = [
    { region: 'Île-de-France', inscriptions: Math.floor(users.length * 0.4), percentage: 40 },
    { region: 'PACA', inscriptions: Math.floor(users.length * 0.25), percentage: 25 },
    { region: 'Auvergne-Rhône-Alpes', inscriptions: Math.floor(users.length * 0.15), percentage: 15 },
    { region: 'Nouvelle-Aquitaine', inscriptions: Math.floor(users.length * 0.1), percentage: 10 },
    { region: 'Autres', inscriptions: Math.floor(users.length * 0.1), percentage: 10 }
  ];

  const deviceData = [
    { device: 'Desktop', value: 65, color: '#8B5CF6', users: Math.floor(users.length * 0.65) },
    { device: 'Mobile', value: 30, color: '#06B6D4', users: Math.floor(users.length * 0.30) },
    { device: 'Tablet', value: 5, color: '#84CC16', users: Math.floor(users.length * 0.05) }
  ];

  const pageViewsData = [
    { page: 'Accueil', vues: 1250, temps: '2:45', taux_sortie: 15 },
    { page: 'Galerie Biens', vues: 890, temps: '4:20', taux_sortie: 25 },
    { page: 'Concept', vues: 650, temps: '3:10', taux_sortie: 30 },
    { page: 'Services', vues: 420, temps: '2:55', taux_sortie: 35 },
    { page: 'Contact', vues: 380, temps: '1:30', taux_sortie: 20 },
    { page: 'Recherche', vues: 320, temps: '5:15', taux_sortie: 40 }
  ];

  const trafficSourceData = [
    { source: 'Recherche Google', visitors: 45, color: '#4285F4', growth: '+12%' },
    { source: 'Direct', visitors: 30, color: '#34A853', growth: '+8%' },
    { source: 'Réseaux sociaux', visitors: 15, color: '#EA4335', growth: '+25%' },
    { source: 'Référencement', visitors: 10, color: '#FBBC04', growth: '+5%' }
  ];

  const hourlyTrafficData = Array.from({ length: 24 }, (_, hour) => ({
    heure: `${hour}h`,
    visiteurs: Math.floor(Math.random() * 50) + 10,
    inscriptions: Math.floor(Math.random() * 5)
  }));

  const conversionFunnelData = [
    { etape: 'Visiteurs', nombre: 2847, pourcentage: 100 },
    { etape: 'Pages vues', nombre: 1420, pourcentage: 50 },
    { etape: 'Temps > 2min', nombre: 854, pourcentage: 30 },
    { etape: 'Formulaire vu', nombre: 427, pourcentage: 15 },
    { etape: 'Inscriptions', nombre: users.length, pourcentage: Math.round((users.length / 2847) * 100) }
  ];

  const COLORS = ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A'];

  return (
    <div className="space-y-8">
      {/* Métriques en temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Utilisateurs actifs</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">{realTimeData.activeUsers}</p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-green-600 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            En temps réel
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pages vues</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">{realTimeData.pageViews.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-blue-600">
            +15% vs hier
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Taux de rebond</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">{realTimeData.bounceRate}%</p>
            </div>
            <MousePointer className="w-8 h-8 text-purple-500" />
          </div>
          <div className="mt-2 text-xs text-purple-600">
            -5% vs semaine dernière
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Durée moyenne</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">
                {Math.floor(realTimeData.avgSessionDuration / 60)}:{(realTimeData.avgSessionDuration % 60).toString().padStart(2, '0')}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
          <div className="mt-2 text-xs text-orange-600">
            +30s vs moyenne
          </div>
        </div>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Entonnoir de conversion */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-yellow-600" />
            Entonnoir de Conversion
          </h3>
          <div className="space-y-4">
            {conversionFunnelData.map((etape, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {etape.etape}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {etape.nombre.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      ({etape.pourcentage}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-yellow-600 to-yellow-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${etape.pourcentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sources de trafic */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-yellow-600" />
            Sources de Trafic
          </h3>
          <div className="space-y-4">
            {trafficSourceData.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: source.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {source.source}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {source.visitors}%
                  </div>
                  <div className="text-xs text-green-600">
                    {source.growth}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                <span className="text-gray-700 dark:text-gray-300 font-medium">{item.region}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-yellow-600 to-yellow-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                    {item.inscriptions}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Types d'appareils */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
            <Smartphone className="w-5 h-5 mr-2 text-yellow-600" />
            Types d'Appareils
          </h3>
          <div className="space-y-4">
            {deviceData.map((device, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: device.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {device.device}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {device.value}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {device.users} utilisateurs
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trafic par heure */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-yellow-600" />
          Trafic par Heure (Aujourd'hui)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={hourlyTrafficData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="heure" 
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="visiteurs" 
              stroke="#D97706" 
              fill="url(#colorVisiteurs)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="inscriptions" 
              stroke="#10B981" 
              fill="url(#colorInscriptions)"
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="colorVisiteurs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D97706" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorInscriptions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Pages populaires avec métriques avancées */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-yellow-600" />
          Performance des Pages
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
                  Taux de sortie
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody>
              {pageViewsData.map((page, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900 dark:text-white">{page.page}</div>
                  </td>
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                    {page.vues.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                    {page.temps}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      page.taux_sortie < 25 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : page.taux_sortie < 35
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {page.taux_sortie}%
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-600 to-yellow-500 h-2 rounded-full transition-all duration-1000"
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

      {/* Insights et recommandations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Insights et Recommandations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-800 dark:text-green-200">Excellent taux de conversion</h4>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              Votre taux de conversion de {((users.length / 2847) * 100).toFixed(1)}% est supérieur à la moyenne du secteur (2-3%).
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Engagement élevé</h4>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Temps moyen de {Math.floor(realTimeData.avgSessionDuration / 60)} minutes indique un fort intérêt pour vos contenus.
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Smartphone className="w-5 h-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Optimisation mobile</h4>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              30% de trafic mobile : continuez à optimiser l'expérience mobile pour augmenter les conversions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;