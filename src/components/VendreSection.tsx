import React, { useState } from 'react';
import { Home, Euro, Clock, Shield, CheckCircle, Phone, Mail, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const VendreSection: React.FC = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    typeVente: 'villa',
    localisation: '',
    prixEstime: '',
    description: '',
    urgence: 'normale'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulation d'envoi de demande de vente
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Demande de vente:', formData);
      
      setIsSuccess(true);
      toast.success('Demande de vente envoyée avec succès !');
      
      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          typeVente: 'villa',
          localisation: '',
          prixEstime: '',
          description: '',
          urgence: 'normale'
        });
      }, 3000);
      
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const avantages = [
    {
      icon: <Shield className="w-8 h-8 text-yellow-600" />,
      title: "Confidentialité totale",
      description: "Votre bien reste confidentiel, pas de diffusion publique"
    },
    {
      icon: <Euro className="w-8 h-8 text-yellow-600" />,
      title: "Valorisation optimale",
      description: "Expertise professionnelle pour maximiser la valeur de votre bien"
    },
    {
      icon: <Clock className="w-8 h-8 text-yellow-600" />,
      title: "Vente rapide",
      description: "Réseau d'acheteurs qualifiés pour une transaction efficace"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-yellow-600" />,
      title: "Accompagnement complet",
      description: "Suivi personnalisé de A à Z par nos experts"
    }
  ];

  if (isSuccess) {
    return (
      <section id="vendre" className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-12"
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h3 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
              Demande envoyée avec succès !
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Nous vous contacterons sous 24h pour évaluer votre bien et vous proposer notre accompagnement personnalisé.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Appel sous 24h</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Confirmation par email</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="vendre" className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-light text-yellow-600 tracking-wide mb-8">
            VENDRE VOTRE BIEN
          </h2>
          <div className="w-24 h-px bg-yellow-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300 font-light leading-relaxed max-w-4xl mx-auto">
            Confiez-nous la vente de votre bien immobilier de prestige. Notre approche off-market garantit discrétion, 
            valorisation optimale et accompagnement personnalisé pour une transaction réussie.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Avantages */}
          <div className="space-y-8">
            <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-8">
              Pourquoi nous choisir ?
            </h3>
            
            <div className="space-y-6">
              {avantages.map((avantage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm"
                >
                  <div className="flex-shrink-0">
                    {avantage.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {avantage.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                      {avantage.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact direct */}
            <div className="bg-white dark:bg-gray-900 border-2 border-amber-400 rounded-lg p-8 shadow-sm">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Besoin d'un conseil immédiat ?
              </h4>
              <div className="flex items-center justify-center space-x-8">
                <a
                  href="tel:+33652913556"
                  className="flex items-center justify-center w-12 h-12 border-2 border-amber-400 rounded-full text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300 hover:scale-110"
                >
                  <Phone className="w-5 h-5" />
                </a>
                <a
                  href="mailto:nicolas.c@lacremerie.fr"
                  className="flex items-center justify-center w-12 h-12 border-2 border-amber-400 rounded-full text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300 hover:scale-110"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <Home className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-2">
                Estimation gratuite
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Obtenez une évaluation professionnelle de votre bien
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Informations sur le bien */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type de bien *
                  </label>
                  <select
                    name="typeVente"
                    value={formData.typeVente}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="villa">Villa</option>
                    <option value="appartement">Appartement</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="maison">Maison</option>
                    <option value="terrain">Terrain</option>
                    <option value="commercial">Local commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Localisation *
                  </label>
                  <input
                    type="text"
                    name="localisation"
                    value={formData.localisation}
                    onChange={handleInputChange}
                    placeholder="Cannes, Saint-Tropez, Monaco..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prix estimé
                  </label>
                  <input
                    type="text"
                    name="prixEstime"
                    value={formData.prixEstime}
                    onChange={handleInputChange}
                    placeholder="2 500 000 €"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Urgence de vente
                  </label>
                  <select
                    name="urgence"
                    value={formData.urgence}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="normale">Normale (6-12 mois)</option>
                    <option value="rapide">Rapide (3-6 mois)</option>
                    <option value="urgente">Urgente (moins de 3 mois)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description de votre bien
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Décrivez votre bien : nombre de pièces, caractéristiques particulières, vue, équipements..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 bg-yellow-600 text-white py-3 px-6 rounded-md hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className={`w-5 h-5 ${isSubmitting ? 'animate-pulse' : ''}`} />
                <span>{isSubmitting ? 'Envoi en cours...' : 'Demander une estimation'}</span>
              </button>
            </form>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
              Estimation gratuite et sans engagement. Réponse sous 24h.
            </p>
          </div>
        </div>

        {/* Processus de vente */}
        <div className="max-w-6xl mx-auto mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-4">
              Notre processus de vente off-market
            </h3>
            <div className="w-16 h-px bg-yellow-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Évaluation",
                description: "Expertise gratuite et confidentielle de votre bien"
              },
              {
                step: "02", 
                title: "Stratégie",
                description: "Définition d'une stratégie de vente sur-mesure"
              },
              {
                step: "03",
                title: "Diffusion",
                description: "Présentation ciblée à notre réseau d'acheteurs qualifiés"
              },
              {
                step: "04",
                title: "Transaction",
                description: "Accompagnement complet jusqu'à la signature"
              }
            ].map((etape, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-yellow-600 text-white rounded-full flex items-center justify-center text-xl font-light mx-auto mb-4">
                  {etape.step}
                </div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {etape.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                  {etape.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Avantages détaillés */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {avantages.map((avantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center space-x-4 mb-4">
                  {avantage.icon}
                  <h4 className="text-xl font-medium text-gray-900 dark:text-white">
                    {avantage.title}
                  </h4>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                  {avantage.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendreSection;