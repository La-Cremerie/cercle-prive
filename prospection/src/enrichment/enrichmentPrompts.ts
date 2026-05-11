/**
 * Prompts IA pour l'enrichissement commercial.
 * Volontairement courts, structurés, JSON-only.
 */

import type { ScoredLead } from "../types/EnrichedLead.js";

export const SYSTEM_PROMPT = `Tu es un analyste commercial senior spécialisé en immobilier de valorisation en Gironde.
Tu produis des analyses CONCISES, factuelles, exploitables par une équipe de prospection B2B.

Règles absolues :
- Ne JAMAIS inventer de données personnelles (nom, email, téléphone, adresse perso).
- Ne JAMAIS proposer de message intrusif ou de pression commerciale.
- Si seller_type = particulier, limiter l'analyse au bien (pas de profilage de personne).
- Si l'information manque, l'admettre explicitement.
- Réponse STRICTEMENT en JSON valide, sans markdown ni commentaire.
- Texte en français, ton professionnel, neutre, factuel.`;

export interface AIAnalysisSchema {
  enriched_short_analysis: string;
  value_creation_summary: string;
  top_3_value_levers: string[];
  suggested_audit_offer: string;
  estimated_conversion_probability: "faible" | "moyenne" | "forte";
  lead_temperature: "cold" | "warm" | "hot";
  reason_to_contact_now: string;
  what_not_to_say: string;
  human_review_notes: string;
  main_pain_point: string;
  commercial_opportunity: string;
  objection_likely: string;
  sales_pitch_angle: string;
  recommended_next_action: string;
}

export function buildUserPrompt(lead: ScoredLead): string {
  const safe = {
    id: lead.id,
    city: lead.city,
    postal_code: lead.postal_code,
    department: lead.department,
    property_type: lead.property_type,
    price: lead.price,
    surface_m2: lead.surface_m2,
    rooms: lead.rooms,
    bedrooms: lead.bedrooms,
    dpe: lead.dpe,
    ges: lead.ges,
    year_built: lead.year_built,
    photos_count: lead.photos_count,
    seller_type: lead.seller_type,
    agency_name: lead.agency_name,
    agency_city: lead.agency_city,
    initial_score: lead.initial_score,
    title: (lead.title ?? "").slice(0, 200),
    description: (lead.description ?? "").slice(0, 1500),
    keywords: lead.keywords ?? [],
  };

  return `Analyse cette annonce immobilière (Gironde) pour qualifier le lead commercial.

Données annonce :
${JSON.stringify(safe, null, 2)}

Contexte offre : nous vendons des "Audits de Valorisation Immobilière" (avant vente, rénovation stratégique, investisseur locatif, ameublement / location saisonnière, division / foncier, premium résidence secondaire).

Renvoie UNIQUEMENT un objet JSON avec EXACTEMENT ces clés :
{
  "enriched_short_analysis": "3 à 5 phrases max",
  "value_creation_summary": "résumé du potentiel en 1-2 phrases",
  "top_3_value_levers": ["levier1","levier2","levier3"],
  "suggested_audit_offer": "Audit Valorisation avant vente|Audit rénovation stratégique|Audit investisseur locatif|Audit ameublement / location saisonnière|Audit division / foncier|Audit premium résidence secondaire|Non prioritaire",
  "estimated_conversion_probability": "faible|moyenne|forte",
  "lead_temperature": "cold|warm|hot",
  "reason_to_contact_now": "1 phrase",
  "what_not_to_say": "1 phrase - ce qu'il ne faut surtout pas évoquer",
  "human_review_notes": "points à vérifier humainement",
  "main_pain_point": "1 phrase",
  "commercial_opportunity": "1 phrase",
  "objection_likely": "1 phrase",
  "sales_pitch_angle": "angle d'approche en 1-2 phrases",
  "recommended_next_action": "action concrète, professionnelle, non intrusive"
}

Valeurs autorisées pour top_3_value_levers (max 3) :
"home staging","ameublement","rénovation légère","rénovation lourde","redistribution des espaces","création de suite parentale","amélioration DPE","optimisation extérieur","division parcellaire","changement d'usage","montée en gamme premium","photographie / annonce","repositionnement prix".

Si seller_type = particulier : ne propose pas de prospection directe, mentionne-le dans human_review_notes.
Si données insuffisantes : reflète-le dans les champs et conseille une revue humaine.`;
}
