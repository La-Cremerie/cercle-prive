import type { OutreachOutput } from '../types/Outreach.js';

export interface CrmPayload {
  lead_id: string;
  source_url: string | null;
  city: string | null;
  agency_name: string | null;
  seller_type: string;
  commercial_priority: string;
  outreach_allowed_status: string;
  recommended_channel: string;
  recommended_tone: string;
  validation_status: string;
  gdpr_disclaimer_included: boolean;
  human_review_required: boolean;
  risk_flags: string;
  reviewer_notes: string;

  email_short_subject: string;
  email_short_body: string;
  email_premium_subject: string;
  email_premium_body: string;
  linkedin_message: string;
  call_script: string;
  contact_form_message: string;
  crm_note: string;

  sequence_step_1_delay: number | string;
  sequence_step_1_message: string;
  sequence_step_2_delay: number | string;
  sequence_step_2_message: string;
  sequence_step_3_delay: number | string;
  sequence_step_3_message: string;
  sequence_step_4_delay: number | string;
  sequence_step_4_message: string;

  generator_mode: string;
  ai_model: string;
  created_at: string;
}

export function prepareOutreachCrmPayload(out: OutreachOutput): CrmPayload {
  const m = out.messages;
  const seq = out.sequence;

  const step = (n: number): { delay: number | string; message: string } => {
    const s = seq.find((x) => x.step === n);
    return s
      ? { delay: s.delay_days, message: s.message }
      : { delay: '', message: '' };
  };

  return {
    lead_id: out.lead_id,
    source_url: out.source_url,
    city: out.city,
    agency_name: out.agency_name,
    seller_type: out.seller_type,
    commercial_priority: out.commercial_priority,
    outreach_allowed_status: out.outreach_allowed_status,
    recommended_channel: out.recommended_channel,
    recommended_tone: out.recommended_tone,
    validation_status: out.validation_status,
    gdpr_disclaimer_included: out.gdpr_disclaimer_included,
    human_review_required: out.human_review_required,
    risk_flags: out.risk_flags.join('|'),
    reviewer_notes: out.reviewer_notes,

    email_short_subject: m?.email_short.subject ?? '',
    email_short_body: m?.email_short.body ?? '',
    email_premium_subject: m?.email_premium.subject ?? '',
    email_premium_body: m?.email_premium.body ?? '',
    linkedin_message: m?.linkedin.body ?? '',
    call_script: m?.call_script.body ?? '',
    contact_form_message: m?.contact_form.body ?? '',
    crm_note: m?.crm_note.body ?? '',

    sequence_step_1_delay: step(1).delay,
    sequence_step_1_message: step(1).message,
    sequence_step_2_delay: step(2).delay,
    sequence_step_2_message: step(2).message,
    sequence_step_3_delay: step(3).delay,
    sequence_step_3_message: step(3).message,
    sequence_step_4_delay: step(4).delay,
    sequence_step_4_message: step(4).message,

    generator_mode: out.generator_mode,
    ai_model: out.ai_model ?? '',
    created_at: out.created_at,
  };
}
