import React, { useState, useEffect } from 'react';
import { Save, Edit, Image, Type, Globe, Eye, Upload, Link, Trash2, Plus, X, Copy, RotateCcw } from 'lucide-react';
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
}

const ContentManager: React.FC = () => {
  const getDefaultContent = (): SiteContent => ({
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
      phone: "+33 6 52 91 35 56",
      address: "Côte d'Azur, France"
    },
    branding: {
      siteName: "CERCLE PRIVÉ",
      logoUrl: ""
    }
  });

  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const stored = localStorage.getItem('siteContent');
      if (stored) {
        const parsedContent = JSON.parse(stored);
        
        // Vérifier que toutes les propriétés requises existent et fusionner avec les valeurs par défaut
        const defaultContent = getDefaultContent();
        const mergedContent: SiteContent = {
          hero: {
            ...defaultContent.hero,
            ...(parsedContent.hero || {})
          },
          concept: {
            ...defaultContent.concept,
            ...(parsedContent.concept || {}),
            description: Array.isArray(parsedContent.concept?.description) 
              ? parsedContent.concept.description 
              : defaultContent.concept.description
          },
          offMarket: {
            ...defaultContent.offMarket,
            ...(parsedContent.offMarket || {}),
            sellerAdvantages: Array.isArray(parsedContent.offMarket?.sellerAdvantages)
              ? parsedContent.offMarket.sellerAdvantages
              : defaultContent.offMarket.sellerAdvantages,
            buyerAdvantages: Array.isArray(parsedContent.offMarket?.buyerAdvantages)
              ? parsedContent.offMarket.buyerAdvantages
              : defaultContent.offMarket.buyerAdvantages
          },
          services: {
            ...defaultContent.services,
            ...(parsedContent.services || {}),
            items: Array.isArray(parsedContent.services?.items)
              ? parsedContent.services.items
              : defaultContent.services.items
          },
          contact: {
            ...defaultContent.contact,
            ...(parsedContent.contact || {})
          },
          branding: {
            ...defaultContent.branding,
            ...(parsedContent.branding || {})
          }
        };
        
        return mergedContent;
      }
    } catch (error) {
      console.warn('Erreur lors du chargement du contenu depuis localStorage:', error);
    }
    
    // Retourner le contenu par défaut en cas d'erreur ou si aucun contenu stocké
    return getDefaultContent();
  });

  const [activeSection, setActiveSection] = useState<keyof SiteContent>('hero');
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showBulkEditor, setShowBulkEditor] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const saveContent = () => {
    try {
      localStorage.setItem('siteContent', JSON.stringify(content));
      
      // Déclencher des événements pour mettre à jour les composants
      window.dispatchEvent(new CustomEvent('contentUpdated', { detail: content }));
      
      toast.success('Contenu sauvegardé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tout le contenu aux valeurs par défaut ?')) {
      const defaultContent = getDefaultContent();
      setContent(defaultContent);
      localStorage.setItem('siteContent', JSON.stringify(defaultContent));
      window.dispatchEvent(new CustomEvent('contentUpdated', { detail: defaultContent }));
      toast.success('Contenu réinitialisé aux valeurs par défaut');
    }
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
    toast.success('Texte modifié');
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
      toast.success('Élément ajouté');
    }
  };

  const removeListItem = (section: keyof SiteContent, field: string, index: number) => {
    if (window.confirm('Supprimer cet élément ?')) {
      setContent(prev => {
        const newContent = { ...prev };
        const target = newContent[section] as any;
        if (Array.isArray(target[field])) {
          target[field] = target[field].filter((_: any, i: number) => i !== index);
        }
        return newContent;
      });
      toast.success('Élément supprimé');
    }
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

  const duplicateListItem = (section: keyof SiteContent, field: string, index: number) => {
    setContent(prev => {
      const newContent = { ...prev };
      const target = newContent[section] as any;
      if (Array.isArray(target[field])) {
        const itemToDuplicate = target[field][index];
        target[field] = [...target[field], `${itemToDuplicate} (Copie)`];
      }
      return newContent;
    });
    toast.success('Élément dupliqué');
  };

  // Fonction pour extraire tous les textes du site
  const getAllTexts = (): string => {
    const texts: string[] = [];
    
    // Hero
    texts.push(`[HERO] Titre: ${content.hero.title}`);
    if (content.hero.subtitle) texts.push(`[HERO] Sous-titre: ${content.hero.subtitle}`);
    
    // Concept
    texts.push(`[CONCEPT] Titre: ${content.concept.title}`);
    texts.push(`[CONCEPT] Sous-titre: ${content.concept.subtitle}`);
    content.concept.description.forEach((desc, i) => {
      texts.push(`[CONCEPT] Description ${i + 1}: ${desc}`);
    });
    
    // Off-Market
    texts.push(`[OFF-MARKET] Titre: ${content.offMarket.title}`);
    texts.push(`[OFF-MARKET] Description: ${content.offMarket.description}`);
    content.offMarket.sellerAdvantages.forEach((adv, i) => {
      texts.push(`[OFF-MARKET] Avantage vendeur ${i + 1}: ${adv}`);
    });
    content.offMarket.buyerAdvantages.forEach((adv, i) => {
      texts.push(`[OFF-MARKET] Avantage acheteur ${i + 1}: ${adv}`);
    });
    
    // Services
    texts.push(`[SERVICES] Titre: ${content.services.title}`);
    texts.push(`[SERVICES] Sous-titre: ${content.services.subtitle}`);
    content.services.items.forEach((service, i) => {
      texts.push(`[SERVICES] Service ${i + 1} - Titre: ${service.title}`);
      texts.push(`[SERVICES] Service ${i + 1} - Description: ${service.description}`);
    });
    
    // Contact
    texts.push(`[CONTACT] Email: ${content.contact.email}`);
    texts.push(`[CONTACT] Téléphone: ${content.contact.phone}`);
    texts.push(`[CONTACT] Adresse: ${content.contact.address}`);
    
    // Branding
    texts.push(`[BRANDING] Nom du site: ${content.branding.siteName}`);
    
    return texts.join('\n');
  };

  // Fonction pour appliquer les modifications en masse
  const applyBulkChanges = () => {
    try {
      const lines = bulkText.split('\n').filter(line => line.trim());
      const newContent = { ...content };
      
      lines.forEach(line => {
        const match = line.match(/^\[([^\]]+)\]\s*(.+?):\s*(.+)$/);
        if (match) {
          const [, section, field, value] = match;
          
          switch (section) {
            case 'HERO':
              if (field === 'Titre') newContent.hero.title = value;
              if (field === 'Sous-titre') newContent.hero.subtitle = value;
              break;
            case 'CONCEPT':
              if (field === 'Titre') newContent.concept.title = value;
              if (field === 'Sous-titre') newContent.concept.subtitle = value;
              if (field.startsWith('Description')) {
                const index = parseInt(field.match(/\d+/)?.[0] || '1') - 1;
                if (index >= 0) {
                  newContent.concept.description[index] = value;
                }
              }
              break;
            case 'OFF-MARKET':
              if (field === 'Titre') newContent.offMarket.title = value;
              if (field === 'Description') newContent.offMarket.description = value;
              if (field.startsWith('Avantage vendeur')) {
                const index = parseInt(field.match(/\d+/)?.[0] || '1') - 1;
                if (index >= 0) {
                  newContent.offMarket.sellerAdvantages[index] = value;
                }
              }
              if (field.startsWith('Avantage acheteur')) {
                const index = parseInt(field.match(/\d+/)?.[0] || '1') - 1;
                if (index >= 0) {
                  newContent.offMarket.buyerAdvantages[index] = value;
                }
              }
              break;
            case 'SERVICES':
              if (field === 'Titre') newContent.services.title = value;
              if (field === 'Sous-titre') newContent.services.subtitle = value;
              if (field.includes('Service') && field.includes('Titre')) {
                const index = parseInt(field.match(/\d+/)?.[0] || '1') - 1;
                if (index >= 0 && newContent.services.items[index]) {
                  newContent.services.items[index].title = value;
                }
              }
              if (field.includes('Service') && field.includes('Description')) {
                const index = parseInt(field.match(/\d+/)?.[0] || '1') - 1;
                if (index >= 0 && newContent.services.items[index]) {
                  newContent.services.items[index].description = value;
                }
              }
              break;
            case 'CONTACT':
              if (field === 'Email') newContent.contact.email = value;
              if (field === 'Téléphone') newContent.contact.phone = value;
              if (field === 'Adresse') newContent.contact.address = value;
              break;
            case 'BRANDING':
              if (field === 'Nom du site') newContent.branding.siteName = value;
              break;
          }
        }
      });
      
      setContent(newContent);
      setShowBulkEditor(false);
      setBulkText('');
      toast.success('Modifications en masse appliquées');
    } catch (error) {
      toast.error('Erreur lors de l\'application des modifications');
    }
  };

  const sections = [
    { key: 'hero', label: 'Page d\'accueil', icon: Eye },
    { key: 'concept', label: 'Concept', icon: Type },
    { key: 'offMarket', label: 'Off-Market', icon: Globe },
    { key: 'services', label: 'Services', icon: Edit },
    { key: 'contact', label: 'Contact', icon: Type },
    { key: 'branding', label: 'Marque', icon: Image }
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
                type="button"
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
              type="button"
              onClick={() => addListItem(sectionKey, fieldKey)}
              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter</span>
            </button>
          </div>
          <div className="space-y-2">
            {value.map((item: string, index: number) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md group">
                <span className="flex-1 text-gray-700 dark:text-gray-300">{item}</span>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => duplicateListItem(sectionKey, fieldKey, index)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    title="Dupliquer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newValue = prompt('Modifier :', item);
                      if (newValue !== null) {
                        setContent(prev => {
                          const newContent = { ...prev };
                          const target = newContent[sectionKey] as any;
                          if (Array.isArray(target[fieldKey])) {
                            target[fieldKey][index] = newValue;
                          }
                          return newContent;
                        });
                        toast.success('Élément modifié');
                      }
                    }}
                    className="text-yellow-500 hover:text-yellow-700 transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeListItem(sectionKey, fieldKey, index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
                type="button"
                onClick={saveField}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
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
                type="button"
                onClick={() => startEditing(fieldId, value as string)}
                className="px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(value as string);
                  toast.success('Texte copié');
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                title="Copier le texte"
              >
                <Copy className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // Filtrer les sections selon le terme de recherche
  const filteredSections = sections.filter(section => 
    searchTerm === '' || 
    section.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header avec actions avancées */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-gray-900 dark:text-white">
            Gestion du Contenu
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Modifiez facilement tous les textes et images de votre site
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setBulkText(getAllTexts());
              setShowBulkEditor(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Édition en masse</span>
          </button>
          <button
            onClick={resetToDefaults}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Réinitialiser</span>
          </button>
          <button
            onClick={saveContent}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>Sauvegarder tout</span>
          </button>
        </div>
      </div>

      {/* Recherche */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une section..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredSections.length} section(s)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Menu des sections */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sticky top-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Sections du site
            </h3>
            <nav className="space-y-2">
              {filteredSections.map(({ key, label, icon: Icon }) => (
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
                  {content.hero.subtitle && renderField('hero', 'subtitle', content.hero.subtitle, 'Sous-titre')}
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
                        <div key={index} className="flex items-start space-x-3 group">
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
                          <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => duplicateListItem('concept', 'description', index)}
                              className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                              title="Dupliquer"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const newDescription = content.concept.description.filter((_, i) => i !== index);
                                setContent(prev => ({
                                  ...prev,
                                  concept: { ...prev.concept, description: newDescription }
                                }));
                                toast.success('Paragraphe supprimé');
                              }}
                              className="p-2 text-red-500 hover:text-red-700 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
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
                            toast.success('Paragraphe ajouté');
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
                        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg group">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Service {index + 1}
                            </h4>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => {
                                  const newServices = [...content.services.items];
                                  newServices.splice(index + 1, 0, { ...service, title: `${service.title} (Copie)` });
                                  setContent(prev => ({
                                    ...prev,
                                    services: { ...prev.services, items: newServices }
                                  }));
                                  toast.success('Service dupliqué');
                                }}
                                className="text-blue-500 hover:text-blue-700 transition-colors"
                                title="Dupliquer"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm('Supprimer ce service ?')) {
                                    const newServices = content.services.items.filter((_, i) => i !== index);
                                    setContent(prev => ({
                                      ...prev,
                                      services: { ...prev.services, items: newServices }
                                    }));
                                    toast.success('Service supprimé');
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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
                        type="button"
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
                          toast.success('Service ajouté');
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

      {/* Modal d'édition en masse */}
      {showBulkEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  Édition en Masse - Tous les Textes
                </h3>
                <button
                  onClick={() => setShowBulkEditor(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  💡 Instructions
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Modifiez directement les textes dans l'éditeur ci-dessous</li>
                  <li>• Respectez le format : [SECTION] Champ: Valeur</li>
                  <li>• Supprimez une ligne pour supprimer un élément</li>
                  <li>• Ajoutez une ligne pour ajouter un nouvel élément</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tous les textes du site
                </label>
                <textarea
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  rows={25}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBulkEditor(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={applyBulkChanges}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Appliquer les modifications</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;