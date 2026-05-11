import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import "dotenv/config";
import { runApifyScrapers } from "./scrapers/apifyClient.js";
import { importCsv } from "./scrapers/importCsv.js";
import { scoreLead } from "./scoring/scoreLead.js";
import { exportCsv } from "./exports/exportCsv.js";
import { exportJson } from "./exports/exportJson.js";
import { exportAirtable } from "./exports/exportAirtable.js";
import type { Lead } from "./types/Lead.js";

const EXPORTS_DIR = "./exports";
const LATEST_LEADS_PATH = join(EXPORTS_DIR, "latest_leads.json");
const LOG_PATH = join(EXPORTS_DIR, "pipeline.log");

function todayStamp(): string {
  return new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);
}

function log(message: string): void {
  const line = `[${new Date().toISOString()}] ${message}`;
  console.log(line);
  try {
    mkdirSync(EXPORTS_DIR, { recursive: true });
    appendFileSync(LOG_PATH, line + "\n");
  } catch {
    // logging best-effort
  }
}

function applyScoring(leads: Lead[]): Lead[] {
  return leads.map((l) => {
    const r = scoreLead(l);
    return {
      ...l,
      total_score: r.total_score,
      score_breakdown: r.score_breakdown,
      score_category: r.score_category,
      detected_opportunities: r.detected_opportunities,
      suggested_commercial_angle: r.suggested_commercial_angle,
      recommended_offer: r.recommended_offer,
      short_analysis: r.short_analysis,
      renovation_keywords_found: r.renovation_keywords_found,
      luxury_keywords_found: r.luxury_keywords_found,
      weakness_keywords_found: r.weakness_keywords_found,
      opportunity_keywords_found: r.opportunity_keywords_found,
    };
  });
}

function saveLatest(leads: Lead[]): void {
  mkdirSync(EXPORTS_DIR, { recursive: true });
  writeFileSync(LATEST_LEADS_PATH, JSON.stringify(leads, null, 2), "utf-8");
}

function loadLatest(): Lead[] {
  if (!existsSync(LATEST_LEADS_PATH)) {
    throw new Error(
      `Aucun batch trouvé à ${LATEST_LEADS_PATH}. Lancer 'npm run scrape' ou 'npm run import:csv -- <fichier.csv>' d'abord.`
    );
  }
  return JSON.parse(readFileSync(LATEST_LEADS_PATH, "utf-8")) as Lead[];
}

async function commandScrape(): Promise<Lead[]> {
  log("scrape: démarrage Apify");
  const leads = await runApifyScrapers();
  log(`scrape: ${leads.length} leads collectés`);
  saveLatest(leads);
  return leads;
}

function commandImportCsv(path: string | undefined): Lead[] {
  if (!path) {
    throw new Error("Usage: npm run import:csv -- <chemin/vers/fichier.csv>");
  }
  log(`import:csv: lecture de ${path}`);
  const leads = importCsv(path);
  log(`import:csv: ${leads.length} leads importés`);
  saveLatest(leads);
  return leads;
}

function commandScore(): Lead[] {
  log("score: application des règles de scoring");
  const leads = loadLatest();
  const scored = applyScoring(leads).sort(
    (a, b) => (b.total_score ?? 0) - (a.total_score ?? 0)
  );
  log(`score: ${scored.length} leads scorés`);
  saveLatest(scored);
  return scored;
}

async function commandExport(): Promise<void> {
  log("export: écriture CSV / JSON / Airtable");
  const leads = loadLatest();
  const stamp = todayStamp();
  exportCsv(leads, join(EXPORTS_DIR, `leads_${stamp}.csv`));
  exportJson(leads, join(EXPORTS_DIR, `leads_${stamp}.json`));
  if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
    await exportAirtable(leads);
  } else {
    log("export: Airtable ignoré (variables d'environnement manquantes)");
  }
}

async function main(): Promise<void> {
  const cmd = process.argv[2];
  const arg = process.argv[3];

  switch (cmd) {
    case "scrape":
      await commandScrape();
      break;
    case "import:csv":
      commandImportCsv(arg);
      break;
    case "score":
      commandScore();
      break;
    case "export":
      await commandExport();
      break;
    case "all": {
      if (arg && arg.endsWith(".csv")) {
        commandImportCsv(arg);
      } else {
        await commandScrape();
      }
      commandScore();
      await commandExport();
      break;
    }
    default:
      console.error(
        "Usage: npm run scrape | npm run import:csv -- <file.csv> | npm run score | npm run export | npm run all [<file.csv>]"
      );
      process.exit(1);
  }
}

main().catch((err) => {
  console.error("Pipeline en échec :", err);
  process.exit(1);
});
