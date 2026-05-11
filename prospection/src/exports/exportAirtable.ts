import Airtable, { type FieldSet, type Records } from "airtable";
import type { Lead } from "../types/Lead.js";

const AIRTABLE_BATCH_SIZE = 10;

type AirtableCreateRecord = { fields: FieldSet };

export async function exportAirtable(leads: Lead[]): Promise<void> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME ?? "Leads";

  if (!apiKey || !baseId) {
    console.log("[airtable] ignoré (AIRTABLE_API_KEY ou AIRTABLE_BASE_ID manquant)");
    return;
  }

  const base = new Airtable({ apiKey }).base(baseId);
  const table = base(tableName);

  function buildFields(l: Lead): FieldSet {
    const fields: FieldSet = {
      id: l.id,
      created_at: l.created_at,
      source: l.source,
      source_url: l.source_url,
      title: l.title,
      city: l.city ?? "",
      postal_code: l.postal_code ?? "",
      property_type: l.property_type,
      dpe: l.dpe ?? "",
      photos_count: l.photos_count,
      seller_type: l.seller_type,
      agency_name: l.agency_name ?? "",
      score_category: l.score_category ?? "",
      recommended_offer: l.recommended_offer ?? "",
      detected_opportunities: (l.detected_opportunities ?? []).join(" | "),
      suggested_commercial_angle: l.suggested_commercial_angle ?? "",
      short_analysis: l.short_analysis ?? "",
      opt_out_required: l.opt_out_required,
    };
    if (l.price !== null) fields.price = l.price;
    if (l.surface_m2 !== null) fields.surface_m2 = l.surface_m2;
    if (l.price_per_m2 !== null) fields.price_per_m2 = l.price_per_m2;
    if (l.rooms !== null) fields.rooms = l.rooms;
    if (l.total_score !== undefined) fields.total_score = l.total_score;
    return fields;
  }

  const records: AirtableCreateRecord[] = leads.map((l) => ({ fields: buildFields(l) }));

  for (let i = 0; i < records.length; i += AIRTABLE_BATCH_SIZE) {
    const batch = records.slice(i, i + AIRTABLE_BATCH_SIZE);
    try {
      await (table.create as (recs: AirtableCreateRecord[]) => Promise<Records<FieldSet>>)(batch);
      console.log(
        `[airtable] lot ${Math.floor(i / AIRTABLE_BATCH_SIZE) + 1} inséré (${batch.length} enregistrements)`
      );
    } catch (err) {
      console.warn(
        `[airtable] échec lot ${Math.floor(i / AIRTABLE_BATCH_SIZE) + 1} : ${(err as Error).message}`
      );
    }
  }
}
