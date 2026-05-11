/**
 * Construit un payload neutre, compatible Airtable / Google Sheets / HubSpot / Pipedrive.
 * Sérialise les listes (value levers, keywords) en string-array pour Airtable
 * et en chaîne séparée par "; " pour les CSV / Sheets.
 */

import type { CrmPayload, EnrichedLead } from "../types/EnrichedLead.js";

export function prepareCrmPayload(lead: EnrichedLead): CrmPayload {
  return {
    id: lead.id,
    fields: {
      // Identité annonce
      id: lead.id,
      source: lead.source ?? null,
      source_url: lead.source_url ?? null,
      title: lead.title ?? null,
      city: lead.city ?? null,
      postal_code: lead.postal_code ?? null,
      department: lead.department ?? null,
      property_type: lead.property_type ?? null,
      price: lead.price ?? null,
      surface_m2: lead.surface_m2 ?? null,
      rooms: lead.rooms ?? null,
      bedrooms: lead.bedrooms ?? null,
      dpe: lead.dpe ?? null,
      ges: lead.ges ?? null,
      year_built: lead.year_built ?? null,
      photos_count: lead.photos_count ?? null,
      seller_type: lead.seller_type ?? null,

      // Statut & conformité
      enrichment_status: lead.enrichment_status,
      enrichment_date: lead.enrichment_date,
      human_review_required: lead.human_review_required,
      manual_check_required: lead.manual_check_required,
      legal_basis_note: lead.legal_basis_note,

      // Enrichissement bien
      property_positioning: lead.property_positioning,
      property_condition_estimate: lead.property_condition_estimate,
      value_creation_potential: lead.value_creation_potential,
      likely_buyer_profile: lead.likely_buyer_profile,
      possible_value_levers: lead.possible_value_levers,
      estimated_project_complexity: lead.estimated_project_complexity,
      estimated_budget_range: lead.estimated_budget_range,
      commercial_priority: lead.commercial_priority,

      // Enrichissement commercial
      main_pain_point: lead.main_pain_point,
      commercial_opportunity: lead.commercial_opportunity,
      urgency_level: lead.urgency_level,
      objection_likely: lead.objection_likely,
      best_first_contact_channel: lead.best_first_contact_channel,
      decision_maker_hypothesis: lead.decision_maker_hypothesis,
      sales_pitch_angle: lead.sales_pitch_angle,
      recommended_next_action: lead.recommended_next_action,

      // Analyse IA / règles
      enriched_short_analysis: lead.enriched_short_analysis,
      value_creation_summary: lead.value_creation_summary,
      top_3_value_levers: lead.top_3_value_levers,
      suggested_audit_offer: lead.suggested_audit_offer,
      estimated_conversion_probability: lead.estimated_conversion_probability,
      lead_temperature: lead.lead_temperature,
      reason_to_contact_now: lead.reason_to_contact_now,
      what_not_to_say: lead.what_not_to_say,
      human_review_notes: lead.human_review_notes,

      // B2B agence
      enrichment_confidence_score: lead.enrichment_confidence_score,
      agency_name: lead.agency_name ?? null,
      agency_city: lead.agency_city ?? null,
      agency_website: lead.agency_website ?? null,
      agency_public_email: lead.agency_public_email ?? null,
      agency_public_phone: lead.agency_public_phone ?? null,
      pappers_company_name: lead.pappers_company_name ?? null,
      pappers_siren: lead.pappers_siren ?? null,
      pappers_legal_form: lead.pappers_legal_form ?? null,
      pappers_activity_code: lead.pappers_activity_code ?? null,
      pappers_address_city: lead.pappers_address_city ?? null,
    },
  };
}
