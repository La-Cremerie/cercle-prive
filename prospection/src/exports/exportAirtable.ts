/**
 * Push vers Airtable via REST API (fetch natif, sans SDK).
 * Tolérant aux champs inconnus côté base Airtable : on log un warning et on poursuit.
 */

import { env } from "../utils/env.js";
import { logger, sleep } from "../utils/logger.js";
import type { EnrichedLead } from "../types/EnrichedLead.js";
import { prepareCrmPayload } from "../crm/prepareCrmPayload.js";

interface AirtableRecord {
  fields: Record<string, unknown>;
}

interface AirtableResponse {
  records?: Array<{ id: string }>;
  error?: { type?: string; message?: string };
}

const BATCH_SIZE = 10;
const RATE_LIMIT_MS = 250;

function airtableUrl(): string {
  return `https://api.airtable.com/v0/${env.airtableBaseId}/${encodeURIComponent(env.airtableTable)}`;
}

function toAirtableFields(lead: EnrichedLead): Record<string, unknown> {
  const payload = prepareCrmPayload(lead);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(payload.fields)) {
    if (v === null || v === undefined) continue;
    out[k] = v;
  }
  return out;
}

export async function exportAirtable(leads: EnrichedLead[]): Promise<{ pushed: number; failed: number }> {
  if (!env.airtableKey || !env.airtableBaseId) {
    logger.warn("Airtable non configuré (AIRTABLE_API_KEY / AIRTABLE_BASE_ID manquants).");
    return { pushed: 0, failed: leads.length };
  }

  let pushed = 0;
  let failed = 0;

  for (let i = 0; i < leads.length; i += BATCH_SIZE) {
    const batch = leads.slice(i, i + BATCH_SIZE);
    const records: AirtableRecord[] = batch.map((l) => ({ fields: toAirtableFields(l) }));

    const res = await fetch(airtableUrl(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.airtableKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ records, typecast: true }),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as AirtableResponse;
      const detail = body.error?.message ?? `HTTP ${res.status}`;
      logger.error(`Airtable batch ${i / BATCH_SIZE + 1} échec : ${detail}`);
      failed += batch.length;
    } else {
      const body = (await res.json()) as AirtableResponse;
      const count = body.records?.length ?? 0;
      pushed += count;
      logger.debug(`Airtable batch ${i / BATCH_SIZE + 1} : ${count} enregistrement(s).`);
    }

    if (i + BATCH_SIZE < leads.length) await sleep(RATE_LIMIT_MS);
  }

  return { pushed, failed };
}
