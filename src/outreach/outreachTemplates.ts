import type { EnrichedLead, OutreachTone } from '../types/Outreach.js';
import { GDPR_OPT_OUT_LINE } from './outreachCompliance.js';
import { getZoneAngle } from './outreachToneRules.js';

export type TemplateKey =
  | 'agence_valorisation_before_sale'
  | 'investisseur_locatif'
  | 'residence_secondaire_premium'
  | 'marchand_de_biens'
  | 'renovation_strategique'
  | 'non_prioritaire';

export interface RenderedTemplate {
  subject: string;
  body: string;
  cta: string;
  tone: OutreachTone;
  personalization_points: string[];
}

const SIGNATURE_PLACEHOLDER = `\n\n— [Prénom Nom]\n[Société] — Audit de Valorisation Immobilière\n[Téléphone] · [Email]`;

function leadDisplay(lead: EnrichedLead): {
  who: string;
  city: string;
  zoneAngle: string;
  propertyHint: string;
} {
  const who =
    lead.agency_name ||
    [lead.contact_first_name, lead.contact_last_name].filter(Boolean).join(' ') ||
    'Bonjour';
  const city = lead.city || 'votre secteur';
  const zoneAngle = getZoneAngle(lead);
  const propertyHint = lead.property_type
    ? `${lead.property_type}${lead.surface_m2 ? ` (~${lead.surface_m2} m²)` : ''}`
    : 'ce type de bien';
  return { who, city, zoneAngle, propertyHint };
}

function pickTemplateKey(lead: EnrichedLead): TemplateKey {
  if (lead.commercial_priority === 'D') return 'non_prioritaire';
  if (lead.seller_type === 'agence' || lead.agency_name) {
    return 'agence_valorisation_before_sale';
  }
  if (lead.seller_type === 'marchand_de_biens') return 'marchand_de_biens';
  if (
    lead.seller_type === 'investisseur_locatif' ||
    lead.likely_buyer_profile === 'investisseur_locatif'
  ) {
    return 'investisseur_locatif';
  }
  const zone = (lead.zone || '').toString().toLowerCase();
  if (['arcachon', 'cap_ferret', 'pyla', 'bassin'].some((z) => zone.includes(z))) {
    return 'residence_secondaire_premium';
  }
  return 'renovation_strategique';
}

export function selectTemplateKey(lead: EnrichedLead): TemplateKey {
  return pickTemplateKey(lead);
}

export function renderTemplate(
  key: TemplateKey,
  lead: EnrichedLead,
): RenderedTemplate {
  const { who, city, zoneAngle, propertyHint } = leadDisplay(lead);
  const leversLine = (lead.identified_levers ?? []).length
    ? `Quelques leviers possibles : ${lead.identified_levers!.slice(0, 3).join(', ')}.`
    : '';

  switch (key) {
    case 'agence_valorisation_before_sale':
      return {
        tone: 'partenaire_agence',
        subject: `${city} — une lecture rapide pour vos mandats ?`,
        body:
          `Bonjour ${who},\n\n` +
          `En parcourant des annonces sur ${city}, nous avons remarqué ${propertyHint} qui pourrait gagner en lisibilité à la commercialisation.\n\n` +
          `Sans remettre en cause le travail déjà réalisé, notre approche consiste à améliorer la perception, la valeur et la lisibilité du bien (mise en scène, ameublement léger, ajustements éditoriaux).\n` +
          `${leversLine}\n\n` +
          `Souhaitez-vous que je vous partage les 2 ou 3 leviers que nous avons identifiés ?\n\n` +
          `${GDPR_OPT_OUT_LINE}${SIGNATURE_PLACEHOLDER}`,
        cta: 'Souhaitez-vous que je vous partage les 2 ou 3 leviers que nous avons identifiés ?',
        personalization_points: [
          `ville:${city}`,
          `agence:${lead.agency_name ?? 'n/a'}`,
          `bien:${propertyHint}`,
        ],
      };

    case 'investisseur_locatif':
      return {
        tone: 'investisseur_roi',
        subject: `${city} — leviers de rendement ?`,
        body:
          `Bonjour ${who},\n\n` +
          `Nous intervenons en amont d’une mise en location ou d’une transformation locative sur ${city} : ameublement, agencement, optimisation surface, LMNP, réduction de la vacance.\n\n` +
          `Il pourrait être intéressant d’étudier ${propertyHint} sous l’angle ${zoneAngle}.\n` +
          `${leversLine}\n\n` +
          `Je peux vous envoyer une première note synthétique si cela vous intéresse.\n\n` +
          `${GDPR_OPT_OUT_LINE}${SIGNATURE_PLACEHOLDER}`,
        cta: 'Je peux vous envoyer une première note synthétique si cela vous intéresse.',
        personalization_points: [`ville:${city}`, `profil:investisseur_locatif`],
      };

    case 'residence_secondaire_premium':
      return {
        tone: 'residence_secondaire',
        subject: `${city} — perception premium`,
        body:
          `Bonjour ${who},\n\n` +
          `Sur le secteur ${city}, l’expérience perçue d’une résidence secondaire pèse autant que les m². ` +
          `Nous avons identifié quelques leviers possibles autour de ${zoneAngle}.\n\n` +
          `L’idée serait de vous transmettre une première lecture rapide, à titre indicatif, sans remettre en cause le bien tel qu’il est aujourd’hui.\n\n` +
          `Est-ce que cela vaut le coup que je vous transmette cette lecture ?\n\n` +
          `${GDPR_OPT_OUT_LINE}${SIGNATURE_PLACEHOLDER}`,
        cta: 'Est-ce que cela vaut le coup que je vous transmette une première lecture rapide ?',
        personalization_points: [`ville:${city}`, `angle:residence_secondaire`],
      };

    case 'marchand_de_biens':
      return {
        tone: 'direct_business',
        subject: `${city} — lecture rapide avant revente`,
        body:
          `Bonjour ${who},\n\n` +
          `Nous intervenons en amont d’une revente sur ${city} : lisibilité du bien, perception premium, ajustements éditoriaux et arbitrages travaux à fort impact.\n\n` +
          `Il pourrait être intéressant d’étudier ${propertyHint} sous l’angle ${zoneAngle}.\n\n` +
          `Est-ce pertinent d’en discuter 10 minutes ?\n\n` +
          `${GDPR_OPT_OUT_LINE}${SIGNATURE_PLACEHOLDER}`,
        cta: 'Est-ce pertinent d’en discuter 10 minutes ?',
        personalization_points: [`ville:${city}`, `profil:marchand_de_biens`],
      };

    case 'renovation_strategique':
      return {
        tone: 'premium_sobre',
        subject: `${city} — lecture rapide de valorisation`,
        body:
          `Bonjour ${who},\n\n` +
          `Nous intervenons en amont d’une vente, d’une rénovation ou d’une mise en location sur ${city}.\n` +
          `Notre approche consiste à améliorer la perception, la valeur et la lisibilité du bien, sans dénaturer ce qui fonctionne déjà.\n\n` +
          `L’idée serait de vous transmettre une première lecture rapide, à titre indicatif.\n\n` +
          `Est-ce que cela vaut le coup que je vous la transmette ?\n\n` +
          `${GDPR_OPT_OUT_LINE}${SIGNATURE_PLACEHOLDER}`,
        cta: 'Est-ce que cela vaut le coup que je vous transmette une première lecture rapide ?',
        personalization_points: [`ville:${city}`, `angle:renovation_strategique`],
      };

    case 'non_prioritaire':
      return {
        tone: 'ultra_court',
        subject: '',
        body: 'Lead non prioritaire — pas de message généré.',
        cta: '',
        personalization_points: [],
      };
  }
}

