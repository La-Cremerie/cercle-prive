import { ApifyClient } from "apify-client";
import {
  DEFAULT_RUN_CONFIG,
  SOURCES,
  type ApifyRunConfig,
} from "../config/sources.js";
import {
  normalizeRealEstateLead,
  type RawListing,
} from "../normalizers/normalizeRealEstateLead.js";
import { GIRONDE_DEPARTMENT_PREFIX } from "../config/citiesGironde.js";
import type { Lead } from "../types/Lead.js";

export interface ScrapeOptions {
  config?: Partial<ApifyRunConfig>;
  onlySources?: string[];
}

function inGironde(lead: Lead): boolean {
  if (!lead.postal_code) return true;
  return lead.postal_code.startsWith(GIRONDE_DEPARTMENT_PREFIX);
}

function dedupe(leads: Lead[]): Lead[] {
  const seen = new Map<string, Lead>();
  for (const lead of leads) {
    const key =
      lead.price && lead.surface_m2 && lead.postal_code
        ? `${lead.price}-${lead.surface_m2}-${lead.postal_code}`
        : `${lead.source}-${lead.source_url}`;
    const existing = seen.get(key);
    if (!existing || (lead.description.length > existing.description.length)) {
      seen.set(key, lead);
    }
  }
  return [...seen.values()];
}

export async function runApifyScrapers(options: ScrapeOptions = {}): Promise<Lead[]> {
  const token = process.env.APIFY_TOKEN;
  if (!token) {
    throw new Error(
      "APIFY_TOKEN manquant. Renseigner la variable dans .env ou exporter APIFY_TOKEN avant la commande."
    );
  }

  const cfg: ApifyRunConfig = { ...DEFAULT_RUN_CONFIG, ...options.config };
  const client = new ApifyClient({ token });
  const leads: Lead[] = [];

  for (const source of SOURCES) {
    if (!source.enabled || !source.apify_actor_id || !source.build_input) {
      console.log(`[apify] skip ${source.name} (${source.note ?? "désactivé"})`);
      continue;
    }
    if (options.onlySources && !options.onlySources.includes(source.name)) continue;

    console.log(`[apify] running ${source.apify_actor_id} pour ${source.name}`);
    try {
      const run = await client.actor(source.apify_actor_id).call(source.build_input(cfg));
      const { items } = await client.dataset(run.defaultDatasetId).listItems();
      console.log(`[apify]   -> ${items.length} éléments bruts depuis ${source.name}`);
      for (const raw of items as RawListing[]) {
        leads.push(normalizeRealEstateLead(raw, source.name));
      }
    } catch (err) {
      console.warn(`[apify] actor ${source.name} en échec : ${(err as Error).message}`);
    }
  }

  const filtered = leads.filter(inGironde);
  const deduped = dedupe(filtered);
  console.log(
    `[apify] total ${leads.length} (Gironde: ${filtered.length}, après dédoublonnage: ${deduped.length})`
  );
  return deduped;
}
