import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader2, AlertTriangle, RefreshCw, Home, Menu, X, User, Phone, Mail, Send, CheckCircle, MapPin, Bed, Bath, Square, Eye, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Types simplifiés
interface UserRegistration {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  created_at?: string;
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

// Composant de connexion intégré
const LoginForm: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: ''
  });
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Simulation simple
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(formData));
      
      toast.success('Connexion réussie !');
      onLoginSuccess();
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light text-gray-900 tracking-wider">
            CERCLE PRIVÉ
          </h1>
          <p className="text-sm text-gray-600 font-light mt-2">
            Bienvenue dans votre espace dédié à l'immobilier de prestige
          </p>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              !isLogin ? 'bg-yellow-600 text-white' : 'text-gray-600'
            }`}
          >
            Inscription
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              isLogin ? 'bg-yellow-600 text-white' : 'text-gray-600'
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

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Connexion...' : 'Accéder au site'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Navigation intégrée
const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-light text-gray-900 tracking-wider">
              CERCLE PRIVÉ
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a href="#concept" className="text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
              CONCEPT
            </a>
            <a href="#services" className="text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
              NOS SERVICES
            </a>
            <a href="#recherche" className="text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
              RECHERCHE
            </a>
            <a href="#biens" className="text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
              ACHETER
            </a>
            <a href="#vendre" className="text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
              VENDRE
            </a>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-amber-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <a href="#concept" onClick={() => setIsMenuOpen(false)} className="block text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
                CONCEPT
              </a>
              <a href="#services" onClick={() => setIsMenuOpen(false)} className="block text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
                NOS SERVICES
              </a>
              <a href="#recherche" onClick={() => setIsMenuOpen(false)} className="block text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
                RECHERCHE
              </a>
              <a href="#biens" onClick={() => setIsMenuOpen(false)} className="block text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
                ACHETER
              </a>
              <a href="#vendre" onClick={() => setIsMenuOpen(false)} className="block text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
                VENDRE
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Hero Section intégrée
const HeroSection: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920)'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-8 leading-tight">
          l'excellence immobilière en toute discrétion
        </h1>
        
        <a 
          href="mailto:nicolas.c@lacremerie.fr"
          className="inline-block border border-white text-white px-8 py-3 text-sm font-light tracking-wider hover:bg-white hover:text-gray-900 transition-all duration-300"
        >
          Entrer en relation
        </a>
      </motion.div>
    </section>
  );
};

// Section Concept intégrée
const ConceptSection: React.FC = () => {
  return (
    <section id="concept" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 lg:pr-8">
            <h2 className="text-3xl sm:text-4xl font-light text-yellow-600 tracking-wide">
              CONCEPT
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 text-base leading-relaxed font-light">
                Donnez de la puissance à votre capital, construisez un patrimoine solide.
              </p>
              <p className="text-gray-700 text-base leading-relaxed font-light">
                Notre approche d'investissement vous permet de transformer un capital financier existant en une rentabilité complémentaire, tout en créant un véritable effet de levier patrimonial.
              </p>
            </div>
          </div>

          <div className="relative lg:pl-8">
            <img
              src="https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Architecture moderne"
              className="w-full h-80 lg:h-96 object-cover shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Section Services intégrée
const ServicesSection: React.FC = () => {
  const services = [
    {
      title: "Pack Immobilier Clé en Main",
      description: "Solution complète de A à Z : recherche, acquisition, rénovation et ameublement"
    },
    {
      title: "Conciergerie",
      description: "Services de conciergerie haut de gamme pour l'entretien de votre propriété"
    },
    {
      title: "Architecture & Design",
      description: "Conception architecturale sur-mesure et design d'intérieur raffiné"
    },
    {
      title: "Services Personnalisés",
      description: "Prestations sur-mesure adaptées à vos besoins spécifiques"
    }
  ];

  return (
    <section id="services" className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-extralight text-gray-900 tracking-wider mb-6">
            ACCOMPAGNEMENT PERSONNALISÉ
          </h2>
          <p className="text-xl font-light text-gray-600 mt-8 tracking-wide">
            du 1<sup className="text-sm">er</sup> jour à la revente du bien
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg p-10 lg:p-12 border border-gray-100 hover:border-yellow-600/30 transition-all duration-500">
              <h3 className="text-xl font-light text-gray-900 tracking-wide leading-tight mb-4">
                {service.title}
              </h3>
              <div className="w-12 h-px bg-yellow-600/30 mb-4"></div>
              <p className="text-gray-600 font-light leading-relaxed text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Galerie de biens intégrée
const PropertyGallery: React.FC = () => {
  const properties: Property[] = [
    {
      id: '1',
      name: 'Villa Horizon',
      location: 'Cannes, Côte d\'Azur',
      price: '4 500 000 €',
      bedrooms: 6,
      bathrooms: 4,
      surface: 450,
      images: ['https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'],
      description: 'Villa d\'exception avec vue panoramique sur la mer Méditerranée.',
      features: ['Piscine à débordement', 'Vue mer panoramique', 'Garage 3 voitures'],
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
      images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'],
      description: 'Propriété d\'exception dans un domaine privé sécurisé.',
      features: ['Domaine privé', 'Spa privé', 'Court de tennis'],
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
      images: ['https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800'],
      description: 'Penthouse exceptionnel au cœur de Monaco.',
      features: ['Terrasse 200m²', 'Vue mer et ville', 'Concierge 24h/24'],
      type: 'penthouse',
      status: 'reserve',
      yield: 512000
    }
  ];

  return (
    <section id="biens" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-light text-yellow-600 tracking-wide mb-8">
            ACHETER
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative overflow-hidden">
                <img
                  src={property.images[0]}
                  alt={property.name}
                  className="w-full h-64 object-cover"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Section Recherche intégrée
const RechercheSection: React.FC = () => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    budget: '',
    localisation: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Recherche envoyée avec succès !');
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        budget: '',
        localisation: '',
        message: ''
      });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="recherche" className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-light text-yellow-600 tracking-wide mb-8">
            Trouvez votre bien d'exception
          </h2>
          <div className="w-24 h-px bg-yellow-600 mx-auto mb-8"></div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget maximum</label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                  placeholder="2 500 000 €"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Localisation souhaitée</label>
                <input
                  type="text"
                  value={formData.localisation}
                  onChange={(e) => setFormData(prev => ({ ...prev, localisation: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                  placeholder="Cannes, Saint-Tropez..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                placeholder="Décrivez votre projet immobilier..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-600 text-white py-3 px-6 rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Envoi...' : 'Envoyer ma recherche'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

// Section Vendre intégrée
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Demande de vente envoyée !');
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
    } catch (error) {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="vendre" className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-light text-yellow-600 tracking-wide mb-8">
            VENDRE VOTRE BIEN
          </h2>
          <div className="w-24 h-px bg-yellow-600 mx-auto mb-8"></div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de bien *</label>
                  <select
                    value={formData.typeVente}
                    onChange={(e) => setFormData(prev => ({ ...prev, typeVente: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                    required
                  >
                    <option value="villa">Villa</option>
                    <option value="appartement">Appartement</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="maison">Maison</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Localisation *</label>
                  <input
                    type="text"
                    value={formData.localisation}
                    onChange={(e) => setFormData(prev => ({ ...prev, localisation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                    placeholder="Cannes, Saint-Tropez..."
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prix estimé</label>
                <input
                  type="text"
                  value={formData.prixEstime}
                  onChange={(e) => setFormData(prev => ({ ...prev, prixEstime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                  placeholder="2 500 000 €"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                  placeholder="Décrivez votre bien..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-600 text-white py-3 px-6 rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Envoi...' : 'Demander une estimation'}
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Vérification simple et rapide
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    if (userLoggedIn === 'true') {
      setIsLoggedIn(true);
    }
    setIsInitializing(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Écran de chargement minimal
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-yellow-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-light text-white tracking-wider">CERCLE PRIVÉ</h2>
        </div>
      </div>
    );
  }

  // Page de connexion
  if (!isLoggedIn) {
    return (
      <>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Site principal
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <ConceptSection />
      <ServicesSection />
      <PropertyGallery />
      <RechercheSection />
      <VendreSection />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;