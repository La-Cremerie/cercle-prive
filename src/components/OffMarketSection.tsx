import React from 'react';

const OffMarketSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-light text-white mb-8 tracking-wide">
            Qu'est-ce que l'Off-Market ?
          </h2>
          <div className="w-24 h-px bg-blue-400 mx-auto mb-12"></div>
          <p className="text-lg text-gray-300 font-light leading-relaxed max-w-4xl mx-auto">
            L'immobilier "off-market" consiste à proposer des biens à la vente sans publicité publique ni diffusion sur les plateformes classiques. Ce mode de commercialisation, réservé à un cercle restreint d'acheteurs qualifiés, garantit une confidentialité totale et permet de préserver la rareté et la valeur des biens proposés.
          </p>
        </div>

        {/* Main Content */}
        <div className="mb-20">
          <h3 className="text-2xl sm:text-3xl font-light text-white mb-16 text-center tracking-wide">
            Pourquoi choisir le off-market
          </h3>
          
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 relative">
            {/* Vertical Separator for Desktop */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-blue-400/30 transform -translate-x-1/2"></div>
            
            {/* Left Column - Avantages pour le vendeur */}
            <div className="space-y-8">
              <h4 className="text-xl sm:text-2xl font-light text-blue-300 mb-8 tracking-wide">
                Avantages pour le vendeur
              </h4>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <h5 className="text-lg font-medium text-white">
                    Discrétion totale
                  </h5>
                  <div className="space-y-2">
                    <p className="text-gray-300 font-light leading-relaxed flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Pas de diffusion publique de l'annonce, des photos ou du prix.
                    </p>
                    <p className="text-gray-300 font-light leading-relaxed flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Idéal pour les vendeurs souhaitant protéger leur vie privée (personnalités publiques, chefs d'entreprise, etc.).
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-lg font-medium text-white">
                    Moins de visites inutiles
                  </h5>
                  <div className="space-y-2">
                    <p className="text-gray-300 font-light leading-relaxed flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Seuls les acheteurs réellement intéressés et qualifiés sont contactés.
                    </p>
                    <p className="text-gray-300 font-light leading-relaxed flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Cela réduit le temps et les efforts liés aux visites.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-lg font-medium text-white">
                    Rapidité de transaction
                  </h5>
                  <div className="space-y-2">
                    <p className="text-gray-300 font-light leading-relaxed flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Les biens off-market sont souvent proposés à un réseau d'acheteurs solvables et réactifs.
                    </p>
                    <p className="text-gray-300 font-light leading-relaxed flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Cela peut accélérer la vente, sans attendre de longs mois sur le marché public.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-lg font-medium text-white">
                    Position de force sur le prix
                  </h5>
                  <div className="space-y-2">
                    <p className="text-gray-300 font-light leading-relaxed flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Le bien étant rare et confidentiel, il peut susciter un effet d'exclusivité.
                    </p>
                    <p className="text-gray-300 font-light leading-relaxed flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Cela permet parfois de vendre à un meilleur prix que sur le marché ouvert.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-lg font-medium text-white">
                    Préservation de la valeur du bien
                  </h5>
                  <div>
                    <p className="text-gray-300 font-light leading-relaxed flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Pas de traces visibles sur les plateformes, ce qui évite qu'un bien soit "brûlé" s\'il reste trop longtemps en ligne.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Avantages pour l'acheteur */}
            <div className="space-y-8">
              <h4 className="text-xl sm:text-2xl font-light text-blue-300 mb-8 tracking-wide">
                Avantages pour l'acheteur
              </h4>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <h5 className="text-lg font-medium text-white">
                    Accès à des biens rares ou exclusifs
                  </h5>
                  <div className="space-y-2">
                    <p className="text-gray-300 font-light leading-relaxed flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Certains biens de prestige ou très recherchés ne sont jamais publiés.
                    </p>
                    <p className="text-gray-300 font-light leading-relaxed flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      L'acheteur peut découvrir des opportunités hors du radar du grand public.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-lg font-medium text-white">
                    Moins de concurrence
                  </h5>
                  <div>
                    <p className="text-gray-300 font-light leading-relaxed flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Les biens off-market sont moins exposés, donc moins soumis à une forte demande ou à des surenchères.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-lg font-medium text-white">
                    Négociation plus directe
                  </h5>
                  <div className="space-y-2">
                    <p className="text-gray-300 font-light leading-relaxed flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Les discussions sont souvent plus fluides, avec des interlocuteurs ciblés et professionnels.
                    </p>
                    <p className="text-gray-300 font-light leading-relaxed flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Cela peut mener à des accords sur mesure (conditions, délais, etc.).
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-lg font-medium text-white">
                    Opportunité d'investissement discrète
                  </h5>
                  <div>
                    <p className="text-gray-300 font-light leading-relaxed flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Intéressant pour les investisseurs souhaitant faire des acquisitions discrètes, sans médiatisation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Separator for Mobile */}
          <div className="lg:hidden w-full h-px bg-amber-500/30 my-12"></div>
        </div>

        {/* Section "Pourquoi choisir notre approche ?" */}
        <div className="max-w-5xl mx-auto mt-20">
          <div className="text-center mb-16">
            <h3 className="text-2xl sm:text-3xl font-light text-white mb-6 tracking-wide">
              Pourquoi choisir notre approche ?
            </h3>
            <div className="w-24 h-px bg-blue-400 mx-auto mb-8"></div>
          </div>

          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h5 className="text-lg font-medium text-white mb-2">Discrétion assurée</h5>
                    <p className="text-gray-300 font-light leading-relaxed">
                      Ni annonces publiques, ni visites inutiles. Vos projets restent entre de bonnes mains.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h5 className="text-lg font-medium text-white mb-2">Sélection exclusive</h5>
                    <p className="text-gray-300 font-light leading-relaxed">
                      Chaque bien que nous proposons a été rigoureusement sélectionné pour son caractère exceptionnel, son emplacement, et sa valeur patrimoniale.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h5 className="text-lg font-medium text-white mb-2">Patrimoine immobilier</h5>
                    <p className="text-gray-300 font-light leading-relaxed">
                      Construction et optimisation de votre patrimoine immobilier avec une vision long terme et des stratégies personnalisées.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h5 className="text-lg font-medium text-white mb-2">Accompagnement sur-mesure</h5>
                    <p className="text-gray-300 font-light leading-relaxed">
                      Que vous soyez vendeur ou acquéreur, vous bénéficiez d'un accompagnement personnalisé, discret et confidentiel à chaque étape.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h5 className="text-lg font-medium text-white mb-2">Réseau d'exception</h5>
                    <p className="text-gray-300 font-light leading-relaxed">
                      Grâce à notre réseau privé d'investisseurs, de propriétaires et de partenaires, nous créons des connexions pertinentes et efficaces, loin du marché saturé.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h5 className="text-lg font-medium text-white mb-2">Rentabilité</h5>
                    <p className="text-gray-300 font-light leading-relaxed">
                      Maximisation du rendement de vos investissements grâce à notre expertise du marché et nos opportunités exclusives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center bg-gray-800 py-12 px-8 lg:px-12 rounded-lg">
            <h4 className="text-xl sm:text-2xl font-light text-white mb-6 tracking-wide">
              Une autre vision de l'immobilier de prestige
            </h4>
            <div className="w-24 h-px bg-blue-400 mx-auto mb-6"></div>
            <p className="text-lg text-gray-300 font-light leading-relaxed max-w-3xl mx-auto italic">
              Nous croyons que l'immobilier de luxe ne se vend pas, il se transmet. C'est pourquoi nous privilégions une approche humaine, fondée sur la confiance, la confidentialité et l'excellence dans chaque détail.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffMarketSection;