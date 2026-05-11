import type {
  EnrichedLead,
  MultiChannelOutreach,
  OutreachChannel,
  OutreachMessage,
} from '../types/Outreach.js';
import { generateMessageWithoutAI } from './generateMessageWithoutAI.js';
import {
  generateMessageWithAI,
  type AiOutreachConfig,
} from './generateMessageWithAI.js';
import { pickToneForLead } from './outreachToneRules.js';
import { assessCompliance } from './outreachCompliance.js';
import { validateOutreachContent } from './outreachGuards.js';

export interface GenerateOptions {
  ai?: AiOutreachConfig | null;
  preferredChannel?: OutreachChannel;
}

export function pickRecommendedChannel(lead: EnrichedLead): OutreachChannel {
  if (lead.seller_type === 'particulier') return 'crm_note';
  if (lead.commercial_priority === 'C') return 'crm_note';
  if (lead.commercial_priority === 'D') return 'crm_note';
  if (lead.contact_email) {
    return lead.commercial_priority === 'A' ? 'email_premium' : 'email_short';
  }
  if (lead.contact_linkedin) return 'linkedin';
  return 'contact_form';
}

export async function generateProspectionMessage(
  lead: EnrichedLead,
  opts: GenerateOptions = {},
): Promise<OutreachMessage | null> {
  const compliance = assessCompliance(lead);
  if (compliance.outreach_allowed_status === 'not_recommended') return null;

  const channel = opts.preferredChannel ?? pickRecommendedChannel(lead);
  const multi: MultiChannelOutreach | null = opts.ai
    ? await generateMessageWithAI(lead, opts.ai)
    : generateMessageWithoutAI(lead);
  if (!multi) return null;

  const message = pickChannelMessage(multi, channel);
  message.tone = pickToneForLead(lead);
  message.compliance_note =
    compliance.reasons.join(' ') || message.compliance_note;
  message.risk_flags = Array.from(
    new Set([...message.risk_flags, ...compliance.risk_flags]),
  );
  message.human_review_required = true;

  const validation = validateOutreachContent(message, lead);
  if (!validation.is_valid) {
    message.compliance_note += ` | ALERTE : ${validation.warnings.join(' ')}`;
  }
  return message;
}

function pickChannelMessage(
  multi: MultiChannelOutreach,
  channel: OutreachChannel,
): OutreachMessage {
  switch (channel) {
    case 'email_short':
      return multi.email_short;
    case 'email_premium':
      return multi.email_premium;
    case 'linkedin':
      return multi.linkedin;
    case 'call':
      return multi.call_script;
    case 'contact_form':
      return multi.contact_form;
    case 'crm_note':
      return multi.crm_note;
    case 'courrier':
      return { ...multi.email_premium, channel: 'courrier' };
  }
}
