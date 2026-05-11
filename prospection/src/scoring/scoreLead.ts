import { cityTier, isInPriorityZone } from "../config/citiesGironde.js";
import type {
  Lead,
  RecommendedOffer,
  ScoreBreakdown,
  ScoreCategory,
} from "../types/Lead.js";
import {
  CATEGORY_MAX,
  FURNISHING_KEYWORDS,
  GENERIC_TITLE_PATTERNS,
  MARCHAND_KEYWORDS,
  POINTS_PER_KEYWORD,
  PREMIUM_KEYWORDS,
  RENOVATION_KEYWORDS,
  THRESHOLDS,
  URGENCY_KEYWORDS,
} from "./keywordRules.js";

export interface ScoreResult {
  total_score: number;
  score_breakdown: ScoreBreakdown;
  score_category: ScoreCategory;
  detected_opportunities: string[];
  suggested_commercial_angle: string;
  recommended_offer: RecommendedOffer;
  short_analysis: string;
  renovation_keywords_found: string[];
  luxury_keywords_found: string[];
  weakness_keywords_found: string[];
  opportunity_keywords_found: string[];
}

function findKeywords(text: string, keywords: string[]): string[] {
  const haystack = text.toLowerCase();
  return keywords.filter((kw) => haystack.includes(kw.toLowerCase()));
}

function clamp(value: number, max: number): number {
  return Math.min(Math.max(value, 0), max);
}

export function scoreLead(lead: Lead): ScoreResult {
  const haystack = `${lead.title ?? ""}\n${lead.description ?? ""}`;

  const renovation = findKeywords(haystack, RENOVATION_KEYWORDS);
  const furnishing = findKeywords(haystack, FURNISHING_KEYWORDS);
  const premium = findKeywords(haystack, PREMIUM_KEYWORDS);
  const marchand = findKeywords(haystack, MARCHAND_KEYWORDS);
  const urgency = findKeywords(haystack, URGENCY_KEYWORDS);

  const detected: string[] = [];

  // 1. Potentiel travaux / rénovation
  let travauxScore = renovation.length * POINTS_PER_KEYWORD.renovation;
  if (renovation.includes("à rénover") || renovation.includes("travaux à prévoir")) {
    travauxScore += POINTS_PER_KEYWORD.renovation_strong_bonus;
  }
  travauxScore = clamp(travauxScore, CATEGORY_MAX.travaux);
  if (travauxScore > 0) {
    detected.push(`Potentiel travaux (${renovation.join(", ")})`);
  }

  // 2. Faiblesse de présentation
  const weakness: string[] = [];
  let presentationScore = 0;
  if ((lead.photos_count ?? 0) < THRESHOLDS.photos_low) {
    presentationScore += 6;
    weakness.push(`peu de photos (${lead.photos_count})`);
  }
  if ((lead.description ?? "").length < THRESHOLDS.description_short) {
    presentationScore += 5;
    weakness.push("description courte");
  }
  if (GENERIC_TITLE_PATTERNS.some((re) => re.test(lead.title ?? ""))) {
    presentationScore += 4;
    weakness.push("titre générique");
  }
  if (premium.length === 0) {
    presentationScore += 3;
    weakness.push("aucun mot-clé premium");
  }
  presentationScore = clamp(presentationScore, CATEGORY_MAX.presentation_faible);
  if (presentationScore > 0) {
    detected.push(`Présentation sous-valorisée (${weakness.join(", ")})`);
  }

  // 3. Ameublement / locatif
  let furnishingScore = furnishing.length * POINTS_PER_KEYWORD.furnishing;
  furnishingScore = clamp(furnishingScore, CATEGORY_MAX.ameublement);
  if (furnishingScore > 0) {
    detected.push(`Potentiel ameublement / locatif (${furnishing.join(", ")})`);
  }

  // 4. Premium / montée en gamme
  let premiumScore = premium.length * POINTS_PER_KEYWORD.premium;
  const tier = cityTier(lead.postal_code, lead.city);
  if (tier === "premium") premiumScore += 8;
  else if (tier === "core") premiumScore += 4;
  premiumScore = clamp(premiumScore, CATEGORY_MAX.premium);
  if (premiumScore > 0) {
    const reasons = [...premium];
    if (tier) reasons.push(`zone ${tier}`);
    detected.push(`Potentiel premium (${reasons.join(", ")})`);
  }

  // 5. Marchand / investisseur
  let marchandScore = marchand.length * POINTS_PER_KEYWORD.marchand;
  if (
    lead.property_type === "immeuble" ||
    lead.property_type === "terrain" ||
    lead.property_type === "local"
  ) {
    marchandScore += 6;
  }
  if (lead.surface_m2 && lead.surface_m2 >= THRESHOLDS.large_surface_m2) {
    marchandScore += 4;
  }
  if (lead.dpe && ["F", "G"].includes(lead.dpe.toUpperCase())) {
    marchandScore += 3;
  }
  marchandScore = clamp(marchandScore, CATEGORY_MAX.marchand);
  if (marchandScore > 0) {
    detected.push(`Potentiel marchand (${marchand.join(", ") || lead.property_type})`);
  }

  // 6. Urgence commerciale
  let urgencyScore = urgency.length * POINTS_PER_KEYWORD.urgency;
  if (lead.publication_date) {
    const pubTime = new Date(lead.publication_date).getTime();
    if (!Number.isNaN(pubTime)) {
      const ageDays = (Date.now() - pubTime) / (1000 * 60 * 60 * 24);
      if (ageDays > THRESHOLDS.very_old_listing_days) urgencyScore += 4;
      else if (ageDays > THRESHOLDS.old_listing_days) urgencyScore += 2;
    }
  }
  urgencyScore = clamp(urgencyScore, CATEGORY_MAX.urgence);
  if (urgencyScore > 0) {
    detected.push(`Signaux d'urgence (${urgency.join(", ") || "annonce ancienne"})`);
  }

  const breakdown: ScoreBreakdown = {
    travaux: travauxScore,
    presentation_faible: presentationScore,
    ameublement: furnishingScore,
    premium: premiumScore,
    marchand: marchandScore,
    urgence: urgencyScore,
  };

  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  const category: ScoreCategory =
    total >= 80
      ? "priorité très haute"
      : total >= 65
      ? "priorité haute"
      : total >= 50
      ? "potentiel moyen"
      : "faible priorité";

  return {
    total_score: total,
    score_breakdown: breakdown,
    score_category: category,
    detected_opportunities: detected,
    suggested_commercial_angle: buildCommercialAngle(breakdown, detected),
    recommended_offer: pickRecommendedOffer(breakdown, lead),
    short_analysis: buildShortAnalysis(lead, breakdown, premium, renovation, weakness),
    renovation_keywords_found: renovation,
    luxury_keywords_found: premium,
    weakness_keywords_found: weakness,
    opportunity_keywords_found: [...renovation, ...furnishing, ...marchand, ...urgency],
  };
}

