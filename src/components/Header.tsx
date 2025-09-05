import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Phone, Mail } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-blue-900/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-white">PRESTIGE IMMOBILIER</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="hidden md:flex space-x-6">
              <a href="#accueil" className="text-white hover:text-blue-200 transition-colors">{t('nav.accueil')}</a>
              <a href="#recherche" className="text-white hover:text-blue-200 transition-colors">{t('nav.recherche')}</a>
              <a href="#vendre" className="text-white hover:text-blue-200 transition-colors">{t('nav.vendre')}</a>
              <a href="#contact" className="text-white hover:text-blue-200 transition-colors">{t('nav.contact')}</a>
            </nav>
            <LanguageSelector />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-blue-200 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-blue-200 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-900/95 backdrop-blur-sm">
            <div className="px-4 py-4 space-y-4">
              <a href="#accueil" className="block text-white hover:text-blue-200 transition-colors">{t('nav.accueil')}</a>
              <a href="#recherche" className="block text-white hover:text-blue-200 transition-colors">{t('nav.recherche')}</a>
              <a href="#vendre" className="block text-white hover:text-blue-200 transition-colors">{t('nav.vendre')}</a>
              <a href="#contact" className="block text-white hover:text-blue-200 transition-colors">{t('nav.contact')}</a>
              <div className="pt-4 border-t border-white/20">
                <LanguageSelector />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}