/**
 * Génère une fiche markdown lisible par un commercial.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import type { EnrichedLead } from "../types/EnrichedLead.js";

function bullet(items: string[]): string {
  return items.map((x, i) => `${i + 1}. ${x}`).join("\n");
}

function safeLine(s: string | undefined | null): string {
  return s && s.trim().length > 0 ? s : "_(à compléter)_";
}

export function generateLeadBrief(lead: EnrichedLead): string {
  const title = lead.title ? `${lead.title}` : `Lead ${lead.id}`;
  const loc = [lead.city, lead.postal_code].filter(Boolean).join(" - ");

  return `# Fiche opportunité

**Référence** : \`${lead.id}\`
**Annonce** : ${title}
**Localisation** : ${loc || "_(à compléter)_"}
**Statut enrichissement** : \`${lead.enrichment_status}\` · score confiance : ${lead.enrichment_confidence_score}/100
**Priorité commerciale** : \`${lead.commercial_priority}\` · température : \`${lead.lead_temperature}\` · proba conversion : \`${lead.estimated_conversion_probability}\`
**Validation humaine requise** : ${lead.human_review_required ? "oui" : "non"} · vérification manuelle : ${lead.manual_check_required ? "oui" : "non"}

## Résumé
${safeLine(lead.enriched_short_analysis)}

## Pourquoi ce lead est intéressant
${safeLine(lead.commercial_opportunity)}

**Pain point identifié** : ${safeLine(lead.main_pain_point)}

## Leviers de valorisation identifiés
${bullet(lead.top_3_value_levers.length > 0 ? lead.top_3_value_levers : ["_(à compléter)_"])}

**Tous leviers possibles** : ${lead.possible_value_levers.join(", ") || "_(aucun)_"}
**Budget estimé** : ${lead.estimated_budget_range} · complexité : ${lead.estimated_project_complexity}

## Offre recommandée
**${lead.suggested_audit_offer}**

${safeLine(lead.value_creation_summary)}

## Angle commercial conseillé
${safeLine(lead.sales_pitch_angle)}

**Canal recommandé** : ${lead.best_first_contact_channel}
**Interlocuteur probable** : ${lead.decision_maker_hypothesis}
**Urgence** : ${lead.urgency_level}

## Risques / précautions
- **Objection probable** : ${safeLine(lead.objection_likely)}
- **À ne PAS dire** : ${safeLine(lead.what_not_to_say)}
- **Cadre légal** : ${lead.legal_basis_note}
- **Notes revue humaine** : ${safeLine(lead.human_review_notes)}

## Prochaine action recommandée
${safeLine(lead.recommended_next_action)}

**Raison de contacter maintenant** : ${safeLine(lead.reason_to_contact_now)}

---

### Contexte agence (si B2B)
| Champ | Valeur |
|---|---|
| Agence | ${lead.agency_name ?? "_(n/a)_"} |
| Ville agence | ${lead.agency_city ?? "_(n/a)_"} |
| Site | ${lead.agency_website ?? "_(n/a)_"} |
| Email public | ${lead.agency_public_email ?? "_(n/a)_"} |
| Téléphone public | ${lead.agency_public_phone ?? "_(n/a)_"} |
| Pappers - raison sociale | ${lead.pappers_company_name ?? "_(n/a)_"} |
| Pappers - SIREN | ${lead.pappers_siren ?? "_(n/a)_"} |
| Pappers - forme juridique | ${lead.pappers_legal_form ?? "_(n/a)_"} |
| Pappers - code activité | ${lead.pappers_activity_code ?? "_(n/a)_"} |
| Pappers - ville siège | ${lead.pappers_address_city ?? "_(n/a)_"} |

_Généré le ${lead.enrichment_date}_
`;
}

export async function exportLeadBrief(lead: EnrichedLead, outDir: string): Promise<string> {
  const file = join(outDir, `${lead.id}.md`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, generateLeadBrief(lead), "utf8");
  return file;
}
