import React from 'react';
import { motion } from 'framer-motion';
import { Package, Crown, Ruler, Sparkles } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Package,
      title: "Développement Immobilier",
      description: "Création de projets immobiliers modernes, performants et sécurisés. Technologies de pointe pour une rentabilité optimale.",
      features: [
        "Projets immobiliers professionnels",
        "Investissements sur-mesure", 
        "Optimisation fiscale intégrée",
        "Performance et sécurité garanties"
      ],
      price: "À partir de 2 500 000€",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
      icon: Crown,
      title: "Investissement Prestige",
      description: "Portefeuilles immobiliers haut de gamme avec gestion complète des acquisitions, optimisation fiscale et tableau de bord intuitif.",
      features: [
        "Plateforme d'investissement complète",
        "Acquisitions sécurisées",
        "Gestion de patrimoine",
        "Analytics et reporting"
      ],
      price: "À partir de 4 500 000€",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
      icon: Ruler,
      title: "Architecture & Design",
      description: "Conception d'espaces immobiliers intuitifs et esthétiques. Expérience optimisée pour maximiser la valorisation.",
      features: [
        "Audit architectural complet",
        "Design d'intérieur interactif",
        "Tests d'aménagement",
        "Design system cohérent"
      ],
      price: "À partir de 1 800 000€",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
      icon: Sparkles,
      title: "Conciergerie & Support",
      description: "Conciergerie préventive et support technique pour assurer la pérennité et la sécurité de votre patrimoine immobilier.",
      features: [
        "Services de conciergerie",
        "Maintenance automatique",
        "Monitoring 24/7",
        "Support technique réactif"
      ],
      price: "À partir de 150 000€/an",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Page Header */}
      <section className="pt-24 pb-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
              Nos Services
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
              Solutions immobilières complètes pour faire grandir votre patrimoine
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
              Expertise Complète en Immobilier de Prestige
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden ${
                  index === 0 ? 'border-2 border-yellow-600' : ''
                }`}
              >
                <img
                  src={service.image}
                  alt={`${service.title} - Solutions immobilières de prestige`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <service.icon className="w-8 h-8 text-yellow-600" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-xl font-medium text-yellow-600">
                    {service.price}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
              Notre Processus de Travail
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Analyse & Stratégie",
                description: "Audit complet de vos besoins et définition de la stratégie immobilière optimale pour votre projet."
              },
              {
                step: "02",
                title: "Recherche & Sélection",
                description: "Identification et sélection des opportunités immobilières pour valider le potentiel d'investissement."
              },
              {
                step: "03",
                title: "Acquisition",
                description: "Négociation et acquisition avec les meilleures pratiques et accompagnement juridique continu."
              },
              {
                step: "04",
                title: "Valorisation & Suivi",
                description: "Optimisation patrimoniale et accompagnement post-acquisition pour assurer votre succès."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-yellow-600 text-white rounded-full flex items-center justify-center text-xl font-light mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-600 to-yellow-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-light text-white mb-6">
              Discutons de Votre Projet
            </h2>
            <p className="text-xl text-yellow-100 mb-8 leading-relaxed">
              Chaque projet est unique. Contactez-nous pour une consultation personnalisée et un accompagnement sur-mesure.
            </p>
            <a
              href="mailto:nicolas.c@lacremerie.fr"
              className="inline-block bg-white text-yellow-600 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors font-medium"
            >
              Obtenir une Consultation Gratuite
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;