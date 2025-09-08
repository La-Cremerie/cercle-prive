import React, { useState, useEffect } from 'react';
import { FileText, Eye, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { ContentVersioningService } from '../services/contentVersioningService';

interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  concept: {
    title: string;
    description: string;
    image: string;
  };
  services: {
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  contact: {
    title: string;
    description: string;
    email: string;
    phone: string;
  };
}

const ContentManager: React.FC = () => {
  const [content, setContent] = useState<SiteContent>(() => {
    const stored = localStorage.getItem('siteContent');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Contenu par défaut
    return {
      hero: {
        title: "l'excellence immobilière en toute discrétion",
        subtitle: "Découvrez nos biens d'exception",
        backgroundImage: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920"
      },
      concept: {
        title: "CONCEPT",
        description: "Notre approche d'investissement vous permet de transformer un capital financier existant en une rentabilité complémentaire...",
        image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      services: {
        title: "ACCOMPAGNEMENT PERSONNALISÉ",
        subtitle: "du 1er jour à la revente du bien",
        items: [
          {
            title: "Pack Immobilier Clé en Main",
            description: "Solution complète de A à Z : recherche, acquisition, rénovation et ameublement de votre bien d'exception"
          },
          {
            title: "Conciergerie",
            description: "Services de conciergerie haut de gamme pour l'entretien et la gestion quotidienne de votre propriété"
          },
          {
            title: "Architecture & Design",
            description: "Conception architecturale sur-mesure et design d'intérieur raffiné pour créer des espaces uniques"
          },
          {
            title: "Services Personnalisés",
            description: "Prestations sur-mesure adaptées à vos besoins spécifiques et à votre style de vie d'exception"
          }
        ]
      },
      contact: {
        title: "CONTACTEZ-NOUS",
        description: "Notre équipe d'experts est à votre disposition",
        email: "nicolas.c@lacremerie.fr",
        phone: "+33 6 52 91 35 56"
      }
    };
  });

  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versionHistory, setVersionHistory] = useState<any[]>([]);

  // Charger le contenu depuis Supabase au démarrage
  useEffect(() => {
    const loadContentFromSupabase = async () => {
      try {
        const supabaseContent = await ContentVersioningService.getCurrentSiteContent();
        if (supabaseContent) {
          setContent(supabaseContent);
          localStorage.setItem('siteContent', JSON.stringify(supabaseContent));
        }
      } catch (error) {
        console.warn('Erreur chargement contenu Supabase:', error);
      }
    };

    loadContentFromSupabase();
  }, []);

  const showHistory = async () => {
    try {
      const history = await ContentVersioningService.getVersionHistory('content');
      setVersionHistory(history);
      setShowVersionHistory(true);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique');
    }
  };

  const refreshContent = async () => {
    try {
      const supabaseContent = await ContentVersioningService.getCurrentSiteContent();
      if (supabaseContent) {
        setContent(supabaseContent);
        localStorage.setItem('siteContent', JSON.stringify(supabaseContent));
        window.dispatchEvent(new CustomEvent('contentUpdated', { detail: supabaseContent }));
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header - Mode lecture seule */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-gray-900 dark:text-white">
            Contenu du Site (Lecture Seule)
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Consultez le contenu actuel du site - Modifications via l'outil Bolt uniquement
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={refreshContent}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualiser</span>
          </button>
          <button
            onClick={showHistory}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Historique</span>
          </button>
        </div>
      </div>

      {/* Avertissement modification */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Modification de Contenu Désactivée
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300 mb-4">
              Pour des raisons de sécurité et de stabilité, la modification de contenu en ligne a été désactivée. 
              Toutes les modifications doivent être effectuées directement sur l'outil de développement Bolt.
            </p>
            <div className="flex items-center space-x-2">
              <ExternalLink className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                Utilisez l'interface Bolt pour modifier le contenu du site
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Hero - Lecture seule */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-600" />
          Section Hero (Page d'accueil)
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titre principal
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
              {content.hero.title}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sous-titre
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
              {content.hero.subtitle}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image d'arrière-plan (URL)
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white break-all">
              {content.hero.backgroundImage}
            </div>
            {content.hero.backgroundImage && (
              <div className="mt-3">
                <img
                  src={content.hero.backgroundImage}
                  alt="Aperçu"
                  className="w-32 h-20 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section Concept - Lecture seule */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-green-600" />
          Section Concept
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titre de la section
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
              {content.concept.title}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white min-h-[120px] whitespace-pre-wrap">
              {content.concept.description}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image illustrative (URL)
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white break-all">
              {content.concept.image}
            </div>
            {content.concept.image && (
              <div className="mt-3">
                <img
                  src={content.concept.image}
                  alt="Aperçu concept"
                  className="w-32 h-20 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section Services - Lecture seule */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-purple-600" />
          Section Services
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Titre principal
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                {content.services.title}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sous-titre
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                {content.services.subtitle}
              </div>
            </div>
          </div>

          {/* Services items - Lecture seule */}
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
              Services proposés
            </h4>
            
            <div className="space-y-4">
              {content.services.items.map((item, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      Service {index + 1}
                    </h5>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Titre
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        {item.title}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[60px] whitespace-pre-wrap">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section Contact - Lecture seule */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-yellow-600" />
          Section Contact
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titre
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
              {content.contact.title}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
              {content.contact.description}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email de contact
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
              {content.contact.email}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Téléphone
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
              {content.contact.phone}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions pour modification */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-4">
          📝 Comment Modifier le Contenu
        </h3>
        <div className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
          <div className="flex items-start space-x-2">
            <span className="font-medium">1.</span>
            <span>Accédez à l'outil de développement Bolt</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium">2.</span>
            <span>Modifiez les fichiers de contenu directement dans le code</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium">3.</span>
            <span>Les modifications seront automatiquement synchronisées</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium">4.</span>
            <span>Utilisez le bouton "Actualiser" ci-dessus pour voir les dernières modifications</span>
          </div>
        </div>
      </div>

      {/* Modal d'historique des versions */}
      {showVersionHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  Historique des Versions - Contenu
                </h3>
                <button
                  onClick={() => setShowVersionHistory(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              {versionHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  Aucun historique disponible
                </div>
              ) : (
                <div className="space-y-4">
                  {versionHistory.map((version) => (
                    <div
                      key={version.id}
                      className={`border rounded-lg p-4 ${
                        version.is_current
                          ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            version.is_current
                              ? 'bg-yellow-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}>
                            Version {version.version_number}
                          </span>
                          {version.is_current && (
                            <span className="text-sm text-yellow-600 font-medium">
                              (Version actuelle)
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Auteur:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {version.author_name} ({version.author_email})
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Date:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {new Date(version.created_at).toLocaleString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      
                      {version.change_description && (
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Description:</span>
                          <span className="ml-2 text-gray-700 dark:text-gray-300">
                            {version.change_description}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;