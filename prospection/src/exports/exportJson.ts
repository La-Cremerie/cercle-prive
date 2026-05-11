import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { Lead } from "../types/Lead.js";

export function exportJson(leads: Lead[], path: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(leads, null, 2), "utf-8");
  console.log(`[export-json] ${leads.length} leads -> ${path}`);
}
