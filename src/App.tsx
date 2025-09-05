import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader2, Home } from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérification simple et rapide
    const checkLogin = () => {
      try {
        const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        setIsLoggedIn(userLoggedIn);
      } catch (error) {
        console.warn('Erreur localStorage:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Timeout de sécurité pour éviter le blocage
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    checkLogin();
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Écran de chargement simple avec timeout
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-yellow-600 animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-light text-white tracking-wider">CERCLE PRIVÉ</h2>
        </div>
      </div>
    );
  }

  // Formulaire de connexion si pas connecté
  if (!isLoggedIn) {
    return (
      <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
    );
  }

  // Site principal
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navigation />
      <HeroSection />
      <NotreAdnSection />
      <ServicesSection />
      <OffMarketSection />
      <RechercheSection />
      <PropertyGallery />
      <VendreSection />
      <PWAInstallPrompt />
      <Toaster position="top-right" />
    </div>
  );
}

// Composant LoginForm intégré pour éviter les problèmes d'import
const LoginForm = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation d'inscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(formData));
      
      onLoginSuccess();
    } catch (error) {
      alert('Erreur lors de l\'inscription');
    } finally {
      setIsSubmitting(false);
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
            Accès à l'immobilier de prestige
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prénom *
            </label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
          </div>
            />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone *
            </label>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
          </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Inscription...' : 'Accéder au site'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Composants principaux intégrés pour éviter les problèmes d'import
const Navigation = () => {
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
              SERVICES
            </a>
            <a href="#biens" className="text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
              BIENS
            </a>
            <a href="#recherche" className="text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
              RECHERCHE
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
              {isMenuOpen ? '✕' : '☰'}
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
                SERVICES
              </a>
              <a href="#biens" onClick={() => setIsMenuOpen(false)} className="block text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
                BIENS
              </a>
              <a href="#recherche" onClick={() => setIsMenuOpen(false)} className="block text-sm font-light text-gray-700 hover:text-amber-600 transition-colors tracking-wide">
                RECHERCHE
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

const HeroSection = () => {
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

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-8 leading-tight">
          l'excellence immobilière en toute discrétion
        </h1>
        
        <a 
          href="mailto:nicolas.c@lacremerie.fr"
          className="inline-block border border-white text-white px-8 py-3 text-sm font-light tracking-wider hover:bg-white hover:text-gray-900 transition-all duration-300"
        >
          Entrer en relation
        </a>
      </div>
    </section>
  );
};

const NotreAdnSection = () => {
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
                nous avons fait le choix de la discrétion, de l'exclusivité et de l'excellence.
              </p>
              <p className="text-gray-700 text-base leading-relaxed font-light">
                Nous sommes spécialisés dans la vente de biens immobiliers haut de gamme en off-market, 
                une approche confidentielle réservée à une clientèle exigeante.
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

const ServicesSection = () => {
  const services = [
    {
      title: "Acquisition",
      description: "Conseil et accompagnement personnalisé pour l'acquisition de votre bien d'exception"
    },
    {
      title: "Architecture & Design", 
      description: "Conception architecturale sur-mesure et design d'intérieur raffiné"
    },
    {
      title: "Suivi de Chantier",
      description: "Coordination et supervision de tous les travaux avec nos équipes d'exception"
    },
    {
      title: "Ameublement",
      description: "Décoration et ameublement haut de gamme pour sublimer votre propriété"
    }
  ];

  return (
    <section id="services" className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-extralight text-gray-900 tracking-wider mb-6">
            ACCOMPAGNEMENT PERSONNALISÉ
          </h2>
          <p className="text-xl font-light text-gray-600 mt-8 tracking-wide">
            du 1<sup>er</sup> jour à la revente du bien
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <div key={index} className="group relative bg-white border border-gray-100 hover:border-yellow-600/30 transition-all duration-500 overflow-hidden">
              <div className="p-10 lg:p-12">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 border-2 border-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Home className="w-8 h-8 text-yellow-600" />
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

const OffMarketSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-light text-white mb-8 tracking-wide">
            Qu'est-ce que l'Off-Market ?
          </h2>
          <div className="w-24 h-px bg-amber-500 mx-auto mb-12"></div>
          <p className="text-lg text-gray-300 font-light leading-relaxed max-w-4xl mx-auto">
            L'immobilier "off-market" consiste à proposer des biens à la vente sans publicité publique. 
            Ce mode de commercialisation garantit une confidentialité totale et préserve la valeur des biens.
          </p>
        </div>
      </div>
    </section>
  );
};

const RechercheSection = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    budget: '',
    localisation: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Recherche enregistrée ! Nous vous contacterons.');
  };

  return (
    <section id="recherche" className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-light text-yellow-600 tracking-wide mb-8">
            RECHERCHE PERSONNALISÉE
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Votre nom"
                value={formData.nom}
                onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                required
              />
              <input
                type="email"
                placeholder="Votre email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                required
              />
              <input
                type="text"
                placeholder="Budget maximum"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="text"
                placeholder="Localisation souhaitée"
                value={formData.localisation}
                onChange={(e) => setFormData(prev => ({ ...prev, localisation: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-600 text-white py-3 px-6 rounded-md hover:bg-yellow-700 transition-colors font-medium"
            >
              Envoyer ma recherche
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const PropertyGallery = () => {
  const properties = [
    {
      id: '1',
      name: 'Villa Horizon',
      location: 'Cannes, Côte d\'Azur',
      price: '4 500 000 €',
      image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '2',
      name: 'Villa Azure',
      location: 'Saint-Tropez',
      price: '6 200 000 €',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '3',
      name: 'Penthouse Élégance',
      location: 'Monaco, Monte-Carlo',
      price: '12 800 000 €',
      image: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  return (
    <section id="biens" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-light text-yellow-600 tracking-wide mb-8">
            BIENS D'EXCEPTION
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-light text-gray-900 mb-2">
                  {property.name}
                </h3>
                <p className="text-gray-600 mb-4">{property.location}</p>
                <div className="text-xl font-medium text-yellow-600">
                  {property.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const VendreSection = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    typeVente: 'villa',
    localisation: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Demande d\'estimation envoyée !');
  };

  return (
    <section id="vendre" className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-light text-yellow-600 tracking-wide mb-8">
            VENDRE VOTRE BIEN
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Votre nom"
                value={formData.nom}
                onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                required
              />
              <input
                type="email"
                placeholder="Votre email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                required
              />
              <input
                type="tel"
                placeholder="Votre téléphone"
                value={formData.telephone}
                onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                required
              />
              <select
                value={formData.typeVente}
                onChange={(e) => setFormData(prev => ({ ...prev, typeVente: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
              >
                <option value="villa">Villa</option>
                <option value="appartement">Appartement</option>
                <option value="penthouse">Penthouse</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Localisation de votre bien"
              value={formData.localisation}
              onChange={(e) => setFormData(prev => ({ ...prev, localisation: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
              required
            />

            <button
              type="submit"
              className="w-full bg-yellow-600 text-white py-3 px-6 rounded-md hover:bg-yellow-700 transition-colors font-medium"
            >
              Demander une estimation
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const PWAInstallPrompt = () => {
  return null; // Simplifié pour éviter les erreurs
};

export default App;