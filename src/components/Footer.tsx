import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">CERCLE PRIVÉ</h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                L'excellence immobilière en toute discrétion. Spécialiste de l'immobilier de prestige en off-market sur la Côte d'Azur.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li><a href="#notre-adn" className="text-blue-100 hover:text-white transition-colors">Concept</a></li>
              <li><a href="#nos-services" className="text-blue-100 hover:text-white transition-colors">Services</a></li>
              <li><a href="#recherche" className="text-blue-100 hover:text-white transition-colors">Recherche</a></li>
              <li><a href="#galerie-biens" className="text-blue-100 hover:text-white transition-colors">Acheter</a></li>
              <li><a href="#vendre" className="text-blue-100 hover:text-white transition-colors">Vendre</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-200" />
                <span className="text-blue-100">Côte d'Azur, France</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-200" />
                <a href="tel:+33652913556" className="text-blue-100 hover:text-white transition-colors">
                  +33 6 52 91 35 56
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-200" />
                <a href="mailto:nicolas.c@lacremerie.fr" className="text-blue-100 hover:text-white transition-colors">
                  nicolas.c@lacremerie.fr
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-700 pt-8 mt-8 text-center">
          <p className="text-blue-100">© 2024 CERCLE PRIVÉ. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}