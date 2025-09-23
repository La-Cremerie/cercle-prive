import React, { useState, useEffect } from 'react';
import { Shield, Eye, Globe, Clock, AlertTriangle, Download, RefreshCw, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { privacyMonitoring, type PrivacyMetrics } from '../services/privacyCompliantMonitoring';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const PrivacyCompliantDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PrivacyMetrics | null>(null);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(7);

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      const [metricsData, alertsData] = await Promise.all([
        privacyMonitoring.getPrivacyMetrics(selectedPeriod),
        privacyMonitoring.detectSuspiciousPatterns()
      ]);
      
      setMetrics(metricsData);
      setAlerts(alertsData);
    } catch (error) {
      toast.error('Erreur lors du chargement des métriques');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, [selectedPeriod]);

  const exportReport = async () => {
    try {
      const report = await privacyMonitoring.exportAnonymizedReport(selectedPeriod);
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-securite-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      
      URL.revokeObjectURL(url);
      toast.success('Rapport exporté');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
  };

  const cleanupOldData = async () => {
    if (window.confirm('Supprimer les données de plus de 90 jours ? (Conformité RGPD)')) {
      try {
        await privacyMonitoring.cleanupOldEvents(90);
        toast.success('Nettoyage effectué');
        loadMetrics();
      } catch (error) {
        toast.error('Erreur lors du nettoyage');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 text-yellow-600 animate-spin" />
        <span className="ml-3 text-gray-600">Chargement des métriques de sécurité...</span>
      </div>
    );
  }

  const geoData = metrics ? Object.entries(metrics.geographic_distribution).map(([country, count]) => ({
    country,
    sessions: count
  })) : [];

  const hourlyData = metrics ? Object.entries(metrics.hourly_activity).map(([hour, count]) => ({
    hour: `${hour}h`,
    events: count
  })) : [];

  const riskData = metrics ? [
    { name: 'Faible', value: metrics.risk_levels.low, color: '#10B981' },
    { name: 'Moyen', value: metrics.risk_levels.medium, color: '#F59E0B' },
    { name: 'Élevé', value: metrics.risk_levels.high, color: '#EF4444' }
  ] : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-gray-900 dark:text-white">
            Surveillance Conforme à la Confidentialité
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitoring de sécurité respectueux de la vie privée
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value={1}>24 heures</option>
            <option value={7}>7 jours</option>
            <option value={30}>30 jours</option>
            <option value={90}>90 jours</option>
          </select>
          <button
            onClick={exportReport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
          <button
            onClick={cleanupOldData}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Nettoyer</span>
          </button>
        </div>
      </div>

      {/* Alertes de sécurité */}
      {alerts.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
              Alertes de Sécurité Détectées
            </h3>
          </div>
          <ul className="space-y-2">
            {alerts.map((alert, index) => (
              <li key={index} className="text-red-700 dark:text-red-300 flex items-start">
                <span className="mr-2">•</span>
                <span>{alert}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sessions Totales</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">
                {metrics?.total_sessions || 0}
              </p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Visiteurs Uniques</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">
                {metrics?.unique_visitors_estimate || 0}
              </p>
            </div>
            <Globe className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Estimation anonymisée</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Événements Sécurité</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">
                {metrics?.security_events || 0}
              </p>
            </div>
            <Shield className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tentatives Bloquées</p>
              <p className="text-2xl font-light text-gray-900 dark:text-white">
                {metrics?.blocked_attempts || 0}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribution géographique */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Distribution Géographique (Anonymisée)
          </h3>
          {geoData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={geoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sessions" fill="#D97706" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Aucune donnée géographique disponible
            </div>
          )}
        </div>

        {/* Niveaux de risque */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Répartition des Niveaux de Risque
          </h3>
          {riskData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Aucun événement de risque détecté
            </div>
          )}
        </div>
      </div>

      {/* Activité par heure */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Activité par Heure (Anonymisée)
        </h3>
        {hourlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="events" stroke="#D97706" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Aucune donnée d'activité disponible
          </div>
        )}
      </div>

      {/* Informations de conformité */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-4">
          🔒 Conformité à la Confidentialité
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700 dark:text-green-300">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Aucune donnée personnelle stockée</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Adresses IP hashées et anonymisées</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Géolocalisation limitée au code pays</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Rétention limitée à 90 jours</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Métriques agrégées uniquement</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Nettoyage automatique conforme RGPD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyCompliantDashboard;