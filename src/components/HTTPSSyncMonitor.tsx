import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, RefreshCw, Globe, Lock, Wifi, WifiOff } from 'lucide-react';
import { HTTPSSyncService } from '../services/httpsSync';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface HTTPSStatus {
  isHTTPS: boolean;
  hasValidSSL: boolean;
  mixedContentIssues: string[];
  securityHeaders: { [key: string]: string | null };
  performance: {
    sslHandshakeTime: number;
    firstByteTime: number;
    totalLoadTime: number;
    certificateValid: boolean;
  };
}

const HTTPSSyncMonitor: React.FC = () => {
  const [httpsStatus, setHttpsStatus] = useState<HTTPSStatus | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [syncEvents, setSyncEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [autoFix, setAutoFix] = useState(false);

  const runHTTPSDiagnostic = async () => {
    setIsLoading(true);
    
    try {
      const verification = await HTTPSSyncService.verifyHTTPSSetup();
      const performance = await HTTPSSyncService.measureHTTPSPerformance();
      
      setHttpsStatus({
        ...verification,
        performance
      });

      // Auto-correction si activée
      if (autoFix && verification.mixedContentIssues.length > 0) {
        await HTTPSSyncService.fixMixedContent();
        toast.success('Contenu mixte corrigé automatiquement');
      }

    } catch (error) {
      toast.error('Erreur lors du diagnostic HTTPS');
    } finally {
      setIsLoading(false);
    }
  };

  const startRealtimeMonitoring = () => {
    setIsMonitoring(true);
    
    // Écouter les événements de synchronisation
    const events = ['contentUpdated', 'storage', 'presentationImageChanged', 'designSettingsChanged', 'forceUpdate'];
    
    events.forEach(eventName => {
      window.addEventListener(eventName, (event: any) => {
        const syncEvent = {
          id: Date.now().toString(),
          type: eventName,
          timestamp: new Date().toISOString(),
          protocol: location.protocol,
          secure: location.protocol === 'https:',
          details: event.detail || null
        };
        
        setSyncEvents(prev => [syncEvent, ...prev.slice(0, 19)]); // Garder 20 derniers événements
      });
    });

    toast.success('Monitoring temps réel démarré');
  };

  const stopRealtimeMonitoring = () => {
    setIsMonitoring(false);
    setSyncEvents([]);
    toast.success('Monitoring arrêté');
  };

  const forceSyncAll = async () => {
    try {
      await HTTPSSyncService.forceSyncAllContent();
    } catch (error) {
      toast.error('Erreur lors de la synchronisation forcée');
    }
  };

  useEffect(() => {
    // Diagnostic automatique au chargement
    runHTTPSDiagnostic();
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-6 h-6 text-green-500" />
    ) : (
      <AlertTriangle className="w-6 h-6 text-red-500" />
    );
  };

  const getPerformanceColor = (time: number) => {
    if (time < 500) return 'text-green-600';
    if (time < 1000) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-gray-900 dark:text-white">
            Monitoring HTTPS & Synchronisation
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Surveillance de la sécurité et de la synchronisation temps réel
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={runHTTPSDiagnostic}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Diagnostic</span>
          </button>
          <button
            onClick={forceSyncAll}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>Sync Forcée</span>
          </button>
        </div>
      </div>

      {/* État HTTPS */}
      {httpsStatus && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Protocole HTTPS</p>
                <p className="text-2xl font-light text-gray-900 dark:text-white">
                  {httpsStatus.isHTTPS ? 'Sécurisé' : 'Non sécurisé'}
                </p>
              </div>
              {getStatusIcon(httpsStatus.isHTTPS)}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Certificat SSL</p>
                <p className="text-2xl font-light text-gray-900 dark:text-white">
                  {httpsStatus.hasValidSSL ? 'Valide' : 'Invalide'}
                </p>
              </div>
              {getStatusIcon(httpsStatus.hasValidSSL)}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contenu Mixte</p>
                <p className="text-2xl font-light text-gray-900 dark:text-white">
                  {httpsStatus.mixedContentIssues.length}
                </p>
              </div>
              {getStatusIcon(httpsStatus.mixedContentIssues.length === 0)}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Performance SSL</p>
                <p className={`text-2xl font-light ${getPerformanceColor(httpsStatus.performance.firstByteTime)}`}>
                  {httpsStatus.performance.firstByteTime}ms
                </p>
              </div>
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      )}

      {/* Problèmes détectés */}
      {httpsStatus && httpsStatus.mixedContentIssues.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Problèmes de Contenu Mixte Détectés
          </h3>
          <div className="space-y-2">
            {httpsStatus.mixedContentIssues.map((issue, index) => (
              <div key={index} className="text-sm text-red-700 dark:text-red-300 font-mono">
                {issue}
              </div>
            ))}
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={async () => {
                const fixes = await HTTPSSyncService.fixMixedContent();
                toast.success(`${fixes.length} correction(s) appliquée(s)`);
                runHTTPSDiagnostic();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Corriger Automatiquement
            </button>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoFix}
                onChange={(e) => setAutoFix(e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-red-700 dark:text-red-300">Correction automatique</span>
            </label>
          </div>
        </div>
      )}

      {/* Headers de sécurité */}
      {httpsStatus && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Headers de Sécurité HTTPS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(httpsStatus.securityHeaders).map(([header, value]) => (
              <div key={header} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {header.replace(/-/g, ' ')}
                </span>
                <div className="flex items-center space-x-2">
                  {value ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {value ? 'Configuré' : 'Manquant'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monitoring temps réel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Monitoring Synchronisation Temps Réel
          </h3>
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              isMonitoring ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {isMonitoring ? (
                <Wifi className="w-4 h-4" />
              ) : (
                <WifiOff className="w-4 h-4" />
              )}
              <span>{isMonitoring ? 'Actif' : 'Inactif'}</span>
            </div>
            <button
              onClick={isMonitoring ? stopRealtimeMonitoring : startRealtimeMonitoring}
              className={`px-4 py-2 rounded-md transition-colors ${
                isMonitoring
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isMonitoring ? 'Arrêter' : 'Démarrer'}
            </button>
          </div>
        </div>

        {/* Événements de synchronisation */}
        {syncEvents.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {syncEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg border ${
                  event.secure 
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {event.secure ? (
                      <Lock className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-medium">{event.type}</span>
                  </div>
                  <span className="text-xs">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-xs mt-2 opacity-80">
                  Protocole: {event.protocol} | Sécurisé: {event.secure ? 'Oui' : 'Non'}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {isMonitoring ? 'En attente d\'événements...' : 'Monitoring inactif'}
          </div>
        )}
      </div>

      {/* Actions rapides */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Actions de Correction HTTPS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={async () => {
              const fixes = await HTTPSSyncService.fixMixedContent();
              toast.success(`${fixes.length} correction(s) appliquée(s)`);
              runHTTPSDiagnostic();
            }}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            <Shield className="w-5 h-5" />
            <span>Corriger Contenu Mixte</span>
          </button>

          <button
            onClick={() => {
              if (location.protocol === 'http:') {
                location.href = location.href.replace('http://', 'https://');
              } else {
                toast.success('Déjà en HTTPS');
              }
            }}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Lock className="w-5 h-5" />
            <span>Forcer HTTPS</span>
          </button>

          <button
            onClick={async () => {
              // Vider tous les caches et recharger
              if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
              }
              
              if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                await Promise.all(registrations.map(reg => reg.update()));
              }
              
              toast.success('Caches vidés - Rechargement...');
              setTimeout(() => location.reload(), 1500);
            }}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Reset Cache HTTPS</span>
          </button>
        </div>
      </div>

      {/* Instructions de résolution */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-4">
          🔧 Guide de Résolution HTTPS
        </h3>
        <div className="space-y-4 text-sm text-blue-700 dark:text-blue-300">
          <div>
            <strong>1. Problèmes de Synchronisation :</strong>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Vérifiez que Supabase est configuré en HTTPS</li>
              <li>Assurez-vous que toutes les images utilisent HTTPS</li>
              <li>Vérifiez que les WebSockets utilisent WSS (sécurisé)</li>
            </ul>
          </div>
          
          <div>
            <strong>2. Configuration Supabase :</strong>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Cliquez sur "Connect to Supabase" en haut à droite</li>
              <li>Vérifiez que l'URL commence par https://</li>
              <li>Testez la connexion avec le bouton "Test Supabase"</li>
            </ul>
          </div>
          
          <div>
            <strong>3. Test de Synchronisation :</strong>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Ouvrez le site sur 2 navigateurs différents</li>
              <li>Modifiez un bien immobilier sur l'un</li>
              <li>Vérifiez que l'autre se met à jour automatiquement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HTTPSSyncMonitor;