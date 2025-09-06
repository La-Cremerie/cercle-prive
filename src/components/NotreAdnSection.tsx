import React from 'react';
import { useState, useEffect } from 'react';

const NotreAdnSection: React.FC = () => {
  const [conceptImage, setConceptImage] = useState('https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800');

  useEffect(() => {
    // Charger l'image depuis le contenu du site
    const loadConceptImage = () => {
      const stored = localStorage.getItem('siteContent');
      if (stored) {
        const content = JSON.parse(stored);
        if (content.concept?.image) {
          setConceptImage(content.concept.image);
        }
      }
    };

    loadConceptImage();

    // Écouter les changements de contenu
    const handleContentChange = (event: CustomEvent) => {
      if (event.detail?.concept?.image) {
        setConceptImage(event.detail.concept.image);
      }
    };

    window.addEventListener('contentUpdated', handleContentChange as EventListener);
    
    return () => {
      window.removeEventListener('contentUpdated', handleContentChange as EventListener);
    };
  }, []);

  return (
    <section id="notre-adn" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          {/* Left Content */}
          <div className="space-y-8 lg:pr-8">
            <h2 className="text-3xl sm:text-4xl font-light text-yellow-600 tracking-wide">
              CONCEPT
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 text-base leading-relaxed font-light text-justify">
                Donnez de la puissance à votre capital, construisez un patrimoine solide.
              </p>
              <p className="text-gray-700 text-base leading-relaxed font-light text-justify">
                Notre approche d'investissement vous permet de transformer un capital financier existant en une rentabilité complémentaire, tout en créant un véritable effet de levier patrimonial. Nous sélectionnons des opportunités offrant la sécurité d'un actif tangible et le potentiel d'une forte valorisation.
              </p>
              <p className="text-gray-700 text-base leading-relaxed font-light text-justify">
                Grâce à notre conciergerie dédiée, vous bénéficiez d'un accompagnement exclusif couvrant l'intégralité du cycle d'investissement :
              </p>
              <ul className="space-y-2 text-gray-700 text-base leading-relaxed font-light">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                  Acquisition immobilière rigoureusement sélectionnée
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                  Travaux et ameublement conçus pour la valorisation
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                  Financement et structuration patrimoniale sur mesure
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                  Revente optimisée pour maximiser la performance
                </li>
              </ul>
              <p className="text-gray-700 text-base leading-relaxed font-light text-justify">
                Nous conjuguons sécurité, sérénité et rendement afin de faire de chaque projet une véritable stratégie de valorisation patrimoniale.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:pl-8">
            <img
              src={conceptImage}
              alt="Architecture moderne méditerranéenne"
              className="w-full h-80 lg:h-96 object-cover shadow-lg"
            />
          </div>
        </div>

        {/* Extended Content Section */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-2xl sm:text-3xl font-light text-gray-900 mb-6 tracking-wide">
              Pourquoi choisir le Off-Market ?
            </h3>
            <div className="w-24 h-px bg-yellow-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-700 font-light leading-relaxed max-w-4xl mx-auto">
              L'immobilier "off-market" consiste à proposer des biens à la vente sans publicité publique ni diffusion sur les plateformes classiques. Ce mode de commercialisation, réservé à un cercle restreint d'acheteurs qualifiés, garantit une confidentialité totale et permet de préserver la rareté et la valeur des biens proposés.
            </p>
          </div>

          <div className="mb-16">
            <h4 className="text-xl sm:text-2xl font-light text-gray-900 mb-12 text-center tracking-wide">
              Pourquoi choisir notre approche ?
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h5 className="text-lg font-medium text-gray-900 mb-2">Discrétion assurée</h5>
                    <p className="text-gray-600 font-light leading-relaxed">
                      Ni annonces publiques, ni visites inutiles. Vos projets restent entre de bonnes mains.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h5 className="text-lg font-medium text-gray-900 mb-2">Sélection exclusive</h5>
                    <p className="text-gray-600 font-light leading-relaxed">
                      Chaque bien que nous proposons a été rigoureusement sélectionné pour son caractère exceptionnel, son emplacement, et sa valeur patrimoniale.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h5 className="text-lg font-medium text-gray-900 mb-2">Patrimoine immobilier</h5>
                    <p className="text-gray-600 font-light leading-relaxed">
                      Construction et optimisation de votre patrimoine immobilier avec une vision long terme et des stratégies personnalisées.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h5 className="text-lg font-medium text-gray-900 mb-2">Accompagnement sur-mesure</h5>
                    <p className="text-gray-600 font-light leading-relaxed">
                      Que vous soyez vendeur ou acquéreur, vous bénéficiez d'un accompagnement personnalisé, discret et confidentiel à chaque étape.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h5 className="text-lg font-medium text-gray-900 mb-2">Réseau d'exception</h5>
                    <p className="text-gray-600 font-light leading-relaxed">
                      Grâce à notre réseau privé d'investisseurs, de propriétaires et de partenaires, nous créons des connexions pertinentes et efficaces, loin du marché saturé.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h5 className="text-lg font-medium text-gray-900 mb-2">Rentabilité</h5>
                    <p className="text-gray-600 font-light leading-relaxed">
                      Maximisation du rendement de vos investissements grâce à notre expertise du marché et nos opportunités exclusives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center bg-gray-50 py-12 px-8 lg:px-12">
            <h4 className="text-xl sm:text-2xl font-light text-gray-900 mb-6 tracking-wide">
              Une autre vision de l'immobilier de prestige
            </h4>
            <div className="w-24 h-px bg-yellow-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-700 font-light leading-relaxed max-w-3xl mx-auto italic">
              Nous croyons que l'immobilier de luxe ne se vend pas, il se transmet. C'est pourquoi nous privilégions une approche humaine, fondée sur la confiance, la confidentialité et l'excellence dans chaque détail.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotreAdnSection;