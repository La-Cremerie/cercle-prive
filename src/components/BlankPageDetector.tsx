import React, { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, Settings, Phone } from 'lucide-react';
import { BlankPageDiagnostics } from '../utils/diagnostics';

const BlankPageDetector: React.FC = () => {
  const [showDetector, setShowDetector] = useState(false);
  const [diagnosticSummary, setDiagnosticSummary] = useState<any>(null);

  useEffect(() => {
    // Detect if page is blank or has loading issues
    const detectBlankPage = () => {
      const rootElement = document.getElementById('root');
      const hasContent = rootElement && rootElement.children.length > 0;
      const hasVisibleContent = rootElement && rootElement.offsetHeight > 100;
      
      // If no content after 5 seconds, show detector
      if (!hasContent || !hasVisibleContent) {
        setShowDetector(true);
        runQuickDiagnostic();
      }
    };

    const timer = setTimeout(detectBlankPage, 5000);
    
    // Also check immediately if DOM is already loaded
    if (document.readyState === 'complete') {
      setTimeout(detectBlankPage, 1000);
    }

    return () => clearTimeout(timer);
  }, []);

  const runQuickDiagnostic = async () => {
    try {
      const results = await BlankPageDiagnostics.runFullDiagnostic();
      setDiagnosticSummary(results);
    } catch (error) {
      console.error('Quick diagnostic failed:', error);
    }
  };

  const handleQuickFix = async () => {
    try {
      const fixes = await BlankPageDiagnostics.runAutomaticFixes();
      if (fixes.length > 0) {
        // Reload page after fixes
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      console.error('Quick fix failed:', error);
    }
  };

  if (!showDetector) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-600 mx-auto mb-6" />
        
        <h2 className="text-2xl font-light text-gray-900 mb-4">
          CERCLE PRIVÉ
        </h2>
        
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Page Loading Issue Detected
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          The page appears to be blank or not loading properly. 
          Let's run a quick diagnostic to identify and fix the issue.
        </p>

        {diagnosticSummary && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-medium text-gray-900 mb-2">Quick Analysis:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• JavaScript Errors: {diagnosticSummary.frontend?.jsErrors?.length || 0}</li>
              <li>• React Mounted: {diagnosticSummary.frontend?.reactMounting ? '✅' : '❌'}</li>
              <li>• Server Response: {diagnosticSummary.backend?.serverResponse ? '✅' : '❌'}</li>
              <li>• User Session: {diagnosticSummary.authentication?.userLoggedIn ? '✅' : '❌'}</li>
            </ul>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleQuickFix}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Auto Fix & Reload</span>
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Force Reload</span>
          </button>
          
          <button
            onClick={() => {
              BlankPageDiagnostics.emergencyReset();
              window.location.reload();
            }}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>Emergency Reset</span>
          </button>
          
          <a
            href="mailto:nicolas.c@lacremerie.fr?subject=Technical Issue - Blank Page&body=I'm experiencing a blank page issue on CERCLE PRIVÉ. Please help."
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <Phone className="w-5 h-5" />
            <span>Contact Support</span>
          </a>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          If the issue persists, please contact technical support with the diagnostic report.
        </p>
      </div>
    </div>
  );
};

export default BlankPageDetector;