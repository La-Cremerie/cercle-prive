import React, { useState, useEffect } from 'react';
import { Palette, Layout, Type, Sliders, Save, RotateCcw, Eye, Monitor, Smartphone, Tablet } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRealTimeSync } from '../hooks/useRealTimeSync';
import { ContentVersioningService } from '../services/contentVersioningService';

interface DesignSettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    headingSize: string;
    bodySize: string;
    lineHeight: string;
  };
  layout: {
    containerWidth: string;
    sectionSpacing: string;
    borderRadius: string;
    shadowIntensity: string;
  };
  animations: {
    enabled: boolean;
    speed: string;
    intensity: string;
  };
}

const DesignCustomizer: React.FC = () => {
  const [settings, setSettings] = useState<DesignSettings>(() => {
    const stored = localStorage.getItem('designSettings');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Paramètres par défaut
    return {
      colors: {
        primary: '#D97706', // yellow-600
        secondary: '#1F2937', // gray-800
        accent: '#F59E0B', // yellow-500
        background: '#FFFFFF',
        text: '#111827'
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        headingSize: 'large',
        bodySize: 'medium',
        lineHeight: 'relaxed'
      },
      layout: {
        containerWidth: 'max-w-7xl',
        sectionSpacing: 'py-20',
        borderRadius: 'rounded-lg',
        shadowIntensity: 'shadow-sm'
      },
      animations: {
        enabled: true,
        speed: 'normal',
        intensity: 'medium'
      }
    };
  });

  const [activeSection, setActiveSection] = useState<'colors' | 'typography' | 'layout' | 'animations'>('colors');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const { broadcastChange } = useRealTimeSync('design-customizer');

  // Charger les paramètres depuis Supabase au démarrage
  useEffect(() => {
    const loadDesignFromSupabase = async () => {
      try {
        const supabaseDesign = await ContentVersioningService.getCurrentDesignSettings();
        if (supabaseDesign) {
          setSettings(supabaseDesign);
          localStorage.setItem('designSettings', JSON.stringify(supabaseDesign));
        }
      } catch (error) {
        console.warn('Erreur chargement design Supabase:', error);
      }
    };

    loadDesignFromSupabase();
  }, []);

  const applyDesignSettings = () => {
    const root = document.documentElement;
    
    // Appliquer les couleurs CSS
    root.style.setProperty('--color-primary', settings.colors.primary);
    root.style.setProperty('--color-secondary', settings.colors.secondary);
    root.style.setProperty('--color-accent', settings.colors.accent);
    root.style.setProperty('--color-background', settings.colors.background);
    root.style.setProperty('--color-text', settings.colors.text);
    
    // Appliquer la typographie
    root.style.setProperty('--font-heading', settings.typography.headingFont);
    root.style.setProperty('--font-body', settings.typography.bodyFont);
    
    // Déclencher un événement pour mettre à jour les composants
    window.dispatchEvent(new CustomEvent('designSettingsChanged', { detail: settings }));
  };

  const saveSettings = () => {
    // Sauvegarder dans Supabase avec versioning
    const saveToSupabase = async () => {
      try {
        const adminEmail = localStorage.getItem('currentAdminEmail') || 'nicolas.c@lacremerie.fr';
        const adminName = adminEmail.split('@')[0];
        
        await ContentVersioningService.saveDesignSettingsVersion(
          settings,
          adminName,
          adminEmail,
          'Modification des paramètres de design'
        );
        
        console.log('✅ Paramètres de design sauvegardés dans Supabase avec versioning');
        
        // Diffuser le changement en temps réel pour TOUS les utilisateurs
        await broadcastChange('design', 'update', settings);
        
      } catch (error) {
        console.warn('⚠️ Erreur sauvegarde Supabase, utilisation localStorage:', error);
      }
    };

    // Attendre la sauvegarde Supabase avant de continuer
    const performSave = async () => {
      await saveToSupabase();
      
      // Sauvegarder localement (fallback)
      localStorage.setItem('designSettings', JSON.stringify(settings));
      applyDesignSettings();
      
      toast.success('Paramètres de design sauvegardés et synchronisés !');
    };
    
    performSave();
  };

  };

  const resetToDefaults = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres de design ?')) {
      const defaultSettings: DesignSettings = {
        colors: {
          primary: '#D97706',
          secondary: '#1F2937',
          accent: '#F59E0B',
          background: '#FFFFFF',
          text: '#111827'
        },
        typography: {
          headingFont: 'Inter',
          bodyFont: 'Inter',
          headingSize: 'large',
          bodySize: 'medium',
          lineHeight: 'relaxed'
        },
        layout: {
          containerWidth: 'max-w-7xl',
          sectionSpacing: 'py-20',
          borderRadius: 'rounded-lg',
          shadowIntensity: 'shadow-sm'
        },
        animations: {
          enabled: true,
          speed: 'normal',
          intensity: 'medium'
        }
      };
      
      setSettings(defaultSettings);
      localStorage.setItem('designSettings', JSON.stringify(defaultSettings));
      applyDesignSettings();
      toast.success('Paramètres réinitialisés');
    }
  };

  useEffect(() => {
    applyDesignSettings();
  }, [settings]);

  const colorPresets = [
    { name: 'Doré Classique', primary: '#D97706', accent: '#F59E0B', secondary: '#1F2937' },
    { name: 'Bleu Élégant', primary: '#2563EB', accent: '#3B82F6', secondary: '#1E293B' },
    { name: 'Vert Prestige', primary: '#059669', accent: '#10B981', secondary: '#1F2937' },
    { name: 'Rouge Luxe', primary: '#DC2626', accent: '#EF4444', secondary: '#1F2937' },
    { name: 'Violet Royal', primary: '#7C3AED', accent: '#8B5CF6', secondary: '#1F2937' }
  ];

  const fontOptions = [
    { name: 'Inter (Moderne)', value: 'Inter' },
    { name: 'Playfair Display (Élégant)', value: 'Playfair Display' },
    { name: 'Montserrat (Clean)', value: 'Montserrat' },
    { name: 'Lora (Classique)', value: 'Lora' },
    { name: 'Poppins (Moderne)', value: 'Poppins' }
  ];

  const sections = [
    { key: 'colors', label: 'Couleurs', icon: Palette },
    { key: 'typography', label: 'Typographie', icon: Type },
    { key: 'layout', label: 'Mise en page', icon: Layout },
    { key: 'animations', label: 'Animations', icon: Sliders }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-gray-900 dark:text-white">
            Personnalisation du Design
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Modifiez l'apparence et la mise en page de votre site
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
            onClick={async () => {
              try {
                const history = await ContentVersioningService.getVersionHistory('design');
                // Afficher l'historique des versions de design
                console.log('Historique design:', history);
                toast.success(`${history.length} version(s) trouvée(s)`);
              } catch (error) {
                toast.error('Erreur lors du chargement de l\'historique');
              }
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Historique</span>
          </button>
          <button
            onClick={saveSettings}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>Sauvegarder</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Menu des sections */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sticky top-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Paramètres
            </h3>
            <nav className="space-y-2">
              {sections.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key as any)}
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

            {/* Aperçu responsive */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Aperçu
              </h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 rounded-md transition-colors ${
                    previewMode === 'desktop'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('tablet')}
                  className={`p-2 rounded-md transition-colors ${
                    previewMode === 'tablet'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 rounded-md transition-colors ${
                    previewMode === 'mobile'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>
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
              {/* Section Couleurs */}
              {activeSection === 'colors' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    Palette de Couleurs
                  </h3>
                  
                  {/* Presets de couleurs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Palettes prédéfinies
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => {
                            setSettings(prev => ({
                              ...prev,
                              colors: {
                                ...prev.colors,
                                primary: preset.primary,
                                accent: preset.accent,
                                secondary: preset.secondary
                              }
                            }));
                          }}
                          className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex space-x-1">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: preset.primary }}
                            ></div>
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: preset.accent }}
                            ></div>
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: preset.secondary }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Couleurs personnalisées */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Couleur principale
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.colors.primary}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            colors: { ...prev.colors, primary: e.target.value }
                          }))}
                          className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.colors.primary}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            colors: { ...prev.colors, primary: e.target.value }
                          }))}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Couleur d'accent
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.colors.accent}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            colors: { ...prev.colors, accent: e.target.value }
                          }))}
                          className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.colors.accent}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            colors: { ...prev.colors, accent: e.target.value }
                          }))}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Couleur secondaire
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.colors.secondary}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            colors: { ...prev.colors, secondary: e.target.value }
                          }))}
                          className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.colors.secondary}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            colors: { ...prev.colors, secondary: e.target.value }
                          }))}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Couleur de fond
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.colors.background}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            colors: { ...prev.colors, background: e.target.value }
                          }))}
                          className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.colors.background}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            colors: { ...prev.colors, background: e.target.value }
                          }))}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Typographie */}
              {activeSection === 'typography' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    Typographie
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Police des titres
                      </label>
                      <select
                        value={settings.typography.headingFont}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          typography: { ...prev.typography, headingFont: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {fontOptions.map(font => (
                          <option key={font.value} value={font.value}>
                            {font.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Police du texte
                      </label>
                      <select
                        value={settings.typography.bodyFont}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          typography: { ...prev.typography, bodyFont: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {fontOptions.map(font => (
                          <option key={font.value} value={font.value}>
                            {font.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Taille des titres
                      </label>
                      <select
                        value={settings.typography.headingSize}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          typography: { ...prev.typography, headingSize: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="small">Petite</option>
                        <option value="medium">Moyenne</option>
                        <option value="large">Grande</option>
                        <option value="xl">Très grande</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Taille du texte
                      </label>
                      <select
                        value={settings.typography.bodySize}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          typography: { ...prev.typography, bodySize: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="small">Petite</option>
                        <option value="medium">Moyenne</option>
                        <option value="large">Grande</option>
                      </select>
                    </div>
                  </div>

                  {/* Aperçu typographie */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Aperçu de la typographie
                    </h4>
                    <div 
                      className="space-y-4"
                      style={{ 
                        fontFamily: settings.typography.bodyFont,
                        fontSize: settings.typography.bodySize === 'small' ? '14px' : 
                                 settings.typography.bodySize === 'large' ? '18px' : '16px'
                      }}
                    >
                      <h2 
                        style={{ 
                          fontFamily: settings.typography.headingFont,
                          fontSize: settings.typography.headingSize === 'small' ? '24px' :
                                   settings.typography.headingSize === 'medium' ? '32px' :
                                   settings.typography.headingSize === 'large' ? '40px' : '48px',
                          color: settings.colors.primary
                        }}
                      >
                        Titre Principal
                      </h2>
                      <p style={{ color: settings.colors.text }}>
                        Ceci est un exemple de texte avec la typographie sélectionnée. 
                        Vous pouvez voir comment les polices et tailles s'harmonisent ensemble.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Mise en page */}
              {activeSection === 'layout' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    Mise en Page
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Largeur du contenu
                      </label>
                      <select
                        value={settings.layout.containerWidth}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          layout: { ...prev.layout, containerWidth: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="max-w-5xl">Étroite</option>
                        <option value="max-w-6xl">Moyenne</option>
                        <option value="max-w-7xl">Large</option>
                        <option value="max-w-full">Pleine largeur</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Espacement des sections
                      </label>
                      <select
                        value={settings.layout.sectionSpacing}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          layout: { ...prev.layout, sectionSpacing: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="py-12">Compact</option>
                        <option value="py-16">Normal</option>
                        <option value="py-20">Spacieux</option>
                        <option value="py-32">Très spacieux</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Arrondis des éléments
                      </label>
                      <select
                        value={settings.layout.borderRadius}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          layout: { ...prev.layout, borderRadius: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="rounded-none">Aucun</option>
                        <option value="rounded-sm">Léger</option>
                        <option value="rounded-md">Moyen</option>
                        <option value="rounded-lg">Important</option>
                        <option value="rounded-xl">Très important</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Intensité des ombres
                      </label>
                      <select
                        value={settings.layout.shadowIntensity}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          layout: { ...prev.layout, shadowIntensity: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="shadow-none">Aucune</option>
                        <option value="shadow-sm">Légère</option>
                        <option value="shadow-md">Moyenne</option>
                        <option value="shadow-lg">Importante</option>
                        <option value="shadow-xl">Très importante</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Animations */}
              {activeSection === 'animations' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    Animations et Transitions
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settings.animations.enabled}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            animations: { ...prev.animations, enabled: e.target.checked }
                          }))}
                          className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Activer les animations
                        </span>
                      </label>
                    </div>

                    {settings.animations.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Vitesse des animations
                          </label>
                          <select
                            value={settings.animations.speed}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              animations: { ...prev.animations, speed: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="slow">Lente</option>
                            <option value="normal">Normale</option>
                            <option value="fast">Rapide</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Intensité des effets
                          </label>
                          <select
                            value={settings.animations.intensity}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              animations: { ...prev.animations, intensity: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="subtle">Subtile</option>
                            <option value="medium">Moyenne</option>
                            <option value="strong">Forte</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Aperçu en temps réel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Aperçu en Temps Réel
          </h3>
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Mode {previewMode}
            </span>
          </div>
        </div>

        {/* Aperçu du design */}
        <div 
          className={`mx-auto border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden ${
            previewMode === 'mobile' ? 'max-w-sm' :
            previewMode === 'tablet' ? 'max-w-2xl' : 'max-w-4xl'
          }`}
          style={{ backgroundColor: settings.colors.background }}
        >
          {/* Header simulé */}
          <div 
            className="p-4 border-b"
            style={{ backgroundColor: settings.colors.secondary }}
          >
            <h4 
              className="font-medium"
              style={{ 
                color: settings.colors.background,
                fontFamily: settings.typography.headingFont 
              }}
            >
              CERCLE PRIVÉ
            </h4>
          </div>

          {/* Contenu simulé */}
          <div className="p-6 space-y-4">
            <h2 
              style={{ 
                color: settings.colors.primary,
                fontFamily: settings.typography.headingFont,
                fontSize: settings.typography.headingSize === 'small' ? '24px' :
                         settings.typography.headingSize === 'medium' ? '32px' :
                         settings.typography.headingSize === 'large' ? '40px' : '48px'
              }}
            >
              Titre de Section
            </h2>
            <p 
              style={{ 
                color: settings.colors.text,
                fontFamily: settings.typography.bodyFont,
                fontSize: settings.typography.bodySize === 'small' ? '14px' : 
                         settings.typography.bodySize === 'large' ? '18px' : '16px'
              }}
            >
              Ceci est un exemple de texte avec vos paramètres de design. 
              Vous pouvez voir comment les couleurs et la typographie s'harmonisent.
            </p>
            
            {/* Bouton simulé */}
            <button 
              className={`px-6 py-3 text-white font-medium transition-colors ${settings.layout.borderRadius}`}
              style={{ backgroundColor: settings.colors.primary }}
            >
              Bouton d'Action
            </button>

            {/* Card simulée */}
            <div 
              className={`p-4 border ${settings.layout.borderRadius} ${settings.layout.shadowIntensity}`}
              style={{ 
                backgroundColor: settings.colors.background,
                borderColor: settings.colors.primary + '20'
              }}
            >
              <h3 
                style={{ 
                  color: settings.colors.accent,
                  fontFamily: settings.typography.headingFont 
                }}
              >
                Carte d'Exemple
              </h3>
              <p 
                style={{ 
                  color: settings.colors.text,
                  fontFamily: settings.typography.bodyFont 
                }}
              >
                Contenu de la carte avec vos paramètres appliqués.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS personnalisé généré */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          CSS Généré
        </h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <pre>{`:root {
  --color-primary: ${settings.colors.primary};
  --color-secondary: ${settings.colors.secondary};
  --color-accent: ${settings.colors.accent};
  --color-background: ${settings.colors.background};
  --color-text: ${settings.colors.text};
  --font-heading: ${settings.typography.headingFont};
  --font-body: ${settings.typography.bodyFont};
}`}</pre>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
          Ces variables CSS sont automatiquement appliquées à votre site.
        </p>
      </div>
    </div>
  );
};

export default DesignCustomizer;