import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Download, Trash2, Settings, Monitor } from 'lucide-react';
import { BlankPageDiagnostics } from '../utils/diagnostics';
import toast from 'react-hot-toast';

interface DiagnosticResult {
  category: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
  fix?: () => void;
}

const DiagnosticPanel: React.FC = () => {
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const runDiagnostic = async () => {
    setIsRunning(true);
    setDiagnosticResults([]);

    try {
      const results = await BlankPageDiagnostics.runFullDiagnostic();
      const diagnostics: DiagnosticResult[] = [];

      // Frontend diagnostics
      if (results.frontend.jsErrors.length > 0) {
        diagnostics.push({
          category: 'JavaScript Errors',
          status: 'error',
          message: `${results.frontend.jsErrors.length} JavaScript error(s) detected`,
          details: results.frontend.jsErrors,
          fix: () => {
            localStorage.removeItem('errorLog');
            toast.success('Error log cleared');
          }
        });
      } else {
        diagnostics.push({
          category: 'JavaScript',
          status: 'success',
          message: 'No JavaScript errors detected'
        });
      }

      if (!results.frontend.reactMounting) {
        diagnostics.push({
          category: 'React Mounting',
          status: 'error',
          message: 'React application not properly mounted',
          fix: () => {
            window.location.reload();
          }
        });
      } else {
        diagnostics.push({
          category: 'React Mounting',
          status: 'success',
          message: 'React application mounted successfully'
        });
      }

      // Backend diagnostics
      if (!results.backend.serverResponse) {
        diagnostics.push({
          category: 'Server Connection',
          status: 'error',
          message: 'Server not responding',
          details: 'Cannot reach the main server'
        });
      } else {
        diagnostics.push({
          category: 'Server Connection',
          status: 'success',
          message: 'Server responding normally'
        });
      }

      if (!results.backend.supabaseConnection) {
        diagnostics.push({
          category: 'Database Connection',
          status: 'warning',
          message: 'Supabase connection issues',
          details: 'Using local storage fallback'
        });
      } else {
        diagnostics.push({
          category: 'Database Connection',
          status: 'success',
          message: 'Supabase connected successfully'
        });
      }

      // Authentication diagnostics
      if (!results.authentication.userLoggedIn && !results.authentication.adminLoggedIn) {
        diagnostics.push({
          category: 'Authentication',
          status: 'warning',
          message: 'No active user session',
          details: 'User may need to log in again'
        });
      } else {
        diagnostics.push({
          category: 'Authentication',
          status: 'success',
          message: 'Valid user session found'
        });
      }

      // Browser compatibility
      if (!results.browser.browserSupported) {
        diagnostics.push({
          category: 'Browser Compatibility',
          status: 'error',
          message: 'Browser missing required features',
          details: results.browser.missingFeatures
        });
      } else {
        diagnostics.push({
          category: 'Browser Compatibility',
          status: 'success',
          message: 'Browser fully supported'
        });
      }

      // Network diagnostics
      if (!results.network.networkStatus) {
        diagnostics.push({
          category: 'Network',
          status: 'error',
          message: 'No internet connection',
          details: 'Check your network connection'
        });
      } else {
        diagnostics.push({
          category: 'Network',
          status: 'success',
          message: `Connection speed: ${results.network.connectionSpeed}`
        });
      }

      setDiagnosticResults(diagnostics);

    } catch (error) {
      toast.error('Diagnostic failed');
      console.error('Diagnostic error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runAutomaticFixes = async () => {
    try {
      const fixes = await BlankPageDiagnostics.runAutomaticFixes();
      if (fixes.length > 0) {
        toast.success(`Applied ${fixes.length} automatic fix(es)`);
        // Re-run diagnostic after fixes
        setTimeout(runDiagnostic, 1000);
      } else {
        toast.success('No fixes needed - system is healthy');
      }
    } catch (error) {
      toast.error('Auto-fix failed');
    }
  };

  const emergencyReset = () => {
    if (window.confirm('⚠️ EMERGENCY RESET ⚠️\n\nThis will:\n- Clear all caches\n- Reset all local data\n- Reload the page\n\nContinue?')) {
      BlankPageDiagnostics.emergencyReset();
      toast.success('Emergency reset completed - reloading...');
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  const exportDiagnosticReport = () => {
    const report = BlankPageDiagnostics.generateReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostic-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    
    URL.revokeObjectURL(url);
    toast.success('Diagnostic report exported');
  };

  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  useEffect(() => {
    // Auto-run diagnostic on component mount
    runDiagnostic();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-light text-gray-900 mb-2">
          CERCLE PRIVÉ - Diagnostic System
        </h1>
        <p className="text-gray-600">
          Comprehensive troubleshooting for blank page issues
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={runDiagnostic}
            disabled={isRunning}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Monitor className={`w-5 h-5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Run Diagnostic'}</span>
          </button>

          <button
            onClick={runAutomaticFixes}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Auto Fix</span>
          </button>

          <button
            onClick={emergencyReset}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span>Emergency Reset</span>
          </button>

          <button
            onClick={exportDiagnosticReport}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Diagnostic Results */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Diagnostic Results</h2>
        
        {diagnosticResults.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Click "Run Diagnostic" to start troubleshooting
          </div>
        ) : (
          <div className="space-y-4">
            {diagnosticResults.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <h3 className="font-medium">{result.category}</h3>
                      <p className="text-sm">{result.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {result.details && (
                      <button
                        onClick={() => setShowDetails(showDetails === result.category ? null : result.category)}
                        className="text-sm px-3 py-1 bg-white/50 rounded-md hover:bg-white/70 transition-colors"
                      >
                        {showDetails === result.category ? 'Hide' : 'Details'}
                      </button>
                    )}
                    {result.fix && (
                      <button
                        onClick={result.fix}
                        className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Fix
                      </button>
                    )}
                  </div>
                </div>
                
                {showDetails === result.category && result.details && (
                  <div className="mt-4 p-3 bg-white/50 rounded-md">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {typeof result.details === 'string' 
                        ? result.details 
                        : JSON.stringify(result.details, null, 2)
                      }
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Browser:</strong> {navigator.userAgent.split(' ')[0]}
          </div>
          <div>
            <strong>Viewport:</strong> {window.innerWidth} × {window.innerHeight}
          </div>
          <div>
            <strong>Protocol:</strong> {window.location.protocol}
          </div>
          <div>
            <strong>Host:</strong> {window.location.host}
          </div>
          <div>
            <strong>Local Storage:</strong> {typeof Storage !== 'undefined' ? '✅ Available' : '❌ Not available'}
          </div>
          <div>
            <strong>Service Worker:</strong> {'serviceWorker' in navigator ? '✅ Supported' : '❌ Not supported'}
          </div>
        </div>
      </div>

      {/* Troubleshooting Guide */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Troubleshooting Guide</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-medium text-gray-900">Step 1: Check Browser Console</h3>
            <p className="text-sm text-gray-600">
              Press F12 → Console tab → Look for red error messages
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-medium text-gray-900">Step 2: Clear Browser Cache</h3>
            <p className="text-sm text-gray-600">
              Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac) to hard refresh
            </p>
          </div>
          
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-medium text-gray-900">Step 3: Check Network Tab</h3>
            <p className="text-sm text-gray-600">
              F12 → Network tab → Reload page → Look for failed requests (red)
            </p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-medium text-gray-900">Step 4: Verify Login Status</h3>
            <p className="text-sm text-gray-600">
              Check if user is properly logged in and has valid session
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Actions */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-red-800 mb-4">Emergency Actions</h2>
        <p className="text-sm text-red-700 mb-4">
          Use these actions only if the automatic fixes don't resolve the issue.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              toast.success('All local data cleared - please reload');
            }}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Clear All Local Data
          </button>
          
          <button
            onClick={() => {
              if ('caches' in window) {
                caches.keys().then(names => {
                  names.forEach(name => caches.delete(name));
                  toast.success('All caches cleared - please reload');
                });
              }
            }}
            className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            Clear All Caches
          </button>
          
          <button
            onClick={() => window.location.href = window.location.origin + '?reset=' + Date.now()}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Force Page Reload with Cache Bust
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPanel;