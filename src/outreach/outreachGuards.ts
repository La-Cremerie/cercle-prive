import type {
  EnrichedLead,
  OutreachMessage,
  OutreachValidationResult,
} from '../types/Outreach.js';
import { GDPR_OPT_OUT_LINE, isB2BChannel } from './outreachCompliance.js';

const FORBIDDEN_PATTERNS: { pattern: RegExp; reason: string; severity: 'low' | 'medium' | 'high' }[] = [
  {
    pattern: /votre bien est mal vendu/i,
    reason: 'Critique frontale de l’annonce',
    severity: 'high',
  },
  {
    pattern: /vous (vendez|vous y prenez) mal/i,
    reason: 'Critique frontale du vendeur',
    severity: 'high',
  },
  {
    pattern: /(\+|\b)\s*\d{2,3}\s*%\s*(de plus|en plus|de marge|de rendement)/i,
    reason: 'Promesse chiffrée non vérifiée',
    severity: 'high',
  },
  {
    pattern: /garantie? (de|d’|d')\s*(vendre|valor|prix)/i,
    reason: 'Promesse contractuelle non tenable',
    severity: 'high',
  },
  {
    pattern: /(dernière chance|urgent|attention|act(ez|ions) (vite|maintenant))/i,
    reason: 'Urgence artificielle',
    severity: 'medium',
  },
  {
    pattern: /votre situation (personnelle|familiale|financière)/i,
    reason: 'Intrusion personnelle',
    severity: 'high',
  },
  {
    pattern: /(IA|intelligence artificielle|robot|scraping|scrap(é|er)|bot)/i,
    reason: 'Mention d’IA / scraping / robot interdite',
    severity: 'medium',
  },
  {
    pattern: /votre agence ne (sait|fait) pas/i,
    reason: 'Critique d’agence',
    severity: 'high',
  },
];

const MAX_LENGTHS: Record<string, number> = {
  email_short: 900,
  email_premium: 1400,
  linkedin: 320,
  call: 1200,
  contact_form: 650,
  crm_note: 800,
  courrier: 1400,
};

export function validateOutreachContent(
  message: OutreachMessage,
  lead: EnrichedLead,
): OutreachValidationResult {
  const warnings: string[] = [];
  let severity: 'none' | 'low' | 'medium' | 'high' = 'none';
  const text = `${message.subject ?? ''}\n${message.body}`;

  for (const rule of FORBIDDEN_PATTERNS) {
    if (rule.pattern.test(text)) {
      warnings.push(`Contenu sensible détecté : ${rule.reason}.`);
      severity = bumpSeverity(severity, rule.severity);
    }
  }

  const maxLen = MAX_LENGTHS[message.channel] ?? 1500;
  if (message.body.length > maxLen) {
    warnings.push(
      `Longueur excessive pour le canal ${message.channel} (${message.body.length} > ${maxLen}).`,
    );
    severity = bumpSeverity(severity, 'low');
  }

  if (isB2BChannel(message.channel) && !text.includes(GDPR_OPT_OUT_LINE)) {
    warnings.push('Mention d’opposition (RGPD) absente du message B2B.');
    severity = bumpSeverity(severity, 'medium');
  }

  if (lead.seller_type === 'particulier' && message.channel !== 'crm_note') {
    warnings.push(
      'Le lead est un particulier : aucun message direct ne devrait être envoyé sans validation explicite.',
    );
    severity = bumpSeverity(severity, 'high');
  }

  if (containsFabricatedData(message, lead)) {
    warnings.push('Possible invention de données absentes du lead.');
    severity = bumpSeverity(severity, 'medium');
  }

  return {
    is_valid: severity !== 'high',
    warnings,
    severity,
    suggested_fix: warnings.length > 0 ? buildSuggestion(warnings) : null,
  };
}

function bumpSeverity(
  current: 'none' | 'low' | 'medium' | 'high',
  next: 'low' | 'medium' | 'high',
): 'none' | 'low' | 'medium' | 'high' {
  const order = { none: 0, low: 1, medium: 2, high: 3 } as const;
  return order[next] > order[current] ? next : current;
}

function buildSuggestion(warnings: string[]): string {
  return [
    'Reformuler en supprimant toute critique frontale, promesse chiffrée et urgence artificielle.',
    'Vérifier la présence de la mention d’opposition RGPD.',
    'Limiter la personnalisation aux données réellement présentes dans le lead.',
    `Points à corriger : ${warnings.join(' | ')}`,
  ].join('\n');
}

function containsFabricatedData(
  message: OutreachMessage,
  lead: EnrichedLead,
): boolean {
  const text = `${message.subject ?? ''} ${message.body}`.toLowerCase();
  const claimedAgency = /agence\s+([A-Za-zÀ-ÿ' -]{3,40})/.exec(message.body);
  if (claimedAgency && lead.agency_name) {
    if (!text.includes(lead.agency_name.toLowerCase())) {
      return true;
    }
  }
  const priceMatch = /\b(\d{2,4})\s?(?:000|k)\s?€/.exec(text);
  if (priceMatch && !lead.price_eur) {
    return true;
  }
  return false;
}
