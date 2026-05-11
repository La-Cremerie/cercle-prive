/**
 * CLI Brique 2.
 *
 * Usage :
 *   tsx src/cli/index.ts [--input <csv>] [--output <csv>] [--ai|--no-ai] [--airtable] [--pipeline]
 *
 * Equivalents npm :
 *   npm run enrich        (défaut, auto IA si configurée)
 *   npm run enrich:csv    (CSV → CSV)
 *   npm run enrich:ai     (force IA)
 *   npm run enrich:no-ai  (force fallback règles)
 *   npm run enrich:airtable (push Airtable)
 *   npm run all           (pipeline complet)
 */

import { resolve } from "node:path";
import { env, hasAICapability } from "../utils/env.js";
import { logger, setVerbose } from "../utils/logger.js";
import { readScoredLeadsCsv } from "../utils/csv.js";
import { enrichLeads } from "../enrichment/enrichLead.js";
import { exportEnrichedCsv } from "../exports/exportEnrichedCsv.js";
import { exportEnrichedJson } from "../exports/exportEnrichedJson.js";
import { exportAirtable } from "../exports/exportAirtable.js";
import { exportLeadBrief } from "../exports/generateLeadBrief.js";
import type { EnrichmentOptions } from "../types/EnrichedLead.js";

interface CliArgs {
  input: string;
  output: string;
  jsonOutput: string;
  briefsDir: string;
  useAI: boolean | null;
  airtable: boolean;
  pipeline: boolean;
  briefs: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const out: CliArgs = {
    input: "data/sample_scored_leads.csv",
    output: "exports/enriched_leads.csv",
    jsonOutput: "exports/enriched_leads.json",
    briefsDir: "exports/briefs",
    useAI: null,
    airtable: false,
    pipeline: false,
    briefs: true,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case "--input":
        out.input = argv[++i];
        break;
      case "--output":
        out.output = argv[++i];
        break;
      case "--json":
        out.jsonOutput = argv[++i];
        break;
      case "--ai":
        out.useAI = true;
        break;
      case "--no-ai":
        out.useAI = false;
        break;
      case "--airtable":
        out.airtable = true;
        break;
      case "--pipeline":
        out.pipeline = true;
        break;
      case "--no-briefs":
        out.briefs = false;
        break;
      case "--briefs-dir":
        out.briefsDir = argv[++i];
        break;
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
    }
  }
  return out;
}

function printHelp(): void {
  process.stdout.write(`Brique 2 - Enrichissement de leads immobiliers

Options :
  --input <csv>        CSV scoré en entrée (défaut: data/sample_scored_leads.csv)
  --output <csv>       CSV enrichi en sortie (défaut: exports/enriched_leads.csv)
  --json <path>        Aussi exporter en JSON (défaut: exports/enriched_leads.json)
  --ai                 Force l'usage de l'IA (si clé présente)
  --no-ai              Force le fallback règles
  --airtable           Push vers Airtable après enrichissement
  --pipeline           Active toutes les sorties + airtable si configuré
  --no-briefs          Désactive l'export des fiches markdown
  --briefs-dir <dir>   Dossier des fiches (défaut: exports/briefs)
  -h, --help           Affiche cette aide
`);
}

async function main(): Promise<void> {
  setVerbose(env.verbose);
  const args = parseArgs(process.argv.slice(2));

  const useAI = args.useAI ?? hasAICapability();
  const options: EnrichmentOptions = {
    useAI,
    enablePappers: env.enablePappers,
    aiProvider: env.aiProvider,
    rateLimitMs: env.aiRateLimitMs,
    verbose: env.verbose,
  };

  logger.info(`Mode IA : ${useAI ? `ON (${env.aiProvider})` : "OFF (règles)"}`);
  logger.info(`Pappers : ${env.enablePappers ? "ON" : "OFF"}`);
  logger.info(`Lecture : ${args.input}`);

  const inputPath = resolve(args.input);
  const leads = await readScoredLeadsCsv(inputPath);
  logger.info(`${leads.length} lead(s) chargé(s).`);

  const enriched = await enrichLeads(leads, options);

  await exportEnrichedCsv(enriched, resolve(args.output));
  logger.success(`CSV : ${args.output}`);

  await exportEnrichedJson(enriched, resolve(args.jsonOutput));
  logger.success(`JSON : ${args.jsonOutput}`);

  if (args.briefs) {
    for (const lead of enriched) {
      await exportLeadBrief(lead, resolve(args.briefsDir));
    }
    logger.success(`Fiches : ${enriched.length} brief(s) → ${args.briefsDir}/`);
  }

  if (args.airtable || (args.pipeline && env.airtableKey)) {
    const { pushed, failed } = await exportAirtable(enriched);
    if (failed === 0) logger.success(`Airtable : ${pushed} record(s) poussé(s).`);
    else logger.warn(`Airtable : ${pushed} ok / ${failed} échec(s).`);
  }

  const byPriority = enriched.reduce<Record<string, number>>((acc, l) => {
    acc[l.commercial_priority] = (acc[l.commercial_priority] ?? 0) + 1;
    return acc;
  }, {});
  logger.info(
    `Répartition priorité : ` +
      ["A", "B", "C", "D"].map((p) => `${p}=${byPriority[p] ?? 0}`).join("  "),
  );

  logger.success("Brique 2 terminée.");
}

main().catch((err) => {
  logger.error("Pipeline en échec", err);
  process.exit(1);
});
