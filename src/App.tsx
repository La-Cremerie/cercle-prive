import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier le statut de connexion
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
    setIsLoading(false);
  }, []);

  // Affichage de debug pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Formulaire de connexion simple
  if (!isLoggedIn) {
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

          <form onSubmit={(e) => {
            e.preventDefault();
            localStorage.setItem('userLoggedIn', 'true');
            setIsLoggedIn(true);
          }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
                placeholder="Votre mot de passe"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 transition-colors font-medium"
            >
              Accéder au site
            </button>
          </form>
        </div>
        <Toaster position="top-right" />
      </div>
    );
  }

  // Site principal - Version ultra-simplifiée
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-light text-gray-900 tracking-wider">
              CERCLE PRIVÉ
            </h1>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#concept" className="text-sm text-gray-700 hover:text-yellow-600 transition-colors">
                CONCEPT
              </a>
              <a href="#services" className="text-sm text-gray-700 hover:text-yellow-600 transition-colors">
                SERVICES
              </a>
              <a href="#biens" className="text-sm text-gray-700 hover:text-yellow-600 transition-colors">
                BIENS
              </a>
              <a href="#contact" className="text-sm text-gray-700 hover:text-yellow-600 transition-colors">
                CONTACT
              </a>
              <button
                onClick={() => {
                  localStorage.removeItem('userLoggedIn');
                  setIsLoggedIn(false);
                }}
                className="text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                DÉCONNEXION
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920)'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-8 leading-tight">
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

      {/* Section Concept */}
      <section id="concept" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-light text-yellow-600 tracking-wide">
                CONCEPT
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Donnez de la puissance à votre capital, construisez un patrimoine solide.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Notre approche d'investissement vous permet de transformer un capital financier existant 
                  en une rentabilité complémentaire, tout en créant un véritable effet de levier patrimonial.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3"></span>
                    Acquisition immobilière rigoureusement sélectionnée
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3"></span>
                    Travaux et ameublement pensés pour la valorisation
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3"></span>
                    Financement et structuration patrimoniale sur mesure
                  </li>
                </ul>
              </div>
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

      {/* Section Services */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 tracking-wide mb-8">
              ACCOMPAGNEMENT PERSONNALISÉ
            </h2>
            <p className="text-xl font-light text-gray-600">
              du 1er jour à la revente du bien
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
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
                description: "Prestations sur-mesure adaptées à votre style de vie d'exception"
              }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-100 p-8">
                <div className="w-12 h-12 border-2 border-yellow-600 rounded-full flex items-center justify-center mb-6">
                  <span className="text-yellow-600 text-xl">📦</span>
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Biens */}
      <section id="biens" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-yellow-600 tracking-wide mb-8">
              NOS BIENS D'EXCEPTION
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Villa Horizon',
                location: 'Cannes, Côte d\'Azur',
                price: '4 500 000 €',
                bedrooms: 6,
                bathrooms: 4,
                surface: 450,
                image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'
              },
              {
                name: 'Villa Azure',
                location: 'Saint-Tropez',
                price: '6 200 000 €',
                bedrooms: 8,
                bathrooms: 6,
                surface: 600,
                image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
              },
              {
                name: 'Penthouse Élégance',
                location: 'Monaco, Monte-Carlo',
                price: '12 800 000 €',
                bedrooms: 4,
                bathrooms: 3,
                surface: 280,
                image: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800'
              }
            ].map((property, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {property.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{property.location}</p>
                  <div className="text-xl font-medium text-yellow-600 mb-4">
                    {property.price}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>🛏️ {property.bedrooms}</span>
                    <span>🚿 {property.bathrooms}</span>
                    <span>📐 {property.surface}m²</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-white tracking-wide mb-8">
              CONTACT
            </h2>
            <div className="w-24 h-px bg-yellow-600 mx-auto mb-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-xl font-medium text-white mb-2">Adresse</h3>
                <p className="text-gray-300">Côte d'Azur, France</p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <div className="text-4xl mb-4">📞</div>
                <h3 className="text-xl font-medium text-white mb-2">Téléphone</h3>
                <a 
                  href="tel:+33652913556" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  +33 6 52 91 35 56
                </a>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <div className="text-4xl mb-4">✉️</div>
                <h3 className="text-xl font-medium text-white mb-2">Email</h3>
                <a 
                  href="mailto:nicolas.c@lacremerie.fr" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  nicolas.c@lacremerie.fr
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;