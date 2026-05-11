/**
 * Export JSON brut (idéal pour Make / n8n / API).
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import type { EnrichedLead } from "../types/EnrichedLead.js";

export async function exportEnrichedJson(
  leads: EnrichedLead[],
  outputPath: string,
): Promise<void> {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(leads, null, 2), "utf8");
}
