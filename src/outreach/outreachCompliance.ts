import type {
  EnrichedLead,
  OutreachAllowedStatus,
  RiskFlag,
} from '../types/Outreach.js';

export const GDPR_OPT_OUT_LINE =
  'Si ce sujet n’est pas pertinent pour vous, indiquez-le-moi simplement et je ne vous recontacterai pas.';

export interface ComplianceAssessment {
  outreach_allowed_status: OutreachAllowedStatus;
  human_review_required: boolean;
  risk_flags: RiskFlag[];
  reasons: string[];
}

export function assessCompliance(lead: EnrichedLead): ComplianceAssessment {
  const flags: RiskFlag[] = [];
  const reasons: string[] = [];

  if (lead.commercial_priority === 'D') {
    flags.push('priorite_d');
    reasons.push('Priorité D : non prioritaire, prise de contact non recommandée.');
    return {
      outreach_allowed_status: 'not_recommended',
      human_review_required: true,
      risk_flags: flags,
      reasons,
    };
  }

  if (lead.seller_type === 'particulier') {
    flags.push('particulier_sans_consentement');
    reasons.push(
      'Particulier : contact non autorisé sans validation humaine et base légale claire.',
    );
    return {
      outreach_allowed_status: 'manual_review_only',
      human_review_required: true,
      risk_flags: flags,
      reasons,
    };
  }

  if (lead.data_confidence === 'low') {
    flags.push('donnees_incertaines');
    reasons.push('Données enrichies à faible confiance.');
  }

  if (
    (lead.seller_type === 'agence' || lead.seller_type === 'professionnel') &&
    !lead.agency_name
  ) {
    flags.push('agency_name_manquant');
    reasons.push('Nom d’agence ou d’entité professionnelle manquant.');
  }

  if (!lead.contact_email) {
    flags.push('email_absent');
    reasons.push('Pas d’email professionnel disponible.');
  }

  if (!lead.zone) {
    flags.push('zone_inconnue');
    reasons.push('Zone géographique non identifiée.');
  }

  const isPublicB2B =
    lead.is_public_b2b_data === true ||
    lead.seller_type === 'agence' ||
    lead.seller_type === 'marchand_de_biens' ||
    lead.seller_type === 'professionnel';

  if (!isPublicB2B) {
    flags.push('absence_contact_pro');
    reasons.push('Données B2B publiques non confirmées.');
    return {
      outreach_allowed_status: 'caution_required',
      human_review_required: true,
      risk_flags: flags,
      reasons,
    };
  }

  if (flags.length > 0) {
    return {
      outreach_allowed_status: 'caution_required',
      human_review_required: true,
      risk_flags: flags,
      reasons,
    };
  }

  return {
    outreach_allowed_status: 'allowed_b2b_contextual',
    human_review_required: true,
    risk_flags: flags,
    reasons: ['Données B2B publiques, contact contextualisé autorisé sous validation humaine.'],
  };
}

export function appendGdprDisclaimer(body: string): string {
  if (body.includes(GDPR_OPT_OUT_LINE)) return body;
  return `${body.trim()}\n\n${GDPR_OPT_OUT_LINE}`;
}

export function isB2BChannel(channel: string): boolean {
  return ['email_short', 'email_premium', 'courrier'].includes(channel);
}
