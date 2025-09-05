import React, { useState } from 'react';
import { Menu, X, Settings, Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import ThemeToggle from './ThemeToggle';

interface NavigationProps {
  onAdminClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onAdminClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { unreadCount, markAsRead } = useNotifications();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAdminClick = () => {
    markAsRead();
    onAdminClick?.();
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
            
            {onAdminClick && import.meta.env.DEV && (
              <button
                onClick={handleAdminClick}
                className="relative flex items-center space-x-2 text-sm font-light text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors tracking-wide"
              >
                <Settings className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
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
              {onAdminClick && import.meta.env.DEV && (
                <button
                  onClick={() => {
                    handleAdminClick();
                    toggleMenu();
                  }}
                  className="relative flex items-center space-x-2 text-sm font-light text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors tracking-wide"
                >
                  <Settings className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center ml-2">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;