export function renderShortVariant(
  rendered: RenderedTemplate,
  lead: EnrichedLead,
): RenderedTemplate {
  const { city, propertyHint } = leadDisplay(lead);
  const short =
    `Bonjour,\n\n` +
    `Sur ${city}, nous avons identifié quelques leviers possibles autour de ${propertyHint}, sans remettre en cause le travail déjà réalisé.\n\n` +
    `${rendered.cta}\n\n` +
    `${GDPR_OPT_OUT_LINE}${SIGNATURE_PLACEHOLDER}`;
  return {
    ...rendered,
    body: short,
    subject: rendered.subject || `${city} — une idée rapide`,
  };
}

export function renderLinkedInVariant(
  rendered: RenderedTemplate,
  lead: EnrichedLead,
): RenderedTemplate {
  const { city } = leadDisplay(lead);
  const base = `Bonjour, nous intervenons en amont d’une vente, rénovation ou mise en location sur ${city}. Sans remettre en cause votre travail, ${rendered.cta.toLowerCase()}`;
  const body = base.length > 300 ? base.slice(0, 297) + '…' : base;
  return {
    ...rendered,
    subject: '',
    body,
  };
}

export function renderCallScript(
  rendered: RenderedTemplate,
  lead: EnrichedLead,
): RenderedTemplate {
  const { who, city } = leadDisplay(lead);
  const body =
    `Accroche (20s) : Bonjour ${who}, [Prénom] de [Société]. Nous intervenons en Gironde sur la valorisation de biens avant vente, rénovation ou mise en location. Je vous appelle au sujet de ${city}, est-ce que je vous prends 60 secondes ?\n\n` +
    `Question d’ouverture : Sur vos mandats actuels, est-ce qu’il y a des biens qui mettent plus de temps que prévu à se positionner ou à se vendre ?\n\n` +
    `Proposition de valeur : Nous identifions, sans critiquer le travail déjà fait, 2 ou 3 leviers de lisibilité, perception et ameublement. C’est court, factuel, sans engagement.\n\n` +
    `Sortie polie : Si ce n’est pas le bon moment ou pas le bon sujet, je n’insiste pas. Je peux vous laisser mes coordonnées et vous me rappelez si pertinent.`;
  return { ...rendered, subject: '', body };
}

export function renderContactForm(
  rendered: RenderedTemplate,
  lead: EnrichedLead,
): RenderedTemplate {
  const { city, propertyHint } = leadDisplay(lead);
  const body =
    `Bonjour, je vous contacte au sujet de votre activité sur ${city}. ` +
    `Nous accompagnons des professionnels et investisseurs sur la valorisation de biens avant vente ou mise en location (lecture rapide, leviers concrets, sans remettre en cause le travail déjà réalisé). ` +
    `Sur ${propertyHint}, ${rendered.cta} ${GDPR_OPT_OUT_LINE}`;
  const trimmed = body.length > 600 ? body.slice(0, 597) + '…' : body;
  return { ...rendered, subject: '', body: trimmed };
}

export function renderCrmNote(
  rendered: RenderedTemplate,
  lead: EnrichedLead,
): RenderedTemplate {
  const angle = rendered.tone;
  const body =
    `Angle : ${angle} — ${getZoneAngle(lead)}.\n` +
    `Pourquoi contacter : ${lead.opportunity_summary ?? 'Opportunité identifiée à partir des données enrichies.'}\n` +
    `Précautions : ${lead.seller_type === 'particulier' ? 'particulier — validation humaine obligatoire' : 'B2B contextuel — joindre disclaimer opposition'}.\n` +
    `Action recommandée : préparer message ${rendered.subject ? rendered.subject : '(canal au choix)'} puis valider avant envoi.`;
  return { ...rendered, subject: '', body };
}
