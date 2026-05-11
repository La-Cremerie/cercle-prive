import { randomUUID } from "node:crypto";
import type { Lead, PropertyType, SellerType } from "../types/Lead.js";

export interface RawListing {
  source?: string;
  source_url?: string;
  url?: string;
  link?: string;
  title?: string;
  subject?: string;
  description?: string;
  body?: string;
  price?: number | string;
  priceValue?: number | string;
  surface?: number | string;
  surface_m2?: number | string;
  livingArea?: number | string;
  city?: string;
  postal_code?: string;
  postalCode?: string;
  zipCode?: string;
  address?: string;
  address_or_area?: string;
  property_type?: string;
  type?: string;
  rooms?: number | string;
  roomsQuantity?: number | string;
  bedrooms?: number | string;
  bedroomsQuantity?: number | string;
  floor?: number | string;
  dpe?: string;
  ges?: string;
  energy_class?: string;
  energyClass?: string;
  photos_count?: number | string;
  photos?: unknown[];
  images?: unknown[];
  publication_date?: string;
  publicationDate?: string;
  seller_type?: string;
  sellerType?: string;
  seller_name?: string;
  agency_name?: string;
  agencyName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  [key: string]: unknown;
}

function toInt(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);
  const digits = String(value).replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : null;
}

function normalizePropertyType(raw: string | undefined): PropertyType {
  if (!raw) return "autre";
  const r = raw.toLowerCase();
  if (r.includes("villa")) return "villa";
  if (r.includes("appart")) return "appartement";
  if (r.includes("maison")) return "maison";
  if (r.includes("immeuble")) return "immeuble";
  if (r.includes("terrain")) return "terrain";
  if (r.includes("local") || r.includes("commerce") || r.includes("bureau")) return "local";
  return "autre";
}

function normalizeSellerType(
  raw: string | undefined,
  agency: string | null
): SellerType {
  if (raw) {
    const r = raw.toLowerCase();
    if (r.includes("particulier")) return "particulier";
    if (r.includes("agence")) return "agence";
    if (r.includes("promo")) return "promoteur";
  }
  if (agency) return "agence";
  return "autre";
}

const DPE_REGEX = /\b(?:dpe|classe[\s_-]?énerg(?:ie|étique)?)\s*[:=]?\s*([A-G])\b/i;
const GES_REGEX = /\bges\s*[:=]?\s*([A-G])\b/i;

function extractEnergyClass(description: string, explicit?: string): string | null {
  if (explicit && /^[A-G]$/i.test(explicit)) return explicit.toUpperCase();
  const m = description.match(DPE_REGEX);
  return m ? m[1].toUpperCase() : null;
}

function extractGes(description: string, explicit?: string): string | null {
  if (explicit && /^[A-G]$/i.test(explicit)) return explicit.toUpperCase();
  const m = description.match(GES_REGEX);
  return m ? m[1].toUpperCase() : null;
}

function toBool(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (value === null || value === undefined || value === "") return false;
  const s = String(value).toLowerCase().trim();
  return s !== "" && s !== "0" && s !== "false" && s !== "no" && s !== "non";
}

export function normalizeRealEstateLead(
  raw: RawListing,
  sourceFallback = "unknown"
): Lead {
  const now = new Date().toISOString();
  const url = raw.source_url ?? raw.url ?? raw.link ?? "";
  const description = String(raw.description ?? raw.body ?? "").trim();
  const title = String(raw.title ?? raw.subject ?? "").trim();
  const price = toInt(raw.price ?? raw.priceValue);
  const surface = toInt(raw.surface ?? raw.surface_m2 ?? raw.livingArea);

  let photos: number;
  if (typeof raw.photos_count === "number") {
    photos = raw.photos_count;
  } else if (typeof raw.photos_count === "string") {
    photos = toInt(raw.photos_count) ?? 0;
  } else if (Array.isArray(raw.photos)) {
    photos = raw.photos.length;
  } else if (Array.isArray(raw.images)) {
    photos = raw.images.length;
  } else {
    photos = 0;
  }

  const agency = (raw.agency_name ?? raw.agencyName ?? null) as string | null;
  const dpe = extractEnergyClass(description, raw.dpe ?? raw.energy_class ?? raw.energyClass);
  const ges = extractGes(description, raw.ges);

  return {
    id: randomUUID(),
    created_at: now,
    source: String(raw.source ?? sourceFallback),
    source_url: String(url),
    title,
    description,
    price,
    surface_m2: surface,
    price_per_m2: price && surface ? Math.round(price / surface) : null,
    city: (raw.city ?? null) as string | null,
    postal_code:
      String(raw.postal_code ?? raw.postalCode ?? raw.zipCode ?? "").trim() || null,
    address_or_area: (raw.address_or_area ?? raw.address ?? null) as string | null,
    property_type: normalizePropertyType(String(raw.property_type ?? raw.type ?? "")),
    rooms: toInt(raw.rooms ?? raw.roomsQuantity),
    bedrooms: toInt(raw.bedrooms ?? raw.bedroomsQuantity),
    floor: toInt(raw.floor),
    dpe,
    ges,
    energy_class: dpe,
    photos_count: photos,
    first_seen_at: now,
    last_seen_at: now,
    publication_date: (raw.publication_date ?? raw.publicationDate ?? null) as string | null,
    seller_type: normalizeSellerType(String(raw.seller_type ?? raw.sellerType ?? ""), agency),
    seller_name: (raw.seller_name ?? raw.contactName ?? null) as string | null,
    agency_name: agency,
    phone_present: toBool(raw.phone),
    email_present: toBool(raw.email),
    renovation_keywords_found: [],
    luxury_keywords_found: [],
    weakness_keywords_found: [],
    opportunity_keywords_found: [],
    raw_data: raw as Record<string, unknown>,
    opt_out_required: true,
  };
}
