export type PropertyType =
  | "appartement"
  | "maison"
  | "villa"
  | "immeuble"
  | "terrain"
  | "local"
  | "autre";

export type SellerType = "particulier" | "agence" | "promoteur" | "autre";

export type ScoreCategory =
  | "priorité très haute"
  | "priorité haute"
  | "potentiel moyen"
  | "faible priorité";

export type RecommendedOffer =
  | "Audit Valorisation avant vente"
  | "Audit investissement locatif"
  | "Audit rénovation / travaux"
  | "Audit ameublement / location saisonnière"
  | "Audit division / optimisation foncière"
  | "Non prioritaire";

export interface ScoreBreakdown {
  travaux: number;
  presentation_faible: number;
  ameublement: number;
  premium: number;
  marchand: number;
  urgence: number;
}

export interface Lead {
  id: string;
  created_at: string;
  source: string;
  source_url: string;
  title: string;
  description: string;
  price: number | null;
  surface_m2: number | null;
  price_per_m2: number | null;
  city: string | null;
  postal_code: string | null;
  address_or_area: string | null;
  property_type: PropertyType;
  rooms: number | null;
  bedrooms: number | null;
  floor: number | null;
  dpe: string | null;
  ges: string | null;
  energy_class: string | null;
  photos_count: number;
  first_seen_at: string;
  last_seen_at: string;
  publication_date: string | null;
  seller_type: SellerType;
  seller_name: string | null;
  agency_name: string | null;
  phone_present: boolean;
  email_present: boolean;
  renovation_keywords_found: string[];
  luxury_keywords_found: string[];
  weakness_keywords_found: string[];
  opportunity_keywords_found: string[];
  raw_data: Record<string, unknown>;

  total_score?: number;
  score_breakdown?: ScoreBreakdown;
  score_category?: ScoreCategory;
  detected_opportunities?: string[];
  suggested_commercial_angle?: string;
  recommended_offer?: RecommendedOffer;
  short_analysis?: string;
  opt_out_required: boolean;
}
