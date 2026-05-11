import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { stringify } from "csv-stringify/sync";
import type { Lead } from "../types/Lead.js";

const CSV_COLUMNS = [
  "id",
  "created_at",
  "source",
  "source_url",
  "title",
  "city",
  "postal_code",
  "property_type",
  "price",
  "surface_m2",
  "price_per_m2",
  "rooms",
  "dpe",
  "photos_count",
  "seller_type",
  "agency_name",
  "total_score",
  "score_category",
  "recommended_offer",
  "detected_opportunities",
  "suggested_commercial_angle",
  "short_analysis",
  "opt_out_required",
  "raw_data",
] as const;

export function exportCsv(leads: Lead[], path: string): void {
  const rows = leads.map((l) => ({
    id: l.id,
    created_at: l.created_at,
    source: l.source,
    source_url: l.source_url,
    title: l.title,
    city: l.city ?? "",
    postal_code: l.postal_code ?? "",
    property_type: l.property_type,
    price: l.price ?? "",
    surface_m2: l.surface_m2 ?? "",
    price_per_m2: l.price_per_m2 ?? "",
    rooms: l.rooms ?? "",
    dpe: l.dpe ?? "",
    photos_count: l.photos_count,
    seller_type: l.seller_type,
    agency_name: l.agency_name ?? "",
    total_score: l.total_score ?? "",
    score_category: l.score_category ?? "",
    recommended_offer: l.recommended_offer ?? "",
    detected_opportunities: (l.detected_opportunities ?? []).join(" | "),
    suggested_commercial_angle: l.suggested_commercial_angle ?? "",
    short_analysis: l.short_analysis ?? "",
    opt_out_required: l.opt_out_required,
    raw_data: JSON.stringify(l.raw_data ?? {}),
  }));

  const csv = stringify(rows, {
    header: true,
    columns: CSV_COLUMNS as unknown as string[],
    bom: true,
  });
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, csv, "utf-8");
  console.log(`[export-csv] ${rows.length} leads -> ${path}`);
}
