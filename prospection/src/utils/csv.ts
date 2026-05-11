/**
 * Lecture CSV → ScoredLead[].
 * Tolérant aux colonnes manquantes, normalise numéros / booléens / listes.
 */

import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";

import type { ScoredLead, SellerType } from "../types/EnrichedLead.js";

const NUMBER_FIELDS = ["price", "surface_m2", "rooms", "bedrooms", "year_built", "photos_count", "initial_score"];
const LIST_FIELDS = ["keywords"];

function toNumber(v: unknown): number | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

function toList(v: unknown): string[] | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  if (Array.isArray(v)) return v.map(String);
  return String(v)
    .split(/[;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function toSellerType(v: unknown): SellerType | undefined {
  if (!v) return undefined;
  const s = String(v).toLowerCase();
  if (["particulier", "pp", "private"].includes(s)) return "particulier";
  if (["agence", "agency"].includes(s)) return "agence";
  if (["pro", "professionnel", "professional"].includes(s)) return "pro";
  return "inconnu";
}

export async function readScoredLeadsCsv(path: string): Promise<ScoredLead[]> {
  const raw = await readFile(path, "utf8");
  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as Record<string, string>[];

  return rows.map((row, idx) => {
    const lead: ScoredLead = {
      id: row.id || `lead_${idx + 1}`,
    };
    for (const [k, v] of Object.entries(row)) {
      if (v === undefined || v === "") continue;
      if (k === "id") continue;
      if (NUMBER_FIELDS.includes(k)) {
        const n = toNumber(v);
        if (n !== undefined) (lead as Record<string, unknown>)[k] = n;
      } else if (LIST_FIELDS.includes(k)) {
        const l = toList(v);
        if (l) (lead as Record<string, unknown>)[k] = l;
      } else if (k === "seller_type") {
        lead.seller_type = toSellerType(v);
      } else {
        (lead as Record<string, unknown>)[k] = v;
      }
    }
    return lead;
  });
}
