import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import {
  normalizeRealEstateLead,
  type RawListing,
} from "../normalizers/normalizeRealEstateLead.js";
import type { Lead } from "../types/Lead.js";

export function importCsv(path: string): Lead[] {
  const content = readFileSync(path, "utf-8");
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    relax_quotes: true,
  }) as RawListing[];

  console.log(`[csv] parsé ${records.length} lignes depuis ${path}`);
  return records.map((row) => normalizeRealEstateLead(row, "csv-import"));
}
