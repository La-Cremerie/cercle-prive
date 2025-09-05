import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Chatbot from './components/Chatbot';

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
      <section id="concept" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
            <div className="space-y-6">
              <h2 className="text-3xl font-light text-yellow-600 tracking-wide">
                CONCEPT
              </h2>
              <h3 className="text-xl font-light text-gray-700 mb-6">
                l'immobilier haut gamme en off market
              </h3>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  nous avons fait le choix de la discrétion, de l'exclusivité et de l'excellence.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Nous sommes spécialisés dans la vente de biens immobiliers haut de gamme en off-market, une approche confidentielle réservée à une clientèle exigeante, en quête de biens rares, souvent inaccessibles via les canaux traditionnels.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Donnez de la puissance à votre capital, construisez un patrimoine solide. Notre approche d'investissement vous permet de transformer un capital financier existant en une rentabilité complémentaire, tout en créant un véritable effet de levier patrimonial.
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
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3"></span>
                    Revente optimisée pour maximiser la performance
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Nous conjuguons sécurité, sérénité et rendement afin de faire de chaque projet une véritable stratégie de valorisation patrimoniale.
                </p>
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

          {/* Section Off-Market étendue */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-2xl sm:text-3xl font-light text-gray-900 mb-6 tracking-wide">
                Qu'est-ce que l'Off-Market ?
              </h3>
              <div className="w-24 h-px bg-yellow-600 mx-auto mb-8"></div>
              <p className="text-lg text-gray-700 font-light leading-relaxed max-w-4xl mx-auto">
                L'immobilier "off-market" consiste à proposer des biens à la vente sans publicité publique ni diffusion sur les plateformes classiques. Ce mode de commercialisation, réservé à un cercle restreint d'acheteurs qualifiés, garantit une confidentialité totale et permet de préserver la rareté et la valeur des biens proposés.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Avantages vendeur */}
              <div className="space-y-6">
                <h4 className="text-xl font-medium text-yellow-600 mb-6">
                  Avantages pour le vendeur
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Discrétion totale</h5>
                      <p className="text-gray-600 text-sm">Pas de diffusion publique, protection de votre vie privée</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Moins de visites inutiles</h5>
                      <p className="text-gray-600 text-sm">Seuls les acheteurs qualifiés et sérieux</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Rapidité de transaction</h5>
                      <p className="text-gray-600 text-sm">Réseau d'acheteurs solvables et réactifs</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Valorisation optimale</h5>
                      <p className="text-gray-600 text-sm">Effet d'exclusivité pour un meilleur prix</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Avantages acheteur */}
              <div className="space-y-6">
                <h4 className="text-xl font-medium text-yellow-600 mb-6">
                  Avantages pour l'acheteur
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Accès à des biens rares</h5>
                      <p className="text-gray-600 text-sm">Propriétés exclusives jamais publiées</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Moins de concurrence</h5>
                      <p className="text-gray-600 text-sm">Éviter les surenchères du marché public</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Négociation directe</h5>
                      <p className="text-gray-600 text-sm">Discussions fluides avec des professionnels</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Investissement discret</h5>
                      <p className="text-gray-600 text-sm">Acquisitions confidentielles sans médiatisation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Services */}
      <section id="services" className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-extralight text-gray-900 tracking-wider mb-6 relative">
              ACCOMPAGNEMENT PERSONNALISÉ
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-yellow-600 to-transparent"></div>
            </h2>
            <p className="text-xl font-light text-gray-600 mt-8 tracking-wide">
              du 1<sup className="text-sm">er</sup> jour à la revente du bien
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-20">
            {[
              {
                icon: "📦",
                title: "Pack Immobilier Clé en Main",
                description: "Solution complète de A à Z : recherche, acquisition, rénovation et ameublement de votre bien d'exception"
              },
              {
                icon: "👑",
                title: "Conciergerie",
                description: "Services de conciergerie haut de gamme pour l'entretien et la gestion quotidienne de votre propriété"
              },
              {
                icon: "📐",
                title: "Architecture & Design",
                description: "Conception architecturale sur-mesure et design d'intérieur raffiné pour créer des espaces uniques"
              },
              {
                icon: "✨",
                title: "Services Personnalisés",
                description: "Prestations sur-mesure adaptées à vos besoins spécifiques et à votre style de vie d'exception"
              }
            ].map((service, index) => (
              <div key={index} className="group relative bg-white border border-gray-100 hover:border-yellow-600/30 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="p-10 lg:p-12">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 border-2 border-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">{service.icon}</span>
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

          {/* Section processus */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-extralight text-gray-900 mb-6 tracking-wider">
                Notre approche d'excellence
              </h3>
              <div className="w-20 h-px bg-yellow-600 mx-auto mb-8"></div>
              <p className="text-lg font-light text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Une méthodologie éprouvée pour transformer votre vision en réalité, 
                avec l'exigence et la discrétion que mérite votre projet d'exception.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
              {[
                {
                  step: "01",
                  title: "Analyse & Conseil",
                  description: "Étude approfondie de vos besoins et définition de votre projet sur-mesure"
                },
                {
                  step: "02", 
                  title: "Recherche & Acquisition",
                  description: "Sélection confidentielle et négociation du bien parfait selon vos critères"
                },
                {
                  step: "03",
                  title: "Conception & Réalisation",
                  description: "Architecture, design et coordination des travaux avec nos équipes d'exception"
                },
                {
                  step: "04",
                  title: "Livraison & Suivi",
                  description: "Remise de votre bien entièrement aménagé avec suivi post-livraison"
                }
              ].map((etape, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto relative">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-2 border-yellow-600">
                        <span className="text-xl font-extralight text-yellow-600 tracking-wider">
                          {etape.step}
                        </span>
                      </div>
                      {index < 3 && (
                        <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-yellow-200 to-transparent transform translate-x-2"></div>
                      )}
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-light text-gray-900 mb-3 tracking-wide">
                    {etape.title}
                  </h4>
                  <p className="text-sm font-light text-gray-600 leading-relaxed">
                    {etape.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Biens */}
      <section id="biens" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-yellow-600 tracking-wide mb-8">
              NOS BIENS D'EXCEPTION
            </h2>
            <div className="w-24 h-px bg-yellow-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-700 font-light leading-relaxed max-w-3xl mx-auto">
              Une sélection rigoureuse de propriétés uniques sur la Côte d'Azur
            </p>
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
                image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
                yield: '180 000 €/an',
                features: ['Vue mer panoramique', 'Piscine à débordement', 'Garage 3 voitures']
              },
              {
                name: 'Villa Azure',
                location: 'Saint-Tropez',
                price: '6 200 000 €',
                bedrooms: 8,
                bathrooms: 6,
                surface: 600,
                image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
                yield: '248 000 €/an',
                features: ['Domaine privé', 'Spa & Tennis', 'Héliport']
              },
              {
                name: 'Penthouse Élégance',
                location: 'Monaco, Monte-Carlo',
                price: '12 800 000 €',
                bedrooms: 4,
                bathrooms: 3,
                surface: 280,
                image: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800',
                yield: '512 000 €/an',
                features: ['Terrasse 200m²', 'Vue mer & ville', 'Concierge 24h/24']
              }
            ].map((property, index) => (
              <div key={index} className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Disponible
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    {property.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{property.location}</p>
                  <div className="text-xl font-medium text-yellow-600 mb-4">
                    {property.price}
                  </div>
                  <div className="mb-4">
                    <span className="text-sm text-green-600 font-medium">
                      Rendement : {property.yield}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {property.features.map((feature, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>🛏️ {property.bedrooms}</span>
                    <span>🚿 {property.bathrooms}</span>
                    <span>📐 {property.surface}m²</span>
                  </div>
                  <div className="mt-4">
                    <a
                      href="mailto:nicolas.c@lacremerie.fr"
                      className="w-full block text-center bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors text-sm font-medium"
                    >
                      Demander des informations
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section recherche de biens */}
          <div className="mt-20 text-center">
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-gray-50 to-white border border-gray-200 p-12">
              <h4 className="text-2xl font-extralight text-gray-900 mb-6 tracking-wider">
                Vous recherchez un bien spécifique ?
              </h4>
              <div className="w-16 h-px bg-yellow-600 mx-auto mb-8"></div>
              <p className="text-gray-600 font-light mb-8 leading-relaxed">
                Notre réseau exclusif nous permet d'accéder à des propriétés d'exception 
                qui ne sont jamais mises sur le marché public.
              </p>
              <a
                href="mailto:nicolas.c@lacremerie.fr"
                className="inline-block px-8 py-4 bg-yellow-600 text-white font-light tracking-wider hover:bg-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                NOUS CONTACTER
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section id="contact" className="py-20 lg:py-32 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-wide mb-8">
              CONTACT
            </h2>
            <div className="w-24 h-px bg-yellow-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-300 font-light leading-relaxed">
              Notre équipe d'experts est à votre disposition
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <div className="w-8 h-8 text-yellow-600 mx-auto mb-4">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Adresse</h3>
                <p className="text-gray-300">Côte d'Azur, France</p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <div className="w-8 h-8 text-yellow-600 mx-auto mb-4">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
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
                <div className="w-8 h-8 text-yellow-600 mx-auto mb-4">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
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

          {/* Formulaire de contact */}
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h3 className="text-xl font-medium text-white mb-6 text-center">
                Nous contacter
              </h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Votre nom"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white placeholder-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white placeholder-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <textarea
                  rows={4}
                  placeholder="Votre message"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white placeholder-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-yellow-600 text-white py-3 px-6 rounded-md hover:bg-yellow-700 transition-colors font-medium"
                >
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Toaster position="top-right" />
      <Chatbot />
    </div>
  );
}

export default App;