import React, { useState, useEffect } from 'react';
import { Save, Edit, Image, Type, Globe, Eye, Upload, Link, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ContentSection {
  id: string;
  name: string;
  type: 'text' | 'image' | 'list';
  value: string | string[];
  description: string;
}

interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  concept: {
    title: string;
    subtitle: string;
    description: string[];
    image: string;
  };
  offMarket: {
    title: string;
    description: string;
    sellerAdvantages: string[];
    buyerAdvantages: string[];
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
    email: string;
    phone: string;
    address: string;
  };
  branding: {
    siteName: string;
    logoUrl: string;
  };
  features: {
    showAdvancedTools: boolean;
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
        subtitle: "",
        backgroundImage: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920"
      },
      concept: {
        title: "CONCEPT",
        subtitle: "l'immobilier haut gamme en off market",
        description: [
          "nous avons fait le choix de la discrétion, de l'exclusivité et de l'excellence.",
          "Nous sommes spécialisés dans la vente de biens immobiliers haut de gamme en off-market, une approche confidentielle réservée à une clientèle exigeante, en quête de biens rares, souvent inaccessibles via les canaux traditionnels."
        ],
        image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      offMarket: {
        title: "Qu'est-ce que l'Off-Market ?",
        description: "L'immobilier \"off-market\" consiste à proposer des biens à la vente sans publicité publique ni diffusion sur les plateformes classiques. Ce mode de commercialisation, réservé à un cercle restreint d'acheteurs qualifiés, garantit une confidentialité totale et permet de préserver la rareté et la valeur des biens proposés.",
        sellerAdvantages: [
          "Discrétion totale",
          "Moins de visites inutiles", 
          "Rapidité de transaction",
          "Position de force sur le prix",
          "Préservation de la valeur du bien"
        ],
        buyerAdvantages: [
          "Accès à des biens rares ou exclusifs",
          "Moins de concurrence",
          "Négociation plus directe",
          "Opportunité d'investissement discrète"
        ]
      },
      services: {
        title: "Nos services",
        subtitle: "Un accompagnement personnalisé pour tous vos projets immobiliers",
        items: [
          {
            title: "Achat",
            description: "Conseil et accompagnement personnalisé pour l'acquisition de votre bien d'exception"
          },
          {
            title: "Vente", 
            description: "Estimation et commercialisation de votre propriété avec notre expertise du marché de prestige"
          },
          {
            title: "Location",
            description: "Gestion locative haut de gamme pour propriétaires et recherche pour locataires exigeants"
          },
          {
            title: "Investissement",
            description: "Conseil en investissement immobilier et opportunités sur la Côte d'Azur"
          }
        ]
      },
      contact: {
        email: "nicolas.c@lacremerie.fr",
        phone: "+33 1 23 45 67 89",
        address: "123 Boulevard de la Croisette, 06400 Cannes"
      },
      branding: {
        siteName: "CERCLE PRIVÉ",
        logoUrl: ""
      },
      features: {
        showAdvancedTools: true
      }
    };
  });

  const [activeSection, setActiveSection] = useState<keyof SiteContent>('hero');
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const saveContent = () => {
    localStorage.setItem('siteContent', JSON.stringify(content));
    
    // Déclencher des événements pour mettre à jour les composants
    window.dispatchEvent(new CustomEvent('contentUpdated', { detail: content }));
    
    toast.success('Contenu sauvegardé avec succès');
  };

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
    setIsEditing(true);
  };

  const saveField = () => {
    if (!editingField) return;
    
    const [section, ...fieldPath] = editingField.split('.');
    
    setContent(prev => {
      const newContent = { ...prev };
      let target = newContent[section as keyof SiteContent] as any;
      
      // Naviguer jusqu'au champ à modifier
      for (let i = 0; i < fieldPath.length - 1; i++) {
        target = target[fieldPath[i]];
      }
      
      target[fieldPath[fieldPath.length - 1]] = tempValue;
      
      return newContent;
    });
    
    setIsEditing(false);
    setEditingField(null);
    setTempValue('');
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingField(null);
    setTempValue('');
  };

  const addListItem = (section: keyof SiteContent, field: string) => {
    const newItem = prompt('Nouveau élément :');
    if (newItem) {
      setContent(prev => {
        const newContent = { ...prev };
        const target = newContent[section] as any;
        if (Array.isArray(target[field])) {
          target[field] = [...target[field], newItem];
        }
        return newContent;
      });
    }
  };

  const removeListItem = (section: keyof SiteContent, field: string, index: number) => {
    setContent(prev => {
      const newContent = { ...prev };
      const target = newContent[section] as any;
      if (Array.isArray(target[field])) {
        target[field] = target[field].filter((_: any, i: number) => i !== index);
      }
      return newContent;
    });
  };

  const updateImage = (section: keyof SiteContent, field: string, newUrl: string) => {
    setContent(prev => {
      const newContent = { ...prev };
      const target = newContent[section] as any;
      target[field] = newUrl;
      return newContent;
    });
    setNewImageUrl('');
    toast.success('Image mise à jour');
  };

  const sections = [
    { key: 'hero', label: 'Page d\'accueil', icon: Eye },
    { key: 'concept', label: 'Concept', icon: Type },
    { key: 'offMarket', label: 'Off-Market', icon: Globe },
    { key: 'services', label: 'Services', icon: Edit },
    { key: 'contact', label: 'Contact', icon: Type },
    { key: 'branding', label: 'Marque', icon: Image },
    { key: 'features', label: 'Fonctionnalités', icon: Edit }
  ];

  const renderField = (
    sectionKey: keyof SiteContent,
    fieldKey: string,
    value: any,
    label: string,
    type: 'text' | 'textarea' | 'image' | 'list' = 'text'
  ) => {
    const fieldId = `${sectionKey}.${fieldKey}`;
    const isCurrentlyEditing = editingField === fieldId;

    if (type === 'image') {
      return (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          <div className="flex items-center space-x-4">
            <img
              src={value || 'https://via.placeholder.com/200x100?text=Aucune+image'}
              alt={label}
              className="w-32 h-20 object-cover rounded-md border border-gray-200 dark:border-gray-600"
            />
            <div className="flex-1 space-y-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="URL de la nouvelle image"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={() => updateImage(sectionKey, fieldKey, newImageUrl)}
                disabled={!newImageUrl.trim()}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                Changer l'image
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (type === 'list' && Array.isArray(value)) {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
            <button
              onClick={() => addListItem(sectionKey, fieldKey)}
              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter</span>
            </button>
          </div>
          <div className="space-y-2">
            {value.map((item: string, index: number) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <span className="flex-1 text-gray-700 dark:text-gray-300">{item}</span>
                <button
                  onClick={() => removeListItem(sectionKey, fieldKey, index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <div className="flex items-center space-x-3">
          {isCurrentlyEditing ? (
            <>
              {type === 'textarea' ? (
                <textarea
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  rows={4}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              ) : (
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              )}
              <button
                onClick={saveField}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={cancelEditing}
                className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                ×
              </button>
            </>
          ) : (
            <>
              <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <span className="text-gray-700 dark:text-gray-300">
                  {type === 'textarea' && typeof value === 'string' && value.length > 100 
                    ? `${value.substring(0, 100)}...` 
                    : value as string
                  }
                </span>
              </div>
              <button
                onClick={() => startEditing(fieldId, value as string)}
                className="px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    );
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
            Modifiez facilement tous les textes et images de votre site
          </p>
        </div>
        <button
          onClick={saveContent}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Save className="w-5 h-5" />
          <span>Sauvegarder tout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Menu des sections */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sticky top-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Sections du site
            </h3>
            <nav className="space-y-2">
              {sections.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key as keyof SiteContent)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-colors ${
                    activeSection === key
                      ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu de la section active */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Section Hero */}
              {activeSection === 'hero' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    Page d'accueil
                  </h3>
                  
                  {renderField('hero', 'title', content.hero.title, 'Titre principal', 'textarea')}
                  {renderField('hero', 'backgroundImage', content.hero.backgroundImage, 'Image de fond', 'image')}
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                      💡 Aperçu en temps réel
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Les modifications seront visibles immédiatement sur votre site après sauvegarde.
                    </p>
                  </div>
                </div>
              )}

              {/* Section Concept */}
              {activeSection === 'concept' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    Section Concept
                  </h3>
                  
                  {renderField('concept', 'title', content.concept.title, 'Titre de section')}
                  {renderField('concept', 'subtitle', content.concept.subtitle, 'Sous-titre')}
                  {renderField('concept', 'image', content.concept.image, 'Image de la section', 'image')}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Paragraphes de description
                    </label>
                    <div className="space-y-3">
                      {content.concept.description.map((paragraph, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <textarea
                            value={paragraph}
                            onChange={(e) => {
                              const newDescription = [...content.concept.description];
                              newDescription[index] = e.target.value;
                              setContent(prev => ({
                                ...prev,
                                concept: { ...prev.concept, description: newDescription }
                              }));
                            }}
                            rows={3}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <button
                            onClick={() => {
                              const newDescription = content.concept.description.filter((_, i) => i !== index);
                              setContent(prev => ({
                                ...prev,
                                concept: { ...prev.concept, description: newDescription }
                              }));
                            }}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newParagraph = prompt('Nouveau paragraphe :');
                          if (newParagraph) {
                            setContent(prev => ({
                              ...prev,
                              concept: {
                                ...prev.concept,
                                description: [...prev.concept.description, newParagraph]
                              }
                            }));
                          }
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter un paragraphe</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Off-Market */}
              {activeSection === 'offMarket' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    Section Off-Market
                  </h3>
                  
                  {renderField('offMarket', 'title', content.offMarket.title, 'Titre de section')}
                  {renderField('offMarket', 'description', content.offMarket.description, 'Description principale', 'textarea')}
                  {renderField('offMarket', 'sellerAdvantages', content.offMarket.sellerAdvantages, 'Avantages vendeur', 'list')}
                  {renderField('offMarket', 'buyerAdvantages', content.offMarket.buyerAdvantages, 'Avantages acheteur', 'list')}
                </div>
              )}

              {/* Section Services */}
              {activeSection === 'services' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    Section Services
                  </h3>
                  
                  {renderField('services', 'title', content.services.title, 'Titre de section')}
                  {renderField('services', 'subtitle', content.services.subtitle, 'Sous-titre')}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Services proposés
                    </label>
                    <div className="space-y-4">
                      {content.services.items.map((service, index) => (
                        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Service {index + 1}
                            </h4>
                            <button
                              onClick={() => {
                                const newServices = content.services.items.filter((_, i) => i !== index);
                                setContent(prev => ({
                                  ...prev,
                                  services: { ...prev.services, items: newServices }
                                }));
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={service.title}
                              onChange={(e) => {
                                const newServices = [...content.services.items];
                                newServices[index] = { ...service, title: e.target.value };
                                setContent(prev => ({
                                  ...prev,
                                  services: { ...prev.services, items: newServices }
                                }));
                              }}
                              placeholder="Titre du service"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                            />
                            <textarea
                              value={service.description}
                              onChange={(e) => {
                                const newServices = [...content.services.items];
                                newServices[index] = { ...service, description: e.target.value };
                                setContent(prev => ({
                                  ...prev,
                                  services: { ...prev.services, items: newServices }
                                }));
                              }}
                              rows={2}
                              placeholder="Description du service"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newService = {
                            title: 'Nouveau service',
                            description: 'Description du nouveau service'
                          };
                          setContent(prev => ({
                            ...prev,
                            services: {
                              ...prev.services,
                              items: [...prev.services.items, newService]
                            }
                          }));
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter un service</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Contact */}
              {activeSection === 'contact' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    Informations de Contact
                  </h3>
                  
                  {renderField('contact', 'email', content.contact.email, 'Adresse email')}
                  {renderField('contact', 'phone', content.contact.phone, 'Numéro de téléphone')}
                  {renderField('contact', 'address', content.contact.address, 'Adresse physique', 'textarea')}
                </div>
              )}

              {/* Section Branding */}
              {activeSection === 'branding' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    Identité de Marque
                  </h3>
                  
                  {renderField('branding', 'siteName', content.branding.siteName, 'Nom du site')}
                  {renderField('branding', 'logoUrl', content.branding.logoUrl, 'Logo (URL)', 'image')}
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                      ⚠️ Important
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Les modifications du nom du site nécessitent une sauvegarde et un rechargement de la page pour être visibles.
                    </p>
                  </div>
                </div>
              )}

              {/* Section Fonctionnalités */}
              {activeSection === 'features' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    Fonctionnalités du Site
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Outils Avancés
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Calculateur de rentabilité, comparateur de biens et alertes immobilières
                        </p>
                      </div>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={content.features?.showAdvancedTools ?? true}
                          onChange={(e) => setContent(prev => ({
                            ...prev,
                            features: {
                              ...prev.features,
                              showAdvancedTools: e.target.checked
                            }
                          }))}
                          className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Afficher sur le site
                        </span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                      💡 Outils Avancés
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Ces outils permettent à vos visiteurs de calculer la rentabilité, comparer les biens et créer des alertes personnalisées.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Aperçu des modifications */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Aperçu des Modifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Titre principal</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {content.hero.title}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Nom du site</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {content.branding.siteName}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Email contact</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {content.contact.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManager;