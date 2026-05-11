import type {
  EnrichedLead,
  MultiChannelOutreach,
  OutreachChannel,
  OutreachMessage,
  OutreachTone,
} from '../types/Outreach.js';
import { OUTREACH_SYSTEM_PROMPT, buildUserPrompt } from './outreachPrompts.js';
import { appendGdprDisclaimer, assessCompliance, isB2BChannel } from './outreachCompliance.js';
import { generateMessageWithoutAI } from './generateMessageWithoutAI.js';
import { pickToneForLead } from './outreachToneRules.js';

export interface AiOutreachConfig {
  provider: 'openai' | 'anthropic';
  model?: string;
  apiKey: string;
  temperature?: number;
}

interface RawAiResponse {
  subject?: string;
  body?: string;
  cta?: string;
  personalization_points?: string[];
  risk_flags?: string[];
}

async function callOpenAI(
  cfg: AiOutreachConfig,
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify({
      model: cfg.model || 'gpt-4o-mini',
      temperature: cfg.temperature ?? 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`OpenAI API ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content ?? '';
}

async function callAnthropic(
  cfg: AiOutreachConfig,
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': cfg.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: cfg.model || 'claude-sonnet-4-6',
      max_tokens: 1200,
      temperature: cfg.temperature ?? 0.4,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `${userPrompt}\n\nRetourne uniquement un JSON valide.`,
        },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`Anthropic API ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as {
    content?: { type: string; text: string }[];
  };
  const txt = data.content?.find((c) => c.type === 'text')?.text ?? '';
  const match = txt.match(/\{[\s\S]*\}/);
  return match ? match[0] : txt;
}

function parseAi(raw: string): RawAiResponse {
  try {
    return JSON.parse(raw) as RawAiResponse;
  } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]) as RawAiResponse;
      } catch {
        return {};
      }
    }
    return {};
  }
}

async function generateOneChannel(
  cfg: AiOutreachConfig,
  lead: EnrichedLead,
  tone: OutreachTone,
  channel:
    | 'email_short'
    | 'email_premium'
    | 'linkedin'
    | 'call'
    | 'contact_form'
    | 'crm_note',
): Promise<OutreachMessage> {
  const userPrompt = buildUserPrompt({ lead, tone, channel });
  const raw =
    cfg.provider === 'anthropic'
      ? await callAnthropic(cfg, OUTREACH_SYSTEM_PROMPT, userPrompt)
      : await callOpenAI(cfg, OUTREACH_SYSTEM_PROMPT, userPrompt);
  const parsed = parseAi(raw);

  const channelMap: Record<typeof channel, OutreachChannel> = {
    email_short: 'email_short',
    email_premium: 'email_premium',
    linkedin: 'linkedin',
    call: 'call',
    contact_form: 'contact_form',
    crm_note: 'crm_note',
  };
  const outChannel = channelMap[channel];

  let body = (parsed.body ?? '').trim();
  if (isB2BChannel(outChannel) && body) {
    body = appendGdprDisclaimer(body);
  }

  return {
    channel: outChannel,
    subject: parsed.subject || undefined,
    body,
    tone,
    cta: parsed.cta ?? '',
    personalization_points: parsed.personalization_points ?? [],
    compliance_note:
      'Brouillon généré par IA — validation humaine obligatoire avant tout envoi.',
    human_review_required: true,
    risk_flags: (parsed.risk_flags ?? []) as OutreachMessage['risk_flags'],
  };
}

export async function generateMessageWithAI(
  lead: EnrichedLead,
  cfg: AiOutreachConfig,
): Promise<MultiChannelOutreach | null> {
  if (lead.commercial_priority === 'D') return null;
  const compliance = assessCompliance(lead);
  if (compliance.outreach_allowed_status === 'not_recommended') return null;

  const tone = pickToneForLead(lead);

  try {
    const [
      email_short,
      email_premium,
      linkedin,
      call_script,
      contact_form,
      crm_note,
    ] = await Promise.all([
      generateOneChannel(cfg, lead, tone, 'email_short'),
      generateOneChannel(cfg, lead, tone, 'email_premium'),
      generateOneChannel(cfg, lead, tone, 'linkedin'),
      generateOneChannel(cfg, lead, tone, 'call'),
      generateOneChannel(cfg, lead, tone, 'contact_form'),
      generateOneChannel(cfg, lead, tone, 'crm_note'),
    ]);
    return {
      email_short,
      email_premium,
      linkedin,
      call_script,
      contact_form,
      crm_note,
    };
  } catch (err) {
    console.warn(
      `[outreach] AI generation failed for lead ${lead.id}: ${(err as Error).message}. Falling back to templates.`,
    );
    return generateMessageWithoutAI(lead);
  }
}
