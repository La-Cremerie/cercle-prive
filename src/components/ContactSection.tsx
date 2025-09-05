import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 lg:py-32 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-wide mb-8">
            CONTACT
          </h2>
          <div className="w-24 h-px bg-yellow-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-300 font-light leading-relaxed">
            Notre équipe d'experts est à votre disposition
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <MapPin className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Adresse</h3>
              <p className="text-gray-300">Côte d'Azur, France</p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <Phone className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Téléphone</h3>
              <a 
                href="tel:+33652913556" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                +33 6 52 91 35 56
              </a>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <Mail className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Email</h3>
              <a 
                href="mailto:nicolas.c@lacremerie.fr" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                nicolas.c@lacremerie.fr
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}