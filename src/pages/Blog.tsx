import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react';

const Blog: React.FC = () => {
  const featuredArticle = {
    title: "Les Tendances de l'Immobilier de Prestige en 2024",
    excerpt: "Découvrez les technologies et approches qui façonnent l'avenir de l'immobilier : IA, performance, durabilité et expérience client.",
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
    category: "Tendances",
    date: "2024-01-15",
    readTime: "5 min de lecture"
  };

  const articles = [
    {
      title: "Comment Optimiser la Rentabilité de Votre Patrimoine",
      excerpt: "Guide complet pour améliorer la performance et l'expérience de gestion de votre portefeuille immobilier.",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
      category: "Performance",
      date: "2024-01-10",
      readTime: "8 min"
    },
    {
      title: "L'Importance de la Diversification Immobilière",
      excerpt: "Pourquoi diversifier son patrimoine immobilier est essentiel en 2024 et comment l'implémenter efficacement.",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
      category: "Stratégie",
      date: "2024-01-05",
      readTime: "6 min"
    },
    {
      title: "Sécuriser Vos Investissements : Guide Essentiel",
      excerpt: "Les meilleures pratiques de sécurisation immobilière pour protéger votre patrimoine contre les risques.",
      image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
      category: "Sécurité",
      date: "2023-12-28",
      readTime: "10 min"
    },
    {
      title: "Fiscalité Immobilière en 2024 : Stratégies Gagnantes",
      excerpt: "Techniques avancées d'optimisation fiscale pour améliorer la rentabilité de vos investissements immobiliers.",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
      category: "Fiscalité",
      date: "2023-12-20",
      readTime: "12 min"
    },
    {
      title: "Rendre Votre Patrimoine Accessible et Performant",
      excerpt: "Guide pratique pour améliorer la gestion de votre patrimoine immobilier et toucher de nouveaux marchés.",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
      category: "Gestion",
      date: "2023-12-15",
      readTime: "7 min"
    },
    {
      title: "Investir dans l'Immobilier de Prestige : Guide Complet",
      excerpt: "Étapes essentielles pour créer un portefeuille immobilier performant et rentable dès le lancement.",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
      category: "Investissement",
      date: "2023-12-10",
      readTime: "15 min"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Page Header */}
      <section className="pt-24 pb-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
              Blog & Actualités
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
              Conseils, tendances et expertise en immobilier de prestige
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-64 lg:h-full object-cover"
              />
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <span className="inline-block bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider mb-4">
                  {featuredArticle.category}
                </span>
                <h2 className="text-2xl lg:text-3xl font-light text-gray-900 dark:text-white mb-4">
                  {featuredArticle.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={featuredArticle.date}>
                      {new Date(featuredArticle.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{featuredArticle.readTime}</span>
                  </div>
                </div>
                <button className="bg-yellow-600 text-white px-6 py-3 rounded-md hover:bg-yellow-700 transition-colors font-medium self-start">
                  Lire l'article
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Articles */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
              Derniers Articles
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <span className="inline-block bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider mb-3">
                    {article.category}
                  </span>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <time dateTime={article.date}>
                      {new Date(article.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-16 bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
            <button className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Page 1 sur 3
            </span>
            <button className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
              <span>Suivant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;