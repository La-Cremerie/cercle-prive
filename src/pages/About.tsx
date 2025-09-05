import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Page Header */}
      <section className="pt-24 pb-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
              À Propos de CERCLE PRIVÉ
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
              Découvrez notre histoire, notre mission et l'équipe passionnée qui donne vie à vos projets
            </p>
          </div>
        </div>
      </section>

      {/* About Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-light text-gray-900 dark:text-white">
                Notre Histoire
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  Fondée en 2020 avec une vision claire : démocratiser l'accès à des solutions immobilières de qualité professionnelle. CERCLE PRIVÉ est née de la passion de créer des expériences immobilières exceptionnelles qui transforment la façon dont les investisseurs interagissent avec le marché de prestige.
                </p>
                <p>
                  Depuis nos débuts, nous avons accompagné plus de 150 investisseurs dans leur stratégie patrimoniale, des entrepreneurs innovants aux familles établies. Notre approche combine expertise technique, créativité et compréhension approfondie des enjeux patrimoniaux.
                </p>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mt-8 mb-4">
                  Notre Mission
                </h3>
                <p>
                  Transformer vos projets en solutions immobilières performantes qui génèrent des résultats concrets. Nous croyons que chaque investissement mérite une attention particulière et une approche sur-mesure.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Équipe de développeurs collaborant sur un projet innovant"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
              Nos Valeurs Fondamentales
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: '💡',
                title: 'Innovation Continue',
                description: 'Nous restons à la pointe des technologies immobilières pour offrir des solutions modernes et pérennes qui anticipent les besoins futurs.'
              },
              {
                icon: '🤝',
                title: 'Partenariat Authentique',
                description: 'Nous construisons des relations durables basées sur la confiance, l\'écoute et la compréhension mutuelle de vos objectifs.'
              },
              {
                icon: '⭐',
                title: 'Excellence Technique',
                description: 'Chaque projet est pensé pour la performance, la sécurité et la rentabilité. Qualité irréprochable garantie.'
              },
              {
                icon: '🌱',
                title: 'Croissance Durable',
                description: 'Solutions évolutives qui grandissent avec votre patrimoine. Architecture flexible pour s\'adapter à vos futurs besoins.'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8 text-center"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
              Notre Équipe d'Experts
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Des professionnels passionnés au service de votre réussite
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Marie Dupont',
                role: 'Directrice Créative',
                description: 'Experte en design immobilier avec plus de 8 ans d\'expérience. Marie transforme les espaces en lieux d\'exception.',
                image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
              },
              {
                name: 'Jean Martin',
                role: 'Architecte Senior',
                description: 'Architecte passionné par les projets d\'exception. Jean garantit l\'excellence et la performance de nos réalisations.',
                image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
              },
              {
                name: 'Sophie Chen',
                role: 'Responsable Projet',
                description: 'Experte en gestion de projet immobilier. Sophie coordonne chaque étape pour assurer la livraison dans les délais.',
                image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
              >
                <img
                  src={member.image}
                  alt={`Portrait professionnel de ${member.name}`}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-yellow-600 font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;