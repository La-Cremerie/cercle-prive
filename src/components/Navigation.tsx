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
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4 ml-auto">
            <a href="#notre-adn" className="text-sm font-light text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors tracking-wide">
              CONCEPT
            </a>
            <a href="#nos-services" className="text-sm font-light text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors tracking-wide">
              NOS SERVICES
            </a>
            <a href="#recherche" className="text-sm font-light text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors tracking-wide">
              RECHERCHE
            </a>
            <a href="#galerie-biens" className="text-sm font-light text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors tracking-wide">
              ACHETER
            </a>
            <a href="#vendre" className="text-sm font-light text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors tracking-wide">
              VENDRE
            </a>
            <a href="#off-market" className="text-sm font-light text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors tracking-wide">
              OFF-MARKET
            </a>
            <a href="#contact" className="text-sm font-light text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors tracking-wide">
              CONTACT
            </a>
            
            {/* Theme toggle only in development */}
            <ThemeToggle />
            
            {/* Admin access logo - always visible but discreet */}
            {onAdminClick && (
              <button
                onClick={handleAdminClick}
                className="relative p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                title="Administration"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
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
                className="block text-sm font-light text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors tracking-wide"
              >
                CONCEPT
              </a>
              <a
                href="#nos-services"
                onClick={toggleMenu}
                className="block text-sm font-light text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors tracking-wide"
              >
                NOS SERVICES
              </a>
              <a
                href="#recherche"
                onClick={toggleMenu}
                className="block text-sm font-light text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors tracking-wide"
              >
                RECHERCHE
              </a>
              <a
                href="#galerie-biens"
                onClick={toggleMenu}
                className="block text-sm font-light text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors tracking-wide"
              >
                ACHETER
              </a>
              <a
                href="#vendre"
                onClick={toggleMenu}
                className="block text-sm font-light text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors tracking-wide"
              >
                VENDRE
              </a>
              <a
                href="#off-market"
                onClick={toggleMenu}
                className="block text-sm font-light text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors tracking-wide"
              >
                OFF-MARKET
              </a>
              <a
                href="#contact"
                onClick={toggleMenu}
                className="block text-sm font-light text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors tracking-wide"
              >
                CONTACT
              </a>
              {onAdminClick && (
                <button
                  onClick={() => {
                    handleAdminClick();
                    toggleMenu();
                  }}
                  className="relative p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                  title="Administration"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
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