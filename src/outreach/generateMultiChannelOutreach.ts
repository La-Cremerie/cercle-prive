import type {
  EnrichedLead,
  MultiChannelOutreach,
} from '../types/Outreach.js';
import { generateMessageWithoutAI } from './generateMessageWithoutAI.js';
import {
  generateMessageWithAI,
  type AiOutreachConfig,
} from './generateMessageWithAI.js';
import { assessCompliance } from './outreachCompliance.js';
import { validateOutreachContent } from './outreachGuards.js';

export interface MultiChannelOptions {
  ai?: AiOutreachConfig | null;
}

export async function generateMultiChannelOutreach(
  lead: EnrichedLead,
  opts: MultiChannelOptions = {},
): Promise<MultiChannelOutreach | null> {
  const compliance = assessCompliance(lead);
  if (compliance.outreach_allowed_status === 'not_recommended') return null;

  const multi: MultiChannelOutreach | null = opts.ai
    ? await generateMessageWithAI(lead, opts.ai)
    : generateMessageWithoutAI(lead);
  if (!multi) return null;

  for (const key of Object.keys(multi) as (keyof MultiChannelOutreach)[]) {
    const msg = multi[key];
    msg.risk_flags = Array.from(
      new Set([...msg.risk_flags, ...compliance.risk_flags]),
    );
    msg.human_review_required = true;
    const validation = validateOutreachContent(msg, lead);
    if (!validation.is_valid) {
      msg.compliance_note += ` | ALERTE : ${validation.warnings.join(' ')}`;
    }
  }
  return multi;
}
