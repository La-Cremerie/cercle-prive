/**
 * Enrichissement IA - providers OpenAI (Chat Completions JSON mode) ou Anthropic (Messages API).
 * En cas d'échec : fallback transparent sur les règles.
 */

import type {
  ConversionProbability,
  EnrichedLead,
  LeadTemperature,
  ScoredLead,
  SuggestedAuditOffer,
  ValueLever,
} from "../types/EnrichedLead.js";
import { enrichLeadWithoutAI } from "./enrichLeadWithoutAI.js";
import { AIAnalysisSchema, SYSTEM_PROMPT, buildUserPrompt } from "./enrichmentPrompts.js";
import { env, hasAICapability } from "../utils/env.js";
import { logger } from "../utils/logger.js";

const ALLOWED_LEVERS: ValueLever[] = [
  "home staging",
  "ameublement",
  "rénovation légère",
  "rénovation lourde",
  "redistribution des espaces",
  "création de suite parentale",
  "amélioration DPE",
  "optimisation extérieur",
  "division parcellaire",
  "changement d'usage",
  "montée en gamme premium",
  "photographie / annonce",
  "repositionnement prix",
];

const ALLOWED_OFFERS: SuggestedAuditOffer[] = [
  "Audit Valorisation avant vente",
  "Audit rénovation stratégique",
  "Audit investisseur locatif",
  "Audit ameublement / location saisonnière",
  "Audit division / foncier",
  "Audit premium résidence secondaire",
  "Non prioritaire",
];

function sanitizeLevers(input: unknown): ValueLever[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((x): x is string => typeof x === "string")
    .map((x) => x.trim() as ValueLever)
    .filter((x) => ALLOWED_LEVERS.includes(x))
    .slice(0, 3);
}

function sanitizeOffer(input: unknown, fallback: SuggestedAuditOffer): SuggestedAuditOffer {
  if (typeof input !== "string") return fallback;
  const v = input.trim() as SuggestedAuditOffer;
  return ALLOWED_OFFERS.includes(v) ? v : fallback;
}

function sanitizeStr(v: unknown, max = 600, fallback = ""): string {
  if (typeof v !== "string") return fallback;
  return v.trim().slice(0, max);
}

function sanitizeEnum<T extends string>(v: unknown, allowed: T[], fallback: T): T {
  if (typeof v !== "string") return fallback;
  return (allowed.includes(v as T) ? v : fallback) as T;
}

async function callOpenAI(userPrompt: string): Promise<AIAnalysisSchema> {
  const body = {
    model: env.openaiModel,
    response_format: { type: "json_object" },
    temperature: 0.2,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  };
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.openaiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI ${res.status} ${txt.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI empty content");
  return JSON.parse(content) as AIAnalysisSchema;
}

async function callAnthropic(userPrompt: string): Promise<AIAnalysisSchema> {
  const body = {
    model: env.anthropicModel,
    max_tokens: 1024,
    temperature: 0.2,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: userPrompt + "\n\nRépond UNIQUEMENT avec l'objet JSON, sans ```json ni texte additionnel.",
      },
    ],
  };
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.anthropicKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Anthropic ${res.status} ${txt.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const text = data.content?.find((c) => c.type === "text")?.text;
  if (!text) throw new Error("Anthropic empty content");
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
  return JSON.parse(cleaned) as AIAnalysisSchema;
}

function mergeAIIntoEnriched(
  base: EnrichedLead,
  ai: AIAnalysisSchema,
): EnrichedLead {
  const top3 = sanitizeLevers(ai.top_3_value_levers);
  const offer = sanitizeOffer(ai.suggested_audit_offer, base.suggested_audit_offer);

  return {
    ...base,
    enrichment_status: "enriched_ai",
    enriched_short_analysis: sanitizeStr(ai.enriched_short_analysis, 800, base.enriched_short_analysis),
    value_creation_summary: sanitizeStr(ai.value_creation_summary, 500, base.value_creation_summary),
    top_3_value_levers: top3.length > 0 ? top3 : base.top_3_value_levers,
    suggested_audit_offer: offer,
    estimated_conversion_probability: sanitizeEnum<ConversionProbability>(
      ai.estimated_conversion_probability,
      ["faible", "moyenne", "forte"],
      base.estimated_conversion_probability,
    ),
    lead_temperature: sanitizeEnum<LeadTemperature>(
      ai.lead_temperature,
      ["cold", "warm", "hot"],
      base.lead_temperature,
    ),
    reason_to_contact_now: sanitizeStr(ai.reason_to_contact_now, 300, base.reason_to_contact_now),
    what_not_to_say: sanitizeStr(ai.what_not_to_say, 300, base.what_not_to_say),
    human_review_notes: sanitizeStr(ai.human_review_notes, 500, base.human_review_notes),
    main_pain_point: sanitizeStr(ai.main_pain_point, 300, base.main_pain_point),
    commercial_opportunity: sanitizeStr(ai.commercial_opportunity, 300, base.commercial_opportunity),
    objection_likely: sanitizeStr(ai.objection_likely, 300, base.objection_likely),
    sales_pitch_angle: sanitizeStr(ai.sales_pitch_angle, 400, base.sales_pitch_angle),
    recommended_next_action: sanitizeStr(ai.recommended_next_action, 400, base.recommended_next_action),
  };
}

export async function enrichLeadWithAI(lead: ScoredLead): Promise<EnrichedLead> {
  const baseline = enrichLeadWithoutAI(lead);

  if (!hasAICapability()) {
    logger.debug(`AI off pour ${lead.id} - fallback règles`);
    return baseline;
  }

  // Pas de profilage IA des particuliers (RGPD / spec).
  if (lead.seller_type === "particulier") {
    logger.debug(`Particulier ${lead.id} - IA limitée au bien (réutilisation règles)`);
    return { ...baseline, human_review_notes: baseline.human_review_notes + " Particulier : profilage IA volontairement limité." };
  }

  const prompt = buildUserPrompt(lead);
  try {
    const ai = env.aiProvider === "anthropic" ? await callAnthropic(prompt) : await callOpenAI(prompt);
    return mergeAIIntoEnriched(baseline, ai);
  } catch (err) {
    logger.warn(`IA indisponible pour ${lead.id} - fallback règles`);
    logger.debug(err instanceof Error ? err.message : String(err));
    return {
      ...baseline,
      enrichment_status: "partial",
      human_review_notes: baseline.human_review_notes + " IA en échec : analyse par règles uniquement.",
    };
  }
}
