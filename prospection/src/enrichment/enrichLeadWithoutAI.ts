/**
 * Fallback déterministe basé sur règles métier.
 * Aucune API externe requise.
 */

import type {
  EnrichedLead,
  ScoredLead,
  SuggestedAuditOffer,
  ValueLever,
} from "../types/EnrichedLead.js";
import {
  LEGAL_BASIS_NOTE,
  analyzeZone,
  estimateBudget,
  estimateBuyerProfile,
  estimateComplexity,
  estimateCondition,
  estimateContactChannel,
  estimateConversionProbability,
  estimateDecisionMaker,
  estimateLevers,
  estimatePositioning,
  estimatePriority,
  estimateTemperature,
  estimateUrgency,
  estimateValueCreation,
  suggestAuditOffer,
} from "./enrichmentRules.js";

function clipLevers(levers: ValueLever[]): ValueLever[] {
  return levers.slice(0, 3);
}

function buildShortAnalysis(lead: ScoredLead, enriched: Partial<EnrichedLead>): string {
  const parts: string[] = [];
  if (lead.property_type && lead.city) {
    parts.push(`${lead.property_type} situé à ${lead.city}.`);
  }
  if (lead.surface_m2) {
    parts.push(`Surface ${lead.surface_m2} m².`);
  }
  if (enriched.property_condition_estimate) {
    parts.push(`État estimé : ${enriched.property_condition_estimate}.`);
  }
  if (enriched.value_creation_potential) {
    parts.push(`Potentiel de valorisation : ${enriched.value_creation_potential}.`);
  }
  if (enriched.commercial_priority) {
    parts.push(`Priorité commerciale ${enriched.commercial_priority}.`);
  }
  return parts.join(" ");
}

function buildValueSummary(enriched: Partial<EnrichedLead>): string {
  const top = (enriched.top_3_value_levers ?? []).join(", ");
  const offer = enriched.suggested_audit_offer ?? "Audit Valorisation avant vente";
  return top
    ? `Leviers prioritaires : ${top}. Offre recommandée : ${offer}.`
    : `Offre recommandée : ${offer}.`;
}

function buildPainPoint(lead: ScoredLead, enriched: Partial<EnrichedLead>): string {
  if (enriched.property_condition_estimate === "à rénover" ||
      enriched.property_condition_estimate === "lourd potentiel travaux") {
    return "Bien dont l'état réel pénalise la valorisation au prix actuel.";
  }
  if (lead.dpe && ["F", "G"].includes(lead.dpe.toUpperCase())) {
    return "DPE défavorable : risque de décote et de friction à la vente.";
  }
  if ((lead.photos_count ?? 0) < 5) {
    return "Annonce sous-exposée : présentation limitée, peu de photos.";
  }
  return "Potentiel de valorisation sous-exploité avant mise sur le marché.";
}

function buildOpportunity(offer: SuggestedAuditOffer): string {
  switch (offer) {
    case "Audit Valorisation avant vente":
      return "Maximiser le prix de vente via une mise en valeur ciblée avant publication.";
    case "Audit rénovation stratégique":
      return "Identifier les travaux à fort ROI pour requalifier le bien.";
    case "Audit investisseur locatif":
      return "Optimiser le rendement locatif via reconfiguration et ameublement.";
    case "Audit ameublement / location saisonnière":
      return "Positionner le bien sur le segment locatif courte durée premium.";
    case "Audit division / foncier":
      return "Évaluer le potentiel de division ou de changement d'usage.";
    case "Audit premium résidence secondaire":
      return "Repositionner sur le segment résidence secondaire haut de gamme.";
    case "Non prioritaire":
      return "Opportunité commerciale limitée à ce stade.";
  }
}

function buildObjection(lead: ScoredLead): string {
  if (lead.seller_type === "particulier") {
    return "Le vendeur peut estimer ne pas avoir besoin d'accompagnement professionnel.";
  }
  if (lead.seller_type === "agence" || lead.seller_type === "pro") {
    return "L'agence peut percevoir l'audit comme une concurrence sur son métier.";
  }
  return "Manque de visibilité sur le ROI réel de l'audit.";
}

function buildPitchAngle(offer: SuggestedAuditOffer, lead: ScoredLead): string {
  const zone = analyzeZone(lead.city);
  const zoneTag = zone.isPremium
    ? "marché premium local"
    : zone.isVolume
    ? "marché de volume / investisseurs"
    : zone.isBassin
    ? "Bassin d'Arcachon"
    : "marché Gironde";
  return `Aborder l'audit "${offer}" comme un outil d'aide à la décision, fondé sur ${zoneTag}, sans promesse chiffrée.`;
}

