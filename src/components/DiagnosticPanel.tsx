import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, RefreshCw, Download, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { CodeOptimizer } from '../utils/codeOptimizer';
import { BundleAnalyzer } from '../utils/bundleAnalyzer';
import toast from 'react-hot-toast';

const DiagnosticPanel: React.FC = () => {
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<string[]>([]);
  const [bundleAnalysis, setBundleAnalysis] = useState<any>(null);

  // Diagnostic complet automatique
  const runFullDiagnostic = async () => {
    setIsRunning(true);
    toast.loading('Diagnostic en cours...', { id: 'diagnostic' });

    try {
      // 1. Analyse du code
      const codeOptimizer = CodeOptimizer.getInstance();
      const codeAnalysis = await codeOptimizer.analyzeAndOptimize();

      // 2. Analyse du bundle
      const bundleAnalyzer = BundleAnalyzer.getInstance();
      const bundleAnalysis = await bundleAnalyzer.analyzeBundleComposition();

      // 3. Diagnostic de santé général
      const healthCheck = {
        timestamp: new Date().toISOString(),
        browser: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          onLine: navigator.onLine,
          cookieEnabled: navigator.cookieEnabled
        },
        performance: {
          memory: (performance as any).memory ? {
            used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024),
            limit: Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024)
          } : null,
          timing: performance.timing ? {
            domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
            loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart
          } : null
        },
        storage: {
          localStorage: this.checkLocalStorageHealth(),
          sessionStorage: this.checkSessionStorageHealth(),
          caches: await this.checkCacheHealth()
        },
        errors: this.getErrorHistory()
      };

      const results = {
        codeAnalysis,
        bundleAnalysis,
        healthCheck,
        recommendations: this.generateRecommendations(codeAnalysis, bundleAnalysis, healthCheck)
      };

      setDiagnosticResults(results);
      setBundleAnalysis(bundleAnalysis);
      toast.success('Diagnostic terminé', { id: 'diagnostic' });

    } catch (error) {
      console.error('Erreur diagnostic:', error);
      toast.error('Erreur lors du diagnostic', { id: 'diagnostic' });
    } finally {
      setIsRunning(false);
    }
  };

  // Appliquer les optimisations automatiques
  const applyOptimizations = async () => {
    toast.loading('Application des optimisations...', { id: 'optimize' });

    try {
      const codeOptimizer = CodeOptimizer.getInstance();
      const bundleAnalyzer = BundleAnalyzer.getInstance();

      const codeOptimizations = await codeOptimizer.applyAutomaticOptimizations();
      const bundleOptimizations = await bundleAnalyzer.applyAutomaticOptimizations();

      const allOptimizations = [...codeOptimizations, ...bundleOptimizations];
      setOptimizationResults(allOptimizations);

      toast.success(`${allOptimizations.length} optimisation(s) appliquée(s)`, { id: 'optimize' });

    } catch (error) {
      console.error('Erreur optimisations:', error);
      toast.error('Erreur lors des optimisations', { id: 'optimize' });
    }
  };

  // Vérifier la santé du localStorage
  private checkLocalStorageHealth() {
    try {
      const totalSize = JSON.stringify(localStorage).length;
      const itemCount = localStorage.length;
      
      // Vérifier les données corrompues
      let corruptedCount = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
          const value = localStorage.getItem(key!);
          if (value && value.startsWith('{')) {
            JSON.parse(value);
          }
        } catch (e) {
          corruptedCount++;
        }
      }

      return {
        available: true,
        size: Math.round(totalSize / 1024),
        items: itemCount,
        corrupted: corruptedCount,
        health: corruptedCount === 0 ? 'good' : 'warning'
      };
    } catch (error) {
      return {
        available: false,
        error: error.message,
        health: 'error'
      };
    }
  }

  // Vérifier la santé du sessionStorage
  private checkSessionStorageHealth() {
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      return { available: true, health: 'good' };
    } catch (error) {
      return { available: false, error: error.message, health: 'error' };
    }
  }

  // Vérifier la santé du cache
  private async checkCacheHealth() {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        let totalSize = 0;
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          totalSize += keys.length;
        }

        return {
          available: true,
          caches: cacheNames.length,
          totalEntries: totalSize,
          health: 'good'
        };
      } catch (error) {
        return {
          available: true,
          error: error.message,
          health: 'warning'
        };
      }
    }
    return { available: false, health: 'warning' };
  }

  // Obtenir l'historique des erreurs
  private getErrorHistory() {
    try {
      const errorLog = localStorage.getItem('errorLog');
      const errors = errorLog ? JSON.parse(errorLog) : [];
      
      return {
        total: errors.length,
        recent: errors.slice(-5),
        types: this.categorizeErrors(errors)
      };
    } catch (error) {
      return { error: 'Impossible de lire l\'historique' };
    }
  }

  // Catégoriser les erreurs
  private categorizeErrors(errors: any[]) {
    const categories: any = {};
    
    errors.forEach(error => {
      const type = error.type || 'unknown';
      categories[type] = (categories[type] || 0) + 1;
    });

    return categories;
  }

  // Générer des recommandations
  private generateRecommendations(codeAnalysis: any, bundleAnalysis: any, healthCheck: any) {
    const recommendations = [];

    // Recommandations basées sur la santé du stockage
    if (healthCheck.storage.localStorage.corrupted > 0) {
      recommendations.push({
        type: 'critical',
        title: 'Données corrompues détectées',
        description: `${healthCheck.storage.localStorage.corrupted} clé(s) corrompue(s) dans le localStorage`,
        action: 'Nettoyer les données corrompues'
      });
    }

    // Recommandations basées sur les performances
    if (healthCheck.performance.memory?.used > 100) {
      recommendations.push({
        type: 'warning',
        title: 'Utilisation mémoire élevée',
        description: `${healthCheck.performance.memory.used}MB utilisés`,
        action: 'Optimiser la gestion mémoire'
      });
    }

    // Recommandations basées sur les erreurs
    if (healthCheck.errors.total > 10) {
      recommendations.push({
        type: 'warning',
        title: 'Nombreuses erreurs détectées',
        description: `${healthCheck.errors.total} erreurs dans l'historique`,
        action: 'Analyser et corriger les erreurs récurrentes'
      });
    }

    // Recommandations d'optimisation
    if (bundleAnalysis.duplications.totalDuplications > 10) {
      recommendations.push({
        type: 'info',
        title: 'Code dupliqué détecté',
        description: `${bundleAnalysis.duplications.totalDuplications}% de duplication`,
        action: 'Refactoriser le code dupliqué'
      });
    }

    return recommendations;
  }

  // Exporter le rapport complet
  const exportReport = () => {
    if (!diagnosticResults) {
      toast.error('Aucun diagnostic disponible');
      return;
    }

    const report = {
      ...diagnosticResults,
      optimizations: optimizationResults,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostic-cercle-prive-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    toast.success('Rapport exporté');
  };

  const getStatusIcon = (health: string) => {
    switch (health) {
      case 'good': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (health: string) => {
    switch (health) {
      case 'good': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-gray-900 dark:text-white">
            Diagnostic Technique
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analyse et optimisation du code sans modification du contenu
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={runFullDiagnostic}
            disabled={isRunning}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Activity className={`w-5 h-5 ${isRunning ? 'animate-pulse' : ''}`} />
            <span>{isRunning ? 'Diagnostic...' : 'Lancer diagnostic'}</span>
          </button>
          <button
            onClick={applyOptimizations}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Zap className="w-5 h-5" />
            <span>Optimiser</span>
          </button>
        </div>
      </div>

      {/* Résultats du diagnostic */}
      {diagnosticResults && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Santé générale */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              État de Santé Général
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Navigateur</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('good')}`}>
                  Compatible
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Stockage Local</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(diagnosticResults.healthCheck.storage.localStorage.health)}`}>
                  {diagnosticResults.healthCheck.storage.localStorage.health === 'good' ? 'OK' : 'Problème'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Service Worker</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(diagnosticResults.healthCheck.storage.caches.health)}`}>
                  {diagnosticResults.healthCheck.storage.caches.available ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
          </div>

          {/* Métriques de performance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Métriques de Performance
            </h3>
            {diagnosticResults.healthCheck.performance.timing && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">DOM Ready</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {diagnosticResults.healthCheck.performance.timing.domContentLoaded}ms
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Chargement complet</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {diagnosticResults.healthCheck.performance.timing.loadComplete}ms
                  </span>
                </div>
                {diagnosticResults.healthCheck.performance.memory && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Mémoire utilisée</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {diagnosticResults.healthCheck.performance.memory.used}MB
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analyse du bundle */}
      {bundleAnalysis && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Analyse du Bundle
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(bundleAnalysis.chunks).map(([name, chunk]: [string, any]) => (
              <div key={name} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 capitalize">
                  {name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {chunk.description}
                </p>
                <div className="text-lg font-medium text-yellow-600">
                  {chunk.estimatedSize}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommandations */}
      {diagnosticResults?.recommendations && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recommandations d'Optimisation
          </h3>
          <div className="space-y-4">
            {diagnosticResults.recommendations.map((rec: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.type === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                  rec.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                  'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {getStatusIcon(rec.type === 'critical' ? 'error' : rec.type === 'warning' ? 'warning' : 'good')}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {rec.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {rec.description}
                    </p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
                      Action: {rec.action}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Optimisations appliquées */}
      {optimizationResults.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Optimisations Appliquées
          </h3>
          <div className="space-y-2">
            {optimizationResults.map((optimization, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">{optimization}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Actions Rapides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.open('/diagnostic.html', '_blank')}
            className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Activity className="w-5 h-5" />
            <span>Outil de diagnostic</span>
          </button>
          <button
            onClick={exportReport}
            className="flex items-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Exporter rapport</span>
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
            className="flex items-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Reset complet</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPanel;