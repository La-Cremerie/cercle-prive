/**
 * Enrichissement B2B agence/pro.
 * Couple : contacts publics + Pappers (si activé).
 * Pas d'enrichissement pour les particuliers.
 */

import type { EnrichedLead, ScoredLead } from "../types/EnrichedLead.js";
import { lookupPappers } from "./pappersClient.js";
import { findPublicContact } from "./publicContactFinder.js";

export interface AgencyB2BEnrichment {
  agency_website?: string;
  agency_public_email?: string;
  agency_public_phone?: string;
  pappers_company_name?: string;
  pappers_siren?: string;
  pappers_legal_form?: string;
  pappers_activity_code?: string;
  pappers_address_city?: string;
  manual_check_required: boolean;
  confidence_score: number; // 0-100, exclusivement pour le volet B2B
  notes: string[];
}

export async function enrichAgencyB2B(lead: ScoredLead): Promise<AgencyB2BEnrichment | null> {
  if (lead.seller_type === "particulier") {
    return {
      manual_check_required: true,
      confidence_score: 0,
      notes: ["Vendeur particulier : enrichissement B2B volontairement désactivé."],
    };
  }

  if (!lead.agency_name && !lead.siren && !lead.siret) {
    return {
      manual_check_required: true,
      confidence_score: 0,
      notes: ["Aucune identification agence/pro disponible."],
    };
  }

  const contact = findPublicContact(lead);

  const siren = lead.siren ?? (lead.siret ? lead.siret.slice(0, 9) : undefined);
  const pappers = await lookupPappers({ siren, agencyName: lead.agency_name });

  let confidence = 30;
  if (lead.agency_name) confidence += 15;
  if (contact.website) confidence += 10;
  if (contact.public_email) confidence += 10;
  if (contact.public_phone) confidence += 10;
  if (pappers) confidence += 20;
  if (pappers && pappers.source === "siren") confidence += 5;
  confidence = Math.min(100, confidence);

  const notes = [...contact.notes];
  if (pappers && pappers.source === "name") {
    notes.push("Correspondance Pappers par nom : vérifier manuellement la bonne entité.");
  }

  return {
    agency_website: contact.website,
    agency_public_email: contact.public_email,
    agency_public_phone: contact.public_phone,
    pappers_company_name: pappers?.pappers_company_name,
    pappers_siren: pappers?.pappers_siren,
    pappers_legal_form: pappers?.pappers_legal_form,
    pappers_activity_code: pappers?.pappers_activity_code,
    pappers_address_city: pappers?.pappers_address_city,
    manual_check_required: contact.flagged_for_manual_review || (!pappers && !!lead.agency_name),
    confidence_score: confidence,
    notes,
  };
}

export function applyB2BEnrichment(
  enriched: EnrichedLead,
  b2b: AgencyB2BEnrichment | null,
): EnrichedLead {
  if (!b2b) return enriched;

  const merged: EnrichedLead = {
    ...enriched,
    agency_website: b2b.agency_website ?? enriched.agency_website,
    agency_public_email: b2b.agency_public_email ?? enriched.agency_public_email,
    agency_public_phone: b2b.agency_public_phone ?? enriched.agency_public_phone,
    pappers_company_name: b2b.pappers_company_name,
    pappers_siren: b2b.pappers_siren,
    pappers_legal_form: b2b.pappers_legal_form,
    pappers_activity_code: b2b.pappers_activity_code,
    pappers_address_city: b2b.pappers_address_city,
    enrichment_confidence_score: Math.max(enriched.enrichment_confidence_score, b2b.confidence_score),
    manual_check_required: enriched.manual_check_required || b2b.manual_check_required,
  };

  if (b2b.notes.length > 0) {
    merged.human_review_notes = `${enriched.human_review_notes} ${b2b.notes.join(" ")}`.trim();
  }
  return merged;
}
