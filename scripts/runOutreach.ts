/**
 * Brique 3 — Outreach Generator
 *
 * Lit /data/sample_enriched_leads.csv (ou un chemin passé en --input),
 * génère messages multi-canaux + séquence pour chaque lead,
 * exporte CSV + JSON + Markdown sous /exports/outreach/.
 *
 * Aucun envoi automatique. Toutes les sorties exigent validation humaine.
 */

import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { generateMultiChannelOutreach } from '../src/outreach/generateMultiChannelOutreach.js';
import { generateOutreachSequence } from '../src/outreach/generateOutreachSequence.js';
import { pickToneForLead } from '../src/outreach/outreachToneRules.js';
import { pickRecommendedChannel } from '../src/outreach/generateProspectionMessage.js';
import { assessCompliance } from '../src/outreach/outreachCompliance.js';
import { exportOutreachCsv } from '../src/exports/exportOutreachCsv.js';
import { exportOutreachJson } from '../src/exports/exportOutreachJson.js';
import { exportOutreachMarkdown } from '../src/exports/exportOutreachMarkdown.js';
import type {
  EnrichedLead,
  OutreachOutput,
  CommercialPriority,
  SellerType,
  DataConfidence,
  LikelyBuyerProfile,
} from '../src/types/Outreach.js';
import type { AiOutreachConfig } from '../src/outreach/generateMessageWithAI.js';

interface RunFlags {
  csvIn: string;
  csvOut: string;
  jsonOut: string;
  mdDir: string;
  ai: boolean;
  noAi: boolean;
  mdOnly: boolean;
}

function parseFlags(argv: string[]): RunFlags {
  const get = (name: string, dflt: string): string => {
    const idx = argv.findIndex((a) => a === `--${name}` || a.startsWith(`--${name}=`));
    if (idx === -1) return dflt;
    const arg = argv[idx];
    if (arg.includes('=')) return arg.split('=').slice(1).join('=');
    return argv[idx + 1] ?? dflt;
  };
  const has = (name: string): boolean => argv.includes(`--${name}`);

  return {
    csvIn: get('input', 'data/sample_enriched_leads.csv'),
    csvOut: get('out-csv', 'exports/outreach/outreach_messages.csv'),
    jsonOut: get('out-json', 'exports/outreach/outreach_messages.json'),
    mdDir: get('out-md', 'exports/outreach/markdown'),
    ai: has('ai'),
    noAi: has('no-ai'),
    mdOnly: has('md-only'),
  };
}

function parseCsv(content: string): Record<string, string>[] {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];
  const parseLine = (line: string): string[] => {
    const out: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQuotes) {
        if (c === '"' && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (c === '"') {
          inQuotes = false;
        } else {
          cur += c;
        }
      } else {
        if (c === '"') inQuotes = true;
        else if (c === ',') {
          out.push(cur);
          cur = '';
        } else cur += c;
      }
    }
    out.push(cur);
    return out;
  };
  const headers = parseLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = parseLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => (row[h] = (values[i] ?? '').trim()));
    return row;
  });
}

function rowToLead(row: Record<string, string>): EnrichedLead {
  const num = (v: string): number | null => {
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const bool = (v: string): boolean | undefined => {
    if (!v) return undefined;
    const lower = v.toLowerCase();
    if (['true', '1', 'yes', 'oui'].includes(lower)) return true;
    if (['false', '0', 'no', 'non'].includes(lower)) return false;
    return undefined;
  };
  const levers = (row.identified_levers || '')
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    id: row.id || cryptoRandomId(),
    created_at: row.created_at || new Date().toISOString(),
    source_url: row.source_url || null,
    city: row.city || null,
    zone: row.zone || null,
    agency_name: row.agency_name || null,
    contact_first_name: row.contact_first_name || null,
    contact_last_name: row.contact_last_name || null,
    contact_email: row.contact_email || null,
    contact_linkedin: row.contact_linkedin || null,
    contact_phone: row.contact_phone || null,
    seller_type: (row.seller_type || 'inconnu') as SellerType,
    likely_buyer_profile: (row.likely_buyer_profile || null) as LikelyBuyerProfile | null,
    commercial_priority: (row.commercial_priority || 'C') as CommercialPriority,
    property_type: row.property_type || null,
    surface_m2: num(row.surface_m2),
    price_eur: num(row.price_eur),
    bedrooms: num(row.bedrooms),
    opportunity_summary: row.opportunity_summary || null,
    identified_levers: levers,
    data_confidence: (row.data_confidence || undefined) as DataConfidence | undefined,
    is_public_b2b_data: bool(row.is_public_b2b_data),
    score: num(row.score) ?? undefined,
    notes: row.notes || null,
  };
}

function cryptoRandomId(): string {
  return 'lead_' + Math.random().toString(36).slice(2, 10);
}

function buildAiConfig(): AiOutreachConfig | null {
  const enabled = (process.env.ENABLE_AI_OUTREACH || 'false').toLowerCase() === 'true';
  if (!enabled) return null;
  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase() as
    | 'openai'
    | 'anthropic';
  const key =
    provider === 'anthropic'
      ? process.env.ANTHROPIC_API_KEY
      : process.env.OPENAI_API_KEY;
  if (!key) {
    console.warn(
      `[outreach] ENABLE_AI_OUTREACH=true mais ${provider === 'anthropic' ? 'ANTHROPIC_API_KEY' : 'OPENAI_API_KEY'} manquant. Fallback templates.`,
    );
    return null;
  }
  return { provider, apiKey: key, model: process.env.AI_MODEL };
}

async function main(): Promise<void> {
  const flags = parseFlags(process.argv.slice(2));
  const aiConfig = flags.noAi ? null : flags.ai ? buildAiConfig() : buildAiConfig();
  if (flags.ai && !aiConfig) {
    console.warn('[outreach] --ai demandé mais configuration IA indisponible.');
  }

  const csvPath = resolve(process.cwd(), flags.csvIn);
  console.log(`[outreach] Lecture des leads enrichis depuis : ${csvPath}`);
  const content = await readFile(csvPath, 'utf8').catch((err) => {
    console.error(`[outreach] Impossible de lire ${csvPath}: ${(err as Error).message}`);
    process.exit(1);
  });
  const rows = parseCsv(content as string);
  console.log(`[outreach] ${rows.length} leads détectés.`);

  const outputs: OutreachOutput[] = [];
  for (const row of rows) {
    const lead = rowToLead(row);
    const compliance = assessCompliance(lead);
    const tone = pickToneForLead(lead);
    const channel = pickRecommendedChannel(lead);

    const generatorMode: OutreachOutput['generator_mode'] =
      lead.commercial_priority === 'D'
        ? 'none'
        : aiConfig
          ? 'ai'
          : 'template';

    const messages =
      lead.commercial_priority === 'D'
        ? null
        : await generateMultiChannelOutreach(lead, { ai: aiConfig });

    const sequence = generateOutreachSequence(lead);

    const gdprIncluded =
      !!messages &&
      (messages.email_short.body.includes('je ne vous recontacterai pas') ||
        messages.email_premium.body.includes('je ne vous recontacterai pas'));

    outputs.push({
      id: 'outreach_' + lead.id,
      lead_id: lead.id,
      created_at: new Date().toISOString(),
      source_url: lead.source_url ?? null,
      city: lead.city ?? null,
      agency_name: lead.agency_name ?? null,
      seller_type: lead.seller_type,
      commercial_priority: lead.commercial_priority,
      outreach_allowed_status: compliance.outreach_allowed_status,
      human_review_required: true,
      risk_flags: compliance.risk_flags,
      recommended_channel: channel,
      recommended_tone: tone,
      messages,
      sequence,
      gdpr_disclaimer_included: gdprIncluded,
      validation_status: 'pending_human_review',
      reviewer_notes: '',
      generator_mode: generatorMode,
      ai_model: aiConfig?.model,
    });
  }

  if (!flags.mdOnly) {
    await exportOutreachCsv(outputs, resolve(process.cwd(), flags.csvOut));
    console.log(`[outreach] CSV exporté : ${flags.csvOut}`);
    await exportOutreachJson(outputs, resolve(process.cwd(), flags.jsonOut));
    console.log(`[outreach] JSON exporté : ${flags.jsonOut}`);
  }

  const mdPaths = await exportOutreachMarkdown(
    outputs,
    resolve(process.cwd(), flags.mdDir),
  );
  console.log(`[outreach] ${mdPaths.length} fiches Markdown générées dans : ${flags.mdDir}`);

  const summary = outputs.reduce<Record<string, number>>((acc, o) => {
    acc[o.outreach_allowed_status] = (acc[o.outreach_allowed_status] ?? 0) + 1;
    return acc;
  }, {});
  console.log('[outreach] Récapitulatif statuts :', summary);
  console.log(
    `[outreach] Tous les outputs sont en statut "pending_human_review". Aucun envoi automatique. (sortie : ${join(flags.csvOut)})`,
  );
}

main().catch((err) => {
  console.error('[outreach] Erreur :', err);
  process.exit(1);
});
