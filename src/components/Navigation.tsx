import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  return (
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-light text-gray-900 dark:text-white tracking-wider">
              CERCLE PRIVÉ
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a href="#notre-adn" className="text-sm font-light text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors tracking-wide">
              CONCEPT
            </a>
            <a href="#nos-services" className="text-sm font-light text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors tracking-wide">
              NOS SERVICES
            </a>
            <a href="#recherche" className="text-sm font-light text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors tracking-wide">
              RECHERCHE
            </a>
            <a href="#galerie-biens" className="text-sm font-light text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors tracking-wide">
              ACHETER
            </a>
            <a href="#vendre" className="text-sm font-light text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors tracking-wide">
              VENDRE
            </a>
            
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <a
                href="#notre-adn"
                onClick={toggleMenu}
                className="block text-sm font-light text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors tracking-wide"
              >
                CONCEPT
              </a>
              <a
                href="#nos-services"
                onClick={toggleMenu}
                className="block text-sm font-light text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors tracking-wide"
              >
                NOS SERVICES
              </a>
              <a
                href="#recherche"
                onClick={toggleMenu}
                className="block text-sm font-light text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors tracking-wide"
              >
                RECHERCHE
              </a>
              <a
                href="#galerie-biens"
                onClick={toggleMenu}
                className="block text-sm font-light text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors tracking-wide"
              >
                ACHETER
              </a>
              <a
                href="#vendre"
                onClick={toggleMenu}
                className="block text-sm font-light text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors tracking-wide"
              >
                VENDRE
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;