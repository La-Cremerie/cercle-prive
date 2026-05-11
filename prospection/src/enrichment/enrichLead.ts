/**
 * Pipeline principal d'enrichissement d'un lead.
 * Coordonne : règles, IA (optionnelle), B2B (Pappers + contacts publics).
 */

import type { EnrichedLead, EnrichmentOptions, ScoredLead } from "../types/EnrichedLead.js";
import { enrichAgencyB2B, applyB2BEnrichment } from "./enrichAgencyB2B.js";
import { enrichLeadWithAI } from "./enrichLeadWithAI.js";
import { enrichLeadWithoutAI } from "./enrichLeadWithoutAI.js";
import { hasAICapability } from "../utils/env.js";
import { logger, sleep } from "../utils/logger.js";

export async function enrichLead(
  lead: ScoredLead,
  options: EnrichmentOptions,
): Promise<EnrichedLead> {
  const useAI = options.useAI && hasAICapability();

  let enriched: EnrichedLead;
  try {
    enriched = useAI ? await enrichLeadWithAI(lead) : enrichLeadWithoutAI(lead);
  } catch (err) {
    logger.error(`Échec enrichissement ${lead.id}, fallback règles`, err);
    enriched = enrichLeadWithoutAI(lead);
    enriched.enrichment_status = "error";
  }

  if (options.enablePappers || lead.seller_type === "agence" || lead.seller_type === "pro") {
    const b2b = await enrichAgencyB2B(lead);
    enriched = applyB2BEnrichment(enriched, b2b);
  }

  // Garde-fou final : human_review_required reste true par défaut.
  enriched.human_review_required = true;

  return enriched;
}

export async function enrichLeads(
  leads: ScoredLead[],
  options: EnrichmentOptions,
): Promise<EnrichedLead[]> {
  const out: EnrichedLead[] = [];
  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    logger.info(`Enrichissement ${i + 1}/${leads.length} : ${lead.id} (${lead.city ?? "?"})`);
    const enriched = await enrichLead(lead, options);
    out.push(enriched);
    if (options.useAI && i < leads.length - 1) {
      await sleep(options.rateLimitMs);
    }
  }
  return out;
}
