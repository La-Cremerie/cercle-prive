import type { EnrichedLead, OutreachTone } from '../types/Outreach.js';
import { TONE_RULES, getZoneAngle } from './outreachToneRules.js';

export const OUTREACH_SYSTEM_PROMPT = `Tu es un assistant rédactionnel spécialisé dans la prospection B2B premium pour un service d’audit de valorisation immobilière en Gironde.

Règles absolues :
- Réponds uniquement en français professionnel, sobre et courtois.
- Reste court. Évite toute promesse chiffrée, garantie, urgence artificielle ou superlatif.
- Ne critique jamais l’annonce, l’agence ou le vendeur. N’écris jamais "votre bien est mal vendu" ou équivalent.
- N’invente jamais de données : si une information n’est pas dans le lead, ne la cite pas.
- Ne mentionne jamais : IA, intelligence artificielle, scraping, robot, base de données, automatisation.
- N’exploite jamais d’information sensible ou personnelle. Privilégie l’angle B2B et la valeur professionnelle.
- Termine chaque message email professionnel par une mention d’opposition explicite : "Si ce sujet n’est pas pertinent pour vous, indiquez-le-moi simplement et je ne vous recontacterai pas."
- Adopte une posture partenaire, jamais agressive. Formulations à privilégier : "Nous avons identifié quelques leviers possibles…", "Il pourrait être intéressant d’étudier…", "Sans remettre en cause le travail déjà réalisé…", "Notre approche consiste à améliorer la perception, la valeur et la lisibilité du bien…", "Nous intervenons en amont d’une vente, d’une rénovation ou d’une mise en location…", "L’idée serait de vous transmettre une première lecture rapide…".
- Les CTA autorisés sont uniquement :
  • "Est-ce que cela vaut le coup que je vous transmette une première lecture rapide ?"
  • "Souhaitez-vous que je vous partage les 2 ou 3 leviers que nous avons identifiés ?"
  • "Est-ce pertinent d’en discuter 10 minutes ?"
  • "Je peux vous envoyer une première note synthétique si cela vous intéresse."
  • "Si ce n’est pas le bon sujet, je ne vous relancerai pas."
- Tu produis UNIQUEMENT du JSON valide, sans texte avant ou après, conforme au schéma demandé.
- Si tu ne peux pas générer un message conforme et utile, retourne un JSON avec body vide et un champ risk_flags non vide.

Tu écris des messages prêts à révision humaine. La validation finale et l’envoi sont assurés par un humain en dehors de ce système.`;

export interface AiMessageRequest {
  lead: EnrichedLead;
  tone: OutreachTone;
  channel:
    | 'email_short'
    | 'email_premium'
    | 'linkedin'
    | 'call'
    | 'contact_form'
    | 'crm_note';
}

export function buildUserPrompt(req: AiMessageRequest): string {
  const { lead, tone, channel } = req;
  const rule = TONE_RULES[tone];
  const zoneAngle = getZoneAngle(lead);

  const safeLead = {
    ville: lead.city ?? null,
    zone: lead.zone ?? null,
    agence: lead.agency_name ?? null,
    seller_type: lead.seller_type,
    likely_buyer_profile: lead.likely_buyer_profile ?? null,
    type_bien: lead.property_type ?? null,
    surface_m2: lead.surface_m2 ?? null,
    chambres: lead.bedrooms ?? null,
    prix_eur: lead.price_eur ?? null,
    leviers_identifies: lead.identified_levers ?? [],
    opportunity_summary: lead.opportunity_summary ?? null,
    data_confidence: lead.data_confidence ?? null,
    commercial_priority: lead.commercial_priority,
  };

  const schemaByChannel: Record<string, string> = {
    email_short:
      '{ "subject": "...", "body": "...", "cta": "...", "personalization_points": ["..."], "risk_flags": ["..."] }',
    email_premium:
      '{ "subject": "...", "body": "...", "cta": "...", "personalization_points": ["..."], "risk_flags": ["..."] }',
    linkedin:
      '{ "subject": "", "body": "... (300 caractères max si possible) ...", "cta": "...", "personalization_points": ["..."], "risk_flags": ["..."] }',
    call:
      '{ "subject": "", "body": "Accroche 20s puis question d’ouverture puis proposition de valeur puis sortie polie", "cta": "...", "personalization_points": ["..."], "risk_flags": ["..."] }',
    contact_form:
      '{ "subject": "", "body": "... (600 caractères max) ...", "cta": "...", "personalization_points": ["..."], "risk_flags": ["..."] }',
    crm_note:
      '{ "subject": "", "body": "Angle, pourquoi contacter, précautions, action recommandée", "cta": "", "personalization_points": ["..."], "risk_flags": ["..."] }',
  };

  return [
    `Canal demandé : ${channel}`,
    `Ton demandé : ${tone} (${rule.description}, max ~${rule.max_body_chars} caractères, CTA préféré : "${rule.preferred_cta}")`,
    `Angle géographique : ${zoneAngle}`,
    'Données du lead (n’invente rien hors de ces données) :',
    JSON.stringify(safeLead, null, 2),
    '',
    'Consigne :',
    '- Rédige un message contextualisé et utile, sans agressivité ni promesse chiffrée.',
    '- Pour un email professionnel, termine par la mention d’opposition exigée.',
    '- N’ajoute pas la signature (un placeholder sera ajouté ensuite).',
    '- Réponds en JSON valide uniquement, conforme au schéma suivant :',
    schemaByChannel[channel],
  ].join('\n');
}