function pickRecommendedOffer(b: ScoreBreakdown, lead: Lead): RecommendedOffer {
  const total = Object.values(b).reduce((a, c) => a + c, 0);
  if (total < 30) return "Non prioritaire";

  const entries = (Object.entries(b) as [keyof ScoreBreakdown, number][])
    .filter(([, value]) => value > 0)
    .sort((a, c) => c[1] - a[1]);

  const dominant = entries[0]?.[0];

  if (dominant === "travaux") return "Audit rénovation / travaux";
  if (dominant === "ameublement") return "Audit ameublement / location saisonnière";
  if (dominant === "marchand") return "Audit division / optimisation foncière";
  if (dominant === "premium" || dominant === "presentation_faible" || dominant === "urgence") {
    if (lead.property_type === "appartement" && isInPriorityZone(lead.postal_code, lead.city) && b.ameublement > 0) {
      return "Audit investissement locatif";
    }
    return "Audit Valorisation avant vente";
  }

  return "Audit Valorisation avant vente";
}

function buildCommercialAngle(b: ScoreBreakdown, detected: string[]): string {
  if (detected.length === 0) return "Pas d'angle commercial évident — à écarter ou requalifier.";

  const parts: string[] = [];
  if (b.presentation_faible >= 8) {
    parts.push("Refonte de la présentation (photos, home staging virtuel, repositionnement éditorial)");
  }
  if (b.travaux >= 10) {
    parts.push("Chiffrage travaux et projection avant/après");
  }
  if (b.ameublement >= 8) {
    parts.push("Projet ameublement / location courte durée avec simulation de rendement");
  }
  if (b.marchand >= 8) {
    parts.push("Approche investisseur : étude de division ou d'optimisation foncière");
  }
  if (b.premium >= 10) {
    parts.push("Alignement de la présentation au standard premium attendu sur la zone");
  }
  if (b.urgence >= 4) {
    parts.push("Repositionnement d'une annonce ancienne pour relancer la commercialisation");
  }

  return parts.length > 0 ? parts.join(" · ") : "Approche valorisation standard.";
}

function buildShortAnalysis(
  lead: Lead,
  b: ScoreBreakdown,
  premium: string[],
  renovation: string[],
  weakness: string[]
): string {
  const city = lead.city ?? "zone non précisée";
  const opportunities: string[] = [];
  if (renovation.length > 0) opportunities.push("modernisation");
  if (b.ameublement > 0) opportunities.push("ameublement et exploitation locative");
  if (b.marchand > 0) opportunities.push("optimisation foncière");
  if (b.premium > 0) opportunities.push("repositionnement premium");

  let intro = `Bien situé à ${city}`;
  if (premium.length > 0) intro += " (adresse à fort potentiel)";
  intro +=
    opportunities.length > 0
      ? `, avec un potentiel de valorisation par ${opportunities.join(", ")}.`
      : ".";

  let weaknessText = "";
  if (weakness.length > 0) {
    weaknessText = ` L'annonce présente des signes de sous-valorisation commerciale : ${weakness.join(", ")}.`;
  }

  return intro + weaknessText;
}
