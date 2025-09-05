import React from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Prestige Immobilier</h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                {t('footer.description')}
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
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">{t('nav.accueil')}</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">{t('nav.recherche')}</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">{t('nav.vendre')}</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">{t('nav.contact')}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Informations légales</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">{t('footer.legalNotices')}</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">{t('footer.privacy')}</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">{t('footer.terms')}</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer.followUs')}</h4>
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

        {/* Bottom */}
        <div className="border-t border-blue-700 pt-8 text-center">
          <p className="text-blue-100">© 2024 Prestige Immobilier. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}