# Prospection Engine — Audit de Valorisation Immobilière Gironde

V1 d'un pipeline de prospection automatisée pour détecter des biens à fort potentiel de valorisation sur la Gironde : scraping légal + scoring + export CSV/JSON/Airtable.

**Périmètre V1** : aide à la décision uniquement. Aucun envoi automatique de message commercial. La validation humaine est obligatoire avant tout contact.

## Architecture

```
scrapers/importCsv ─┐
                    ├─► normalizer ─► scoring ─► exports (CSV / JSON / Airtable)
        Apify ──────┘
```

```
prospection/
├── src/
│   ├── scrapers/        # apifyClient.ts, importCsv.ts
│   ├── normalizers/     # normalizeRealEstateLead.ts
│   ├── scoring/         # scoreLead.ts, keywordRules.ts
│   ├── exports/         # exportCsv.ts, exportJson.ts, exportAirtable.ts
│   ├── config/          # citiesGironde.ts, sources.ts
│   ├── types/           # Lead.ts
│   └── index.ts         # CLI
├── data/                # sample_input.csv, sample_output.csv
├── exports/             # leads du jour + pipeline.log (généré)
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Installation

```bash
cd prospection
npm install
cp .env.example .env   # puis renseigner les clés
```

Node ≥ 18.18 requis.

## Variables d'environnement

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `APIFY_TOKEN` | si scraping | Token Apify — console.apify.com → Integrations |
| `AIRTABLE_API_KEY` | optionnel | Token Airtable — airtable.com/account |
| `AIRTABLE_BASE_ID` | optionnel | ID de la base Airtable |
| `AIRTABLE_TABLE_NAME` | optionnel | Nom de la table (défaut : `Leads`) |
| `OPENAI_API_KEY` | optionnel | Pour analyse IA (V2) |
| `ENABLE_AI_ANALYSIS` | optionnel | `true` pour activer l'IA (défaut : `false`) |

## Commandes

```bash
npm run scrape                                # Apify uniquement
npm run import:csv -- ./data/sample_input.csv # import CSV manuel
npm run score                                 # scoring sur le dernier batch
npm run export                                # CSV + JSON + Airtable (si configuré)
npm run all                                   # scrape + score + export
npm run all -- ./data/sample_input.csv        # import CSV + score + export
```

Sorties dans `exports/` :
- `leads_<timestamp>.csv` (encodage UTF-8 BOM, ouvrable dans Excel)
- `leads_<timestamp>.json`
- `latest_leads.json` (état intermédiaire entre commandes)
- `pipeline.log` (logs horodatés)

## Connecter Apify

1. Créer un compte sur https://apify.com et copier le token (`Settings → Integrations`).
2. Renseigner `APIFY_TOKEN` dans `.env`.
3. **Vérifier les acteurs configurés** dans `src/config/sources.ts` :
   - Les acteurs communautaires pour Leboncoin / SeLoger / Bien'ici sont des **placeholders** : leur ID peut changer.
   - Si un actor renvoie 0 résultat, aller sur https://apify.com/store, chercher le nom du portail, et copier l'ID exact dans la propriété `apify_actor_id`.
4. Tester d'abord avec `max_items: 10` (`DEFAULT_RUN_CONFIG` dans `sources.ts`) avant tout run complet.
5. Pour activer/désactiver une source, basculer `enabled: true|false`.

## Connecter Airtable

1. Créer une base avec une table `Leads` contenant **au minimum** ces colonnes (types entre parenthèses) :
   - `id` (single line text), `created_at` (single line text)
   - `source`, `source_url`, `title` (single line / long text)
   - `city`, `postal_code`, `property_type`
   - `price`, `surface_m2`, `price_per_m2`, `rooms` (number)
   - `dpe`, `photos_count`, `seller_type`, `agency_name`
   - `total_score` (number), `score_category` (single select)
   - `recommended_offer` (single select)
   - `detected_opportunities`, `suggested_commercial_angle`, `short_analysis` (long text)
   - `opt_out_required` (checkbox)
2. Récupérer la clé API : https://airtable.com/account
3. Récupérer l'ID de base : https://airtable.com/api → première section de l'URL
4. Renseigner `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_NAME`.
5. Relancer `npm run export` — insertion par lots de 10 (limite Airtable).

## Scoring (0-100)

Score réparti sur 6 catégories (`src/scoring/keywordRules.ts`) :

| Catégorie | Max | Signaux |
|-----------|-----|---------|
| Travaux | 25 | mots-clés rénovation, modernisation, division, combles, surélévation… |
| Présentation faible | 15 | <6 photos, description courte, titre générique, absence de mots-clés premium |
| Ameublement / locatif | 15 | mots-clés Airbnb, LMNP, vendu vide, rendement, colocation… |
| Premium | 20 | zone premium (Bordeaux, Cap Ferret, Arcachon…), mots-clés haut de gamme |
| Marchand / investisseur | 15 | immeuble, terrain, grande surface (≥200 m²), DPE F/G |
| Urgence | 10 | annonce ancienne, baisse de prix, succession, vacant |

### Catégories de score
- 80-100 : **priorité très haute**
- 65-79 : **priorité haute**
- 50-64 : potentiel moyen
- 0-49 : faible priorité

### Offre recommandée

Mapping dérivé de la catégorie dominante :
- Travaux dominant → **Audit rénovation / travaux**
- Ameublement dominant → **Audit ameublement / location saisonnière**
- Marchand dominant → **Audit division / optimisation foncière**
- Premium ou présentation faible dominant → **Audit Valorisation avant vente**
- Appartement en zone prioritaire avec signaux locatifs → **Audit investissement locatif**
- Score total < 30 → **Non prioritaire**

### Pondération

Tous les seuils, mots-clés et points par occurrence sont modifiables dans `src/scoring/keywordRules.ts` (constantes `CATEGORY_MAX`, `THRESHOLDS`, `POINTS_PER_KEYWORD` et tableaux de mots-clés). Aucun rebuild nécessaire — `tsx` recompile à chaque lancement.

## Conformité RGPD et limites légales

- **Aucune donnée personnelle sensible n'est scrapée.** Téléphone et email : on stocke uniquement leur présence (`phone_present` / `email_present`), jamais leur valeur.
- **`opt_out_required: true` systématique** : tout message commercial en aval devra obligatoirement inclure une mention d'opposition / désinscription explicite (article 21 RGPD, LCEN).
- **Traçabilité** : chaque lead conserve son `source_url` pour audit.
- **Pas de contournement** : aucune logique de bypass paywall, captcha, login ou restriction technique. Si une source bloque, on bascule sur l'import CSV manuel.
- **Pas d'automatisation commerciale** dans cette V1 : pipeline d'**aide** à la prospection, validation humaine obligatoire avant tout contact.
- **Sources publiques uniquement** : annonces immobilières publiquement diffusées.
- Le scraping reste soumis aux CGU de chaque plateforme. Vérifier la compatibilité juridique avant un run massif. Privilégier les acteurs Apify officiels lorsque disponibles.

### Sources et statut V1

| Source | Statut | Méthode |
|--------|--------|---------|
| Leboncoin | activé | Acteur Apify (ID à confirmer) |
| SeLoger | activé | Acteur Apify (ID à confirmer) |
| Bien'ici | activé | Acteur Apify (ID à confirmer) |
| Logic-Immo | désactivé | Fallback : import CSV manuel |
| PAP | désactivé | Fallback : import CSV manuel |
| Figaro Immobilier | désactivé | Fallback : import CSV manuel |
| Agences locales | manuel | Import CSV ou URLs fournies |

## Validation humaine — checklist avant contact

1. Ouvrir le CSV exporté (`exports/leads_<timestamp>.csv`) trié par `total_score` décroissant.
2. Filtrer sur `score_category = priorité très haute` ou `priorité haute`.
3. Recouper manuellement chaque `source_url` :
   - L'annonce est-elle toujours en ligne ?
   - Les signaux détectés (travaux, faible présentation, etc.) sont-ils confirmés visuellement ?
4. Vérifier le `seller_type` :
   - Particulier → approche directe possible
   - Agence → approche B2B (partenariat / co-courtage), pas de démarchage du particulier
5. Préparer un message conforme RGPD avec mention d'opposition et finalité commerciale explicite.

## V2 — Pistes d'évolution

- **Enrichissement Pappers** : croiser les propriétaires SCI / foncières pour cibler l'investisseur réel
- **Génération de messages personnalisés** via OpenAI / Claude (déclenchable par `ENABLE_AI_ANALYSIS=true`)
- **Intégration CRM** (HubSpot, Pipedrive, Folk) via Make ou n8n
- **Séquences de relance** déclenchées sur réponse manuelle (jamais sur signal automatique seul)
- **Dashboard de performance** : taux d'ouverture, taux de réponse, conversions par offre, ROI par source
- **Scoring IA avancé** : analyse sémantique fine des descriptions, comparaison automatique au prix médian DVF local
- **Historisation des annonces** : job quotidien + détection automatique des baisses de prix et des relistings
- **Module agents locaux** via Google Maps API (annuaire pro public, B2B)
- **Webhooks** : alertes Slack / email sur nouveau lead `priorité très haute`

## Licence et responsabilité

Outil interne d'aide à la prospection. Toute utilisation reste sous la responsabilité de l'opérateur quant au respect des CGU des plateformes scrapées, du RGPD et de la LCEN.
