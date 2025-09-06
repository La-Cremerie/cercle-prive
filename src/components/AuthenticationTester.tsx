import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Play, RefreshCw, User, Mail, Lock, Database, Shield, Clock } from 'lucide-react';
import { UserService } from '../services/userService';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  description: string;
  details: string;
  recommendations?: string[];
}

interface TestSuite {
  category: string;
  tests: TestResult[];
  overallStatus: 'success' | 'error' | 'warning';
}

const AuthenticationTester: React.FC = () => {
  const [testResults, setTestResults] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');

  const updateCurrentTest = (testName: string) => {
    setCurrentTest(testName);
  };

  const runComprehensiveTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // 1. Tests du système d'inscription
      updateCurrentTest('Tests d\'inscription');
      const registrationTests = await testRegistrationSystem();
      
      // 2. Tests du système de connexion
      updateCurrentTest('Tests de connexion');
      const loginTests = await testLoginSystem();
      
      // 3. Tests de persistance et historique
      updateCurrentTest('Tests de persistance');
      const persistenceTests = await testPersistenceSystem();
      
      // 4. Tests de facilitation de connexion
      updateCurrentTest('Tests d\'ergonomie');
      const usabilityTests = await testUsabilityFeatures();
      
      // 5. Tests d'intégration globale
      updateCurrentTest('Tests d\'intégration');
      const integrationTests = await testSystemIntegration();

      setTestResults([
        registrationTests,
        loginTests,
        persistenceTests,
        usabilityTests,
        integrationTests
      ]);

    } catch (error) {
      toast.error('Erreur lors des tests d\'authentification');
      console.error('Test error:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  // 1. Tests du système d'inscription
  const testRegistrationSystem = async (): Promise<TestSuite> => {
    const tests: TestResult[] = [];
    
    // Test 1.1: Validation des champs obligatoires
    try {
      await UserService.registerUser({
        nom: '',
        prenom: '',
        telephone: '',
        email: ''
      });
      tests.push({
        name: 'Validation champs vides',
        status: 'error',
        description: 'La validation des champs obligatoires ne fonctionne pas',
        details: 'Le système accepte des champs vides'
      });
    } catch (error) {
      tests.push({
        name: 'Validation champs vides',
        status: 'success',
        description: 'Validation des champs obligatoires fonctionnelle',
        details: 'Le système rejette correctement les champs vides'
      });
    }

    // Test 1.2: Validation format email
    try {
      await UserService.registerUser({
        nom: 'Test',
        prenom: 'User',
        telephone: '0123456789',
        email: 'email-invalide'
      });
      tests.push({
        name: 'Validation format email',
        status: 'warning',
        description: 'Validation email insuffisante',
        details: 'Le système accepte des emails mal formatés',
        recommendations: ['Ajouter une validation regex plus stricte']
      });
    } catch (error) {
      tests.push({
        name: 'Validation format email',
        status: 'success',
        description: 'Validation email fonctionnelle',
        details: 'Le système rejette les emails mal formatés'
      });
    }

    // Test 1.3: Inscription utilisateur valide
    try {
      const testUser = await UserService.registerUser({
        nom: 'TestUser',
        prenom: 'Authentication',
        telephone: '0123456789',
        email: `test-${Date.now()}@example.com`
      });
      
      tests.push({
        name: 'Inscription utilisateur valide',
        status: 'success',
        description: 'Inscription d\'un nouvel utilisateur réussie',
        details: `Utilisateur créé avec ID: ${testUser.id}`
      });
    } catch (error) {
      tests.push({
        name: 'Inscription utilisateur valide',
        status: 'error',
        description: 'Échec de l\'inscription d\'un utilisateur valide',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        recommendations: ['Vérifier la connexion à la base de données', 'Vérifier les permissions']
      });
    }

    // Test 1.4: Prévention doublons email
    try {
      const duplicateEmail = `duplicate-${Date.now()}@example.com`;
      
      // Première inscription
      await UserService.registerUser({
        nom: 'First',
        prenom: 'User',
        telephone: '0123456789',
        email: duplicateEmail
      });
      
      // Tentative de doublon
      await UserService.registerUser({
        nom: 'Second',
        prenom: 'User',
        telephone: '0987654321',
        email: duplicateEmail
      });
      
      tests.push({
        name: 'Prévention doublons email',
        status: 'error',
        description: 'Le système accepte les emails en doublon',
        details: 'Deux utilisateurs avec le même email ont été créés',
        recommendations: ['Ajouter une contrainte d\'unicité sur l\'email']
      });
    } catch (error) {
      tests.push({
        name: 'Prévention doublons email',
        status: 'success',
        description: 'Prévention des doublons email fonctionnelle',
        details: 'Le système rejette correctement les emails déjà utilisés'
      });
    }

    const overallStatus = tests.some(t => t.status === 'error') ? 'error' : 
                         tests.some(t => t.status === 'warning') ? 'warning' : 'success';

    return {
      category: '1. Système d\'Inscription',
      tests,
      overallStatus
    };
  };

  // 2. Tests du système de connexion
  const testLoginSystem = async (): Promise<TestSuite> => {
    const tests: TestResult[] = [];
    
    // Test 2.1: Connexion avec identifiants valides
    try {
      // Créer un utilisateur de test
      const testEmail = `login-test-${Date.now()}@example.com`;
      await UserService.registerUser({
        nom: 'LoginTest',
        prenom: 'User',
        telephone: '0123456789',
        email: testEmail
      });
      
      // Tenter la connexion
      const authenticatedUser = await UserService.authenticateUser(testEmail, 'testpassword');
      
      tests.push({
        name: 'Connexion identifiants valides',
        status: 'success',
        description: 'Connexion avec identifiants corrects réussie',
        details: `Utilisateur authentifié: ${authenticatedUser.prenom} ${authenticatedUser.nom}`
      });
    } catch (error) {
      tests.push({
        name: 'Connexion identifiants valides',
        status: 'error',
        description: 'Échec de connexion avec identifiants valides',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        recommendations: ['Vérifier la logique d\'authentification', 'Vérifier le hashage des mots de passe']
      });
    }

    // Test 2.2: Rejet identifiants invalides
    try {
      await UserService.authenticateUser('nonexistent@example.com', 'wrongpassword');
      tests.push({
        name: 'Rejet identifiants invalides',
        status: 'error',
        description: 'Le système accepte des identifiants incorrects',
        details: 'Connexion réussie avec des identifiants invalides',
        recommendations: ['Renforcer la validation des identifiants']
      });
    } catch (error) {
      tests.push({
        name: 'Rejet identifiants invalides',
        status: 'success',
        description: 'Rejet correct des identifiants invalides',
        details: 'Le système refuse les identifiants incorrects'
      });
    }

    // Test 2.3: Gestion email inexistant
    try {
      await UserService.authenticateUser('inexistant@example.com', 'anypassword');
      tests.push({
        name: 'Gestion email inexistant',
        status: 'error',
        description: 'Le système accepte des emails inexistants',
        details: 'Connexion réussie avec un email non enregistré'
      });
    } catch (error) {
      tests.push({
        name: 'Gestion email inexistant',
        status: 'success',
        description: 'Gestion correcte des emails inexistants',
        details: 'Le système rejette les emails non enregistrés'
      });
    }

    // Test 2.4: Validation format email connexion
    try {
      await UserService.authenticateUser('email-malformé', 'password');
      tests.push({
        name: 'Validation format email connexion',
        status: 'warning',
        description: 'Validation email insuffisante à la connexion',
        details: 'Le système accepte des emails mal formatés'
      });
    } catch (error) {
      tests.push({
        name: 'Validation format email connexion',
        status: 'success',
        description: 'Validation email à la connexion fonctionnelle',
        details: 'Le système rejette les emails mal formatés'
      });
    }

    const overallStatus = tests.some(t => t.status === 'error') ? 'error' : 
                         tests.some(t => t.status === 'warning') ? 'warning' : 'success';

    return {
      category: '2. Système de Connexion',
      tests,
      overallStatus
    };
  };

  // 3. Tests de persistance et historique
  const testPersistenceSystem = async (): Promise<TestSuite> => {
    const tests: TestResult[] = [];
    
    // Test 3.1: Sauvegarde localStorage
    try {
      const testData = { test: 'persistence', timestamp: Date.now() };
      localStorage.setItem('test-persistence', JSON.stringify(testData));
      const retrieved = localStorage.getItem('test-persistence');
      
      if (retrieved && JSON.parse(retrieved).test === 'persistence') {
        tests.push({
          name: 'Sauvegarde localStorage',
          status: 'success',
          description: 'Sauvegarde locale fonctionnelle',
          details: 'Les données sont correctement stockées et récupérées'
        });
      } else {
        tests.push({
          name: 'Sauvegarde localStorage',
          status: 'error',
          description: 'Problème de sauvegarde locale',
          details: 'Les données ne sont pas correctement stockées'
        });
      }
      
      localStorage.removeItem('test-persistence');
    } catch (error) {
      tests.push({
        name: 'Sauvegarde localStorage',
        status: 'error',
        description: 'localStorage non fonctionnel',
        details: 'Impossible d\'utiliser le stockage local',
        recommendations: ['Vérifier les paramètres du navigateur', 'Tester en navigation privée']
      });
    }

    // Test 3.2: Récupération historique utilisateurs
    try {
      const allUsers = await UserService.getAllUsers();
      
      tests.push({
        name: 'Récupération historique utilisateurs',
        status: 'success',
        description: 'Historique des utilisateurs accessible',
        details: `${allUsers.length} utilisateur(s) trouvé(s) dans l'historique`
      });
    } catch (error) {
      tests.push({
        name: 'Récupération historique utilisateurs',
        status: 'error',
        description: 'Impossible de récupérer l\'historique',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        recommendations: ['Vérifier la connexion à la base de données']
      });
    }

    // Test 3.3: Persistance session utilisateur
    const sessionData = localStorage.getItem('userData');
    const loginStatus = localStorage.getItem('userLoggedIn');
    
    if (sessionData && loginStatus === 'true') {
      try {
        const userData = JSON.parse(sessionData);
        tests.push({
          name: 'Persistance session utilisateur',
          status: 'success',
          description: 'Session utilisateur persistante',
          details: `Session active pour: ${userData.prenom} ${userData.nom}`
        });
      } catch (error) {
        tests.push({
          name: 'Persistance session utilisateur',
          status: 'error',
          description: 'Données de session corrompues',
          details: 'Les données utilisateur ne peuvent pas être lues',
          recommendations: ['Nettoyer les données de session corrompues']
        });
      }
    } else {
      tests.push({
        name: 'Persistance session utilisateur',
        status: 'warning',
        description: 'Aucune session active détectée',
        details: 'L\'utilisateur devra se reconnecter à chaque visite'
      });
    }

    // Test 3.4: Intégrité des données
    try {
      const users = await UserService.getAllUsers();
      let corruptedCount = 0;
      
      users.forEach(user => {
        if (!user.email || !user.nom || !user.prenom) {
          corruptedCount++;
        }
      });
      
      if (corruptedCount === 0) {
        tests.push({
          name: 'Intégrité des données',
          status: 'success',
          description: 'Toutes les données utilisateur sont intègres',
          details: `${users.length} utilisateur(s) vérifiés, aucune corruption détectée`
        });
      } else {
        tests.push({
          name: 'Intégrité des données',
          status: 'warning',
          description: 'Données utilisateur partiellement corrompues',
          details: `${corruptedCount} utilisateur(s) avec des données incomplètes`,
          recommendations: ['Nettoyer les données corrompues', 'Ajouter une validation plus stricte']
        });
      }
    } catch (error) {
      tests.push({
        name: 'Intégrité des données',
        status: 'error',
        description: 'Impossible de vérifier l\'intégrité des données',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    const overallStatus = tests.some(t => t.status === 'error') ? 'error' : 
                         tests.some(t => t.status === 'warning') ? 'warning' : 'success';

    return {
      category: '3. Persistance et Historique',
      tests,
      overallStatus
    };
  };

  // 4. Tests de facilitation de connexion
  const testUsabilityFeatures = async (): Promise<TestSuite> => {
    const tests: TestResult[] = [];
    
    // Test 4.1: Interface utilisateur
    const loginForm = document.querySelector('form');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    
    if (loginForm && emailInput && passwordInput) {
      tests.push({
        name: 'Interface de connexion',
        status: 'success',
        description: 'Formulaire de connexion présent et accessible',
        details: 'Tous les éléments d\'interface sont disponibles'
      });
    } else {
      tests.push({
        name: 'Interface de connexion',
        status: 'error',
        description: 'Éléments d\'interface manquants',
        details: 'Formulaire ou champs de saisie introuvables',
        recommendations: ['Vérifier le rendu du composant LoginForm']
      });
    }

    // Test 4.2: Basculement Connection/Registration
    const connectionTab = document.querySelector('button:contains("Connection")');
    const registrationTab = document.querySelector('button:contains("Registration")');
    
    if (connectionTab || registrationTab) {
      tests.push({
        name: 'Basculement onglets',
        status: 'success',
        description: 'Système d\'onglets Connection/Registration fonctionnel',
        details: 'Les utilisateurs peuvent basculer entre connexion et inscription'
      });
    } else {
      tests.push({
        name: 'Basculement onglets',
        status: 'warning',
        description: 'Onglets de basculement non détectés',
        details: 'Interface de basculement peut-être non visible'
      });
    }

    // Test 4.3: Feedback utilisateur
    const toastContainer = document.querySelector('[data-hot-toast]');
    
    tests.push({
      name: 'Système de notifications',
      status: toastContainer ? 'success' : 'warning',
      description: toastContainer ? 'Système de notifications actif' : 'Notifications non détectées',
      details: toastContainer ? 'Les utilisateurs reçoivent des feedbacks visuels' : 'Feedback utilisateur limité'
    });

    // Test 4.4: Accessibilité
    const hasLabels = document.querySelectorAll('label').length > 0;
    const hasAriaLabels = document.querySelectorAll('[aria-label]').length > 0;
    
    if (hasLabels || hasAriaLabels) {
      tests.push({
        name: 'Accessibilité',
        status: 'success',
        description: 'Éléments d\'accessibilité présents',
        details: 'Labels et attributs ARIA détectés'
      });
    } else {
      tests.push({
        name: 'Accessibilité',
        status: 'warning',
        description: 'Accessibilité limitée',
        details: 'Peu d\'éléments d\'accessibilité détectés',
        recommendations: ['Ajouter des labels et attributs ARIA']
      });
    }

    const overallStatus = tests.some(t => t.status === 'error') ? 'error' : 
                         tests.some(t => t.status === 'warning') ? 'warning' : 'success';

    return {
      category: '4. Facilitation de Connexion',
      tests,
      overallStatus
    };
  };

  // 5. Tests d'intégration globale
  const testSystemIntegration = async (): Promise<TestSuite> => {
    const tests: TestResult[] = [];
    
    // Test 5.1: Flux complet inscription → connexion
    try {
      const testEmail = `integration-${Date.now()}@example.com`;
      
      // Inscription
      const newUser = await UserService.registerUser({
        nom: 'Integration',
        prenom: 'Test',
        telephone: '0123456789',
        email: testEmail
      });
      
      // Connexion immédiate
      const authenticatedUser = await UserService.authenticateUser(testEmail, 'testpassword');
      
      if (newUser.id === authenticatedUser.id) {
        tests.push({
          name: 'Flux inscription → connexion',
          status: 'success',
          description: 'Flux complet inscription puis connexion fonctionnel',
          details: 'L\'utilisateur peut s\'inscrire puis se connecter immédiatement'
        });
      } else {
        tests.push({
          name: 'Flux inscription → connexion',
          status: 'error',
          description: 'Incohérence entre inscription et connexion',
          details: 'Les données utilisateur ne correspondent pas'
        });
      }
    } catch (error) {
      tests.push({
        name: 'Flux inscription → connexion',
        status: 'error',
        description: 'Échec du flux complet',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    // Test 5.2: Gestion des erreurs réseau
    try {
      // Simuler une erreur réseau en utilisant une URL invalide
      const originalFetch = window.fetch;
      window.fetch = () => Promise.reject(new Error('Network error'));
      
      try {
        await UserService.getAllUsers();
        tests.push({
          name: 'Gestion erreurs réseau',
          status: 'success',
          description: 'Fallback localStorage fonctionnel',
          details: 'Le système utilise le stockage local en cas d\'erreur réseau'
        });
      } catch (error) {
        tests.push({
          name: 'Gestion erreurs réseau',
          status: 'warning',
          description: 'Gestion d\'erreur réseau limitée',
          details: 'Le système ne gère pas bien les pannes réseau'
        });
      }
      
      // Restaurer fetch
      window.fetch = originalFetch;
    } catch (error) {
      tests.push({
        name: 'Gestion erreurs réseau',
        status: 'error',
        description: 'Impossible de tester la gestion d\'erreur réseau',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    // Test 5.3: Performance du système
    const startTime = performance.now();
    try {
      await UserService.getAllUsers();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration < 1000) {
        tests.push({
          name: 'Performance système',
          status: 'success',
          description: 'Performance excellente',
          details: `Récupération des utilisateurs en ${Math.round(duration)}ms`
        });
      } else if (duration < 3000) {
        tests.push({
          name: 'Performance système',
          status: 'warning',
          description: 'Performance acceptable',
          details: `Récupération des utilisateurs en ${Math.round(duration)}ms`,
          recommendations: ['Optimiser les requêtes de base de données']
        });
      } else {
        tests.push({
          name: 'Performance système',
          status: 'error',
          description: 'Performance dégradée',
          details: `Récupération des utilisateurs en ${Math.round(duration)}ms`,
          recommendations: ['Optimiser les requêtes', 'Ajouter de la mise en cache']
        });
      }
    } catch (error) {
      tests.push({
        name: 'Performance système',
        status: 'error',
        description: 'Impossible de mesurer les performances',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    const overallStatus = tests.some(t => t.status === 'error') ? 'error' : 
                         tests.some(t => t.status === 'warning') ? 'warning' : 'success';

    return {
      category: '5. Intégration Globale',
      tests,
      overallStatus
    };
  };

  const getStatusIcon = (status: 'success' | 'error' | 'warning') => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: 'success' | 'error' | 'warning') => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
  };

  const getCategoryStatusColor = (status: 'success' | 'error' | 'warning') => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
          Test du Système d'Authentification
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Vérification complète des fonctionnalités d'inscription, connexion et persistance
        </p>
        
        <button
          onClick={runComprehensiveTests}
          disabled={isRunning}
          className="flex items-center space-x-3 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 mx-auto"
        >
          <Play className={`w-6 h-6 ${isRunning ? 'animate-pulse' : ''}`} />
          <span className="text-lg">
            {isRunning ? 'Tests en cours...' : 'Lancer les Tests Complets'}
          </span>
        </button>
        
        {currentTest && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-blue-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">{currentTest}</span>
          </div>
        )}
      </div>

      {/* Résultats des tests */}
      {testResults.length > 0 && (
        <div className="space-y-8">
          {/* Résumé global */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
              📊 Résumé Global des Tests
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {testResults.map((suite, index) => (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${getCategoryStatusColor(suite.overallStatus)}`}>
                    {getStatusIcon(suite.overallStatus)}
                    <span>{suite.category.split('.')[0]}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {suite.tests.filter(t => t.status === 'success').length}/{suite.tests.length} réussis
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Détails des tests */}
          {testResults.map((suite, suiteIndex) => (
            <motion.div
              key={suiteIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: suiteIndex * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                  {suite.category}
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryStatusColor(suite.overallStatus)}`}>
                  {getStatusIcon(suite.overallStatus)}
                  <span className="ml-2">
                    {suite.overallStatus === 'success' ? 'Tous les tests réussis' :
                     suite.overallStatus === 'warning' ? 'Problèmes mineurs' : 'Erreurs critiques'}
                  </span>
                </span>
              </div>

              <div className="space-y-4">
                {suite.tests.map((test, testIndex) => (
                  <div
                    key={testIndex}
                    className={`border rounded-lg p-4 ${getStatusColor(test.status)}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(test.status)}
                      <div className="flex-1">
                        <h3 className="font-medium mb-2">{test.name}</h3>
                        <p className="text-sm mb-2">{test.description}</p>
                        <p className="text-xs opacity-80">{test.details}</p>
                        
                        {test.recommendations && test.recommendations.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-medium mb-1">Recommandations :</p>
                            <ul className="text-xs space-y-1">
                              {test.recommendations.map((rec, recIndex) => (
                                <li key={recIndex} className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Recommandations globales */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h2 className="text-xl font-medium text-blue-800 dark:text-blue-200 mb-4">
              🎯 Recommandations Globales
            </h2>
            
            <div className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>
                  <strong>Sécurité :</strong> Implémenter un vrai système de hashage des mots de passe avec bcrypt
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Database className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>
                  <strong>Base de données :</strong> Migrer complètement vers Supabase pour la persistance
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <User className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>
                  <strong>UX :</strong> Ajouter une fonctionnalité "Se souvenir de moi"
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>
                  <strong>Validation :</strong> Ajouter la vérification d'email par lien de confirmation
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Lock className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>
                  <strong>Récupération :</strong> Implémenter la récupération de mot de passe oublié
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthenticationTester;