/**
 * Règles métier - Gironde
 * Centralise la connaissance terrain : zones, vocabulaire, fourchettes prix, leviers.
 * Aucune dépendance externe : utilisable en fallback comme en garde-fou post-IA.
 */

import type {
  BudgetRange,
  CommercialPriority,
  ContactChannel,
  ConversionProbability,
  DecisionMaker,
  LeadTemperature,
  LikelyBuyerProfile,
  ProjectComplexity,
  PropertyConditionEstimate,
  PropertyPositioning,
  ScoredLead,
  SuggestedAuditOffer,
  UrgencyLevel,
  ValueCreationPotential,
  ValueLever,
} from "../types/EnrichedLead.js";

export const LEGAL_BASIS_NOTE =
  "Prospection B2B contextualisée fondée sur intérêt légitime (art. 6.1.f RGPD). " +
  "Données issues exclusivement de sources publiques. Toute prise de contact doit être " +
  "professionnelle, non intrusive, mentionner l'origine de la donnée et offrir un droit " +
  "d'opposition immédiat. Aucune sollicitation des particuliers sans base légale claire.";

export const PREMIUM_ZONES: ReadonlyArray<string> = [
  "Bordeaux centre",
  "Chartrons",
  "Jardin Public",
  "Triangle d'Or",
  "Caudéran",
  "Le Bouscat",
  "Arcachon",
  "Pyla-sur-Mer",
  "Cap Ferret",
  "Lège-Cap-Ferret",
  "La Teste-de-Buch",
  "Saint-Émilion",
];

export const VOLUME_ZONES: ReadonlyArray<string> = [
  "Talence",
  "Pessac",
  "Mérignac",
  "Bègles",
  "Cenon",
  "Floirac",
  "Villenave-d'Ornon",
  "Libourne",
];

export const BASSIN_ZONES: ReadonlyArray<string> = [
  "Arcachon",
  "Pyla-sur-Mer",
  "Cap Ferret",
  "Lège-Cap-Ferret",
  "La Teste-de-Buch",
];

export const PATRIMOINE_ZONES: ReadonlyArray<string> = ["Libourne", "Saint-Émilion"];

export const HYPER_PREMIUM_ZONES: ReadonlyArray<string> = [
  "Triangle d'Or",
  "Jardin Public",
  "Chartrons",
  "Pyla-sur-Mer",
  "Cap Ferret",
];

const RENOVATION_HEAVY_KW = [
  "à rénover",
  "travaux",
  "gros oeuvre",
  "gros œuvre",
  "à rafraichir",
  "à rafraîchir",
  "potentiel",
  "ancien",
];

const RENOVATION_LIGHT_KW = ["rafraîchir", "rafraichir", "daté", "datée", "peinture", "à moderniser"];

const RENOVATED_KW = ["rénové", "renove", "refait à neuf", "neuf", "entièrement rénové"];

const PREMIUM_KW = [
  "prestige",
  "exception",
  "exceptionnel",
  "luxe",
  "vue mer",
  "vue océan",
  "hôtel particulier",
  "hotel particulier",
  "demeure",
  "manoir",
  "château",
];

const LUXURY_KW = ["ultra-luxe", "exceptionnel", "rare", "unique au monde"];

const INVESTOR_KW = ["rentabilité", "rendement", "loué", "locataire", "lmnp", "rentable"];

const SAISONNIER_KW = ["saisonnier", "airbnb", "meublé tourisme", "location courte durée"];

const DIVISION_KW = ["divisible", "à diviser", "parcelle", "constructible", "viabilisé"];

export interface ZoneSignals {
  isPremium: boolean;
  isVolume: boolean;
  isBassin: boolean;
  isPatrimoine: boolean;
  isHyperPremium: boolean;
}

export function analyzeZone(city: string | undefined): ZoneSignals {
  const c = (city ?? "").trim().toLowerCase();
  const match = (list: ReadonlyArray<string>) => list.some((z) => z.toLowerCase() === c);
  return {
    isPremium: match(PREMIUM_ZONES),
    isVolume: match(VOLUME_ZONES),
    isBassin: match(BASSIN_ZONES),
    isPatrimoine: match(PATRIMOINE_ZONES),
    isHyperPremium: match(HYPER_PREMIUM_ZONES),
  };
}

function textBag(lead: ScoredLead): string {
  return [
    lead.title ?? "",
    lead.description ?? "",
    (lead.keywords ?? []).join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

function matchAny(haystack: string, kws: ReadonlyArray<string>): boolean {
  return kws.some((k) => haystack.includes(k.toLowerCase()));
}

export function estimatePositioning(lead: ScoredLead): PropertyPositioning {
  const txt = textBag(lead);
  const zone = analyzeZone(lead.city);
  const ppm = lead.price && lead.surface_m2 ? lead.price / lead.surface_m2 : undefined;

  if (matchAny(txt, LUXURY_KW) || (ppm !== undefined && ppm > 14000)) return "ultra-luxe";
  if (matchAny(txt, PREMIUM_KW) || (ppm !== undefined && ppm > 9000) || zone.isHyperPremium)
    return "luxe";
  if ((ppm !== undefined && ppm > 6000) || zone.isPremium) return "premium";
  if (ppm !== undefined && ppm > 3500) return "milieu de gamme";
  if (ppm !== undefined) return "entrée de gamme";
  return "inconnu";
}

export function estimateCondition(lead: ScoredLead): PropertyConditionEstimate {
  const txt = textBag(lead);
  if (matchAny(txt, RENOVATED_KW)) return "rénové";
  if (matchAny(txt, RENOVATION_HEAVY_KW)) {
    if (txt.includes("gros oeuvre") || txt.includes("gros œuvre") || txt.includes("à rénover"))
      return "lourd potentiel travaux";
    return "à rénover";
  }
  if (matchAny(txt, RENOVATION_LIGHT_KW)) return "à rafraîchir";
  if (lead.dpe && ["F", "G"].includes(lead.dpe.toUpperCase())) return "à rénover";
  if (lead.year_built && lead.year_built < 1970) return "propre mais daté";
  if (lead.photos_count !== undefined && lead.photos_count < 4) return "inconnu";
  return "propre mais daté";
}

export function estimateValueCreation(
  lead: ScoredLead,
  condition: PropertyConditionEstimate,
  positioning: PropertyPositioning,
): ValueCreationPotential {
  let score = 0;
  if (condition === "lourd potentiel travaux") score += 3;
  else if (condition === "à rénover") score += 2;
  else if (condition === "à rafraîchir") score += 1;

  if (lead.dpe && ["E", "F", "G"].includes(lead.dpe.toUpperCase())) score += 1;
  if (positioning === "luxe" || positioning === "premium") score += 1;
  if (positioning === "ultra-luxe") score += 2;

  const zone = analyzeZone(lead.city);
  if (zone.isPremium || zone.isHyperPremium) score += 1;

  if (lead.photos_count !== undefined && lead.photos_count < 5) score += 1;

  if (score >= 5) return "très fort";
  if (score >= 3) return "fort";
  if (score >= 1) return "moyen";
  return "faible";
}

export function estimateBuyerProfile(lead: ScoredLead): LikelyBuyerProfile {
  const txt = textBag(lead);
  const zone = analyzeZone(lead.city);

  if (matchAny(txt, SAISONNIER_KW) || zone.isBassin) return "location saisonnière";
  if (matchAny(txt, INVESTOR_KW)) return "investisseur locatif";
  if (matchAny(txt, DIVISION_KW)) return "marchand de biens";
  if (zone.isPatrimoine) return "résidence secondaire";
  if (zone.isVolume) return "investisseur locatif";
  if (zone.isHyperPremium) return "résidence principale";
  return "résidence principale";
}

export function estimateLevers(
  lead: ScoredLead,
  condition: PropertyConditionEstimate,
  positioning: PropertyPositioning,
): ValueLever[] {
  const levers = new Set<ValueLever>();
  const txt = textBag(lead);
  const zone = analyzeZone(lead.city);

  if (condition === "à rafraîchir" || condition === "propre mais daté") {
    levers.add("home staging");
    levers.add("rénovation légère");
  }
  if (condition === "à rénover") {
    levers.add("rénovation lourde");
    levers.add("redistribution des espaces");
  }
  if (condition === "lourd potentiel travaux") {
    levers.add("rénovation lourde");
    levers.add("redistribution des espaces");
  }
  if (lead.dpe && ["D", "E", "F", "G"].includes(lead.dpe.toUpperCase())) {
    levers.add("amélioration DPE");
  }
  if (zone.isBassin) {
    levers.add("ameublement");
    levers.add("montée en gamme premium");
  }
  if (lead.bedrooms !== undefined && lead.bedrooms >= 4) {
    levers.add("création de suite parentale");
  }
  if (matchAny(txt, DIVISION_KW)) {
    levers.add("division parcellaire");
  }
  if (lead.photos_count !== undefined && lead.photos_count < 6) {
    levers.add("photographie / annonce");
  }
  if (positioning === "luxe" || positioning === "ultra-luxe") {
    levers.add("montée en gamme premium");
  }
  if (zone.isVolume) {
    levers.add("optimisation extérieur");
    levers.add("ameublement");
  }
  if (levers.size === 0) levers.add("repositionnement prix");
  return Array.from(levers);
}

export function estimateComplexity(condition: PropertyConditionEstimate): ProjectComplexity {
  switch (condition) {
    case "rénové":
      return "simple";
    case "propre mais daté":
      return "simple";
    case "à rafraîchir":
      return "intermédiaire";
    case "à rénover":
      return "complexe";
    case "lourd potentiel travaux":
      return "très complexe";
    default:
      return "intermédiaire";
  }
}

export function estimateBudget(
  lead: ScoredLead,
  condition: PropertyConditionEstimate,
  positioning: PropertyPositioning,
): BudgetRange {
  const surf = lead.surface_m2 ?? 0;
  if (!surf) return "inconnu";

  // €/m² selon condition et positionnement (estimation très large)
  let perM2 = 200;
  if (condition === "à rafraîchir") perM2 = 350;
  if (condition === "à rénover") perM2 = 900;
  if (condition === "lourd potentiel travaux") perM2 = 1800;
  if (positioning === "luxe") perM2 *= 1.5;
  if (positioning === "ultra-luxe") perM2 *= 2;

  const budget = surf * perM2;
  if (budget < 10_000) return "<10k";
  if (budget < 30_000) return "10-30k";
  if (budget < 80_000) return "30-80k";
  if (budget < 150_000) return "80-150k";
  if (budget < 300_000) return "150-300k";
  return ">300k";
}

export function estimatePriority(
  lead: ScoredLead,
  potential: ValueCreationPotential,
  zone: ZoneSignals,
): CommercialPriority {
  const isPro = lead.seller_type === "agence" || lead.seller_type === "pro";
  const score = lead.initial_score ?? 0;

  if (score >= 75 && (potential === "fort" || potential === "très fort") && isPro &&
      (zone.isPremium || zone.isVolume || zone.isHyperPremium)) {
    return "A";
  }
  if ((score >= 60 && potential !== "faible") || (isPro && potential === "fort")) return "B";
  if (score >= 40 || potential === "moyen") return "C";
  return "D";
}

export function estimateUrgency(lead: ScoredLead, priority: CommercialPriority): UrgencyLevel {
  if (priority === "A") return "élevé";
  if (priority === "B") return "moyen";
  if (lead.dpe && ["F", "G"].includes(lead.dpe.toUpperCase())) return "moyen";
  return "faible";
}

export function estimateContactChannel(lead: ScoredLead): ContactChannel {
  if (lead.seller_type === "particulier") return "non recommandé";
  if (lead.agency_public_email) return "email agence";
  if (lead.agency_public_phone) return "appel agence";
  if (lead.agency_website) return "formulaire site";
  if (lead.agency_name) return "appel agence";
  return "non recommandé";
}

export function estimateDecisionMaker(lead: ScoredLead): DecisionMaker {
  if (lead.seller_type === "particulier") return "propriétaire";
  if (lead.seller_type === "agence") return "directeur d'agence";
  if (lead.seller_type === "pro") return "agent immobilier";
  return "inconnu";
}

export function suggestAuditOffer(
  lead: ScoredLead,
  buyer: LikelyBuyerProfile,
  potential: ValueCreationPotential,
): SuggestedAuditOffer {
  const zone = analyzeZone(lead.city);
  const txt = textBag(lead);

  if (potential === "faible" && (lead.initial_score ?? 0) < 40) return "Non prioritaire";

  if (zone.isBassin) return "Audit ameublement / location saisonnière";
  if (zone.isPatrimoine) return "Audit premium résidence secondaire";
  if (matchAny(txt, DIVISION_KW)) return "Audit division / foncier";
  if (buyer === "investisseur locatif" || zone.isVolume) return "Audit investisseur locatif";
  if (potential === "très fort" || potential === "fort") return "Audit rénovation stratégique";
  return "Audit Valorisation avant vente";
}

export function estimateConversionProbability(
  priority: CommercialPriority,
  potential: ValueCreationPotential,
): ConversionProbability {
  if (priority === "A" && (potential === "fort" || potential === "très fort")) return "forte";
  if (priority === "A" || priority === "B") return "moyenne";
  return "faible";
}

export function estimateTemperature(priority: CommercialPriority): LeadTemperature {
  if (priority === "A") return "hot";
  if (priority === "B") return "warm";
  return "cold";
}
