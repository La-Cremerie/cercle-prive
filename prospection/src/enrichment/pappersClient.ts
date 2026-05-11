/**
 * Client Pappers (API publique entreprises FR).
 * Mode "soft" : aucune écriture, lecture publique uniquement.
 * Retourne null si désactivé ou si appel en échec.
 */

import { env } from "../utils/env.js";
import { logger } from "../utils/logger.js";

export interface PappersCompany {
  nom_entreprise?: string;
  siren?: string;
  forme_juridique?: string;
  code_naf?: string;
  libelle_code_naf?: string;
  siege?: {
    ville?: string;
    code_postal?: string;
    adresse_ligne_1?: string;
  };
}

export interface PappersResult {
  pappers_company_name?: string;
  pappers_siren?: string;
  pappers_legal_form?: string;
  pappers_activity_code?: string;
  pappers_address_city?: string;
  source: "siren" | "name";
}

async function fetchPappers(
  params: Record<string, string>,
): Promise<PappersCompany | null> {
  const url = new URL(`${env.pappersBase}/entreprise`);
  url.searchParams.set("api_token", env.pappersKey);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), { method: "GET" });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Pappers ${res.status}`);
  }
  return (await res.json()) as PappersCompany;
}

async function fetchPappersByName(name: string): Promise<PappersCompany | null> {
  const url = new URL(`${env.pappersBase}/recherche`);
  url.searchParams.set("api_token", env.pappersKey);
  url.searchParams.set("q", name);
  url.searchParams.set("par_page", "1");

  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) return null;
  const data = (await res.json()) as { resultats?: PappersCompany[] };
  return data.resultats?.[0] ?? null;
}

export async function lookupPappers(opts: {
  siren?: string;
  agencyName?: string;
}): Promise<PappersResult | null> {
  if (!env.enablePappers || !env.pappersKey) {
    logger.debug("Pappers désactivé ou clé absente");
    return null;
  }

  try {
    let company: PappersCompany | null = null;
    let source: "siren" | "name" = "siren";

    if (opts.siren) {
      company = await fetchPappers({ siren: opts.siren });
    }
    if (!company && opts.agencyName && opts.agencyName.length >= 3) {
      source = "name";
      company = await fetchPappersByName(opts.agencyName);
    }
    if (!company) return null;

    return {
      pappers_company_name: company.nom_entreprise,
      pappers_siren: company.siren,
      pappers_legal_form: company.forme_juridique,
      pappers_activity_code: company.code_naf,
      pappers_address_city: company.siege?.ville,
      source,
    };
  } catch (err) {
    logger.warn(`Pappers lookup en échec : ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}
