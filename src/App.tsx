import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('userLoggedIn') === 'true';
    } catch {
      return false;
    }
  });

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Concept />
      <Services />
      <Properties />
      <Contact />
      <Toaster position="top-right" />
    </div>
  );
}

// Composant de connexion ultra-simple
const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.nom || !formData.prenom) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(formData));
      onLogin();
    } catch (error) {
      console.error('Erreur:', error);
      onLogin(); // Continuer même en cas d'erreur localStorage
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light text-gray-900 tracking-wider">CERCLE PRIVÉ</h1>
          <p className="text-sm text-gray-600 font-light mt-2">
            Accès à l'immobilier de prestige
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 transition-colors"
          >
            Accéder au site
          </button>
        </form>
      </div>
    </div>
  );
};

// Header simple
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-light text-gray-900 tracking-wider">CERCLE PRIVÉ</h1>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#concept" className="text-sm font-light text-gray-700 hover:text-yellow-600 transition-colors">CONCEPT</a>
            <a href="#services" className="text-sm font-light text-gray-700 hover:text-yellow-600 transition-colors">SERVICES</a>
            <a href="#biens" className="text-sm font-light text-gray-700 hover:text-yellow-600 transition-colors">BIENS</a>
            <a href="#contact" className="text-sm font-light text-gray-700 hover:text-yellow-600 transition-colors">CONTACT</a>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <a href="#concept" onClick={() => setIsMenuOpen(false)} className="block text-gray-700">CONCEPT</a>
              <a href="#services" onClick={() => setIsMenuOpen(false)} className="block text-gray-700">SERVICES</a>
              <a href="#biens" onClick={() => setIsMenuOpen(false)} className="block text-gray-700">BIENS</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block text-gray-700">CONTACT</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Hero Section simple
const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gray-900">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920)'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-light text-white mb-8 leading-tight">
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

// Section Concept simple
const Concept: React.FC = () => {
  return (
    <section id="concept" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-light text-yellow-600 tracking-wide">CONCEPT</h2>
            <p className="text-gray-700 leading-relaxed">
              Nous avons fait le choix de la discrétion, de l'exclusivité et de l'excellence. 
              Spécialisés dans la vente de biens immobiliers haut de gamme en off-market, 
              une approche confidentielle réservée à une clientèle exigeante.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Notre réseau privé d'investisseurs et de propriétaires nous permet de créer 
              des connexions pertinentes et efficaces, loin du marché saturé.
            </p>
          </div>
          <div>
            <img
              src="https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Architecture moderne"
              className="w-full h-80 object-cover shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Section Services simple
const Services: React.FC = () => {
  const services = [
    {
      title: "Acquisition",
      description: "Conseil et accompagnement pour l'acquisition de biens d'exception"
    },
    {
      title: "Vente",
      description: "Commercialisation confidentielle de votre propriété de prestige"
    },
    {
      title: "Investissement",
      description: "Stratégies d'investissement immobilier personnalisées"
    },
    {
      title: "Conciergerie",
      description: "Services haut de gamme pour la gestion de votre patrimoine"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-yellow-600 tracking-wide mb-8">NOS SERVICES</h2>
          <p className="text-lg text-gray-700 font-light">
            Un accompagnement personnalisé pour tous vos projets immobiliers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-medium text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Section Biens simple
const Properties: React.FC = () => {
  const properties = [
    {
      name: 'Villa Horizon',
      location: 'Cannes',
      price: '4 500 000 €',
      image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: 'Villa Azure',
      location: 'Saint-Tropez',
      price: '6 200 000 €',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: 'Penthouse Élégance',
      location: 'Monaco',
      price: '12 800 000 €',
      image: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  return (
    <section id="biens" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-yellow-600 tracking-wide mb-8">NOS BIENS D'EXCEPTION</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-2">{property.name}</h3>
                <p className="text-gray-600 mb-4">{property.location}</p>
                <div className="text-2xl font-medium text-yellow-600">{property.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Section Contact simple
const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-light text-white mb-8 tracking-wide">CONTACTEZ-NOUS</h2>
        <p className="text-lg text-gray-300 mb-12">
          Notre équipe d'experts est à votre disposition
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              📞
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Téléphone</h3>
            <a href="tel:+33652913556" className="text-gray-300 hover:text-white transition-colors">
              +33 6 52 91 35 56
            </a>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              ✉️
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Email</h3>
            <a href="mailto:nicolas.c@lacremerie.fr" className="text-gray-300 hover:text-white transition-colors">
              nicolas.c@lacremerie.fr
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default App;