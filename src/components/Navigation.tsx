import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Settings, Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
// Import ThemeToggle only in development
const ThemeToggle = React.lazy(() => import('./ThemeToggle'));

interface NavigationProps {
  onAdminClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onAdminClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { unreadCount, markAsRead } = useNotifications();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAdminClick = () => {
    markAsRead();
    onAdminClick?.();
  };

  const isHomePage = location.pathname === '/';

  const navLinks = [
    { href: '/#notre-adn', label: 'CONCEPT', isAnchor: true },
    { href: '/#nos-services', label: 'NOS SERVICES', isAnchor: true },
    { href: '/#recherche', label: 'RECHERCHE', isAnchor: true },
    { href: '/#galerie-biens', label: 'ACHETER', isAnchor: true },
    { href: '/#vendre', label: 'VENDRE', isAnchor: true },
    { href: '/about', label: 'À PROPOS', isAnchor: false },
    { href: '/services', label: 'SERVICES', isAnchor: false },
    { href: '/portfolio', label: 'PORTFOLIO', isAnchor: false },
    { href: '/blog', label: 'BLOG', isAnchor: false },
    { href: '/contact', label: 'CONTACT', isAnchor: false }
  ];

  const displayedLinks = isHomePage 
    ? navLinks.filter(link => link.isAnchor)
    : navLinks.filter(link => !link.isAnchor);
  return (
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl md:text-2xl font-light text-gray-900 dark:text-white tracking-wider hover:text-yellow-600 transition-colors">
              CERCLE PRIVÉ
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {displayedLinks.map((link) => (
              link.isAnchor ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-light text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors tracking-wide"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-light text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors tracking-wide"
                >
                  {link.label}
                </Link>
              )
            ))}
            
            {/* Theme toggle only in development */}
            {import.meta.env.DEV && (
              <React.Suspense fallback={null}>
                <ThemeToggle />
              </React.Suspense>
            )}
            
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
              {displayedLinks.map((link) => (
                link.isAnchor ? (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={toggleMenu}
                    className="block text-sm font-light text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors tracking-wide"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={toggleMenu}
                    className="block text-sm font-light text-gray-700 dark:text-gray-300 hover:text-amber-600 transition-colors tracking-wide"
                  >
                    {link.label}
                  </Link>
                )
              ))}
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