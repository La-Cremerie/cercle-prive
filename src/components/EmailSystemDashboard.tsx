import React, { useState, useEffect } from 'react';
import { Mail, AlertTriangle, CheckCircle, Clock, RefreshCw, Download, Settings, Zap } from 'lucide-react';
import { EmailDiagnostics } from '../services/emailDiagnostics';
import { EmailService } from '../services/emailService';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const EmailSystemDashboard: React.FC = () => {
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [isRunningDiagnosis, setIsRunningDiagnosis] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isRunningValidation, setIsRunningValidation] = useState(false);
  const [queueStatus, setQueueStatus] = useState<any>(null);

  const loadQueueStatus = () => {
    const status = EmailService.getEmailQueueStatus();
    setQueueStatus(status);
  };

  useEffect(() => {
    loadQueueStatus();
    // Refresh queue status every 30 seconds
    const interval = setInterval(loadQueueStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const runInitialDiagnosis = async () => {
    setIsRunningDiagnosis(true);
    try {
      const results = await EmailDiagnostics.performInitialDiagnosis();
      setDiagnosticResults(results);
      toast.success('Diagnostic initial terminé');
    } catch (error) {
      toast.error('Erreur lors du diagnostic');
    } finally {
      setIsRunningDiagnosis(false);
    }
  };

  const runSystematicTests = async () => {
    setIsRunningTests(true);
    try {
      const results = await EmailDiagnostics.runSystematicTests();
      setTestResults(results);
      toast.success('Tests systématiques terminés');
    } catch (error) {
      toast.error('Erreur lors des tests');
    } finally {
      setIsRunningTests(false);
    }
  };

  const runValidationTests = async () => {
    setIsRunningValidation(true);
    try {
      const results = await EmailDiagnostics.runValidationTests();
      setValidationResults(results);
      toast.success('Tests de validation terminés');
    } catch (error) {
      toast.error('Erreur lors de la validation');
    } finally {
      setIsRunningValidation(false);
    }
  };

  const implementFixes = async () => {
    try {
      const fixes = await EmailDiagnostics.implementFixes();
      toast.success(`${fixes.length} correction(s) appliquée(s)`);
      loadQueueStatus();
    } catch (error) {
      toast.error('Erreur lors de l\'implémentation des corrections');
    }
  };

  const processEmailQueue = async () => {
    try {
      const processed = await EmailService.processEmailQueue();
      toast.success(`${processed} email(s) traité(s) depuis la queue`);
      loadQueueStatus();
    } catch (error) {
      toast.error('Erreur lors du traitement de la queue');
    }
  };

  const exportDiagnosticReport = () => {
    try {
      EmailDiagnostics.exportDiagnosticData();
      toast.success('Rapport de diagnostic exporté');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
      case 'success':
      case 'configured':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
      case 'error':
      case 'not_configured':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
      case 'manual':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
      case 'success':
      case 'configured':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'failed':
      case 'error':
      case 'not_configured':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
      case 'manual':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
          📧 DIAGNOSTIC SYSTÈME EMAIL
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Analyse complète et résolution des problèmes d'envoi d'emails
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={runInitialDiagnosis}
            disabled={isRunningDiagnosis}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Settings className={`w-5 h-5 ${isRunningDiagnosis ? 'animate-spin' : ''}`} />
            <span>{isRunningDiagnosis ? 'Diagnostic...' : 'Diagnostic Initial'}</span>
          </button>

          <button
            onClick={runSystematicTests}
            disabled={isRunningTests}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <Zap className={`w-5 h-5 ${isRunningTests ? 'animate-spin' : ''}`} />
            <span>{isRunningTests ? 'Tests...' : 'Tests Systématiques'}</span>
          </button>

          <button
            onClick={implementFixes}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Appliquer Corrections</span>
          </button>

          <button
            onClick={runValidationTests}
            disabled={isRunningValidation}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
          >
            <CheckCircle className={`w-5 h-5 ${isRunningValidation ? 'animate-spin' : ''}`} />
            <span>{isRunningValidation ? 'Validation...' : 'Validation Finale'}</span>
          </button>
        </div>
      </div>

      {/* Email Queue Status */}
      {queueStatus && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">État de la Queue Email</h2>
            <button
              onClick={processEmailQueue}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Traiter Queue</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="text-2xl font-light text-blue-600">{queueStatus.pendingEmails}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">En attente</div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <div className="text-2xl font-light text-green-600">{queueStatus.sentEmails}</div>
                  <div className="text-sm text-green-700 dark:text-green-300">Envoyés</div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <div className="text-2xl font-light text-red-600">{queueStatus.failedEmails}</div>
                  <div className="text-sm text-red-700 dark:text-red-300">Échecs</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6 text-gray-600" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Dernier traitement</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {queueStatus.lastProcessed ? 
                      new Date(queueStatus.lastProcessed).toLocaleTimeString('fr-FR') : 
                      'Jamais'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Diagnostic Results */}
      {diagnosticResults && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">Résultats du Diagnostic Initial</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Configuration Status */}
            <div className={`border rounded-lg p-4 ${getStatusColor(diagnosticResults.configuration.serviceStatus)}`}>
              <div className="flex items-center space-x-3 mb-3">
                {getStatusIcon(diagnosticResults.configuration.serviceStatus)}
                <h3 className="font-medium">Configuration EmailJS</h3>
              </div>
              <div className="text-sm space-y-1">
                <div>Configuré: {diagnosticResults.configuration.emailjsConfigured ? '✅ Oui' : '❌ Non'}</div>
                <div>Statut: {diagnosticResults.configuration.serviceStatus}</div>
              </div>
            </div>

            {/* Connectivity Status */}
            <div className={`border rounded-lg p-4 ${getStatusColor(diagnosticResults.connectivity.emailjsReachable ? 'success' : 'error')}`}>
              <div className="flex items-center space-x-3 mb-3">
                {getStatusIcon(diagnosticResults.connectivity.emailjsReachable ? 'success' : 'error')}
                <h3 className="font-medium">Connectivité</h3>
              </div>
              <div className="text-sm space-y-1">
                <div>Internet: {diagnosticResults.connectivity.internetConnection ? '✅' : '❌'}</div>
                <div>EmailJS: {diagnosticResults.connectivity.emailjsReachable ? '✅' : '❌'}</div>
                <div>Services IP: {diagnosticResults.connectivity.ipDetectionServices.filter((s: any) => s.status === 'working').length}/3</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResults && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">Résultats des Tests Systématiques</h2>
          
          <div className="space-y-4">
            {Object.entries(testResults).filter(([key]) => key !== 'timestamp').map(([testName, result]: [string, any]) => (
              <div key={testName} className={`border rounded-lg p-4 ${getStatusColor(result.status || 'unknown')}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <h3 className="font-medium">{result.name || testName}</h3>
                  </div>
                  <span className="text-sm font-medium">
                    {result.status === 'passed' ? 'RÉUSSI' : 
                     result.status === 'failed' ? 'ÉCHEC' : 
                     result.status === 'error' ? 'ERREUR' : 'EN COURS'}
                  </span>
                </div>
                
                {result.results && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <pre className="whitespace-pre-wrap">
                      {typeof result.results === 'object' ? 
                        JSON.stringify(result.results, null, 2) : 
                        result.results
                      }
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation Results */}
      {validationResults && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">Résultats de la Validation</h2>
          
          <div className="space-y-4">
            {Object.entries(validationResults).filter(([key]) => key !== 'timestamp').map(([testName, result]: [string, any]) => (
              <div key={testName} className={`border rounded-lg p-4 ${getStatusColor(result.overallStatus || result.status || 'unknown')}`}>
                <div className="flex items-center space-x-3 mb-3">
                  {getStatusIcon(result.overallStatus || result.status)}
                  <h3 className="font-medium">{result.test || testName}</h3>
                </div>
                
                {result.steps && (
                  <div className="space-y-2">
                    {result.steps.map((step: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        {getStatusIcon(step.status)}
                        <span>{step.step}: {step.details}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">Actions Avancées</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={exportDiagnosticReport}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Exporter Rapport</span>
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('emailQueue');
              localStorage.removeItem('emailHistory');
              localStorage.removeItem('emailErrorLog');
              toast.success('Historique email nettoyé');
              loadQueueStatus();
            }}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Nettoyer Historique</span>
          </button>

          <button
            onClick={() => {
              const report = EmailDiagnostics.generateDiagnosticReport();
              console.log(report);
              toast.success('Rapport affiché dans la console');
            }}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Mail className="w-5 h-5" />
            <span>Rapport Console</span>
          </button>
        </div>
      </div>

      {/* Troubleshooting Guide */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h2 className="text-xl font-medium text-blue-800 dark:text-blue-200 mb-6">
          🔧 Guide de Résolution des Problèmes
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-3">
              1. Problèmes d'Alertes HTTPS/IP
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <li>• Vérifiez que EmailJS est configuré avec vos vraies clés</li>
              <li>• Testez la détection d'IP avec le diagnostic</li>
              <li>• Vérifiez que les emails ne vont pas dans les spams</li>
              <li>• Assurez-vous que le site est accessible en HTTPS</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-3">
              2. Problèmes d'Emails de Questionnaire/Survey
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <li>• Vérifiez le template EmailJS pour les variables correctes</li>
              <li>• Testez avec différents fournisseurs email (Gmail, Outlook)</li>
              <li>• Vérifiez les logs d'erreur dans la queue email</li>
              <li>• Assurez-vous que les formulaires appellent la bonne méthode</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-3">
              3. Problèmes d'Emails d'Information Générale
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <li>• Vérifiez la configuration SMTP/EmailJS</li>
              <li>• Testez la connectivité réseau</li>
              <li>• Vérifiez les paramètres de sécurité du navigateur</li>
              <li>• Assurez-vous que les destinataires sont corrects</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technical Recommendations */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <h2 className="text-xl font-medium text-green-800 dark:text-green-200 mb-6">
          💡 Recommandations Techniques
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-3">
              Configuration Recommandée
            </h3>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-2">
              <li>• Utilisez EmailJS pour la simplicité et fiabilité</li>
              <li>• Configurez un service Gmail ou Outlook professionnel</li>
              <li>• Activez l'authentification à deux facteurs</li>
              <li>• Utilisez des templates HTML bien formatés</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-3">
              Monitoring et Maintenance
            </h3>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-2">
              <li>• Surveillez la queue d'emails régulièrement</li>
              <li>• Testez l'envoi d'emails après chaque déploiement</li>
              <li>• Vérifiez les spams folders périodiquement</li>
              <li>• Maintenez les logs d'erreur à jour</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSystemDashboard;