import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Phone, Mail } from 'lucide-react';

export default function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold tracking-wider">PRESTIGE IMMOBILIER</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              <a href="#accueil" className="text-white hover:text-blue-200 transition-colors">{t('nav.accueil')}</a>
              <a href="#recherche" className="text-white hover:text-blue-200 transition-colors">{t('nav.recherche')}</a>
              <a href="#vendre" className="text-white hover:text-blue-200 transition-colors">{t('nav.vendre')}</a>
              <a href="#contact" className="text-white hover:text-blue-200 transition-colors">{t('nav.contact')}</a>
            </nav>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-blue-200 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-900/95 backdrop-blur-sm">
            <div className="px-4 py-4 space-y-4">
              <a href="#accueil" className="block text-white hover:text-blue-200 transition-colors">{t('nav.accueil')}</a>
              <a href="#recherche" className="block text-white hover:text-blue-200 transition-colors">{t('nav.recherche')}</a>
              <a href="#vendre" className="block text-white hover:text-blue-200 transition-colors">{t('nav.vendre')}</a>
              <a href="#contact" className="block text-white hover:text-blue-200 transition-colors">{t('nav.contact')}</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}