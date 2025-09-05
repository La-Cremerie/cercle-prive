import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { User, Phone, Mail, UserCheck, Eye, EyeOff, Menu, X, ChevronLeft, ChevronRight, Heart, MapPin, Bed, Bath, Square, Home, Euro, Clock, Shield, CheckCircle, Send, Search, Package, Crown, Ruler, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Types
interface FormData {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
}

interface Property {
  id: string;
  name: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  surface: number;
  images: string[];
  description: string;
  features: string[];
  type: 'villa' | 'appartement' | 'penthouse';
  status: 'disponible' | 'vendu' | 'reserve';
  yield?: number;
}

// Données par défaut des biens immobiliers
const defaultProperties: Property[] = [
  {
    id: '1',
    name: 'Villa Horizon',
    location: 'Cannes, Côte d\'Azur',
    price: '4 500 000 €',
    bedrooms: 6,
    bathrooms: 4,
    surface: 450,
    images: [
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Villa d\'exception avec vue panoramique sur la mer Méditerranée. Architecture contemporaine et finitions haut de gamme.',
    features: ['Piscine à débordement', 'Vue mer panoramique', 'Garage 3 voitures', 'Jardin paysager'],
    type: 'villa',
    status: 'disponible',
    yield: 180000
  },
  {
    id: '2',
    name: 'Villa Azure',
    location: 'Saint-Tropez',
    price: '6 200 000 €',
    bedrooms: 8,
    bathrooms: 6,
    surface: 600,
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Propriété d\'exception dans un domaine privé sécurisé. Design architectural unique.',
    features: ['Domaine privé', 'Spa privé', 'Court de tennis', 'Héliport'],
    type: 'villa',
    status: 'disponible',
    yield: 248000
  },
  {
    id: '3',
    name: 'Penthouse Élégance',
    location: 'Monaco, Monte-Carlo',
    price: '12 800 000 €',
    bedrooms: 4,
    bathrooms: 3,
    surface: 280,
    images: [
      'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Penthouse exceptionnel au cœur de Monaco avec terrasse panoramique.',
    features: ['Terrasse 200m²', 'Vue mer et ville', 'Concierge 24h/24', 'Parking privé'],
    type: 'penthouse',
    status: 'reserve',
    yield: 512000
  }
];

// Composant LoginForm intégré
const LoginForm: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    telephone: '',
    email: ''
  });
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Vérifier immédiatement si l'utilisateur est déjà connecté
  React.useEffect(() => {
    try {
      const userLoggedIn = localStorage.getItem('userLoggedIn');
      if (userLoggedIn === 'true') {
        onLoginSuccess();
      }
    } catch (error) {
      console.warn('Erreur lors de la vérification de connexion:', error);
    }
  }, [onLoginSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!isLogin) {
      if (!formData.nom.trim()) {
        setError('Le nom est requis');
        return false;
      }
      if (!formData.prenom.trim()) {
        setError('Le prénom est requis');
        return false;
      }
      if (!formData.telephone.trim()) {
        setError('Le téléphone est requis');
        return false;
      }
    }
    
    if (!formData.email.trim()) {
      setError('L\'email est requis');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Format d\'email invalide');
      return false;
    }
    if (!password.trim()) {
      setError('Le mot de passe est requis');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulation simple d'inscription/connexion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(formData));
      
      setSuccess(true);
      toast.success('Connexion réussie ! Bienvenue dans le Cercle Privé.');
      
      setTimeout(() => {
        onLoginSuccess();
      }, 1000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8 text-center">
          <div className="mb-6">
            <UserCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-light text-gray-900 mb-2">
              Connexion réussie !
            </h2>
            <p className="text-gray-600 font-light">
              Redirection en cours...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light text-gray-900 tracking-wider">
            CERCLE PRIVÉ
          </h1>
          <p className="text-sm text-gray-600 font-light mt-2">
            Bienvenue dans votre espace dédié à l'immobilier en toute discrétion
          </p>
        </div>

        <div className="flex mb-6 bg-white/5 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              !isLogin
                ? 'bg-yellow-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Inscription
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              isLogin
                ? 'bg-yellow-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Connexion
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de téléphone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      id="telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                      placeholder="Votre numéro de téléphone"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors pr-12"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connexion en cours...' : 'Accéder au site'}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6 font-light">
          En vous inscrivant, vous acceptez de recevoir des informations sur nos biens immobiliers de prestige.
        </p>
      </div>
    </div>
  );
};

// Composant Navigation intégré
const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-light text-gray-900 tracking-wider hover:text-yellow-600 transition-colors">
              CERCLE PRIVÉ
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a href="#notre-adn" className="text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
              CONCEPT
            </a>
            <a href="#nos-services" className="text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
              NOS SERVICES
            </a>
            <a href="#recherche" className="text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
              RECHERCHE
            </a>
            <a href="#galerie-biens" className="text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
              ACHETER
            </a>
            <a href="#vendre" className="text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
              VENDRE
            </a>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-amber-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <a href="#notre-adn" onClick={toggleMenu} className="block text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
                CONCEPT
              </a>
              <a href="#nos-services" onClick={toggleMenu} className="block text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
                NOS SERVICES
              </a>
              <a href="#recherche" onClick={toggleMenu} className="block text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
                RECHERCHE
              </a>
              <a href="#galerie-biens" onClick={toggleMenu} className="block text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
                ACHETER
              </a>
              <a href="#vendre" onClick={toggleMenu} className="block text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
                VENDRE
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Composant HeroSection intégré
const HeroSection: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState('https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = backgroundImage;
  }, [backgroundImage]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {backgroundImage && imageLoaded && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-8 leading-tight"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
        >
          l'excellence immobilière en toute discrétion
        </motion.h1>
        
        <motion.a 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          href="mailto:nicolas.c@lacremerie.fr"
          className="inline-block border border-white text-white px-8 py-3 text-sm font-light tracking-wider hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
        >
          Entrer en relation
        </motion.a>
      </motion.div>
    </section>
  );
};

