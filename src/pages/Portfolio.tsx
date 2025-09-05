import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'vitrine' | 'ecommerce' | 'webapp'>('all');

  const projects = [
    {
      id: 1,
      title: "Villa Le Gourmet",
      category: "vitrine",
      description: "Propriété élégante avec vue panoramique et aménagements haut de gamme.",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      tech: ["Architecture", "Design", "Aménagement"]
    },
    {
      id: 2,
      title: "Résidence Prestige",
      category: "ecommerce", 
      description: "Complexe immobilier complet avec gestion des acquisitions, optimisation fiscale et interface de gestion.",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      tech: ["Investissement", "Gestion", "Optimisation"]
    },
    {
      id: 3,
      title: "Patrimoine Flow",
      category: "webapp",
      description: "Application de gestion patrimoniale collaborative avec tableau de bord en temps réel et notifications.",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      tech: ["Gestion", "Analytics", "Suivi"]
    },
    {
      id: 4,
      title: "Cabinet Immobilier",
      category: "vitrine",
      description: "Plateforme professionnelle pour cabinet immobilier avec prise de rendez-vous en ligne et blog spécialisé.",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      tech: ["Conseil", "Expertise", "Accompagnement"]
    },
    {
      id: 5,
      title: "Luxury Market",
      category: "ecommerce",
      description: "Marketplace dédiée aux biens de prestige avec système d'acquisitions et accompagnement géolocalisé.",
      image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      tech: ["Marketplace", "Géolocalisation", "Premium"]
    }
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Page Header */}
      <section className="pt-24 pb-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
              Notre Portfolio
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
              Découvrez nos réalisations et l'impact de nos solutions immobilières sur le succès de nos clients
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Filter */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-4">
            {[
              { key: 'all', label: 'Tous les projets' },
              { key: 'vitrine', label: 'Projets Vitrine' },
              { key: 'ecommerce', label: 'Investissements' },
              { key: 'webapp', label: 'Applications Patrimoine' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-yellow-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={`Projet ${project.title} - Réalisation immobilière de prestige`}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white text-yellow-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
                      Voir le projet
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-3">
                    <span className="text-yellow-600 text-xs font-medium uppercase tracking-wider">
                      {project.category === 'vitrine' ? 'Projet Vitrine' :
                       project.category === 'ecommerce' ? 'Investissement' : 'Application Patrimoine'}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
              Ce Que Disent Nos Clients
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Une équipe exceptionnelle qui a su comprendre nos besoins patrimoniaux et livrer des solutions au-delà de nos attentes. Professionnalisme et créativité au rendez-vous.",
                author: "Marie Dubois",
                role: "Directrice Patrimoine, TechCorp"
              },
              {
                quote: "Grâce à CERCLE PRIVÉ, notre portefeuille immobilier a vu sa valeur augmenter de 300% en 6 mois. Une solution d'investissement parfaitement adaptée à nos besoins.",
                author: "Pierre Leroy",
                role: "Fondateur, Groupe Éco"
              },
              {
                quote: "Support technique réactif et équipe à l'écoute. Nos investissements fonctionnent parfaitement depuis 2 ans sans aucun problème technique.",
                author: "Sophie Martin",
                role: "CEO, StartupInnovante"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8 border-l-4 border-yellow-600"
              >
                <p className="text-gray-700 dark:text-gray-300 italic mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;