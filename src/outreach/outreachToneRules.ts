import type { OutreachTone, EnrichedLead } from '../types/Outreach.js';

export interface ToneRule {
  tone: OutreachTone;
  vocabulary_hints: string[];
  max_body_chars: number;
  preferred_cta: string;
  personalization_level: 'low' | 'medium' | 'high';
  description: string;
}

export const TONE_RULES: Record<OutreachTone, ToneRule> = {
  premium_sobre: {
    tone: 'premium_sobre',
    vocabulary_hints: [
      'lecture',
      'lisibilité',
      'perception',
      'valorisation',
      'sobriété',
      'sans remettre en cause',
      'à titre indicatif',
    ],
    max_body_chars: 900,
    preferred_cta:
      'Est-ce que cela vaut le coup que je vous transmette une première lecture rapide ?',
    personalization_level: 'high',
    description:
      'Ton premium, sobre, sans superlatifs, orienté valeur et respect du destinataire.',
  },
  direct_business: {
    tone: 'direct_business',
    vocabulary_hints: ['levier', 'amélioration', 'gain', 'temps', 'court'],
    max_body_chars: 700,
    preferred_cta: 'Est-ce pertinent d’en discuter 10 minutes ?',
    personalization_level: 'medium',
    description: 'Court, factuel, orienté décideur B2B.',
  },
  partenaire_agence: {
    tone: 'partenaire_agence',
    vocabulary_hints: [
      'mandat',
      'commercialisation',
      'différenciation',
      'partenariat',
      'sans remettre en cause votre travail',
    ],
    max_body_chars: 900,
    preferred_cta:
      'Souhaitez-vous que je vous partage les 2 ou 3 leviers que nous avons identifiés ?',
    personalization_level: 'high',
    description: 'Posture partenaire vis-à-vis d’une agence immobilière.',
  },
  investisseur_roi: {
    tone: 'investisseur_roi',
    vocabulary_hints: [
      'rendement',
      'vacance locative',
      'LMNP',
      'ameublement',
      'optimisation',
    ],
    max_body_chars: 750,
    preferred_cta:
      'Je peux vous envoyer une première note synthétique si cela vous intéresse.',
    personalization_level: 'medium',
    description: 'Orienté rendement et optimisation locative, sobre.',
  },
  residence_secondaire: {
    tone: 'residence_secondaire',
    vocabulary_hints: [
      'expérience',
      'atmosphère',
      'haut de gamme',
      'aménagement',
      'perception émotionnelle',
    ],
    max_body_chars: 850,
    preferred_cta:
      'Si cela vous intéresse, je peux vous transmettre une première lecture rapide.',
    personalization_level: 'high',
    description:
      'Ton premium pour résidence secondaire (Arcachon, Cap Ferret, Pyla).',
  },
  ultra_court: {
    tone: 'ultra_court',
    vocabulary_hints: ['bref', 'simple', 'direct'],
    max_body_chars: 320,
    preferred_cta:
      'Si ce n’est pas le bon sujet, je ne vous relancerai pas.',
    personalization_level: 'low',
    description:
      'Ultra court, utilisé pour LinkedIn ou messages de relance courts.',
  },
};

const ARCACHON_ZONES = ['bassin_arcachon', 'cap_ferret', 'pyla'];
const BORDEAUX_PATRIMONIAL = ['bordeaux_centre', 'cauderan', 'le_bouscat'];
const PERIPHERIE_LOCATIVE = ['talence', 'pessac', 'merignac'];

export function pickToneForLead(lead: EnrichedLead): OutreachTone {
  if (lead.commercial_priority === 'D') return 'ultra_court';

  if (lead.seller_type === 'agence' || lead.agency_name) {
    return 'partenaire_agence';
  }

  if (
    lead.seller_type === 'investisseur_locatif' ||
    lead.likely_buyer_profile === 'investisseur_locatif'
  ) {
    return 'investisseur_roi';
  }

  const zone = (lead.zone || '').toString().toLowerCase();
  if (ARCACHON_ZONES.some((z) => zone.includes(z))) {
    return 'residence_secondaire';
  }
  if (BORDEAUX_PATRIMONIAL.some((z) => zone.includes(z))) {
    return 'premium_sobre';
  }
  if (PERIPHERIE_LOCATIVE.some((z) => zone.includes(z))) {
    return 'investisseur_roi';
  }

  if (lead.seller_type === 'marchand_de_biens') return 'direct_business';

  return 'premium_sobre';
}

export function getZoneAngle(lead: EnrichedLead): string {
  const zone = (lead.zone || '').toString().toLowerCase();
  if (ARCACHON_ZONES.some((z) => zone.includes(z))) {
    return 'résidence secondaire, expérience premium, perception émotionnelle, aménagement intérieur/extérieur';
  }
  if (BORDEAUX_PATRIMONIAL.some((z) => zone.includes(z))) {
    return 'valorisation patrimoniale, rénovation premium, optimisation avant vente, modernisation sans dénaturer';
  }
  if (PERIPHERIE_LOCATIVE.some((z) => zone.includes(z))) {
    return 'optimisation locative, ameublement, rendement, budget maîtrisé';
  }
  return 'lecture rapide de valorisation, lisibilité, perception';
}
