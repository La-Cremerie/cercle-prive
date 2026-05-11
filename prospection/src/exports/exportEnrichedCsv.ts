/**
 * Export CSV des leads enrichis (compatible Sheets / Excel).
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { stringify } from "csv-stringify/sync";

import type { EnrichedLead } from "../types/EnrichedLead.js";
import { prepareCrmPayload } from "../crm/prepareCrmPayload.js";

const HEADER_ORDER: string[] = [
  "id",
  "source",
  "source_url",
  "title",
  "city",
  "postal_code",
  "department",
  "property_type",
  "price",
  "surface_m2",
  "rooms",
  "bedrooms",
  "dpe",
  "ges",
  "year_built",
  "photos_count",
  "seller_type",
  "enrichment_status",
  "enrichment_date",
  "human_review_required",
  "manual_check_required",
  "legal_basis_note",
  "property_positioning",
  "property_condition_estimate",
  "value_creation_potential",
  "likely_buyer_profile",
  "possible_value_levers",
  "estimated_project_complexity",
  "estimated_budget_range",
  "commercial_priority",
  "main_pain_point",
  "commercial_opportunity",
  "urgency_level",
  "objection_likely",
  "best_first_contact_channel",
  "decision_maker_hypothesis",
  "sales_pitch_angle",
  "recommended_next_action",
  "enriched_short_analysis",
  "value_creation_summary",
  "top_3_value_levers",
  "suggested_audit_offer",
  "estimated_conversion_probability",
  "lead_temperature",
  "reason_to_contact_now",
  "what_not_to_say",
  "human_review_notes",
  "enrichment_confidence_score",
  "agency_name",
  "agency_city",
  "agency_website",
  "agency_public_email",
  "agency_public_phone",
  "pappers_company_name",
  "pappers_siren",
  "pappers_legal_form",
  "pappers_activity_code",
  "pappers_address_city",
];

function flattenForCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join("; ");
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

export async function exportEnrichedCsv(
  leads: EnrichedLead[],
  outputPath: string,
): Promise<void> {
  const rows = leads.map((lead) => {
    const payload = prepareCrmPayload(lead);
    const row: Record<string, string> = {};
    for (const key of HEADER_ORDER) {
      row[key] = flattenForCsv(payload.fields[key]);
    }
    return row;
  });

  const csv = stringify(rows, { header: true, columns: HEADER_ORDER });
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, csv, "utf8");
}
