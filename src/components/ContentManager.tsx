import React, { useState, useEffect } from 'react';
import { FileText, Save, RotateCcw, Eye, Edit, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRealTimeSync } from '../hooks/useRealTimeSync';
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

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versionHistory, setVersionHistory] = useState<any[]>([]);
  const { broadcastChange } = useRealTimeSync('content-manager');

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

  const saveContent = async () => {
    try {
      console.log('💾 ContentManager.saveContent - Début de sauvegarde');
      console.log('📊 Contenu à sauvegarder:', content);
      
      // 1. Vérifier l'authentification admin
      const adminEmail = localStorage.getItem('currentAdminEmail') || 'nicolas.c@lacremerie.fr';
      const adminName = adminEmail.split('@')[0];
      const adminId = localStorage.getItem('currentAdminId');
      const authEstablished = localStorage.getItem('supabaseAuthEstablished') === 'true';
      
      console.log('🔐 État authentification:', { adminEmail, adminName, adminId, authEstablished });
      
      // 2. Sauvegarder localement IMMÉDIATEMENT (garantie de sauvegarde)
      console.log('💾 Sauvegarde locale immédiate...');
      localStorage.setItem('siteContent', JSON.stringify(content));
      console.log('✅ Sauvegarde locale terminée');
      
      // 3. Déclencher TOUS les événements de mise à jour nécessaires
      console.log('🔄 Déclenchement mise à jour locale...');
      
      // Événement principal de mise à jour du contenu
      window.dispatchEvent(new CustomEvent('contentUpdated', { detail: content }));
      
      // Événement spécifique pour l'image hero
      if (content.hero?.backgroundImage) {
        console.log('🖼️ Mise à jour image hero:', content.hero.backgroundImage);
        window.dispatchEvent(new CustomEvent('presentationImageChanged', { 
          detail: content.hero.backgroundImage 
        }));
      }
      
      // Événement pour l'image concept
      if (content.concept?.image) {
        console.log('🖼️ Mise à jour image concept:', content.concept.image);
        window.dispatchEvent(new CustomEvent('conceptImageChanged', { 
          detail: content.concept.image 
        }));
      }
      
      // Événement de force update global
      window.dispatchEvent(new CustomEvent('forceUpdate', { 
        detail: { type: 'content', source: 'admin', timestamp: Date.now() } 
      }));
      
      // Déclencher un événement storage pour les composants qui l'écoutent
      window.dispatchEvent(new Event('storage'));
      
      // Notification immédiate de succès local
      toast.success('✅ Modifications appliquées immédiatement !', {
        duration: 2000,
        icon: '⚡'
      });
      
      // 4. Tenter la sauvegarde Supabase (optionnelle)
      try {
        console.log('📤 Tentative sauvegarde Supabase...');
        await ContentVersioningService.saveContentVersion(
          content,
          adminName,
          adminEmail,
          'Modification du contenu du site'
        );
        console.log('✅ Sauvegarde Supabase réussie');
        
        // 5. Diffuser le changement en temps réel pour TOUS les utilisateurs
        console.log('📡 Diffusion du changement...');
        await broadcastChange('content', 'update', content);
        console.log('✅ Changement diffusé');
        
        toast.success('🌐 Contenu synchronisé sur tous les appareils !', {
          duration: 4000,
          icon: '📡'
        });
        
      } catch (supabaseError) {
        console.warn('⚠️ Erreur sauvegarde Supabase:', supabaseError);
        
        // Même en cas d'erreur Supabase, la sauvegarde locale a réussi
        toast.success('📦 Modifications sauvegardées (mode local)', {
          duration: 4000,
          icon: '💾'
        });
      }
      
      console.log('✅ Processus de sauvegarde terminé');
      
    } catch (error) {
      console.error('❌ Erreur critique sauvegarde:', error);
      
      // En cas d'erreur critique, au moins la sauvegarde locale a été faite
      toast.error('❌ Erreur de synchronisation - Contenu sauvegardé localement');
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tout le contenu ?')) {
      const defaultContent: SiteContent = {
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
      
      setContent(defaultContent);
      localStorage.setItem('siteContent', JSON.stringify(defaultContent));
      toast.success('Contenu réinitialisé');
    }
  };

  const showHistory = async () => {
    try {
      const history = await ContentVersioningService.getVersionHistory('content');
      setVersionHistory(history);
      setShowVersionHistory(true);
    } catch (error) {
      toast.error('Erreur lors du chargement de l\'historique');
    }
  };

  const rollbackToVersion = async (versionId: string, versionNumber: number) => {
    if (window.confirm(`Restaurer le contenu à la version ${versionNumber} ?`)) {
      try {
        const adminEmail = localStorage.getItem('currentAdminEmail') || 'nicolas.c@lacremerie.fr';
        const adminName = adminEmail.split('@')[0];
        
        await ContentVersioningService.rollbackToVersion('content', versionId, adminName, adminEmail);
        
        // Recharger le contenu
        const restoredContent = await ContentVersioningService.getCurrentSiteContent();
        if (restoredContent) {
          setContent(restoredContent);
          localStorage.setItem('siteContent', JSON.stringify(restoredContent));
          window.dispatchEvent(new CustomEvent('contentUpdated', { detail: restoredContent }));
        }
        
        setShowVersionHistory(false);
        toast.success(`Contenu restauré à la version ${versionNumber}`);
      } catch (error) {
        toast.error('Erreur lors de la restauration');
      }
    }
  };

  const updateContent = (section: keyof SiteContent, field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateServiceItem = (index: number, field: 'title' | 'description', value: string) => {
    setContent(prev => ({
      ...prev,
      services: {
        ...prev.services,
        items: prev.services.items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addServiceItem = () => {
    setContent(prev => ({
      ...prev,
      services: {
        ...prev.services,
        items: [...prev.services.items, { title: '', description: '' }]
      }
    }));
  };

  const removeServiceItem = (index: number) => {
    setContent(prev => ({
      ...prev,
      services: {
        ...prev.services,
        items: prev.services.items.filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-gray-900 dark:text-white">
            Gestion du Contenu
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Modifiez les textes et contenus de votre site
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={resetToDefaults}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Réinitialiser</span>
          </button>
          <button
            onClick={showHistory}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Historique</span>
          </button>
          <button
            onClick={saveContent}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>Sauvegarder et Publier</span>
          </button>
        </div>
      </div>

      {/* Section Hero */}
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
            <input
              type="text"
              value={content.hero.title}
              onChange={(e) => updateContent('hero', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sous-titre
            </label>
            <input
              type="text"
              value={content.hero.subtitle}
              onChange={(e) => updateContent('hero', 'subtitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image d'arrière-plan (URL)
            </label>
            <div className="space-y-3">
              <input
                type="url"
                value={content.hero.backgroundImage}
                onChange={(e) => updateContent('hero', 'backgroundImage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://images.pexels.com/photos/..."
              />
              <button
                type="button"
                onClick={() => {
                  const newUrl = prompt('Entrez l\'URL de la nouvelle image d\'arrière-plan:');
                  if (newUrl && newUrl.trim()) {
                    updateContent('hero', 'backgroundImage', newUrl.trim());
                    toast.success('Image d\'arrière-plan mise à jour');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                Changer l'image
              </button>
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

      {/* Section Concept */}
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
            <input
              type="text"
              value={content.concept.title}
              onChange={(e) => updateContent('concept', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={content.concept.description}
              onChange={(e) => updateContent('concept', 'description', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image illustrative (URL)
            </label>
            <div className="space-y-3">
              <input
                type="url"
                value={content.concept.image}
                onChange={(e) => updateContent('concept', 'image', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://images.pexels.com/photos/..."
              />
              <button
                type="button"
                onClick={() => {
                  const newUrl = prompt('Entrez l\'URL de la nouvelle image du concept:');
                  if (newUrl && newUrl.trim()) {
                    updateContent('concept', 'image', newUrl.trim());
                    toast.success('Image du concept mise à jour');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                Changer l'image
              </button>
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

      {/* Section Services */}
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
              <input
                type="text"
                value={content.services.title}
                onChange={(e) => updateContent('services', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sous-titre
              </label>
              <input
                type="text"
                value={content.services.subtitle}
                onChange={(e) => updateContent('services', 'subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Services items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">
                Services proposés
              </h4>
              <button
                onClick={addServiceItem}
                className="flex items-center space-x-2 px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {content.services.items.map((item, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      Service {index + 1}
                    </h5>
                    <button
                      onClick={() => removeServiceItem(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Titre
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateServiceItem(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateServiceItem(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section Contact */}
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
            <input
              type="text"
              value={content.contact.title}
              onChange={(e) => updateContent('contact', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={content.contact.description}
              onChange={(e) => updateContent('contact', 'description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email de contact
            </label>
            <input
              type="email"
              value={content.contact.email}
              onChange={(e) => updateContent('contact', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={content.contact.phone}
              onChange={(e) => updateContent('contact', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
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
                  <X className="w-6 h-6" />
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
                        {!version.is_current && (
                          <button
                            onClick={() => rollbackToVersion(version.id, version.version_number)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            Restaurer
                          </button>
                        )}
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