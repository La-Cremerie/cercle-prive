import React, { useState, useEffect } from 'react';
import { Mail, AlertTriangle, CheckCircle, Clock, RefreshCw, Download, Settings, Zap, Play, Database, Globe, Shield } from 'lucide-react';
import { EmailDiagnosticsService, type EmailTestSuite, type EmailDiagnosticResult } from '../services/emailDiagnosticsService';
import { EmailService } from '../services/emailService';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const EmailSystemDashboard: React.FC = () => {
  const [diagnosticResults, setDiagnosticResults] = useState<EmailTestSuite | null>(null);
  const [isRunningDiagnosis, setIsRunningDiagnosis] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isRunningValidation, setIsRunningValidation] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [queueStatus, setQueueStatus] = useState<any>(null);
  const [emailStats, setEmailStats] = useState<any>(null);

  const loadDashboardData = () => {
    const status = EmailService.getEmailQueueStatus();
    const stats = EmailService.getEmailStatistics();
    setQueueStatus(status);
    setEmailStats(stats);
  };

  useEffect(() => {
    loadDashboardData();
    // Refresh data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const runInitialDiagnosis = async () => {
    setIsRunningDiagnosis(true);
    setCurrentTest('Analyzing email configuration...');
    
    try {
      const results = await EmailDiagnosticsService.performInitialDiagnosis();
      setDiagnosticResults(results);
      toast.success('Initial diagnosis completed');
    } catch (error) {
      toast.error('Diagnosis failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsRunningDiagnosis(false);
      setCurrentTest('');
    }
  };

  const runSystematicTests = async () => {
    setIsRunningTests(true);
    setCurrentTest('Running systematic email tests...');
    
    try {
      const results = await EmailDiagnosticsService.runSystematicTests();
      setDiagnosticResults(results);
      toast.success('Systematic tests completed');
    } catch (error) {
      toast.error('Tests failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsRunningTests(false);
      setCurrentTest('');
    }
  };

  const runValidationTests = async () => {
    setIsRunningValidation(true);
    setCurrentTest('Running validation tests...');
    
    try {
      const results = await EmailDiagnosticsService.runValidationTests();
      setDiagnosticResults(results);
      toast.success('Validation tests completed');
    } catch (error) {
      toast.error('Validation failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsRunningValidation(false);
      setCurrentTest('');
    }
  };

  const implementFixes = async () => {
    try {
      const fixes = await EmailDiagnosticsService.implementAutomaticFixes();
      toast.success(`Applied ${fixes.length} automatic fix(es)`);
      loadDashboardData();
    } catch (error) {
      toast.error('Auto-fix failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const processEmailQueue = async () => {
    try {
      const processed = await EmailService.processEmailQueue();
      toast.success(`Processed ${processed} email(s) from queue`);
      loadDashboardData();
    } catch (error) {
      toast.error('Queue processing failed');
    }
  };

  const exportDiagnosticReport = () => {
    try {
      const report = EmailDiagnosticsService.exportDiagnosticReport();
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `email-diagnostic-report-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      
      URL.revokeObjectURL(url);
      toast.success('Diagnostic report exported');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high' | 'critical') => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
          📧 EMAIL SYSTEM DIAGNOSTICS & REPAIR
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
          Comprehensive email system analysis, testing, and automatic repair for HTTPS alerts, survey emails, and general notifications
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">Diagnostic Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={runInitialDiagnosis}
            disabled={isRunningDiagnosis}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Settings className={`w-5 h-5 ${isRunningDiagnosis ? 'animate-spin' : ''}`} />
            <span>{isRunningDiagnosis ? 'Diagnosing...' : 'Initial Diagnosis'}</span>
          </button>

          <button
            onClick={runSystematicTests}
            disabled={isRunningTests}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <Zap className={`w-5 h-5 ${isRunningTests ? 'animate-spin' : ''}`} />
            <span>{isRunningTests ? 'Testing...' : 'Systematic Tests'}</span>
          </button>

          <button
            onClick={implementFixes}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Apply Fixes</span>
          </button>

          <button
            onClick={runValidationTests}
            disabled={isRunningValidation}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
          >
            <CheckCircle className={`w-5 h-5 ${isRunningValidation ? 'animate-spin' : ''}`} />
            <span>{isRunningValidation ? 'Validating...' : 'Final Validation'}</span>
          </button>
        </div>
        
        {currentTest && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-blue-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">{currentTest}</span>
          </div>
        )}
      </div>

      {/* Email Statistics */}
      {emailStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Emails</p>
                <p className="text-2xl font-light text-gray-900 dark:text-white">{emailStats.totalEmails}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-xs text-blue-600 mt-2">
              {emailStats.emailsLast24h} in last 24h
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-light text-gray-900 dark:text-white">{emailStats.successRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-xs text-green-600 mt-2">
              {emailStats.successfulEmails} successful
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Queue</p>
                <p className="text-2xl font-light text-gray-900 dark:text-white">{emailStats.pendingInQueue}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-xs text-yellow-600 mt-2">
              Pending emails
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Known IPs</p>
                <p className="text-2xl font-light text-gray-900 dark:text-white">{emailStats.knownIPsCount}</p>
              </div>
              <Globe className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-xs text-purple-600 mt-2">
              Tracked addresses
            </p>
          </div>
        </div>
      )}

      {/* Email Queue Management */}
      {queueStatus && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">Email Queue Status</h2>
            <button
              onClick={processEmailQueue}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Process Queue</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="text-2xl font-light text-blue-600">{queueStatus.pendingEmails}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Pending</div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <div className="text-2xl font-light text-green-600">{queueStatus.sentEmails}</div>
                  <div className="text-sm text-green-700 dark:text-green-300">Sent</div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <div className="text-2xl font-light text-red-600">{queueStatus.failedEmails}</div>
                  <div className="text-sm text-red-700 dark:text-red-300">Failed</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6 text-gray-600" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Last Processed</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {queueStatus.lastProcessed ? 
                      new Date(queueStatus.lastProcessed).toLocaleTimeString('fr-FR') : 
                      'Never'
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
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-gray-900 dark:text-white">Diagnostic Results</h2>
            <button
              onClick={exportDiagnosticReport}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>

          {/* Results by Category */}
          {Object.entries(diagnosticResults).map(([category, results]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                {category === 'httpsAlerts' && <Shield className="w-6 h-6 text-blue-600" />}
                {category === 'surveyEmails' && <Mail className="w-6 h-6 text-green-600" />}
                {category === 'generalEmails' && <Settings className="w-6 h-6 text-purple-600" />}
                {category === 'systemHealth' && <Database className="w-6 h-6 text-yellow-600" />}
                
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  {category === 'httpsAlerts' && 'HTTPS Alert System'}
                  {category === 'surveyEmails' && 'Survey/Questionnaire Emails'}
                  {category === 'generalEmails' && 'General Information Emails'}
                  {category === 'systemHealth' && 'System Health & Configuration'}
                </h3>
                
                <span className="text-sm text-gray-500">
                  {results.filter((r: EmailDiagnosticResult) => r.status === 'success').length}/{results.length} passed
                </span>
              </div>

              <div className="space-y-4">
                {(results as EmailDiagnosticResult[]).map((result, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{result.test}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(result.priority)}`}>
                            {result.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{result.message}</p>
                        <p className="text-xs opacity-80 mb-2">{result.details}</p>
                        
                        {result.solution && (
                          <div className="mt-3 p-3 bg-white/50 rounded-md">
                            <p className="text-xs font-medium mb-1">💡 Recommended Solution:</p>
                            <p className="text-xs">{result.solution}</p>
                          </div>
                        )}
                        
                        {result.technicalInfo && (
                          <details className="mt-3">
                            <summary className="text-xs font-medium cursor-pointer text-gray-600 dark:text-gray-400">
                              Technical Details
                            </summary>
                            <pre className="text-xs mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded overflow-auto">
                              {JSON.stringify(result.technicalInfo, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Troubleshooting Guide */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h2 className="text-xl font-medium text-blue-800 dark:text-blue-200 mb-6">
          🔧 Email System Troubleshooting Guide
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-3">
              1. HTTPS/IP Alert Issues
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <li>• Verify EmailJS is configured with real credentials</li>
              <li>• Test IP detection with the diagnostic tools</li>
              <li>• Check that emails aren't going to spam folders</li>
              <li>• Ensure the site is accessible via HTTPS</li>
              <li>• Verify IP tracking system is storing known IPs</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-3">
              2. Survey/Questionnaire Email Issues
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <li>• Check EmailJS template has correct variables</li>
              <li>• Test with different email providers (Gmail, Outlook)</li>
              <li>• Verify form validation is working properly</li>
              <li>• Check error logs in the email queue</li>
              <li>• Ensure forms are calling the correct email methods</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-3">
              3. General Information Email Issues
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <li>• Verify SMTP/EmailJS configuration is correct</li>
              <li>• Test network connectivity to email services</li>
              <li>• Check browser security settings</li>
              <li>• Ensure recipient addresses are correct</li>
              <li>• Monitor the email queue for failed attempts</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-3">
              4. System-Wide Email Issues
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <li>• Configure EmailJS via the admin panel if not done</li>
              <li>• Check internet connectivity and DNS resolution</li>
              <li>• Use the "Process Queue" button to retry failed emails</li>
              <li>• Monitor spam folders for delivered emails</li>
              <li>• Export diagnostic report for technical support</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Critical Issues Alert */}
      {diagnosticResults && Object.values(diagnosticResults).flat().some((r: EmailDiagnosticResult) => r.priority === 'critical') && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
              🚨 CRITICAL ISSUES DETECTED
            </h3>
          </div>
          
          <div className="space-y-3">
            {Object.values(diagnosticResults).flat()
              .filter((r: EmailDiagnosticResult) => r.priority === 'critical')
              .map((result: EmailDiagnosticResult, index) => (
                <div key={index} className="bg-white/50 rounded-md p-3">
                  <p className="font-medium text-red-800 dark:text-red-200">{result.test}</p>
                  <p className="text-sm text-red-700 dark:text-red-300">{result.message}</p>
                  {result.solution && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      <strong>Solution:</strong> {result.solution}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Success Summary */}
      {diagnosticResults && Object.values(diagnosticResults).flat().every((r: EmailDiagnosticResult) => r.status === 'success') && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-green-800 dark:text-green-200 mb-2">
            🎉 ALL EMAIL SYSTEMS OPERATIONAL
          </h3>
          <p className="text-green-700 dark:text-green-300">
            All email functions are working correctly. HTTPS alerts, survey emails, and general notifications are fully functional.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailSystemDashboard;