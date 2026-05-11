import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { OutreachOutput } from '../types/Outreach.js';
import { prepareOutreachCrmPayload } from '../crm/prepareOutreachCrmPayload.js';

const CSV_HEADERS = [
  'id',
  'created_at',
  'source_url',
  'city',
  'agency_name',
  'seller_type',
  'commercial_priority',
  'outreach_allowed_status',
  'human_review_required',
  'risk_flags',
  'recommended_channel',
  'recommended_tone',
  'email_short_subject',
  'email_short_body',
  'email_premium_subject',
  'email_premium_body',
  'linkedin_message',
  'call_script',
  'contact_form_message',
  'crm_note',
  'sequence_step_1_message',
  'sequence_step_1_delay',
  'sequence_step_2_message',
  'sequence_step_2_delay',
  'sequence_step_3_message',
  'sequence_step_3_delay',
  'sequence_step_4_message',
  'sequence_step_4_delay',
  'gdpr_disclaimer_included',
  'validation_status',
  'reviewer_notes',
] as const;

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n;]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function toCsv(outputs: OutreachOutput[]): string {
  const rows: string[] = [];
  rows.push(CSV_HEADERS.join(','));
  for (const out of outputs) {
    const p = prepareOutreachCrmPayload(out);
    const row = [
      out.id,
      p.created_at,
      p.source_url,
      p.city,
      p.agency_name,
      p.seller_type,
      p.commercial_priority,
      p.outreach_allowed_status,
      p.human_review_required,
      p.risk_flags,
      p.recommended_channel,
      p.recommended_tone,
      p.email_short_subject,
      p.email_short_body,
      p.email_premium_subject,
      p.email_premium_body,
      p.linkedin_message,
      p.call_script,
      p.contact_form_message,
      p.crm_note,
      p.sequence_step_1_message,
      p.sequence_step_1_delay,
      p.sequence_step_2_message,
      p.sequence_step_2_delay,
      p.sequence_step_3_message,
      p.sequence_step_3_delay,
      p.sequence_step_4_message,
      p.sequence_step_4_delay,
      p.gdpr_disclaimer_included,
      p.validation_status,
      p.reviewer_notes,
    ].map(csvEscape);
    rows.push(row.join(','));
  }
  return rows.join('\n');
}

export async function exportOutreachCsv(
  outputs: OutreachOutput[],
  filePath: string,
): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, toCsv(outputs), 'utf8');
}
