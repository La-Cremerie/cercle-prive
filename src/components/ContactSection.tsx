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
    <section id="contact" className="py-20 lg:py-32 relative overflow-hidden" style={{ backgroundColor: '#001122' }}>
      {/* Overlay pattern luxueux */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #ffffff 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, #ffffff 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Gradient overlay pour plus de profondeur */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-blue-800/30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 relative z-10">
          <h2 className="text-4xl font-light text-white mb-4 tracking-wide">
            CONTACTEZ-NOUS
          </h2>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"></div>
          <p className="text-xl text-blue-100 font-light">
            Notre équipe d'experts est à votre disposition
          </p>
          <div className="mt-6 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-amber-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start relative z-10">
          {/* Informations de contact */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-500 group">
              <Phone className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-xl font-light text-white mb-3 tracking-wide">Téléphone</h3>
              <div className="w-12 h-px bg-amber-400/50 mb-4"></div>
              <a href="tel:+33652913556" className="text-blue-100 hover:text-white transition-colors">
                +33 6 52 91 35 56
              </a>
              <p className="text-blue-200/70 text-sm mt-2 font-light">Disponible 7j/7 pour vos projets d'exception</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-500 group">
              <Mail className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-xl font-light text-white mb-3 tracking-wide">Email</h3>
              <div className="w-12 h-px bg-amber-400/50 mb-4"></div>
              <a href="mailto:nicolas.c@lacremerie.fr" className="text-blue-100 hover:text-white transition-colors">
                nicolas.c@lacremerie.fr
              </a>
              <p className="text-blue-200/70 text-sm mt-2 font-light">Réponse garantie sous 24h</p>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Effet de brillance luxueux */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-t from-transparent via-amber-400/30 to-transparent"></div>
            
            <h3 className="text-lg font-light text-white mb-5 text-center">
              Envoyez-nous un message
            </h3>
            <div className="w-10 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-5"></div>

            <form onSubmit={handleSubmit} className="space-y-3">
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
                    className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400/50 text-white placeholder-blue-200/70 transition-all duration-300 hover:bg-white/15 focus:bg-white/15"
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
                    className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400/50 text-white placeholder-blue-200/70 transition-all duration-300 hover:bg-white/15 focus:bg-white/15"
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
                    className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400/50 text-white placeholder-blue-200/70 transition-all duration-300 hover:bg-white/15 focus:bg-white/15"
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
                    className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400/50 text-white placeholder-blue-200/70 transition-all duration-300 hover:bg-white/15 focus:bg-white/15"
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
                  rows={2}
                  className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400/50 text-white placeholder-blue-200/70 transition-all duration-300 hover:bg-white/15 focus:bg-white/15 resize-none"
                  placeholder="Décrivez votre projet immobilier..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white py-2 px-4 rounded-lg hover:from-amber-600 hover:via-amber-700 hover:to-amber-600 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-blue-900 transition-all duration-300 font-light tracking-wide text-sm shadow-xl hover:shadow-2xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Send className={`w-5 h-5 ${isSubmitting ? 'animate-pulse' : ''}`} />
                <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}</span>
              </button>
            </form>

            <p className="text-xs text-blue-200/80 text-center mt-4 font-light tracking-wide">
              Nous nous engageons à vous répondre dans les 24h.
            </p>
            
            {/* Signature luxueuse */}
            <div className="text-center mt-4 pt-3 border-t border-white/10">
              <p className="text-amber-400/80 text-sm font-light tracking-widest">
              </p>
              <p className="text-blue-200/60 text-xs mt-1 font-light">
                L'excellence immobilière en toute discrétion
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}