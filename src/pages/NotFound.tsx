import React from 'react';
import { motion } from 'framer-motion';
import { Home, Mail, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Error Visual */}
          <div className="space-y-4">
            <div className="text-8xl font-light text-yellow-600">404</div>
            <Search className="w-16 h-16 text-gray-400 mx-auto" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-light text-gray-900 dark:text-white">
              Page Non Trouvée
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée. 
              Utilisez les liens ci-dessous pour continuer votre navigation.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 bg-yellow-600 text-white px-6 py-3 rounded-md hover:bg-yellow-700 transition-colors font-medium"
            >
              <Home className="w-5 h-5" />
              <span>Retour à l'Accueil</span>
            </Link>
            <Link
              to="/contact"
              className="flex items-center justify-center space-x-2 border border-yellow-600 text-yellow-600 px-6 py-3 rounded-md hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors font-medium"
            >
              <Mail className="w-5 h-5" />
              <span>Nous Contacter</span>
            </Link>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
              Pages Populaires
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { to: '/', label: 'Accueil' },
                { to: '/services', label: 'Nos Services' },
                { to: '/portfolio', label: 'Portfolio' },
                { to: '/about', label: 'À Propos' },
                { to: '/blog', label: 'Blog' },
                { to: '/contact', label: 'Contact' }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-yellow-600 hover:text-yellow-700 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;