// Composant ConceptSection intégré
const ConceptSection: React.FC = () => {
  return (
    <section id="notre-adn" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          <div className="space-y-8 lg:pr-8">
            <h2 className="text-3xl sm:text-4xl font-light text-yellow-600 tracking-wide">
              CONCEPT
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 text-base leading-relaxed font-light text-justify">
                nous avons fait le choix de la discrétion, de l'exclusivité et de l'excellence.
              </p>
              <p className="text-gray-700 text-base leading-relaxed font-light text-justify">
                Nous sommes spécialisés dans la vente de biens immobiliers haut de gamme en off-market, une approche confidentielle réservée à une clientèle exigeante, en quête de biens rares, souvent inaccessibles via les canaux traditionnels.
              </p>
            </div>
          </div>

          <div className="relative lg:pl-8">
            <img
              src="https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Architecture moderne méditerranéenne"
              className="w-full h-80 lg:h-96 object-cover shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Composant ServicesSection intégré
const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: Package,
      title: "Achat",
      description: "Conseil et accompagnement personnalisé pour l'acquisition de votre bien d'exception"
    },
    {
      icon: Crown,
      title: "Vente", 
      description: "Estimation et commercialisation de votre propriété avec notre expertise du marché de prestige"
    },
    {
      icon: Ruler,
      title: "Location",
      description: "Gestion locative haut de gamme pour propriétaires et recherche pour locataires exigeants"
    },
    {
      icon: Sparkles,
      title: "Investissement",
      description: "Conseil en investissement immobilier et opportunités sur la Côte d'Azur"
    }
  ];

  return (
    <section id="nos-services" className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-block">
            <h2 className="text-4xl sm:text-5xl font-extralight text-gray-900 tracking-wider mb-6 relative">
              Un accompagnement personnalisé pour tous vos projets immobiliers
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-yellow-600 to-transparent"></div>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-20">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-none border border-gray-100 hover:border-yellow-600/30 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="p-10 lg:p-12">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 border-2 border-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-light text-gray-900 tracking-wide leading-tight">
                      {service.title}
                    </h3>
                    <div className="w-12 h-px bg-yellow-600/30"></div>
                    <p className="text-gray-600 font-light leading-relaxed text-sm">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Composant PropertyGallery intégré
const PropertyGallery: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | 'villa' | 'appartement' | 'penthouse'>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [properties] = useState(defaultProperties);

  const filteredProperties = filter === 'all' 
    ? properties
    : properties.filter(p => p.type === filter);

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  const nextImage = () => {
    if (selectedProperty) {
      setCurrentImageIndex((prev) => 
        prev === selectedProperty.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProperty) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProperty.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <section id="galerie-biens" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-light text-yellow-600 tracking-wide mb-8">
            ACHETER
          </h2>
          
          <div className="flex justify-center space-x-4 mb-8">
            {[
              { key: 'all', label: 'Tous' },
              { key: 'villa', label: 'Villas' },
              { key: 'penthouse', label: 'Penthouses' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-6 py-2 rounded-full text-sm font-light transition-colors ${
                  filter === key
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative overflow-hidden">
                <img
                  src={property.images[0]}
                  alt={property.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${
                  property.status === 'disponible' 
                    ? 'bg-green-100 text-green-800'
                    : property.status === 'reserve'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {property.status === 'disponible' ? 'Disponible' : 
                   property.status === 'reserve' ? 'Réservé' : 'Vendu'}
                </div>

                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(property.id);
                    }}
                    className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                      favorites.has(property.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.has(property.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProperty(property);
                      setCurrentImageIndex(0);
                    }}
                    className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white backdrop-blur-sm transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-light text-gray-900">
                    {property.name}
                  </h3>
                  <span className="text-lg font-medium text-yellow-600">
                    {property.price}
                  </span>
                </div>
                
                {property.yield && property.yield > 0 && (
                  <div className="mb-3">
                    <span className="text-sm text-green-600 font-medium">
                      Rendement : {property.yield.toLocaleString('fr-FR')} € / an
                    </span>
                  </div>
                )}
                
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="w-4 h-4 mr-1" />
                      <span>{property.surface}m²</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal de détail */}
        <AnimatePresence>
          {selectedProperty && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedProperty(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <div className="relative h-96">
                    <img
                      src={selectedProperty.images[currentImageIndex]}
                      alt={selectedProperty.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {selectedProperty.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white transition-colors"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white transition-colors"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}

                    {selectedProperty.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {selectedProperty.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-light text-gray-900 mb-2">
                        {selectedProperty.name}
                      </h2>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span>{selectedProperty.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-medium text-yellow-600 mb-2">
                        {selectedProperty.price}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        selectedProperty.status === 'disponible' 
                          ? 'bg-green-100 text-green-800'
                          : selectedProperty.status === 'reserve'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedProperty.status === 'disponible' ? 'Disponible' : 
                         selectedProperty.status === 'reserve' ? 'Réservé' : 'Vendu'}
                      </div>
                    </div>
                  </div>
                  
                  {selectedProperty.yield && (
                    <div className="text-center mt-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="text-sm text-green-700 mb-1">
                          Rendement locatif estimé
                        </div>
                        <div className="text-xl font-medium text-green-600">
                          {selectedProperty.yield.toLocaleString('fr-FR')} € / an
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                          Soit {Math.round(selectedProperty.yield / 12).toLocaleString('fr-FR')} € / mois
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <Bed className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-light text-gray-900">
                        {selectedProperty.bedrooms}
                      </div>
                      <div className="text-sm text-gray-600">
                        Chambres
                      </div>
                    </div>
                    <div className="text-center">
                      <Bath className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-light text-gray-900">
                        {selectedProperty.bathrooms}
                      </div>
                      <div className="text-sm text-gray-600">
                        Salles de bain
                      </div>
                    </div>
                    <div className="text-center">
                      <Square className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-light text-gray-900">
                        {selectedProperty.surface}
                      </div>
                      <div className="text-sm text-gray-600">
                        m²
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedProperty.description}
                    </p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">
                      Caractéristiques
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedProperty.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => toggleFavorite(selectedProperty.id)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-colors ${
                        favorites.has(selectedProperty.id)
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${favorites.has(selectedProperty.id) ? 'fill-current' : ''}`} />
                      <span>{favorites.has(selectedProperty.id) ? 'Retiré des favoris' : 'Ajouter aux favoris'}</span>
                    </button>
                    <a
                      href="mailto:nicolas.c@lacremerie.fr?subject=Demande d'information - Villa Horizon"
                      className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-md hover:bg-yellow-700 transition-colors text-center font-medium"
                    >
                      Demander des informations
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// Composant RechercheSection intégré
const RechercheSection: React.FC = () => {
  const [formData, setFormData] = useState({
    typeBien: [] as string[],
    surfaceMin: '',
    nombreChambresMin: '',
    budgetMin: '',
    villesRecherche: '',
    prenom: '',
    nom: '',
    email: '',
    telephone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const typesBien = ['Villa', 'Appartement', 'Penthouse', 'Maison'];

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      typeBien: prev.typeBien.includes(value)
        ? prev.typeBien.filter(item => item !== value)
        : [...prev.typeBien, value]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.prenom || !formData.nom || !formData.email || !formData.telephone) {
      toast.error('Veuillez remplir vos coordonnées');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Recherche immobilière:', formData);
      setIsSuccess(true);
      toast.success('Votre recherche a été envoyée avec succès !');
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de votre recherche');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section id="recherche" className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-12"
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h3 className="text-3xl font-light text-gray-900 mb-4">
              Recherche enregistrée !
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Nous analysons votre demande et vous contacterons dès qu'un bien correspondant à vos critères sera disponible.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="recherche" className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-light text-yellow-600 tracking-wide mb-8">
            Trouvez votre bien d'exception
          </h2>
          <div className="w-24 h-px bg-yellow-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-700 font-light leading-relaxed max-w-3xl mx-auto">
            Recherche personnalisée parmi nos propriétés de prestige
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Que recherchez-vous ?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {typesBien.map((type) => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.typeBien.includes(type)}
                      onChange={() => handleCheckboxChange(type)}
                      className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span className="text-xs text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surface min. (en m²)
                </label>
                <input
                  type="number"
                  name="surfaceMin"
                  value={formData.surfaceMin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 text-gray-900"
                  placeholder="150"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de chambres min.
                </label>
                <input
                  type="number"
                  name="nombreChambresMin"
                  value={formData.nombreChambresMin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 text-gray-900"
                  placeholder="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget maximum (€)
                </label>
                <input
                  type="text"
                  name="budgetMin"
                  value={formData.budgetMin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 text-gray-900"
                  placeholder="2 500 000 €"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Villes ou codes postaux de recherche
              </label>
              <textarea
                name="villesRecherche"
                value={formData.villesRecherche}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 text-gray-900"
                placeholder="Cannes, Saint-Tropez, Monaco, 06400, 83990..."
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Vos coordonnées
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 text-gray-900"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 text-gray-900"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 text-gray-900"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 text-gray-900"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 bg-yellow-600 text-white py-3 px-6 rounded-md hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className={`w-5 h-5 ${isSubmitting ? 'animate-pulse' : ''}`} />
              <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer ma recherche'}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

// Composant VendreSection intégré
const VendreSection: React.FC = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    typeVente: 'villa',
    localisation: '',
    prixEstime: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Demande de vente:', formData);
      setIsSuccess(true);
      toast.success('Demande de vente envoyée avec succès !');
      
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          typeVente: 'villa',
          localisation: '',
          prixEstime: '',
          description: ''
        });
      }, 3000);
      
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const avantages = [
    {
      icon: <Shield className="w-8 h-8 text-yellow-600" />,
      title: "Confidentialité totale",
      description: "Votre bien reste confidentiel, pas de diffusion publique"
    },
    {
      icon: <Euro className="w-8 h-8 text-yellow-600" />,
      title: "Valorisation optimale",
      description: "Expertise professionnelle pour maximiser la valeur de votre bien"
    },
    {
      icon: <Clock className="w-8 h-8 text-yellow-600" />,
      title: "Vente rapide",
      description: "Réseau d'acheteurs qualifiés pour une transaction efficace"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-yellow-600" />,
      title: "Accompagnement complet",
      description: "Suivi personnalisé de A à Z par nos experts"
    }
  ];

  if (isSuccess) {
    return (
      <section id="vendre" className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-12"
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h3 className="text-3xl font-light text-gray-900 mb-4">
              Demande envoyée avec succès !
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Nous vous contacterons sous 24h pour évaluer votre bien et vous proposer notre accompagnement personnalisé.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="vendre" className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-light text-yellow-600 tracking-wide mb-8">
            VENDRE VOTRE BIEN
          </h2>
          <div className="w-24 h-px bg-yellow-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-700 font-light leading-relaxed max-w-4xl mx-auto">
            Confiez-nous la vente de votre bien immobilier de prestige. Notre approche off-market garantit discrétion, 
            valorisation optimale et accompagnement personnalisé pour une transaction réussie.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <h3 className="text-2xl font-light text-gray-900 mb-8">
              Pourquoi nous choisir ?
            </h3>
            
            <div className="space-y-6">
              {avantages.map((avantage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm"
                >
                  <div className="flex-shrink-0">
                    {avantage.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {avantage.title}
                    </h4>
                    <p className="text-gray-600 font-light leading-relaxed">
                      {avantage.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <Home className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-2xl font-light text-gray-900 mb-2">
                Estimation gratuite
              </h3>
              <p className="text-gray-600">
                Obtenez une évaluation professionnelle de votre bien
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de bien *
                  </label>
                  <select
                    name="typeVente"
                    value={formData.typeVente}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-gray-900"
                    required
                  >
                    <option value="villa">Villa</option>
                    <option value="appartement">Appartement</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="maison">Maison</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localisation *
                  </label>
                  <input
                    type="text"
                    name="localisation"
                    value={formData.localisation}
                    onChange={handleInputChange}
                    placeholder="Cannes, Saint-Tropez, Monaco..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix estimé
                </label>
                <input
                  type="text"
                  name="prixEstime"
                  value={formData.prixEstime}
                  onChange={handleInputChange}
                  placeholder="2 500 000 €"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description de votre bien
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Décrivez votre bien : nombre de pièces, caractéristiques particulières, vue, équipements..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 bg-yellow-600 text-white py-3 px-6 rounded-md hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className={`w-5 h-5 ${isSubmitting ? 'animate-pulse' : ''}`} />
                <span>{isSubmitting ? 'Envoi en cours...' : 'Demander une estimation'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Composant principal App
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsUserLoggedIn(true);
  };

  // Initialisation simplifiée avec timeout de sécurité
  useEffect(() => {
    const initializeApp = () => {
      try {
        console.log('🚀 Initialisation simplifiée');
        
        // Vérifier les connexions utilisateur
        let userLoggedIn = false;
        
        try {
          if (typeof window !== 'undefined' && window && window.localStorage) {
            userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
          }
        } catch (storageError) {
          console.warn('⚠️ Erreur localStorage:', storageError);
        }
        
        setIsUserLoggedIn(userLoggedIn);
        
        // Timeout de sécurité - loader disparaît automatiquement après 3 secondes
        setTimeout(() => {
          setIsLoading(false);
          document.body.classList.add('app-loaded');
          console.log('✅ Application initialisée avec succès');
        }, 1000);
        
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Loading state simple
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-light text-yellow-600 mb-4 tracking-wider">
            CERCLE PRIVÉ
          </h1>
          <div className="w-8 h-8 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">
            Chargement en cours...
          </p>
        </div>
      </div>
    );
  }

  // Formulaire de connexion
  if (!isUserLoggedIn) {
    return (
      <>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1F2937',
              color: '#F9FAFB',
              border: '1px solid #374151'
            }
          }}
        />
      </>
    );
  }

  // Application principale
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <ConceptSection />
      <ServicesSection />
      <PropertyGallery />
      <RechercheSection />
      <VendreSection />
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F2937',
            color: '#F9FAFB',
            border: '1px solid #374151'
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#F9FAFB'
            }
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#F9FAFB'
            }
          }
        }}
      />
    </div>
  );
}

export default App;