export type SellerType =
  | 'agence'
  | 'marchand_de_biens'
  | 'investisseur_locatif'
  | 'professionnel'
  | 'hotellerie'
  | 'particulier'
  | 'inconnu';

export type CommercialPriority = 'A' | 'B' | 'C' | 'D';

export type DataConfidence = 'high' | 'medium' | 'low';

export type LikelyBuyerProfile =
  | 'investisseur_locatif'
  | 'residence_principale'
  | 'residence_secondaire'
  | 'marchand_de_biens'
  | 'professionnel'
  | 'inconnu';

export type Zone =
  | 'bassin_arcachon'
  | 'cap_ferret'
  | 'pyla'
  | 'bordeaux_centre'
  | 'cauderan'
  | 'le_bouscat'
  | 'talence'
  | 'pessac'
  | 'merignac'
  | 'autre_gironde'
  | 'inconnu';

export type OutreachChannel =
  | 'email_short'
  | 'email_premium'
  | 'linkedin'
  | 'call'
  | 'contact_form'
  | 'crm_note'
  | 'courrier';

export type OutreachTone =
  | 'premium_sobre'
  | 'direct_business'
  | 'partenaire_agence'
  | 'investisseur_roi'
  | 'residence_secondaire'
  | 'ultra_court';

export type OutreachAllowedStatus =
  | 'allowed_b2b_contextual'
  | 'caution_required'
  | 'not_recommended'
  | 'manual_review_only';

export type ValidationStatus =
  | 'pending_human_review'
  | 'approved'
  | 'rejected'
  | 'skipped';

export type RiskFlag =
  | 'particulier_sans_consentement'
  | 'donnees_incertaines'
  | 'priorite_d'
  | 'absence_contact_pro'
  | 'zone_inconnue'
  | 'enrichissement_partiel'
  | 'agency_name_manquant'
  | 'email_absent';

export interface EnrichedLead {
  id: string;
  created_at?: string;
  source_url?: string | null;
  city?: string | null;
  zone?: Zone | string | null;
  agency_name?: string | null;
  contact_first_name?: string | null;
  contact_last_name?: string | null;
  contact_email?: string | null;
  contact_linkedin?: string | null;
  contact_phone?: string | null;
  seller_type: SellerType;
  likely_buyer_profile?: LikelyBuyerProfile | string | null;
  commercial_priority: CommercialPriority;
  property_type?: string | null;
  surface_m2?: number | null;
  price_eur?: number | null;
  bedrooms?: number | null;
  opportunity_summary?: string | null;
  identified_levers?: string[];
  data_confidence?: DataConfidence;
  is_public_b2b_data?: boolean;
  score?: number;
  notes?: string | null;
}

export interface OutreachMessage {
  channel: OutreachChannel;
  subject?: string;
  body: string;
  tone: OutreachTone;
  cta: string;
  personalization_points: string[];
  compliance_note: string;
  human_review_required: boolean;
  risk_flags: RiskFlag[];
}

export interface MultiChannelOutreach {
  email_short: OutreachMessage;
  email_premium: OutreachMessage;
  linkedin: OutreachMessage;
  call_script: OutreachMessage;
  contact_form: OutreachMessage;
  crm_note: OutreachMessage;
}

export interface OutreachSequenceStep {
  step: number;
  delay_days: number;
  channel_recommended: OutreachChannel;
  subject?: string;
  message: string;
  goal: string;
  stop_condition: string;
  human_review_required: boolean;
}

export interface OutreachOutput {
  id: string;
  lead_id: string;
  created_at: string;
  source_url: string | null;
  city: string | null;
  agency_name: string | null;
  seller_type: SellerType;
  commercial_priority: CommercialPriority;
  outreach_allowed_status: OutreachAllowedStatus;
  human_review_required: boolean;
  risk_flags: RiskFlag[];
  recommended_channel: OutreachChannel;
  recommended_tone: OutreachTone;
  messages: MultiChannelOutreach | null;
  sequence: OutreachSequenceStep[];
  gdpr_disclaimer_included: boolean;
  validation_status: ValidationStatus;
  reviewer_notes: string;
  generator_mode: 'ai' | 'template' | 'none';
  ai_model?: string;
}

export interface OutreachValidationResult {
  is_valid: boolean;
  warnings: string[];
  severity: 'none' | 'low' | 'medium' | 'high';
  suggested_fix: string | null;
}
