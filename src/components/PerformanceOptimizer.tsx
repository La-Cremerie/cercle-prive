import React, { useState, useEffect } from 'react';
import { Zap, Image, Code, Database, Gauge, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'poor';
  description: string;
}

const PerformanceOptimizer: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzePerformance = () => {
    setIsAnalyzing(true);
    
    // Simulation d'analyse de performance
    setTimeout(() => {
      const mockMetrics: PerformanceMetric[] = [
        {
          name: 'First Contentful Paint',
          value: 1.2,
          unit: 's',
          status: 'good',
          description: 'Temps avant l\'affichage du premier contenu'
        },
        {
          name: 'Largest Contentful Paint',
          value: 2.1,
          unit: 's',
          status: 'warning',
          description: 'Temps de chargement du plus gros élément'
        },
        {
          name: 'Cumulative Layout Shift',
          value: 0.05,
          unit: '',
          status: 'good',
          description: 'Stabilité visuelle de la page'
        },
        {
          name: 'Time to Interactive',
          value: 2.8,
          unit: 's',
          status: 'warning',
          description: 'Temps avant que la page soit interactive'
        },
        {
          name: 'Total Blocking Time',
          value: 150,
          unit: 'ms',
          status: 'good',
          description: 'Temps de blocage du thread principal'
        }
      ];
      
      setMetrics(mockMetrics);
      setIsAnalyzing(false);
    }, 2000);
  };

  useEffect(() => {
    analyzePerformance();
  }, []);

  const getStatusIcon = (status: 'good' | 'warning' | 'poor') => {
    switch (status) {
      case 'good': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'poor': return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'good' | 'warning' | 'poor') => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const optimizationTips = [
    {
      icon: <Image className="w-6 h-6 text-blue-600" />,
      title: 'Optimisation des images',
      description: 'Utilisez des formats modernes (WebP, AVIF) et compressez vos images',
      implemented: true
    },
    {
      icon: <Code className="w-6 h-6 text-green-600" />,
      title: 'Minification du code',
      description: 'Le code CSS et JavaScript est automatiquement minifié',
      implemented: true
    },
    {
      icon: <Database className="w-6 h-6 text-purple-600" />,
      title: 'Mise en cache',
      description: 'Service Worker configuré pour la mise en cache des ressources',
      implemented: true
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      title: 'Lazy loading',
      description: 'Chargement différé des images et composants non critiques',
      implemented: false
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-gray-900 dark:text-white">
            Optimisation des Performances
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analysez et améliorez les performances de votre site
          </p>
        </div>
        <button
          onClick={analyzePerformance}
          disabled={isAnalyzing}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
        >
          <Gauge className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Analyse...' : 'Analyser'}</span>
        </button>
      </div>

      {/* Métriques de performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Métriques Core Web Vitals
        </h3>
        
        {isAnalyzing ? (
          <div className="text-center py-12">
            <Gauge className="w-12 h-12 text-yellow-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">Analyse des performances en cours...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(metric.status)}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {metric.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {metric.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {metric.value}{metric.unit}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                    {metric.status === 'good' ? 'Bon' : metric.status === 'warning' ? 'Moyen' : 'Mauvais'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conseils d'optimisation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Optimisations Recommandées
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {optimizationTips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex-shrink-0">
                {tip.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {tip.title}
                  </h4>
                  {tip.implemented ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {tip.description}
                </p>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tip.implemented 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {tip.implemented ? 'Implémenté' : 'À implémenter'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score global */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Score de Performance Global
        </h3>
        
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeDasharray="75, 100"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-light text-gray-900 dark:text-white">75</span>
            </div>
          </div>
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Score de Performance
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Bon niveau de performance global
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOptimizer;