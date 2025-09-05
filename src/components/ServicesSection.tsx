import React from 'react';
import { Package, Ruler, Sofa, Wrench, Crown, Sparkles } from 'lucide-react';

export default function ServicesSection() {

  const services = [
    {
      icon: Package,
      title: "Pack Immobilier Clé en Main",
      description: "Solution complète de A à Z : recherche, acquisition, rénovation et ameublement de votre bien d'exception"
    },
    {
      icon: Crown,
      title: "Conciergerie",
      description: "Services de conciergerie haut de gamme pour l'entretien et la gestion quotidienne de votre propriété"
    },
    {
      icon: Ruler,
      title: "Architecture & Design",
      description: "Conception architecturale sur-mesure et design d'intérieur raffiné pour créer des espaces uniques"
    },
    {
      icon: Sparkles,
      title: "Services Personnalisés",
      description: "Prestations sur-mesure adaptées à vos besoins spécifiques et à votre style de vie d'exception"
    }
  ];

  return (
    <section id="nos-services" className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header avec design luxueux */}
        <div className="text-center mb-20">
          <div className="inline-block">
            <h2 className="text-4xl sm:text-5xl font-extralight text-gray-900 dark:text-white tracking-wider mb-6 relative">
              ACCOMPAGNEMENT PERSONNALISÉ
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-yellow-600 to-transparent"></div>
            </h2>
          </div>
          <p className="text-xl font-light text-gray-600 dark:text-gray-400 mt-8 tracking-wide">
            du 1<sup className="text-sm">er</sup> jour à la revente du bien
          </p>
        </div>

        {/* Services Grid avec design luxe */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-20">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group relative bg-white dark:bg-gray-800 rounded-none border border-gray-100 dark:border-gray-700 hover:border-yellow-600/30 dark:hover:border-yellow-600/30 transition-all duration-500 overflow-hidden"
            >
              {/* Ligne dorée subtile */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="p-10 lg:p-12">
                <div className="flex items-start space-x-6">
                  {/* Icône avec design luxe */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 border-2 border-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                  
                  {/* Contenu */}
                  <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-light text-gray-900 dark:text-white tracking-wide leading-tight">
                      {service.title}
                    </h3>
                    <div className="w-12 h-px bg-yellow-600/30"></div>
                    <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed text-sm">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section processus avec design épuré */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-extralight text-gray-900 dark:text-white mb-6 tracking-wider">
              Notre approche d'excellence
            </h3>
            <div className="w-20 h-px bg-yellow-600 mx-auto mb-8"></div>
            <p className="text-lg font-light text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
              Une méthodologie éprouvée pour transformer votre vision en réalité, 
              avec l'exigence et la discrétion que mérite votre projet d'exception.
            </p>
          </div>

          {/* Processus en 4 étapes avec design minimaliste */}
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
                {/* Numéro avec design luxe */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto relative">
                    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-yellow-600 dark:border-yellow-500">
                      <span className="text-xl font-extralight text-yellow-600 tracking-wider">
                        {etape.step}
                      </span>
                    </div>
                    {/* Ligne de connexion (sauf pour le dernier) */}
                    {index < 3 && (
                      <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-yellow-200 to-transparent dark:from-yellow-800/30 dark:to-transparent transform translate-x-2"></div>
                    )}
                  </div>
                </div>
                
                <h4 className="text-lg font-light text-gray-900 dark:text-white mb-3 tracking-wide">
                  {etape.title}
                </h4>
                <p className="text-sm font-light text-gray-600 dark:text-gray-400 leading-relaxed">
                  {etape.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action luxueux */}
        <div className="mt-20 text-center">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-none border border-gray-200 dark:border-gray-600 p-12">
            <h4 className="text-2xl font-extralight text-gray-900 dark:text-white mb-6 tracking-wider">
              Prêt à concrétiser votre projet ?
            </h4>
            <div className="w-16 h-px bg-yellow-600 mx-auto mb-8"></div>
            <p className="text-gray-600 dark:text-gray-400 font-light mb-8 leading-relaxed">
              Contactez-nous pour une consultation personnalisée et découvrez comment nous pouvons 
              transformer votre vision en réalité d'exception.
            </p>
            <a
              href="mailto:nicolas.c@lacremerie.fr"
              className="inline-block px-8 py-4 bg-yellow-600 text-white font-light tracking-wider hover:bg-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              PLANIFIER UNE CONSULTATION
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}