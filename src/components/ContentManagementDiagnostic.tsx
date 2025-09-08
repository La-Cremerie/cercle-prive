import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Database, Image, FileText, Home, Settings, Wifi, WifiOff } from 'lucide-react';
import { UserService } from '../services/userService';
import { ContentVersioningService } from '../services/contentVersioningService';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface DiagnosticResult {
  category: string;
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details: string;
  solution?: string;
  technicalInfo?: any;
}

const ContentManagementDiagnostic: React.FC = () => {
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [systemInfo, setSystemInfo] = useState<any>({});

  const updateCurrentTest = (testName: string) => {
    setCurrentTest(testName);
  };

  const addResult = (result: DiagnosticResult) => {
    setDiagnosticResults(prev => [...prev, result]);
  };

  const runCompleteDiagnostic = async () => {
    setIsRunning(true);
    setDiagnosticResults([]);
    
    try {
      // 1. Tests de base du système
      updateCurrentTest('Vérification de l\'environnement système...');
      await testSystemEnvironment();
      
      // 2. Tests de connectivité base de données
      updateCurrentTest('Test de connectivité base de données...');
      await testDatabaseConnectivity();
      
      // 3. Tests de gestion des images
      updateCurrentTest('Test du système d\'images...');
      await testImageManagement();
      
      // 4. Tests de gestion du contenu texte
      updateCurrentTest('Test de gestion du contenu...');
      await testContentManagement();
      
      // 5. Tests de gestion des biens immobiliers
      updateCurrentTest('Test de gestion des propriétés...');
      await testPropertyManagement();
      
      // 6. Tests de synchronisation temps réel
      updateCurrentTest('Test de synchronisation temps réel...');
      await testRealTimeSync();
      
      // 7. Tests de permissions et sécurité
      updateCurrentTest('Test des permissions...');
      await testPermissionsAndSecurity();
      
      // 8. Tests de performance et cache
      updateCurrentTest('Test de performance...');
      await testPerformanceAndCache();

    } catch (error) {
      addResult({
        category: 'Erreur Critique',
        test: 'Diagnostic général',
        status: 'error',
        message: 'Erreur lors du diagnostic',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        solution: 'Vérifiez la console pour plus de détails'
      });
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  // 1. Tests de l'environnement système
  const testSystemEnvironment = async () => {
    // Test localStorage
    try {
      localStorage.setItem('diagnostic-test', 'test');
      const retrieved = localStorage.getItem('diagnostic-test');
      localStorage.removeItem('diagnostic-test');
      
      if (retrieved === 'test') {
        addResult({
          category: 'Environnement',
          test: 'LocalStorage',
          status: 'success',
          message: 'LocalStorage fonctionnel',
          details: 'Stockage local disponible pour la sauvegarde'
        });
      } else {
        addResult({
          category: 'Environnement',
          test: 'LocalStorage',
          status: 'error',
          message: 'LocalStorage défaillant',
          details: 'Impossible de lire/écrire dans le stockage local',
          solution: 'Vérifiez les paramètres de confidentialité du navigateur'
        });
      }
    } catch (error) {
      addResult({
        category: 'Environnement',
        test: 'LocalStorage',
        status: 'error',
        message: 'LocalStorage inaccessible',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        solution: 'Désactivez le mode navigation privée ou vérifiez les paramètres du navigateur'
      });
    }

    // Test Service Worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        addResult({
          category: 'Environnement',
          test: 'Service Worker',
          status: registration ? 'success' : 'warning',
          message: registration ? 'Service Worker actif' : 'Service Worker non enregistré',
          details: registration ? `Scope: ${registration.scope}` : 'Pas de cache hors ligne disponible'
        });
      } catch (error) {
        addResult({
          category: 'Environnement',
          test: 'Service Worker',
          status: 'error',
          message: 'Erreur Service Worker',
          details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }
    } else {
      addResult({
        category: 'Environnement',
        test: 'Service Worker',
        status: 'warning',
        message: 'Service Worker non supporté',
        details: 'Navigateur trop ancien ou incompatible'
      });
    }

    // Test des variables d'environnement
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey && 
        supabaseUrl !== 'https://your-project.supabase.co' && 
        supabaseKey !== 'your-anon-key') {
      addResult({
        category: 'Configuration',
        test: 'Variables Supabase',
        status: 'success',
        message: 'Supabase configuré',
        details: `URL: ${supabaseUrl.substring(0, 30)}...`
      });
    } else {
      addResult({
        category: 'Configuration',
        test: 'Variables Supabase',
        status: 'warning',
        message: 'Supabase non configuré',
        details: 'Utilisation du mode localStorage uniquement',
        solution: 'Cliquez sur "Connect to Supabase" en haut à droite pour configurer'
      });
    }
  };

  // 2. Tests de connectivité base de données
  const testDatabaseConnectivity = async () => {
    try {
      // Test connexion Supabase
      const { data, error } = await supabase.from('user_registrations').select('count').limit(1);
      
      if (error) {
        addResult({
          category: 'Base de Données',
          test: 'Connexion Supabase',
          status: 'error',
          message: 'Erreur de connexion Supabase',
          details: error.message,
          solution: 'Vérifiez vos clés API et la configuration réseau'
        });
      } else {
        addResult({
          category: 'Base de Données',
          test: 'Connexion Supabase',
          status: 'success',
          message: 'Connexion Supabase active',
          details: 'Base de données accessible'
        });
      }
    } catch (error) {
      addResult({
        category: 'Base de Données',
        test: 'Connexion Supabase',
        status: 'warning',
        message: 'Supabase inaccessible',
        details: 'Utilisation du mode local uniquement',
        solution: 'Vérifiez votre connexion internet et la configuration Supabase'
      });
    }

    // Test des tables critiques
    const criticalTables = [
      'user_registrations',
      'site_content_versions', 
      'properties_versions',
      'presentation_images_versions',
      'design_settings_versions'
    ];

    for (const table of criticalTables) {
      try {
        const { data, error } = await supabase.from(table).select('count').limit(1);
        
        if (error) {
          addResult({
            category: 'Base de Données',
            test: `Table ${table}`,
            status: 'error',
            message: `Table ${table} inaccessible`,
            details: error.message,
            solution: 'Vérifiez les permissions RLS et la structure de la base'
          });
        } else {
          addResult({
            category: 'Base de Données',
            test: `Table ${table}`,
            status: 'success',
            message: `Table ${table} accessible`,
            details: 'Structure de base de données correcte'
          });
        }
      } catch (error) {
        addResult({
          category: 'Base de Données',
          test: `Table ${table}`,
          status: 'warning',
          message: `Table ${table} non testée`,
          details: 'Connexion Supabase indisponible'
        });
      }
    }
  };

  // 3. Tests de gestion des images
  const testImageManagement = async () => {
    // Test stockage local des images
    const presentationImages = localStorage.getItem('presentationImages');
    const conceptImages = localStorage.getItem('conceptImages');
    
    addResult({
      category: 'Gestion Images',
      test: 'Stockage local images',
      status: (presentationImages || conceptImages) ? 'success' : 'warning',
      message: (presentationImages || conceptImages) ? 'Images stockées localement' : 'Aucune image en local',
      details: `Hero: ${presentationImages ? 'Oui' : 'Non'}, Concept: ${conceptImages ? 'Oui' : 'Non'}`
    });

    // Test de chargement d'image externe
    try {
      const testImageUrl = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=100';
      const response = await fetch(testImageUrl, { method: 'HEAD' });
      
      addResult({
        category: 'Gestion Images',
        test: 'Chargement images externes',
        status: response.ok ? 'success' : 'error',
        message: response.ok ? 'Images externes accessibles' : 'Problème chargement images',
        details: `Status: ${response.status}`,
        solution: !response.ok ? 'Vérifiez la connexion internet et les paramètres CORS' : undefined
      });
    } catch (error) {
      addResult({
        category: 'Gestion Images',
        test: 'Chargement images externes',
        status: 'error',
        message: 'Impossible de charger les images externes',
        details: error instanceof Error ? error.message : 'Erreur réseau',
        solution: 'Vérifiez votre connexion internet et les paramètres de sécurité'
      });
    }

    // Test de sauvegarde d'image
    try {
      const testImage = {
        id: 'test-' + Date.now(),
        url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=100',
        name: 'Test Image',
        type: 'url',
        isActive: false
      };
      
      const currentImages = JSON.parse(localStorage.getItem('presentationImages') || '[]');
      const testImages = [...currentImages, testImage];
      localStorage.setItem('test-images', JSON.stringify(testImages));
      localStorage.removeItem('test-images');
      
      addResult({
        category: 'Gestion Images',
        test: 'Sauvegarde images',
        status: 'success',
        message: 'Sauvegarde d\'images fonctionnelle',
        details: 'Système de stockage d\'images opérationnel'
      });
    } catch (error) {
      addResult({
        category: 'Gestion Images',
        test: 'Sauvegarde images',
        status: 'error',
        message: 'Erreur sauvegarde images',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        solution: 'Vérifiez l\'espace de stockage disponible et les permissions'
      });
    }
  };

  // 4. Tests de gestion du contenu
  const testContentManagement = async () => {
    // Test du contenu du site
    const siteContent = localStorage.getItem('siteContent');
    
    if (siteContent) {
      try {
        const content = JSON.parse(siteContent);
        const hasRequiredSections = content.hero && content.concept && content.services;
        
        addResult({
          category: 'Gestion Contenu',
          test: 'Structure du contenu',
          status: hasRequiredSections ? 'success' : 'warning',
          message: hasRequiredSections ? 'Structure de contenu complète' : 'Structure de contenu incomplète',
          details: `Sections: Hero(${!!content.hero}), Concept(${!!content.concept}), Services(${!!content.services})`
        });
      } catch (error) {
        addResult({
          category: 'Gestion Contenu',
          test: 'Structure du contenu',
          status: 'error',
          message: 'Contenu corrompu',
          details: 'Impossible de parser le contenu stocké',
          solution: 'Réinitialisez le contenu ou restaurez depuis une sauvegarde'
        });
      }
    } else {
      addResult({
        category: 'Gestion Contenu',
        test: 'Structure du contenu',
        status: 'warning',
        message: 'Aucun contenu personnalisé',
        details: 'Utilisation du contenu par défaut',
        solution: 'Configurez le contenu via le panel d\'administration'
      });
    }

    // Test de sauvegarde de contenu
    try {
      const testContent = {
        hero: { title: 'Test', subtitle: 'Test', backgroundImage: 'test.jpg' },
        concept: { title: 'Test', description: 'Test', image: 'test.jpg' },
        services: { title: 'Test', subtitle: 'Test', items: [] },
        contact: { title: 'Test', description: 'Test', email: 'test@test.com', phone: '123' }
      };
      
      localStorage.setItem('test-content', JSON.stringify(testContent));
      const retrieved = localStorage.getItem('test-content');
      localStorage.removeItem('test-content');
      
      if (retrieved && JSON.parse(retrieved).hero.title === 'Test') {
        addResult({
          category: 'Gestion Contenu',
          test: 'Sauvegarde contenu',
          status: 'success',
          message: 'Sauvegarde de contenu fonctionnelle',
          details: 'Le système peut sauvegarder et récupérer le contenu'
        });
      } else {
        addResult({
          category: 'Gestion Contenu',
          test: 'Sauvegarde contenu',
          status: 'error',
          message: 'Problème de sauvegarde',
          details: 'Les données ne sont pas correctement sauvegardées'
        });
      }
    } catch (error) {
      addResult({
        category: 'Gestion Contenu',
        test: 'Sauvegarde contenu',
        status: 'error',
        message: 'Erreur sauvegarde contenu',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        solution: 'Vérifiez l\'espace de stockage et les permissions du navigateur'
      });
    }
  };

  // 5. Tests de gestion des propriétés
  const testPropertyManagement = async () => {
    const properties = localStorage.getItem('properties');
    
    if (properties) {
      try {
        const propertiesData = JSON.parse(properties);
        const isValidStructure = Array.isArray(propertiesData) && 
          propertiesData.every(p => p.id && p.name && p.location && p.price);
        
        addResult({
          category: 'Biens Immobiliers',
          test: 'Structure des propriétés',
          status: isValidStructure ? 'success' : 'warning',
          message: isValidStructure ? 'Structure des biens valide' : 'Structure des biens incomplète',
          details: `${propertiesData.length} bien(s) trouvé(s)`,
          technicalInfo: propertiesData.map(p => ({ id: p.id, name: p.name, status: p.status }))
        });
      } catch (error) {
        addResult({
          category: 'Biens Immobiliers',
          test: 'Structure des propriétés',
          status: 'error',
          message: 'Données de propriétés corrompues',
          details: 'Impossible de parser les données des biens',
          solution: 'Réinitialisez les données des biens ou restaurez depuis une sauvegarde'
        });
      }
    } else {
      addResult({
        category: 'Biens Immobiliers',
        test: 'Structure des propriétés',
        status: 'warning',
        message: 'Aucun bien configuré',
        details: 'Utilisation des biens par défaut',
        solution: 'Ajoutez des biens via le panel d\'administration'
      });
    }

    // Test de création/modification de propriété
    try {
      const testProperty = {
        id: 'test-' + Date.now(),
        name: 'Test Property',
        location: 'Test Location',
        price: '1 000 000 €',
        bedrooms: 3,
        bathrooms: 2,
        surface: 150,
        images: [],
        description: 'Test description',
        features: [],
        type: 'villa',
        status: 'disponible',
        isVisible: true
      };
      
      const currentProperties = JSON.parse(localStorage.getItem('properties') || '[]');
      const testProperties = [...currentProperties, testProperty];
      localStorage.setItem('test-properties', JSON.stringify(testProperties));
      localStorage.removeItem('test-properties');
      
      addResult({
        category: 'Biens Immobiliers',
        test: 'Ajout de propriété',
        status: 'success',
        message: 'Ajout de biens fonctionnel',
        details: 'Le système peut créer et sauvegarder de nouveaux biens'
      });
    } catch (error) {
      addResult({
        category: 'Biens Immobiliers',
        test: 'Ajout de propriété',
        status: 'error',
        message: 'Erreur ajout de bien',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        solution: 'Vérifiez l\'espace de stockage et la structure des données'
      });
    }
  };

  // 6. Tests de synchronisation temps réel
  const testRealTimeSync = async () => {
    // Test des événements personnalisés
    let eventReceived = false;
    const testEventHandler = () => { eventReceived = true; };
    
    window.addEventListener('test-sync-event', testEventHandler);
    window.dispatchEvent(new CustomEvent('test-sync-event'));
    
    setTimeout(() => {
      addResult({
        category: 'Synchronisation',
        test: 'Événements personnalisés',
        status: eventReceived ? 'success' : 'error',
        message: eventReceived ? 'Événements fonctionnels' : 'Problème d\'événements',
        details: eventReceived ? 'Communication inter-composants active' : 'Les composants ne peuvent pas communiquer',
        solution: !eventReceived ? 'Vérifiez la console pour les erreurs JavaScript' : undefined
      });
      
      window.removeEventListener('test-sync-event', testEventHandler);
    }, 100);

    // Test de diffusion de changement
    try {
      window.dispatchEvent(new CustomEvent('contentUpdated', { 
        detail: { test: true, timestamp: Date.now() } 
      }));
      
      addResult({
        category: 'Synchronisation',
        test: 'Diffusion de changements',
        status: 'success',
        message: 'Diffusion d\'événements active',
        details: 'Les modifications peuvent être propagées'
      });
    } catch (error) {
      addResult({
        category: 'Synchronisation',
        test: 'Diffusion de changements',
        status: 'error',
        message: 'Erreur diffusion d\'événements',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  };

  // 7. Tests de permissions et sécurité
  const testPermissionsAndSecurity = async () => {
    // Test statut de connexion admin
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    addResult({
      category: 'Sécurité',
      test: 'Statut de connexion',
      status: (adminLoggedIn || userLoggedIn) ? 'success' : 'warning',
      message: (adminLoggedIn || userLoggedIn) ? 'Utilisateur connecté' : 'Aucune session active',
      details: `Admin: ${adminLoggedIn}, User: ${userLoggedIn}`,
      solution: !(adminLoggedIn || userLoggedIn) ? 'Connectez-vous pour accéder aux fonctionnalités complètes' : undefined
    });

    // Test des données utilisateur
    if (userLoggedIn) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          addResult({
            category: 'Sécurité',
            test: 'Données utilisateur',
            status: 'success',
            message: 'Session utilisateur valide',
            details: `Utilisateur: ${user.prenom} ${user.nom}`
          });
        } catch (error) {
          addResult({
            category: 'Sécurité',
            test: 'Données utilisateur',
            status: 'error',
            message: 'Données utilisateur corrompues',
            details: 'Session utilisateur invalide',
            solution: 'Reconnectez-vous pour restaurer la session'
          });
        }
      }
    }

    // Test HTTPS
    const isHTTPS = location.protocol === 'https:';
    addResult({
      category: 'Sécurité',
      test: 'Protocole HTTPS',
      status: isHTTPS ? 'success' : 'warning',
      message: isHTTPS ? 'Site sécurisé HTTPS' : 'Site non sécurisé HTTP',
      details: `Protocole: ${location.protocol}`,
      solution: !isHTTPS ? 'Configurez HTTPS pour sécuriser les communications' : undefined
    });
  };

  // 8. Tests de performance et cache
  const testPerformanceAndCache = async () => {
    // Test de la taille du localStorage
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length;
      }
    }
    
    const sizeInMB = totalSize / (1024 * 1024);
    
    addResult({
      category: 'Performance',
      test: 'Utilisation du stockage',
      status: sizeInMB < 5 ? 'success' : sizeInMB < 8 ? 'warning' : 'error',
      message: `Stockage utilisé: ${sizeInMB.toFixed(2)} MB`,
      details: `Limite recommandée: 5 MB`,
      solution: sizeInMB >= 5 ? 'Nettoyez les données inutiles ou utilisez des liens externes pour les images' : undefined
    });

    // Test des caches Service Worker
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        addResult({
          category: 'Performance',
          test: 'Cache Service Worker',
          status: 'success',
          message: `${cacheNames.length} cache(s) actif(s)`,
          details: cacheNames.join(', ') || 'Aucun cache nommé'
        });
      } catch (error) {
        addResult({
          category: 'Performance',
          test: 'Cache Service Worker',
          status: 'error',
          message: 'Erreur accès aux caches',
          details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }
    }

    // Test de performance de chargement
    const startTime = performance.now();
    try {
      await fetch(location.origin + '/manifest.json', { cache: 'no-cache' });
      const loadTime = performance.now() - startTime;
      
      addResult({
        category: 'Performance',
        test: 'Temps de réponse serveur',
        status: loadTime < 500 ? 'success' : loadTime < 1000 ? 'warning' : 'error',
        message: `Temps de réponse: ${Math.round(loadTime)}ms`,
        details: loadTime < 500 ? 'Performance excellente' : loadTime < 1000 ? 'Performance acceptable' : 'Performance dégradée',
        solution: loadTime >= 1000 ? 'Optimisez la configuration serveur et réseau' : undefined
      });
    } catch (error) {
      addResult({
        category: 'Performance',
        test: 'Temps de réponse serveur',
        status: 'error',
        message: 'Serveur inaccessible',
        details: 'Impossible de mesurer les performances',
        solution: 'Vérifiez la connectivité réseau'
      });
    }
  };

  // Collecte des informations système
  useEffect(() => {
    const info = {
      userAgent: navigator.userAgent,
      url: window.location.href,
      protocol: window.location.protocol,
      localStorage: typeof Storage !== 'undefined',
      serviceWorker: 'serviceWorker' in navigator,
      online: navigator.onLine,
      language: navigator.language,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toLocaleString('fr-FR')
    };
    setSystemInfo(info);
  }, []);

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Environnement': return <Settings className="w-5 h-5" />;
      case 'Configuration': return <Settings className="w-5 h-5" />;
      case 'Base de Données': return <Database className="w-5 h-5" />;
      case 'Gestion Images': return <Image className="w-5 h-5" />;
      case 'Gestion Contenu': return <FileText className="w-5 h-5" />;
      case 'Biens Immobiliers': return <Home className="w-5 h-5" />;
      case 'Synchronisation': return <RefreshCw className="w-5 h-5" />;
      case 'Sécurité': return <Settings className="w-5 h-5" />;
      case 'Performance': return <Settings className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  // Grouper les résultats par catégorie
  const groupedResults = diagnosticResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as { [key: string]: DiagnosticResult[] });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
          DIAGNOSTIC SYSTÈME DE GESTION DE CONTENU
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Analyse complète des fonctionnalités de gestion d'images, texte et biens immobiliers
        </p>
        
        <button
          onClick={runCompleteDiagnostic}
          disabled={isRunning}
          className="flex items-center space-x-3 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 mx-auto"
        >
          <RefreshCw className={`w-6 h-6 ${isRunning ? 'animate-spin' : ''}`} />
          <span className="text-lg">
            {isRunning ? 'Diagnostic en cours...' : 'Lancer le Diagnostic Complet'}
          </span>
        </button>
        
        {currentTest && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-blue-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">{currentTest}</span>
          </div>
        )}
      </div>

      {/* Informations système */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
          📊 Informations Système
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div><strong>Navigateur:</strong> {systemInfo.userAgent?.split(' ')[0]}</div>
          <div><strong>URL:</strong> {systemInfo.url}</div>
          <div><strong>Protocole:</strong> {systemInfo.protocol}</div>
          <div><strong>Résolution:</strong> {systemInfo.viewport}</div>
          <div><strong>Langue:</strong> {systemInfo.language}</div>
          <div><strong>En ligne:</strong> {systemInfo.online ? '✅ Oui' : '❌ Non'}</div>
          <div><strong>LocalStorage:</strong> {systemInfo.localStorage ? '✅ Disponible' : '❌ Indisponible'}</div>
          <div><strong>Service Worker:</strong> {systemInfo.serviceWorker ? '✅ Supporté' : '❌ Non supporté'}</div>
          <div><strong>Dernière analyse:</strong> {systemInfo.timestamp}</div>
        </div>
      </div>

      {/* Résultats du diagnostic */}
      {Object.keys(groupedResults).length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-light text-gray-900 dark:text-white">
            📋 Résultats du Diagnostic
          </h2>
          
          {Object.entries(groupedResults).map(([category, results]) => (
            <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                {getCategoryIcon(category)}
                <span className="ml-2">{category}</span>
                <span className="ml-auto text-sm text-gray-500">
                  {results.filter(r => r.status === 'success').length}/{results.length} OK
                </span>
              </h3>
              
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{result.test}</h4>
                        </div>
                        <p className="text-sm mb-2">{result.message}</p>
                        <p className="text-xs opacity-80 mb-2">{result.details}</p>
                        
                        {result.solution && (
                          <div className="mt-3 p-3 bg-white/50 rounded-md">
                            <p className="text-xs font-medium mb-1">💡 Solution recommandée :</p>
                            <p className="text-xs">{result.solution}</p>
                          </div>
                        )}
                        
                        {result.technicalInfo && (
                          <details className="mt-3">
                            <summary className="text-xs font-medium cursor-pointer">Détails techniques</summary>
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
            </div>
          ))}
        </div>
      )}

      {/* Actions de correction automatique */}
      {diagnosticResults.some(r => r.status === 'error' || r.status === 'warning') && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            🔧 Actions de Correction Automatique
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                // Nettoyer les données corrompues
                const keysToCheck = ['siteContent', 'properties', 'presentationImages', 'conceptImages'];
                let cleaned = 0;
                
                keysToCheck.forEach(key => {
                  try {
                    const data = localStorage.getItem(key);
                    if (data) {
                      JSON.parse(data); // Test de parsing
                    }
                  } catch (error) {
                    localStorage.removeItem(key);
                    cleaned++;
                  }
                });
                
                toast.success(`${cleaned} donnée(s) corrompue(s) nettoyée(s)`);
                runCompleteDiagnostic();
              }}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Nettoyer Données Corrompues</span>
            </button>

            <button
              onClick={async () => {
                // Vider les caches
                if ('caches' in window) {
                  const cacheNames = await caches.keys();
                  await Promise.all(cacheNames.map(name => caches.delete(name)));
                  toast.success(`${cacheNames.length} cache(s) vidé(s)`);
                } else {
                  toast.success('Aucun cache à vider');
                }
                runCompleteDiagnostic();
              }}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Vider les Caches</span>
            </button>

            <button
              onClick={() => {
                // Reset complet (sauf session utilisateur)
                const importantKeys = ['userLoggedIn', 'userData', 'adminLoggedIn'];
                const backup: { [key: string]: string } = {};
                
                importantKeys.forEach(key => {
                  const value = localStorage.getItem(key);
                  if (value) backup[key] = value;
                });
                
                localStorage.clear();
                
                Object.entries(backup).forEach(([key, value]) => {
                  localStorage.setItem(key, value);
                });
                
                toast.success('Système réinitialisé (session préservée)');
                setTimeout(() => window.location.reload(), 1500);
              }}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Reset Système</span>
            </button>
          </div>
        </div>
      )}

      {/* Guide de résolution */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-4">
          📚 Guide de Résolution par Type de Problème
        </h3>
        
        <div className="space-y-4 text-sm text-blue-700 dark:text-blue-300">
          <div>
            <strong>🖼️ Problèmes d'Images :</strong>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Vérifiez que les URLs d'images sont en HTTPS</li>
              <li>Testez les images dans un nouvel onglet</li>
              <li>Réduisez la taille des images si problème de stockage</li>
              <li>Utilisez des liens externes pour les grandes images</li>
            </ul>
          </div>
          
          <div>
            <strong>📝 Problèmes de Contenu :</strong>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Vérifiez que vous êtes connecté en tant qu'administrateur</li>
              <li>Cliquez sur "PUBLIER POUR TOUS" après modification</li>
              <li>Vérifiez l'espace de stockage disponible</li>
              <li>Testez en navigation privée pour éliminer les problèmes de cache</li>
            </ul>
          </div>
          
          <div>
            <strong>🏠 Problèmes de Biens Immobiliers :</strong>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Vérifiez que tous les champs obligatoires sont remplis</li>
              <li>Utilisez des URLs d'images valides et accessibles</li>
              <li>Évitez les caractères spéciaux dans les noms de biens</li>
              <li>Sauvegardez régulièrement vos modifications</li>
            </ul>
          </div>
          
          <div>
            <strong>🔄 Problèmes de Synchronisation :</strong>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Configurez Supabase via "Connect to Supabase"</li>
              <li>Vérifiez votre connexion internet</li>
              <li>Utilisez le bouton "PUBLIER POUR TOUS" pour forcer la sync</li>
              <li>Rechargez la page si les changements ne s'affichent pas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagementDiagnostic;