# Brique 2 — Module d'enrichissement & qualification IA de leads immobiliers

> Module **Node.js / TypeScript** complémentaire à la Brique 1 (scraping + scoring).
> **Cette brique n'envoie AUCUN email** : elle se contente d'enrichir, qualifier, prioriser et exporter.

---

## Objectif

Transformer chaque annonce immobilière scorée en **opportunité commerciale exploitable** pour l'offre "Audit de Valorisation Immobilière" en Gironde :

- enrichissement bien (positionnement, état, leviers, budget travaux),
- qualification commerciale (priorité, urgence, angle, prochaine action),
- enrichissement B2B agences (contacts publics, Pappers),
- analyse IA optionnelle (OpenAI ou Anthropic) avec fallback règles,
- export CSV / JSON / Airtable + fiches markdown par lead.

Compatibilité **Make / n8n** garantie (sortie JSON + CSV + REST Airtable).

---

## Position dans le repo

Ce module est isolé dans `/prospection/` pour ne **pas interférer** avec le site web Cercle Privé qui occupe la racine. Il a son propre `package.json`, son propre `tsconfig.json`, son propre `.env`. Aucune commande du site (`npm run dev`, `npm run build`...) n'est modifiée.

```
cercle-prive/
├── src/             ← site web React/Vite (intact)
├── package.json     ← site web (intact)
└── prospection/     ← Brique 2 (nouveau)
    ├── src/
    ├── data/
    ├── exports/
    ├── package.json
    └── README.md
```

---

## Installation

```bash
cd prospection
npm install
cp .env.example .env
# (optionnel) renseigner OPENAI_API_KEY / ANTHROPIC_API_KEY / PAPPERS_API_KEY / AIRTABLE_*
```

> Aucune clé n'est obligatoire : sans aucune configuration, le module fonctionne en **mode règles déterministe** sur le CSV fourni en exemple.

---

## Commandes

| Commande | Effet |
|---|---|
| `npm run enrich` | Pipeline par défaut (IA si configurée, sinon règles) sur `data/sample_scored_leads.csv` |
| `npm run enrich:csv` | `data/sample_scored_leads.csv` → `exports/enriched_leads.csv` |
| `npm run enrich:ai` | Force l'IA (échec si pas de clé → fallback transparent) |
| `npm run enrich:no-ai` | Force le fallback règles |
| `npm run enrich:airtable` | Push vers Airtable après enrichissement |
| `npm run all` | Pipeline complet (CSV + JSON + briefs + Airtable si configuré) |
| `npm run typecheck` | Vérifie les types stricts |
| `npm run build` | Compile TS → `dist/` |

Options CLI complètes :

```bash
npm run enrich -- --input data/mon_fichier.csv --output exports/out.csv --ai --briefs-dir exports/briefs
```

---

## Format d'entrée — CSV scoré (sortie de la Brique 1)

Colonnes minimales attendues (toutes optionnelles sauf `id`) :

```
id, source, source_url, title, description,
price, surface_m2, rooms, bedrooms,
property_type, city, postal_code, department,
dpe, ges, year_built, photos_count,
seller_type, agency_name, agency_city,
agency_website, agency_public_email, agency_public_phone,
siren, initial_score, keywords
```

`seller_type` accepte : `particulier`, `agence`, `pro`, `inconnu`.
`keywords` : valeurs séparées par `;` ou `|`.

Un échantillon prêt à l'emploi se trouve dans `data/sample_scored_leads.csv`.

---

## Format de sortie

### CSV (`exports/enriched_leads.csv`)

58 colonnes incluant tous les champs ajoutés par la Brique 2 (voir liste ci-dessous).

### JSON (`exports/enriched_leads.json`)

Tableau d'objets `EnrichedLead` (typage strict, prêt pour Make/n8n).

### Fiche markdown (`exports/briefs/<id>.md`)

Une fiche par lead, lisible par un commercial :

```markdown
# Fiche opportunité
## Résumé
## Pourquoi ce lead est intéressant
## Leviers de valorisation identifiés
## Offre recommandée
## Angle commercial conseillé
## Risques / précautions
## Prochaine action recommandée
```

### Airtable

Push via REST API, batch de 10, avec `typecast: true`. La table cible doit contenir des champs aux mêmes noms que ceux ci-dessous.

---

## Champs ajoutés (cf. types `EnrichedLead`)

**Statut & conformité**
`enrichment_status`, `enrichment_date`, `human_review_required`, `manual_check_required`, `legal_basis_note`

**Enrichissement bien**
`property_positioning`, `property_condition_estimate`, `value_creation_potential`,
`likely_buyer_profile`, `possible_value_levers`, `estimated_project_complexity`,
`estimated_budget_range`, `commercial_priority`

**Enrichissement commercial**
`main_pain_point`, `commercial_opportunity`, `urgency_level`, `objection_likely`,
`best_first_contact_channel`, `decision_maker_hypothesis`, `sales_pitch_angle`,
`recommended_next_action`

**Analyse IA / règles**
`enriched_short_analysis`, `value_creation_summary`, `top_3_value_levers`,
`suggested_audit_offer`, `estimated_conversion_probability`, `lead_temperature`,
`reason_to_contact_now`, `what_not_to_say`, `human_review_notes`

