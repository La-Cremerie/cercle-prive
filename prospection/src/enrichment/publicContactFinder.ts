/**
 * Recherche de contacts publics d'une agence à partir des données déjà présentes.
 *
 * IMPORTANT - cadre RGPD / spec :
 * - Aucun scraping de site protégé, aucun contournement de captcha / login / paywall.
 * - Aucune extraction d'emails ou téléphones personnels.
 * - Aucune recherche sur réseaux sociaux personnels.
 *
 * Ce module se contente de :
 * - normaliser l'URL d'un site d'agence si présente,
 * - vérifier que l'email "agence" capté ressemble à un email générique (contact@, info@, accueil@),
 * - normaliser un téléphone public,
 * - signaler quand une vérification humaine est nécessaire.
 */

import type { ScoredLead } from "../types/EnrichedLead.js";

const GENERIC_EMAIL_LOCALPARTS = [
  "contact",
  "info",
  "infos",
  "accueil",
  "agence",
  "hello",
  "bonjour",
  "client",
  "clients",
  "commercial",
  "vente",
  "ventes",
  "secretariat",
  "secrétariat",
];

export interface PublicContact {
  website?: string;
  public_email?: string;
  public_phone?: string;
  flagged_for_manual_review: boolean;
  notes: string[];
}

export function normalizeWebsite(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  try {
    const u = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    return `${u.protocol}//${u.hostname}${u.pathname.replace(/\/$/, "")}`;
  } catch {
    return undefined;
  }
}

export function isGenericProfessionalEmail(email: string | undefined): boolean {
  if (!email) return false;
  const m = email.toLowerCase().match(/^([a-z0-9._+-]+)@([a-z0-9.-]+\.[a-z]{2,})$/);
  if (!m) return false;
  const local = m[1];
  return GENERIC_EMAIL_LOCALPARTS.some(
    (g) => local === g || local.startsWith(`${g}.`) || local.startsWith(`${g}-`),
  );
}

export function normalizePhone(phone: string | undefined): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/[^\d+]/g, "");
  if (!digits) return undefined;
  if (digits.startsWith("+")) return digits;
  if (digits.length === 10 && digits.startsWith("0")) {
    return `+33${digits.slice(1)}`;
  }
  return digits;
}

export function findPublicContact(lead: ScoredLead): PublicContact {
  const notes: string[] = [];
  let flagged = false;

  const website = normalizeWebsite(lead.agency_website);
  const phone = normalizePhone(lead.agency_public_phone);

  let email: string | undefined;
  if (lead.agency_public_email) {
    if (isGenericProfessionalEmail(lead.agency_public_email)) {
      email = lead.agency_public_email.toLowerCase();
    } else {
      notes.push(
        "Email captable mais non générique : à valider humainement avant tout contact (risque de prospection nominative non sollicitée).",
      );
      flagged = true;
    }
  }

  if (!website && !email && !phone && lead.agency_name) {
    notes.push("Aucun contact public détecté. Recherche manuelle requise (site agence officiel).");
    flagged = true;
  }

  return {
    website,
    public_email: email,
    public_phone: phone,
    flagged_for_manual_review: flagged,
    notes,
  };
}