function buildNextAction(lead: ScoredLead, channel: string): string {
  if (lead.seller_type === "particulier") {
    return "Ne pas contacter. Marquer pour revue humaine - vérifier la base légale.";
  }
  if (channel === "non recommandé") {
    return "Compléter les données de contact publiques avant toute action.";
  }
  return `Préparer un message court via ${channel}, contextualisé sur l'annonce, avec opt-out clair.`;
}

function buildHumanReviewNotes(lead: ScoredLead): string {
  const notes: string[] = [];
  if (lead.seller_type === "particulier") {
    notes.push("Vendeur particulier : pas de prospection sans base légale spécifique.");
  }
  if (!lead.city) notes.push("Ville manquante.");
  if (!lead.surface_m2) notes.push("Surface manquante.");
  if (!lead.price) notes.push("Prix manquant.");
  if ((lead.photos_count ?? 0) < 3) notes.push("Très peu de photos : qualifier état réel.");
  if (notes.length === 0) notes.push("Aucun point bloquant détecté.");
  return notes.join(" ");
}

function computeConfidence(lead: ScoredLead): number {
  let c = 30;
  if (lead.city) c += 10;
  if (lead.surface_m2) c += 10;
  if (lead.price) c += 10;
  if (lead.dpe) c += 5;
  if (lead.photos_count !== undefined) c += 5;
  if (lead.seller_type && lead.seller_type !== "inconnu") c += 10;
  if (lead.agency_name) c += 10;
  if (lead.description && lead.description.length > 200) c += 10;
  return Math.min(100, c);
}

export function enrichLeadWithoutAI(lead: ScoredLead): EnrichedLead {
  const zone = analyzeZone(lead.city);
  const positioning = estimatePositioning(lead);
  const condition = estimateCondition(lead);
  const potential = estimateValueCreation(lead, condition, positioning);
  const buyer = estimateBuyerProfile(lead);
  const levers = estimateLevers(lead, condition, positioning);
  const complexity = estimateComplexity(condition);
  const budget = estimateBudget(lead, condition, positioning);
  const priority = estimatePriority(lead, potential, zone);
  const urgency = estimateUrgency(lead, priority);
  const channel = estimateContactChannel(lead);
  const decisionMaker = estimateDecisionMaker(lead);
  const offer = suggestAuditOffer(lead, buyer, potential);
  const conversion = estimateConversionProbability(priority, potential);
  const temperature = estimateTemperature(priority);
  const top3: ValueLever[] = clipLevers(levers);

  const partial: Partial<EnrichedLead> = {
    property_positioning: positioning,
    property_condition_estimate: condition,
    value_creation_potential: potential,
    likely_buyer_profile: buyer,
    possible_value_levers: levers,
    estimated_project_complexity: complexity,
    estimated_budget_range: budget,
    commercial_priority: priority,
    urgency_level: urgency,
    suggested_audit_offer: offer,
    top_3_value_levers: top3,
  };

  const enriched: EnrichedLead = {
    ...lead,
    enrichment_status: "enriched_rules",
    enrichment_date: new Date().toISOString(),
    human_review_required: true,
    manual_check_required: lead.seller_type === "particulier" || !lead.agency_name,
    legal_basis_note: LEGAL_BASIS_NOTE,

    property_positioning: positioning,
    property_condition_estimate: condition,
    value_creation_potential: potential,
    likely_buyer_profile: buyer,
    possible_value_levers: levers,
    estimated_project_complexity: complexity,
    estimated_budget_range: budget,
    commercial_priority: priority,

    main_pain_point: buildPainPoint(lead, partial),
    commercial_opportunity: buildOpportunity(offer),
    urgency_level: urgency,
    objection_likely: buildObjection(lead),
    best_first_contact_channel: channel,
    decision_maker_hypothesis: decisionMaker,
    sales_pitch_angle: buildPitchAngle(offer, lead),
    recommended_next_action: buildNextAction(lead, channel),

    enrichment_confidence_score: computeConfidence(lead),

    enriched_short_analysis: buildShortAnalysis(lead, partial),
    value_creation_summary: buildValueSummary(partial),
    top_3_value_levers: top3,
    suggested_audit_offer: offer,
    estimated_conversion_probability: conversion,
    lead_temperature: temperature,
    reason_to_contact_now:
      priority === "A"
        ? "Lead prioritaire combinant zone, potentiel et accessibilité B2B."
        : priority === "B"
        ? "Lead intéressant mais à qualifier davantage avant approche."
        : "Lead à mettre en file basse priorité.",
    what_not_to_say:
      "Ne pas critiquer frontalement l'annonce, le prix ou le travail de l'agence en place.",
    human_review_notes: buildHumanReviewNotes(lead),
  };

  return enriched;
}
