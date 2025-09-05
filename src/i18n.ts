import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      nav: {
        accueil: 'Accueil',
        recherche: 'Recherche',
        vendre: 'Vendre',
        contact: 'Contact'
      },
      footer: {
        description: 'Spécialiste de l\'immobilier de prestige sur la Côte d\'Azur depuis plus de 20 ans.',
        quickLinks: 'Liens rapides',
        legalNotices: 'Mentions légales',
        privacy: 'Confidentialité',
        terms: 'CGU',
        followUs: 'Suivez-nous',
        rights: 'Tous droits réservés.'
      },
      contact: {
        title: 'Contactez-nous',
        subtitle: 'Notre équipe d\'experts est à votre disposition',
        address: '123 Boulevard de la Croisette, 06400 Cannes',
        phone: '+33 4 93 XX XX XX',
        email: 'contact@prestige-immobilier.fr'
      },
      properties: {
        title: 'Nos biens d\'exception',
        subtitle: 'Une sélection de propriétés uniques sur la Côte d\'Azur'
      },
      login: {
        success: 'Inscription réussie ! Bienvenue dans le Cercle Privé.',
        errors: {
          nameRequired: 'Le nom est requis',
          firstNameRequired: 'Le prénom est requis',
          phoneRequired: 'Le téléphone est requis',
          emailRequired: 'L\'email est requis',
          emailInvalid: 'Format d\'email invalide',
          general: 'Une erreur est survenue'
        }
      }
    }
  },
  en: {
    translation: {
      nav: {
        accueil: 'Home',
        recherche: 'Search',
        vendre: 'Sell',
        contact: 'Contact'
      },
      footer: {
        description: 'Specialist in luxury real estate on the French Riviera for over 20 years.',
        quickLinks: 'Quick links',
        legalNotices: 'Legal notices',
        privacy: 'Privacy',
        terms: 'Terms',
        followUs: 'Follow us',
        rights: 'All rights reserved.'
      },
      contact: {
        title: 'Contact us',
        subtitle: 'Our team of experts is at your disposal',
        address: '123 Boulevard de la Croisette, 06400 Cannes',
        phone: '+33 4 93 XX XX XX',
        email: 'contact@prestige-immobilier.fr'
      },
      properties: {
        title: 'Our exceptional properties',
        subtitle: 'A selection of unique properties on the French Riviera'
      },
      login: {
        success: 'Registration successful! Welcome to the Private Circle.',
        errors: {
          nameRequired: 'Name is required',
          firstNameRequired: 'First name is required',
          phoneRequired: 'Phone is required',
          emailRequired: 'Email is required',
          emailInvalid: 'Invalid email format',
          general: 'An error occurred'
        }
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;