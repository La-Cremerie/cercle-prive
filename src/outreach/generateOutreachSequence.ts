import type {
  EnrichedLead,
  OutreachChannel,
  OutreachSequenceStep,
} from '../types/Outreach.js';
import { GDPR_OPT_OUT_LINE } from './outreachCompliance.js';
import { pickRecommendedChannel } from './generateProspectionMessage.js';
import { selectTemplateKey, renderTemplate } from './outreachTemplates.js';

export function generateOutreachSequence(
  lead: EnrichedLead,
): OutreachSequenceStep[] {
  if (lead.commercial_priority === 'D') return [];
  if (lead.commercial_priority === 'C') {
    return [
      {
        step: 1,
        delay_days: 0,
        channel_recommended: 'crm_note',
        message:
          'Priorité C : pas de séquence directe. Garder en surveillance, relance humaine si nouvel élément (changement de prix, nouveau mandat, etc.).',
        goal: 'Mise en suivi passive',
        stop_condition: 'Aucune action automatique',
        human_review_required: true,
      },
    ];
  }

  const channel: OutreachChannel = pickRecommendedChannel(lead);
  const city = lead.city ?? 'votre secteur';
  const key = selectTemplateKey(lead);
  const base = renderTemplate(key, lead);

  const subject = base.subject;

  const step1: OutreachSequenceStep = {
    step: 1,
    delay_days: 0,
    channel_recommended: channel,
    subject,
    message: base.body,
    goal: 'Premier contact contextualisé, sans pression.',
    stop_condition:
      'Stop si réponse, demande de non-sollicitation, ou marqueur "non pertinent".',
    human_review_required: true,
  };

  const step2: OutreachSequenceStep = {
    step: 2,
    delay_days: 4,
    channel_recommended: channel === 'email_premium' ? 'email_short' : channel,
    subject: subject ? `Re: ${subject}` : undefined,
    message:
      `Bonjour,\n\n` +
      `Je me permets une courte relance, sans insister.\n` +
      `Pour préciser : il s’agit simplement d’une lecture rapide à titre indicatif sur ${city}, deux ou trois points concrets, sans engagement.\n\n` +
      `Est-ce que cela vaut le coup que je vous transmette cette lecture ?\n\n` +
      `${GDPR_OPT_OUT_LINE}`,
    goal: 'Apporter une précision et lever un éventuel malentendu.',
    stop_condition: 'Stop si réponse ou marqueur "non pertinent".',
    human_review_required: true,
  };

  const step3: OutreachSequenceStep = {
    step: 3,
    delay_days: 10,
    channel_recommended: channel,
    subject: subject ? `Re: ${subject} — un exemple concret` : undefined,
    message:
      `Bonjour,\n\n` +
      `Pour rendre les choses plus concrètes, voici le type de leviers que nous regardons sur ${city} :\n` +
      `• lisibilité visuelle et éditoriale du bien ;\n` +
      `• perception premium (mise en scène, ameublement léger) ;\n` +
      `• arbitrages travaux à fort impact perçu.\n\n` +
      `Souhaitez-vous que je vous partage les 2 ou 3 leviers que nous avons identifiés ?\n\n` +
      `${GDPR_OPT_OUT_LINE}`,
    goal: 'Mini-analyse / preuve de valeur sans dévoiler tout.',
    stop_condition: 'Stop si réponse, refus, ou absence de signal après cette étape.',
    human_review_required: true,
  };

  const step4: OutreachSequenceStep = {
    step: 4,
    delay_days: 21,
    channel_recommended: channel,
    subject: subject ? `Re: ${subject} — je n’insiste pas` : undefined,
    message:
      `Bonjour,\n\n` +
      `Sans nouvelle de votre côté, j’en déduis que ce n’est pas le bon moment. Je ne vous relancerai pas.\n\n` +
      `Si la question revient plus tard, vous savez où me trouver. Bonne continuation sur ${city}.\n\n` +
      `${GDPR_OPT_OUT_LINE}`,
    goal: 'Clôture élégante, laisse la porte ouverte.',
    stop_condition: 'Fin de la séquence, plus de relance.',
    human_review_required: true,
  };

  return [step1, step2, step3, step4];
}