**B2B agence**
`enrichment_confidence_score`, `agency_website`, `agency_public_email`,
`agency_public_phone`, `pappers_company_name`, `pappers_siren`,
`pappers_legal_form`, `pappers_activity_code`, `pappers_address_city`

---

## Cadre RGPD / conformité — règles tenues par le code

1. **Aucune donnée sensible** collectée (santé, opinion, etc.).
2. **Aucun contournement** : pas de captcha, pas de login, pas de paywall.
3. **Particuliers** : enrichissement strictement limité au bien. Pas de recherche de nom personnel, email perso, adresse perso, profil social. `recommended_next_action = "Ne pas contacter. Marquer pour revue humaine."`
4. **Agences / pros** : enrichissement B2B sur **données publiques uniquement** (site, email générique type `contact@/info@`, téléphone public, SIREN). Emails non génériques → drapeau `manual_check_required`.
5. **`human_review_required = true`** par défaut sur tous les leads. Aucune action commerciale automatique.
6. **`legal_basis_note`** rempli sur chaque lead (intérêt légitime B2B, contextualisation, droit d'opposition).
7. **Aucune génération de message** : la Brique 2 produit une **fiche d'opportunité**, pas un email.

---

## Architecture

```
src/
├── enrichment/
│   ├── enrichLead.ts            ← orchestrateur
│   ├── enrichLeadWithAI.ts      ← OpenAI / Anthropic
│   ├── enrichLeadWithoutAI.ts   ← fallback règles
│   ├── enrichAgencyB2B.ts       ← B2B agence
│   ├── pappersClient.ts         ← API Pappers
│   ├── publicContactFinder.ts   ← contacts publics
│   ├── enrichmentRules.ts       ← règles métier Gironde
│   └── enrichmentPrompts.ts     ← prompts IA
├── crm/prepareCrmPayload.ts     ← payload neutre
├── exports/
│   ├── exportEnrichedCsv.ts
│   ├── exportEnrichedJson.ts
│   ├── exportAirtable.ts
│   └── generateLeadBrief.ts     ← fiches markdown
├── types/EnrichedLead.ts        ← typage strict
├── utils/{csv,env,logger}.ts
└── cli/index.ts                 ← entrée CLI
```

---

## Logique de priorisation

| Priorité | Critères |
|---|---|
| **A** | `initial_score ≥ 75` + potentiel `fort`/`très fort` + vendeur pro/agence + zone prioritaire |
| **B** | Bon potentiel mais infos incomplètes |
| **C** | Potentiel moyen / besoin peu clair |
| **D** | Faible priorité, à mettre en file basse |

### Adaptation Gironde

| Zone(s) | Offre par défaut |
|---|---|
| Bordeaux centre, Triangle d'Or, Chartrons, Jardin Public, Caudéran, Le Bouscat | **Audit Valorisation avant vente** / Rénovation stratégique |
| Arcachon, Pyla, Cap Ferret, Lège-Cap-Ferret, La Teste | **Audit ameublement / location saisonnière** |
| Talence, Pessac, Mérignac, Bègles, Cenon, Floirac, Villenave-d'Ornon | **Audit investisseur locatif** |
| Libourne, Saint-Émilion | **Audit premium résidence secondaire** |
| Mention "à diviser", "constructible", "parcelle" | **Audit division / foncier** |

---

## Exemple de sortie enrichie (extrait JSON)

```json
{
  "id": "L0001",
  "city": "Chartrons",
  "enrichment_status": "enriched_rules",
  "human_review_required": true,
  "commercial_priority": "A",
  "lead_temperature": "hot",
  "property_positioning": "luxe",
  "property_condition_estimate": "lourd potentiel travaux",
  "value_creation_potential": "très fort",
  "estimated_budget_range": "150-300k",
  "top_3_value_levers": ["rénovation lourde", "redistribution des espaces", "amélioration DPE"],
  "suggested_audit_offer": "Audit rénovation stratégique",
  "recommended_next_action": "Préparer un message court via email agence, contextualisé sur l'annonce, avec opt-out clair."
}
```

---

## Intégration Make / n8n

- **n8n** : lire le JSON exporté ou la table Airtable, brancher sur un nœud de validation humaine (Slack/Telegram/Email).
- **Make** : importer le CSV en module "Watch files" ou utiliser le webhook Airtable.

> ⚠️ Aucune brique n'envoie de message automatique. La validation humaine reste obligatoire avant tout envoi.

---

## Tests

```bash
npm test
```

Un test minimal vérifie que le pipeline règles produit bien tous les champs requis et respecte les contraintes RGPD (particulier → `recommended_next_action` non-contact).

---

## Compatibilité Brique 1

La Brique 2 attend en entrée le format CSV scoré de la Brique 1. Si la Brique 1 produit déjà :
- `data/scored_leads.csv` → lancer `npm run enrich -- --input ../path/to/scored_leads.csv`
- ou bouger le fichier dans `prospection/data/` puis `npm run enrich:csv`.

La sortie ne touche **aucun fichier** de la Brique 1.

---

## Roadmap V3

Voir [`V3_PROPOSAL.md`](./V3_PROPOSAL.md).
