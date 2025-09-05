import React, { useState } from 'react';
import { Search, Globe, TrendingUp, Eye, Save, Edit, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  robots: string;
  structuredData: {
    type: string;
    name: string;
    description: string;
    url: string;
    telephone: string;
    address: string;
  };
}

const SEOManager: React.FC = () => {
  const [seoSettings, setSeoSettings] = useState<SEOSettings>(() => {
    const stored = localStorage.getItem('seoSettings');
    if (stored) {
      return JSON.parse(stored);
    }
    
    return {
      title: 'OFF MARKET - Immobilier de Prestige en Off-Market | Côte d\'Azur',
      description: 'Découvrez l\'excellence immobilière en toute discrétion. Biens de prestige en off-market sur la Côte d\'Azur. Accompagnement personnalisé pour vos projets d\'exception.',
      keywords: ['immobilier prestige', 'off-market', 'côte d\'azur', 'villa luxe', 'investissement immobilier'],
      ogTitle: 'OFF MARKET - L\'excellence immobilière en toute discrétion',
      ogDescription: 'Biens de prestige en off-market sur la Côte d\'Azur. Accompagnement personnalisé pour vos projets immobiliers d\'exception.',
      ogImage: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
      canonicalUrl: 'https://votre-site.com',
      robots: 'index, follow',
      structuredData: {
        type: 'RealEstateAgent',
        name: 'OFF MARKET',
        description: 'Spécialiste de l\'immobilier de prestige en off-market',
        url: 'https://votre-site.com',
        telephone: '+33 6 52 91 35 56',
        address: 'Côte d\'Azur, France'
      }
    };
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'technical' | 'structured'>('basic');

  const saveSettings = () => {
    localStorage.setItem('seoSettings', JSON.stringify(seoSettings));
    
    // Mettre à jour les meta tags dans le document
    updateMetaTags();
    
    toast.success('Paramètres SEO sauvegardés');
  };

  const updateMetaTags = () => {
    // Titre
    document.title = seoSettings.title;
    
    // Meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', seoSettings.description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', seoSettings.description);
      document.head.appendChild(metaDescription);
    }
    
    // Meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', seoSettings.keywords.join(', '));
    } else {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      metaKeywords.setAttribute('content', seoSettings.keywords.join(', '));
      document.head.appendChild(metaKeywords);
    }
    
    // Open Graph
    const ogTags = [
      { property: 'og:title', content: seoSettings.ogTitle },
      { property: 'og:description', content: seoSettings.ogDescription },
      { property: 'og:image', content: seoSettings.ogImage },
      { property: 'og:url', content: seoSettings.canonicalUrl },
      { property: 'og:type', content: 'website' }
    ];
    
    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) {
        tag.setAttribute('content', content);
      } else {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
      }
    });
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !seoSettings.keywords.includes(newKeyword.trim())) {
      setSeoSettings(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setSeoSettings(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const tabs = [
    { key: 'basic', label: 'Basique', icon: Search },
    { key: 'social', label: 'Réseaux sociaux', icon: Globe },
    { key: 'technical', label: 'Technique', icon: TrendingUp },
    { key: 'structured', label: 'Données structurées', icon: Eye }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-gray-900 dark:text-white">
            Optimisation SEO
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Optimisez le référencement naturel de votre site
          </p>
        </div>
        <button
          onClick={saveSettings}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Save className="w-5 h-5" />
          <span>Sauvegarder</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === key
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Onglet Basique */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Titre de la page (Title Tag)
                  </label>
                  <input
                    type="text"
                    value={seoSettings.title}
                    onChange={(e) => setSeoSettings(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Titre optimisé pour le SEO (50-60 caractères)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {seoSettings.title.length}/60 caractères
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={seoSettings.description}
                    onChange={(e) => setSeoSettings(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Description qui apparaîtra dans les résultats de recherche (150-160 caractères)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {seoSettings.description.length}/160 caractères
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mots-clés
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Nouveau mot-clé"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      />
                      <button
                        type="button"
                        onClick={addKeyword}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {seoSettings.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                        >
                          <span>{keyword}</span>
                          <button
                            onClick={() => removeKeyword(index)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Réseaux sociaux */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Titre Open Graph (Facebook, LinkedIn)
                  </label>
                  <input
                    type="text"
                    value={seoSettings.ogTitle}
                    onChange={(e) => setSeoSettings(prev => ({ ...prev, ogTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description Open Graph
                  </label>
                  <textarea
                    value={seoSettings.ogDescription}
                    onChange={(e) => setSeoSettings(prev => ({ ...prev, ogDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Image Open Graph (URL)
                  </label>
                  <input
                    type="url"
                    value={seoSettings.ogImage}
                    onChange={(e) => setSeoSettings(prev => ({ ...prev, ogImage: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://votre-site.com/image-og.jpg"
                  />
                  {seoSettings.ogImage && (
                    <div className="mt-3">
                      <img
                        src={seoSettings.ogImage}
                        alt="Aperçu Open Graph"
                        className="w-64 h-32 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Onglet Technique */}
            {activeTab === 'technical' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL Canonique
                  </label>
                  <input
                    type="url"
                    value={seoSettings.canonicalUrl}
                    onChange={(e) => setSeoSettings(prev => ({ ...prev, canonicalUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://votre-site.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Robots Meta Tag
                  </label>
                  <select
                    value={seoSettings.robots}
                    onChange={(e) => setSeoSettings(prev => ({ ...prev, robots: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="index, follow">Index, Follow (Recommandé)</option>
                    <option value="noindex, follow">No Index, Follow</option>
                    <option value="index, nofollow">Index, No Follow</option>
                    <option value="noindex, nofollow">No Index, No Follow</option>
                  </select>
                </div>
              </div>
            )}

            {/* Onglet Données structurées */}
            {activeTab === 'structured' && (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    💡 Données structurées Schema.org
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Ces informations aident Google à mieux comprendre votre activité immobilière.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom de l'entreprise
                    </label>
                    <input
                      type="text"
                      value={seoSettings.structuredData.name}
                      onChange={(e) => setSeoSettings(prev => ({
                        ...prev,
                        structuredData: { ...prev.structuredData, name: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={seoSettings.structuredData.telephone}
                      onChange={(e) => setSeoSettings(prev => ({
                        ...prev,
                        structuredData: { ...prev.structuredData, telephone: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description de l'activité
                  </label>
                  <textarea
                    value={seoSettings.structuredData.description}
                    onChange={(e) => setSeoSettings(prev => ({
                      ...prev,
                      structuredData: { ...prev.structuredData, description: e.target.value }
                    }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={seoSettings.structuredData.address}
                    onChange={(e) => setSeoSettings(prev => ({
                      ...prev,
                      structuredData: { ...prev.structuredData, address: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Aperçu SEO */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Aperçu dans les résultats de recherche
        </h3>
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
          <div className="text-blue-600 text-lg hover:underline cursor-pointer">
            {seoSettings.title}
          </div>
          <div className="text-green-600 text-sm mt-1">
            {seoSettings.canonicalUrl}
          </div>
          <div className="text-gray-700 dark:text-gray-300 text-sm mt-2">
            {seoSettings.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOManager;