/**
 * Brique 2 - Types stricts pour les leads enrichis.
 * Compatible avec la sortie scorée de la Brique 1 (champ scored_lead en entrée).
 */

export type SellerType = "particulier" | "agence" | "pro" | "inconnu";

export type PropertyPositioning =
  | "entrée de gamme"
  | "milieu de gamme"
  | "premium"
  | "luxe"
  | "ultra-luxe"
  | "inconnu";

export type PropertyConditionEstimate =
  | "rénové"
  | "propre mais daté"
  | "à rafraîchir"
  | "à rénover"
  | "lourd potentiel travaux"
  | "inconnu";

export type ValueCreationPotential = "faible" | "moyen" | "fort" | "très fort";

export type LikelyBuyerProfile =
  | "résidence principale"
  | "investisseur locatif"
  | "marchand de biens"
  | "résidence secondaire"
  | "location saisonnière"
  | "agence immobilière"
  | "promoteur"
  | "autre";

export type ValueLever =
  | "home staging"
  | "ameublement"
  | "rénovation légère"
  | "rénovation lourde"
  | "redistribution des espaces"
  | "création de suite parentale"
  | "amélioration DPE"
  | "optimisation extérieur"
  | "division parcellaire"
  | "changement d'usage"
  | "montée en gamme premium"
  | "photographie / annonce"
  | "repositionnement prix";

export type ProjectComplexity = "simple" | "intermédiaire" | "complexe" | "très complexe";

export type BudgetRange =
  | "<10k"
  | "10-30k"
  | "30-80k"
  | "80-150k"
  | "150-300k"
  | ">300k"
  | "inconnu";

export type CommercialPriority = "A" | "B" | "C" | "D";

export type UrgencyLevel = "faible" | "moyen" | "élevé";

export type ContactChannel =
  | "appel agence"
  | "email agence"
  | "LinkedIn"
  | "formulaire site"
  | "courrier professionnel"
  | "non recommandé";

export type DecisionMaker =
  | "propriétaire"
  | "agent immobilier"
  | "directeur d'agence"
  | "marchand"
  | "investisseur"
  | "asset manager"
  | "inconnu";

export type SuggestedAuditOffer =
  | "Audit Valorisation avant vente"
  | "Audit rénovation stratégique"
  | "Audit investisseur locatif"
  | "Audit ameublement / location saisonnière"
  | "Audit division / foncier"
  | "Audit premium résidence secondaire"
  | "Non prioritaire";

export type ConversionProbability = "faible" | "moyenne" | "forte";
export type LeadTemperature = "cold" | "warm" | "hot";

export type EnrichmentStatus =
  | "pending"
  | "enriched_ai"
  | "enriched_rules"
  | "partial"
  | "skipped"
  | "error";

/**
 * Entrée minimale attendue depuis la Brique 1 (CSV scoré).
 * Tous les champs sont optionnels sauf l'identifiant et la source.
 */
export interface ScoredLead {
  id: string;
  source?: string;
  source_url?: string;

  title?: string;
  description?: string;

  price?: number;
  currency?: string;
  surface_m2?: number;
  rooms?: number;
  bedrooms?: number;

  property_type?: string;
  city?: string;
  postal_code?: string;
  department?: string;

  dpe?: string;
  ges?: string;
  year_built?: number;

  photos_count?: number;

  seller_type?: SellerType;
  seller_name?: string;
  agency_name?: string;
  agency_city?: string;
  agency_website?: string;
  agency_public_email?: string;
  agency_public_phone?: string;
  siren?: string;
  siret?: string;

  initial_score?: number; // 0-100
  keywords?: string[];

  // Champs libres remontés par la Brique 1
  [key: string]: unknown;
}

/**
 * Sortie : annonce enrichie + qualification commerciale.
 */
export interface EnrichedLead extends ScoredLead {
  // Statut & conformité
  enrichment_status: EnrichmentStatus;
  enrichment_date: string; // ISO
  human_review_required: boolean;
  manual_check_required: boolean;
  legal_basis_note: string;

  // 1. Enrichissement du bien
  property_positioning: PropertyPositioning;
  property_condition_estimate: PropertyConditionEstimate;
  value_creation_potential: ValueCreationPotential;
  likely_buyer_profile: LikelyBuyerProfile;
  possible_value_levers: ValueLever[];
  estimated_project_complexity: ProjectComplexity;
  estimated_budget_range: BudgetRange;
  commercial_priority: CommercialPriority;

  // 2. Enrichissement commercial
  main_pain_point: string;
  commercial_opportunity: string;
  urgency_level: UrgencyLevel;
  objection_likely: string;
  best_first_contact_channel: ContactChannel;
  decision_maker_hypothesis: DecisionMaker;
  sales_pitch_angle: string;
  recommended_next_action: string;

  // 3. Enrichissement B2B agence/pro
  enrichment_confidence_score: number; // 0-100
  pappers_company_name?: string;
  pappers_siren?: string;
  pappers_legal_form?: string;
  pappers_activity_code?: string;
  pappers_address_city?: string;

  // 4. Analyse IA (ou règles)
  enriched_short_analysis: string;
  value_creation_summary: string;
  top_3_value_levers: ValueLever[];
  suggested_audit_offer: SuggestedAuditOffer;
  estimated_conversion_probability: ConversionProbability;
  lead_temperature: LeadTemperature;
  reason_to_contact_now: string;
  what_not_to_say: string;
  human_review_notes: string;
}

/**
 * Payload générique CRM (Airtable / Sheets / HubSpot / Pipedrive).
 */
export interface CrmPayload {
  id: string;
  fields: Record<string, string | number | boolean | string[] | null>;
}

export interface EnrichmentOptions {
  useAI: boolean;
  enablePappers: boolean;
  aiProvider: "openai" | "anthropic";
  rateLimitMs: number;
  verbose: boolean;
}
