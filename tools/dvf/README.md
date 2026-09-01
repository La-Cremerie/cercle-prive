# Extraction de comparables DVF — front de mer Sainte-Maxime

Outil d'appui à l'étude [`docs/etudes-marche/sainte-maxime-nartelle-front-de-mer.md`](../../docs/etudes-marche/sainte-maxime-nartelle-front-de-mer.md).

Il produit les **comparables de niveau N1** (mutations réellement enregistrées), seuls opposables
en dossier bancaire ou en contradictoire fiscal.

## Prérequis

- Python 3.8+, aucune dépendance externe
- **Un accès Internet libre vers `files.data.gouv.fr`.** Le script échoue derrière un proxy
  filtrant — c'est le cas de l'environnement de développement Claude Code utilisé pour rédiger
  l'étude, d'où la nécessité de le lancer depuis un poste de l'agence.

## Utilisation

```bash
# Bande littorale Nartelle – Sardinaux, 5 derniers millésimes
python3 tools/dvf/extract_dvf_nartelle.py

# Resserrer sur le pieds-dans-l'eau strict
python3 tools/dvf/extract_dvf_nartelle.py --distance-max 120 --maisons-seules

# Haut de marché communal toutes zones (utile pour situer les records)
python3 tools/dvf/extract_dvf_nartelle.py --commune-entiere --top 50

# Communes de comparaison du Golfe
python3 tools/dvf/extract_dvf_nartelle.py --code-commune 83119 --commune-entiere   # Saint-Tropez
python3 tools/dvf/extract_dvf_nartelle.py --code-commune 83101 --commune-entiere   # Ramatuelle
# Autres communes du Golfe : relever le code INSEE sur insee.fr (Code officiel géographique)
```

| Option | Défaut | Rôle |
|---|---|---|
| `--code-commune` | `83115` (Sainte-Maxime) | code INSEE de la commune |
| `--departement` | `83` | département (arborescence du fichier source) |
| `--annees` | 5 derniers millésimes | millésimes DVF à agréger |
| `--distance-max` | `250` m | largeur de la bande littorale retenue |
| `--surface-min` | `40` m² | écarte les dépendances et les micro-lots |
| `--valeur-min` | `500 000 €` | écarte le marché courant |
| `--maisons-seules` | — | ne garde que les mutations comportant une maison |
| `--commune-entiere` | — | ignore le filtre littoral |
| `--top` | `30` | nombre de lignes affichées |
| `--csv` | `comparables_dvf.csv` | fichier de sortie (séparateur `;`, ouvrable dans Excel) |

## Sorties

- un **tableau Markdown** sur la sortie standard, directement collable dans le §6.3 de l'étude ;
- une **synthèse** de la bande littorale : médiane, min, max, nombre de mutations au-delà de 18 000 €/m² ;
- un **CSV** horodatable à joindre en pièce au rapport.

## Ce que fait le script, et pourquoi

**Reconstitution des mutations.** Une vente DVF s'étale sur plusieurs lignes : une par local,
par parcelle et par nature de culture, avec `valeur_fonciere` répétée à l'identique sur chacune.
Sommer les lignes sans déduplication gonfle les surfaces et écrase les €/m² — c'est l'erreur qui
invalide la plupart des extractions artisanales. Le script déduplique explicitement les locaux
et retient, par parcelle, la surface de terrain la plus grande plutôt que de cumuler les lignes
de culture.

**Filtre littoral.** Chaque mutation géolocalisée est projetée localement et sa distance à une
polyligne du rivage Nartelle → Pointe des Sardinaux est calculée. La polyligne est définie dans
`RIVAGE_NARTELLE` en tête de script : **coordonnées approximatives, à affiner sur
`cadastre.gouv.fr` si le dossier l'exige.** Cette distance est un critère de tri, pas une donnée
juridique — la qualification « pieds dans l'eau » se vérifie au plan cadastral.

**Exclusions.** Seules les `Vente` sont retenues (les adjudications, échanges et expropriations
suivent une autre logique de prix). Les mutations sans surface bâtie sont écartées.

## Limites à mentionner dans tout rapport

- Les **cessions de parts de SCI n'apparaissent pas dans DVF**. Sur le segment du front de mer,
  cette omission est massive : elle explique à elle seule une part des « trous » de comparables
  dans le haut de marché.
- Les transactions **off-market** ne sont pas identifiables comme telles.
- La `surface_reelle_bati` est la surface déclarée au fichier immobilier : elle peut différer de
  la surface Carrez et de la surface commerciale annoncée. Un écart de 10 % sur la surface
  déplace le €/m² de 10 % — à vérifier bien par bien sur les comparables retenus.
- Les millésimes récents sont publiés avec un décalage de plusieurs mois ; le dernier millésime
  disponible est souvent incomplet.

---

# Comptage par tranche de prix — `volumes_tranche_prix.py`

Répond à la question « combien de ventes ont réellement été actées entre 7 et 12 M€ sur le
Golfe de Saint-Tropez, et à quel rythme ? ». Aucune source publique ne publie ce chiffre.

Contrairement au script précédent qui travaille commune par commune, celui-ci télécharge le
fichier DVF du **département entier** (un gzip par millésime) et compte les mutations par
commune et par année dans la tranche demandée — sans qu'il faille relever à l'avance le code
INSEE de chaque commune du Golfe.

```bash
# Tranche 7–12 M€ sur les communes du Golfe, 7 derniers millésimes
python3 tools/dvf/volumes_tranche_prix.py --min 7000000 --max 12000000 --detail

# Tout le Var, au-delà de 10 M€
python3 tools/dvf/volumes_tranche_prix.py --min 10000000 --max 99000000 --communes TOUTES

# Alpes-Maritimes
python3 tools/dvf/volumes_tranche_prix.py --departement 06 --min 7000000
```

| Option | Défaut | Rôle |
|---|---|---|
| `--departement` | `83` | département balayé |
| `--annees` | 7 derniers millésimes | millésimes DVF |
| `--min` / `--max` | `7 000 000` / `12 000 000` | bornes de la tranche |
| `--communes` | les 12 communes du Golfe | noms séparés par des virgules, ou `TOUTES` |
| `--detail` | — | liste chaque mutation retenue |
| `--csv` | `volumes_tranche.csv` | fichier de sortie |

**Sorties :** un tableau croisé commune × année avec, pour chaque commune, le nombre de
mutations dans la tranche, le nombre total de ventes et la part que la tranche représente ;
le rythme annuel moyen ; et le détail de chaque mutation.

**Le comptage est un plancher, jamais un total.** Sur cette tranche, une part importante des
biens est détenue en SCI et cédée par cession de parts sociales : l'opération ne change pas
le propriétaire au fichier immobilier et n'apparaît jamais dans DVF. S'y ajoutent les ventes
off-market, majoritaires sur le haut du Golfe. Toute conclusion tirée de ce comptage doit
énoncer cette limite.
