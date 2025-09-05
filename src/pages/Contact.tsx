import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    budget: '',
    message: '',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message || !formData.consent) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Message de contact:', formData);
      
      setIsSuccess(true);
      toast.success('Message envoyé avec succès !');
      
      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          budget: '',
          message: '',
          consent: false
        });
      }, 3000);
      
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-4">
            Message envoyé !
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Nous vous contacterons sous 24h pour répondre à votre demande.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Réponse sous 24h</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Suivi personnalisé</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Page Header */}
      <section className="pt-24 pb-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
              Contactez-Nous
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
              Prêt à démarrer votre projet ? Parlons-en ensemble
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-8">
                Envoyez-nous un Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Adresse email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Optionnel - pour vous recontacter rapidement
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sujet *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Choisissez un sujet</option>
                    <option value="devis">Demande de devis</option>
                    <option value="info">Demande d'information</option>
                    <option value="support">Support technique</option>
                    <option value="partenariat">Partenariat</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Budget estimé
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Sélectionnez votre budget</option>
                    <option value="1000-3000">1 000 000€ - 3 000 000€</option>
                    <option value="3000-5000">3 000 000€ - 5 000 000€</option>
                    <option value="5000-10000">5 000 000€ - 10 000 000€</option>
                    <option value="10000+">Plus de 10 000 000€</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Votre message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Décrivez votre projet, vos besoins et vos objectifs..."
                    required
                  />
                </div>
                
                <div>
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 mt-1"
                      required
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      J'accepte d'être contacté concernant ma demande *
                    </span>
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 bg-yellow-600 text-white py-3 px-6 rounded-md hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className={`w-5 h-5 ${isSubmitting ? 'animate-pulse' : ''}`} />
                  <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer le Message'}</span>
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-8">
                Informations de Contact
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <Mail className="w-6 h-6 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Email</h3>
                    <a href="mailto:nicolas.c@lacremerie.fr" className="text-yellow-600 hover:text-yellow-700 transition-colors">
                      nicolas.c@lacremerie.fr
                    </a>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Réponse sous 24h garantie</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <Phone className="w-6 h-6 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Téléphone</h3>
                    <a href="tel:+33652913556" className="text-yellow-600 hover:text-yellow-700 transition-colors">
                      +33 6 52 91 35 56
                    </a>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Lun-Ven : 9h-18h</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <MapPin className="w-6 h-6 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Localisation</h3>
                    <address className="not-italic text-gray-700 dark:text-gray-300">
                      Côte d'Azur, France
                    </address>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Rendez-vous sur demande</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <Clock className="w-6 h-6 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Horaires</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Lundi - Vendredi<br />9h00 - 18h00
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Support d'urgence disponible</p>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Questions Fréquentes
                </h3>
                <ul className="space-y-2">
                  <li><a href="#faq-1" className="text-yellow-600 hover:text-yellow-700 transition-colors">Quel est le délai de réalisation ?</a></li>
                  <li><a href="#faq-2" className="text-yellow-600 hover:text-yellow-700 transition-colors">Proposez-vous la maintenance ?</a></li>
                  <li><a href="#faq-3" className="text-yellow-600 hover:text-yellow-700 transition-colors">Travaillez-vous avec des PME ?</a></li>
                  <li><a href="#faq-4" className="text-yellow-600 hover:text-yellow-700 transition-colors">Quelles technologies utilisez-vous ?</a></li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
              Questions Fréquemment Posées
            </h2>
          </div>
          <div className="space-y-6">
            {[
              {
                id: "faq-1",
                question: "Quel est le délai moyen de réalisation d'un projet immobilier ?",
                answer: "Le délai varie selon la complexité du projet. Un investissement simple prend généralement 2-4 mois, tandis qu'un projet complexe peut nécessiter 6-8 mois. Nous établissons un planning détaillé dès le début du projet."
              },
              {
                id: "faq-2", 
                question: "Proposez-vous des services de maintenance ?",
                answer: "Oui, nous offrons des contrats de conciergerie incluant maintenance, gestion locative, monitoring et support technique. Plusieurs formules sont disponibles selon vos besoins."
              },
              {
                id: "faq-3",
                question: "Travaillez-vous avec des particuliers ?",
                answer: "Absolument ! Nous accompagnons des investisseurs de toutes tailles, des particuliers aux grandes fortunes. Nos solutions s'adaptent à votre budget et vos objectifs."
              },
              {
                id: "faq-4",
                question: "Quels types de biens proposez-vous ?",
                answer: "Nous nous spécialisons dans l'immobilier de prestige : villas, penthouses, propriétés d'exception sur la Côte d'Azur, Monaco et destinations premium selon vos besoins spécifiques."
              }
            ].map((faq, index) => (
              <motion.details
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-sm"
                id={faq.id}
              >
                <summary className="p-6 cursor-pointer font-medium text-gray-900 dark:text-white hover:text-yellow-600 transition-colors">
                  {faq.question}
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;