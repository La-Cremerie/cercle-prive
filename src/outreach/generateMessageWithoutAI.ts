import type {
  EnrichedLead,
  MultiChannelOutreach,
  OutreachMessage,
  OutreachChannel,
  RiskFlag,
} from '../types/Outreach.js';
import { assessCompliance } from './outreachCompliance.js';
import {
  renderTemplate,
  selectTemplateKey,
  renderShortVariant,
  renderLinkedInVariant,
  renderCallScript,
  renderContactForm,
  renderCrmNote,
} from './outreachTemplates.js';

function toMessage(
  channel: OutreachChannel,
  rendered: { subject: string; body: string; cta: string; tone: OutreachMessage['tone']; personalization_points: string[] },
  riskFlags: RiskFlag[],
  complianceNote: string,
): OutreachMessage {
  return {
    channel,
    subject: rendered.subject || undefined,
    body: rendered.body,
    tone: rendered.tone,
    cta: rendered.cta,
    personalization_points: rendered.personalization_points,
    compliance_note: complianceNote,
    human_review_required: true,
    risk_flags: riskFlags,
  };
}

export function generateMessageWithoutAI(
  lead: EnrichedLead,
): MultiChannelOutreach | null {
  if (lead.commercial_priority === 'D') return null;

  const compliance = assessCompliance(lead);
  const complianceNote =
    compliance.outreach_allowed_status === 'allowed_b2b_contextual'
      ? 'B2B contextuel autorisé sous validation humaine.'
      : `À valider manuellement : ${compliance.reasons.join(' ')}`;

  const key = selectTemplateKey(lead);
  const base = renderTemplate(key, lead);

  return {
    email_short: toMessage(
      'email_short',
      renderShortVariant(base, lead),
      compliance.risk_flags,
      complianceNote,
    ),
    email_premium: toMessage(
      'email_premium',
      base,
      compliance.risk_flags,
      complianceNote,
    ),
    linkedin: toMessage(
      'linkedin',
      renderLinkedInVariant(base, lead),
      compliance.risk_flags,
      complianceNote,
    ),
    call_script: toMessage(
      'call',
      renderCallScript(base, lead),
      compliance.risk_flags,
      complianceNote,
    ),
    contact_form: toMessage(
      'contact_form',
      renderContactForm(base, lead),
      compliance.risk_flags,
      complianceNote,
    ),
    crm_note: toMessage(
      'crm_note',
      renderCrmNote(base, lead),
      compliance.risk_flags,
      complianceNote,
    ),
  };
}
