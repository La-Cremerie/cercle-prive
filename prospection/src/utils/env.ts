/**
 * Configuration centralisée tirée du .env.
 */

import "dotenv/config";

function bool(value: string | undefined, defaultValue = false): boolean {
  if (value === undefined) return defaultValue;
  return ["1", "true", "yes", "y", "on"].includes(value.toLowerCase());
}

function int(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : defaultValue;
}

export const env = {
  aiProvider: (process.env.AI_PROVIDER ?? "openai") as "openai" | "anthropic",
  enableAi: bool(process.env.ENABLE_AI_ENRICHMENT, false),

  openaiKey: process.env.OPENAI_API_KEY ?? "",
  openaiModel: process.env.OPENAI_MODEL ?? "gpt-4o-mini",

  anthropicKey: process.env.ANTHROPIC_API_KEY ?? "",
  anthropicModel: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",

  enablePappers: bool(process.env.ENABLE_PAPPERS_ENRICHMENT, false),
  pappersKey: process.env.PAPPERS_API_KEY ?? "",
  pappersBase: process.env.PAPPERS_API_BASE ?? "https://api.pappers.fr/v2",

  airtableKey: process.env.AIRTABLE_API_KEY ?? "",
  airtableBaseId: process.env.AIRTABLE_BASE_ID ?? "",
  airtableTable: process.env.AIRTABLE_TABLE_NAME ?? "Leads",

  humanReviewDefault: bool(process.env.HUMAN_REVIEW_REQUIRED_DEFAULT, true),
  aiRateLimitMs: int(process.env.AI_RATE_LIMIT_MS, 350),
  verbose: bool(process.env.VERBOSE, false),
};

export function hasAICapability(): boolean {
  if (!env.enableAi) return false;
  if (env.aiProvider === "openai") return env.openaiKey.length > 0;
  if (env.aiProvider === "anthropic") return env.anthropicKey.length > 0;
  return false;
}
