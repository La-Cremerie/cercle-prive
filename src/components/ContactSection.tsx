import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // Simulation d'envoi de message
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Message de contact:', formData);
      
      setIsSuccess(true);
      toast.success('Message envoyé avec succès !');
      
      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          message: ''
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
      <section id="contact" className="py-20 lg:py-32 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-12 border border-white/20"
          >
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h3 className="text-3xl font-light text-white mb-4">
              Message envoyé !
            </h3>
            <p className="text-lg text-blue-100 mb-8">
              Nous vous contacterons sous 24h pour répondre à votre demande.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-blue-200">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Réponse rapide</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Suivi personnalisé</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 lg:py-32" style={{ backgroundColor: '#003366' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-white mb-4 tracking-wide">
            CONTACTEZ-NOUS
          </h2>
          <div className="w-24 h-px bg-amber-400 mx-auto mb-8"></div>
          <p className="text-xl text-blue-100 font-light">
            Notre équipe d'experts est à votre disposition
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Informations de contact */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <MapPin className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Localisation</h3>
              <p className="text-blue-100">Côte d'Azur, France</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <Phone className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Téléphone</h3>
              <a href="tel:+33652913556" className="text-blue-100 hover:text-white transition-colors">
                +33 6 52 91 35 56
              </a>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <Mail className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
              <a href="mailto:nicolas.c@lacremerie.fr" className="text-blue-100 hover:text-white transition-colors">
                nicolas.c@lacremerie.fr
              </a>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-light text-white mb-8 text-center">
              Envoyez-nous un message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-blue-200"
                    placeholder="Votre nom"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-blue-200"
                    placeholder="Votre prénom"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-blue-200"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-blue-200"
                    placeholder="Votre téléphone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-blue-200"
                  placeholder="Décrivez votre projet immobilier..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 bg-amber-500 text-white py-3 px-6 rounded-md hover:bg-amber-600 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-blue-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className={`w-5 h-5 ${isSubmitting ? 'animate-pulse' : ''}`} />
                <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}</span>
              </button>
            </form>

            <p className="text-xs text-blue-200 text-center mt-6">
              Nous nous engageons à vous répondre dans les 24h.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}