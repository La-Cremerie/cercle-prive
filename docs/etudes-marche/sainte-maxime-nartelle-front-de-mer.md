# Étude de marché — Segment front de mer, Sainte-Maxime (83120)
## Justification des valeurs supérieures à 18 000 €/m² — quartier de La Nartelle

**Objet :** appui à l'avis de valeur et à la constitution d'un dossier d'expertise (banque, notaire, administration fiscale) pour des biens situés en première ligne littorale, secteur La Nartelle – Les Éléphants – Pointe des Sardinaux.

**Segments couverts :**
- **Segment A** — villa *pieds dans l'eau* (accès direct à la mer ou à la plage, sans voie interposée)
- **Segment B** — villa *première ligne vue mer* (front de mer, sans accès direct)

**Date de rédaction :** septembre 2026
**Rédacteur :** Cercle Privé / La Crémerie

---

## 0. Avertissement méthodologique — à lire avant tout usage externe

Ce document est un **cadre d'analyse et d'argumentation**. Il doit être complété par des **termes de comparaison réels** avant tout usage devant un tiers (banque, notaire, administration fiscale).

**Trois niveaux de preuve, à ne jamais confondre :**

| Niveau | Nature | Recevabilité |
|---|---|---|
| **N1 — Mutations enregistrées** | Ventes réellement publiées au fichier immobilier (DVF, Patrim, Perval) | **Seul niveau opposable** en contradictoire fiscal (art. L.17 du LPF) et attendu par un expert bancaire |
| **N2 — Transactions confidentielles** | Ventes off-market, cessions de parts de SCI, connues du réseau | Recevables si attestées par le professionnel qui les a réalisées |
| **N3 — Prix d'offre** | Prix affichés dans les annonces | **Indicatifs uniquement** — jamais suffisants seuls |

Les comparables cités en **§6.1** sont de niveau **N3**. La procédure d'extraction des comparables **N1** est fournie en **§10** avec un script automatisé (`tools/dvf/extract_dvf_nartelle.py`).

Les données de marché agrégées citées (§3) proviennent de sites d'estimation grand public et de la presse spécialisée : elles servent à **poser le décor**, pas à fonder la valeur. Elles doivent être revérifiées à leur source à la date d'émission du rapport.

---

## 1. Le point de départ du problème

Toute contestation d'un prix supérieur à 18 000 €/m² à Sainte-Maxime repose sur une seule et même erreur : **comparer un ratio de micro-marché à une moyenne communale**.

Il faut donc établir en ouverture qu'il n'existe pas *un* marché à Sainte-Maxime, mais **trois marchés emboîtés et non substituables**.

---

## 2. Les trois marchés de Sainte-Maxime

### 2.1 Marché communal (référence « grand public »)

Les indicateurs publics situent Sainte-Maxime, tous biens et toutes zones confondus, dans un ordre de grandeur de **6 000 à 7 500 €/m²** :

| Source | Indicateur | Valeur |
|---|---|---|
| Netvendeur (base notariale) | prix moyen net vendeur, commune | ~6 103 €/m² |
| Netvendeur | appartements | ~5 841 €/m² |
| Netvendeur | maisons | ~7 230 €/m² |

Ce marché agrège les collines, l'arrière-pays, les résidences des années 1970-1980, le locatif et les biens en mauvais état. **Il n'a aucune valeur probante pour un bien de front de mer.**

### 2.2 Marché de quartier « Nartelle – Noyer – Bellevue – bd des Sardinaux »

| Source | Indicateur | Bas | Moyen | Haut |
|---|---|---|---|---|
| SeLoger (quartier, janv. 2026) | tous biens | 5 861 € | **7 814 €** | 11 721 € |
| SeLoger | appartements | 4 958 € | 6 610 € | 9 915 € |
| SeLoger | maisons | 6 426 € | **8 568 €** | 12 852 € |
| MeilleursAgents (chemin de la Nartelle) | maisons | 4 078 € | 8 287 € | **16 573 €** |

**Point capital pour l'argumentaire :** l'outil MeilleursAgents affiche lui-même, *sur la seule voie du chemin de la Nartelle*, une borne haute de **16 573 €/m²** pour les maisons — soit plus du double de sa propre moyenne de voie. Cet écart intra-voie de 1 à 4 est la signature statistique d'un micro-marché littoral que les modèles automatisés ne savent pas isoler.

### 2.3 Micro-marché du front de mer Nartelle – Sardinaux

C'est le seul marché pertinent. Ordre de grandeur constaté à l'offre (voir §6.1) : **13 500 à 18 600 €/m²**, avec des dépassements structurels sur les biens compacts (voir §4).

> **Formulation à retenir pour le rapport :**
> *« La valeur de 18 000 €/m² ne se situe pas au-dessus du marché de Sainte-Maxime : elle se situe à l'intérieur du micro-marché du front de mer, qui représente moins de 2 % du parc communal et qui n'a jamais partagé le régime de prix du reste de la commune. »*

---

## 3. Pourquoi le €/m² s'envole en front de mer — le mécanisme

C'est le cœur de la démonstration, et la partie qui tient devant un expert bancaire ou un vérificateur.

### 3.1 Le €/m² habitable n'est pas un prix : c'est un quotient

Toute maison individuelle se décompose en :

```
Valeur vénale  =  Valeur de situation (foncier)  +  Valeur du bâti  +  Aménagements extérieurs
```

- La **valeur du bâti est plafonnée** par son coût de reconstruction. Sur le Golfe, une construction neuve haut de gamme se situe entre **3 500 et 5 000 €/m²** de surface habitable (hors foncier, hors honoraires, hors extérieurs). Un bâti ne vaut jamais durablement plus que ce qu'il coûte à refaire.
- La **valeur de situation n'est pas plafonnée** : elle dépend d'un actif non reproductible — la position sur le rivage.

Le €/m² habitable affiché n'est donc que :

```
€/m²  =  (Valeur de situation + Aménagements) / SHAB  +  Coût du bâti au m²
```

**Conséquence mécanique : à situation identique, plus la surface bâtie est faible, plus le €/m² est élevé.** Le ratio n'est pas un indicateur de cherté, c'est un indicateur de *densité de bâti sur un foncier rare*.

### 3.2 Calage de la valeur de situation (méthode du compte à rebours foncier)

Point de calage retenu — bien réellement proposé à la vente, situé entre la plage de la Nartelle et la Pointe des Sardinaux, pieds dans l'eau, 177,17 m², rénové contemporain, affiché **2 950 000 €** (Espaces Atypiques, réf. 5791).

| Poste | Hypothèse | Montant |
|---|---|---|
| Prix affiché | — | 2 950 000 € |
| Prix net vendeur retenu (négociation −5 %) | — | **2 800 000 €** |
| Valeur du bâti | 177 m² × 4 500 €/m² × 0,85 (vétusté, bien rénové non neuf) | − 677 000 € |
| Aménagements extérieurs (piscine, terrasses, soutènement littoral, paysagisme) | — | − 200 000 € |
| **= Valeur de situation résiduelle** | | **≈ 1 920 000 €** |

> **Valeur de situation retenue pour le segment A (pieds dans l'eau, Nartelle) : 1,9 M€ par emprise résidentielle**, hors caractéristiques exceptionnelles.

Cette valeur est à ajuster à la hausse en présence de : plage privative, ponton, exposition plein sud, vue frontale sur Saint-Tropez, parcelle > 1 000 m², absence de servitude de passage.

### 3.3 Table de sensibilité — le résultat décisif

Hypothèses : valeur de situation constante à **1,9 M€**, bâti neuf ou équivalent-neuf à **4 500 €/m²**, aménagements extérieurs **200 000 €**.

| Surface habitable | Valeur bâti | + extérieurs | + situation | **Valeur vénale** | **€/m² habitable** |
|---:|---:|---:|---:|---:|---:|
| 100 m² | 450 000 € | 650 000 € | 1 900 000 € | 2 550 000 € | **25 500 €** |
| 120 m² | 540 000 € | 740 000 € | 1 900 000 € | 2 640 000 € | **22 000 €** |
| 140 m² | 630 000 € | 830 000 € | 1 900 000 € | 2 730 000 € | **19 500 €** |
| **155 m²** | 697 500 € | 897 500 € | 1 900 000 € | 2 797 500 € | **18 048 €** |
| 177 m² | 796 500 € | 996 500 € | 1 900 000 € | 2 896 500 € | **16 365 €** |
| 200 m² | 900 000 € | 1 100 000 € | 1 900 000 € | 3 000 000 € | **15 000 €** |
| 250 m² | 1 125 000 € | 1 325 000 € | 1 900 000 € | 3 225 000 € | **12 900 €** |
| 300 m² | 1 350 000 € | 1 550 000 € | 1 900 000 € | 3 450 000 € | **11 500 €** |

**Lecture :** sur une même emprise pieds dans l'eau, de qualité et d'état identiques, le prix au m² varie **de 11 500 € à 25 500 €** selon la seule surface bâtie. Le franchissement des 18 000 €/m² intervient **en deçà d'environ 155 m² habitables**.

### 3.4 Seuil de franchissement des 18 000 €/m² selon la qualité de situation

Formule : `SHAB_seuil = (Valeur de situation + Aménagements) / (18 000 − 4 500)`

| Situation | Valeur de situation | **Surface en deçà de laquelle le bien dépasse 18 000 €/m²** |
|---|---:|---:|
| **Segment B** — 1re ligne vue mer, sans accès direct | 1 200 000 € | **≈ 104 m²** |
| **Segment A** — pieds dans l'eau standard Nartelle | 1 900 000 € | **≈ 156 m²** |
| Pieds dans l'eau, exposition sud + vue Saint-Tropez | 2 500 000 € | **≈ 200 m²** |
| Pieds dans l'eau avec plage privative / ponton | 3 500 000 € | **≈ 274 m²** |

> **Formulation à retenir :**
> *« Un dépassement de 18 000 €/m² n'est pas une anomalie de prix : c'est la conséquence arithmétique d'une valeur de situation de l'ordre de 1,9 M€ portée par une surface bâtie inférieure à 155 m². Sur la même parcelle, une villa de 250 m² afficherait 12 900 €/m² pour une valeur vénale supérieure de 425 000 €. »*

Ce dernier point est celui qui désamorce le plus efficacement l'objection : **le €/m² le plus élevé correspond au bien le moins cher en valeur absolue.**

---

## 4. Contrôle de cohérence par capitalisation locative

Méthode de recoupement indépendante, utile en dossier bancaire.

Le marché locatif saisonnier haut de gamme du secteur donne, pour une villa pieds dans l'eau à Sainte-Maxime, des tarifs affichés **à partir de 10 000 € la semaine** en haute saison (Magrey & Sons, villas pieds dans l'eau Sainte-Maxime 220 et 252 m²). À titre de contraste, une villa « aperçu mer » au Domaine de la Nartelle, sans front de mer, se loue **2 640 à 2 980 € la semaine** en très haute saison — soit un rapport de **1 à 3,5** entre le front de mer et l'arrière-plage, sur le même quartier.

Reconstitution d'un produit locatif annuel prudent (segment A) :

| Période | Semaines | Tarif | Produit |
|---|---:|---:|---:|
| Très haute et haute saison | 8 | 9 000 € | 72 000 € |
| Moyenne saison | 6 | 4 500 € | 27 000 € |
| **Total brut annuel** | | | **≈ 99 000 €** |

Sur ce segment, les taux de rendement brut observés sur les actifs balnéaires de rareté se situent entre **3,0 % et 3,5 %** (l'acquéreur achète un usage et une rareté, non un rendement).

```
Valeur par capitalisation = 99 000 / 3,3 %  ≈  3 000 000 €
```

Rapportée à une villa de 150 m², cette valeur ressort à **20 000 €/m²** — cohérente avec la table §3.3 et **confirmant la fourchette par une méthode entièrement indépendante**.

---

## 5. Rareté structurelle du foncier — pourquoi la prime ne se résorbe pas

Trois facteurs à documenter dans le rapport final (à vérifier au PLU de Sainte-Maxime en vigueur avant citation) :

1. **Loi Littoral** (art. L.121-16 et s. du code de l'urbanisme) — inconstructibilité de principe dans la bande des 100 mètres hors espaces urbanisés, et limitation de l'extension de l'urbanisation dans les espaces proches du rivage. **Aucune offre nouvelle de foncier pieds dans l'eau ne peut être créée.**
2. **Stock physiquement fini** — le linéaire côtier bâti entre la plage de la Nartelle et la Pointe des Sardinaux comporte un nombre fermé de parcelles en première ligne. *À chiffrer précisément par comptage cadastral (voir §10.3) : c'est un élément factuel très fort en dossier.*
3. **Protection environnementale des Sardinaux** (zone naturelle, sensibilité écologique du site) — contrainte supplémentaire sur toute densification.

**Conséquence économique :** l'offre est parfaitement inélastique. Toute hausse de la demande se transmet intégralement au prix, sans arbitrage possible par la construction. C'est la justification économique de la prime de rareté, et elle est structurelle, pas conjoncturelle.

---

## 6. Comparables

### 6.1 Comparables d'offre — Sainte-Maxime, secteur Nartelle / Sardinaux (niveau N3)

> ⚠️ Prix affichés, non des prix de vente. À utiliser en soutien, jamais seuls.

| # | Localisation | SHAB | Prix affiché | **€/m²** | Caractéristique | Source |
|---|---|---:|---:|---:|---|---|
| O1 | Entre plage de la Nartelle et Pointe des Sardinaux | 177,17 m² | 2 950 000 € | **16 651 €** | Pieds dans l'eau, rénové contemporain, 2 niveaux | Espaces Atypiques réf. 5791 |
| O2 | Secteur Nartelle | ~160 m² | 2 980 000 € | **≈ 18 625 €** | **Accès privatif direct à la plage** | Annonce agence (à re-sourcer et horodater) |
| O3 | Proche plage de la Nartelle | ~117 m² | 1 575 000 € | **≈ 13 460 €** | Vue mer remarquable sur les Sardinaux, sans accès direct | Annonce agence (à re-sourcer et horodater) |

**Le comparable O2 est le plus important du dossier : il établit qu'un bien à accès plage privatif se positionne au-delà de 18 000 €/m² sur ce même secteur.** Il doit impérativement être re-sourcé, horodaté et capturé (PDF de l'annonce avec date) avant remise du rapport.

Fourchette d'offre du micro-marché : **13 500 – 18 600 €/m²**.

### 6.2 Comparables élargis — Golfe de Saint-Tropez

Utiles pour montrer que 18 000 €/m² à Sainte-Maxime est un **niveau modéré** à l'échelle du Golfe.

| Commune / secteur | Indicateur | Valeur |
|---|---|---|
| Saint-Tropez | prix moyen maisons (mai 2026) | ~21 228 €/m² |
| Saint-Tropez | prix moyen tous biens | ~15 278 €/m² |
| Saint-Tropez, **quartier des Salins** | **pieds dans l'eau** | **20 000 – 40 000 €/m²** |
| Saint-Tropez | biens d'exception (vue + emplacement + prestations) | jusqu'à ~50 000 €/m² |
| Ramatuelle | prix moyen | ~16 135 €/m² |
| Sainte-Maxime | neuf haut de gamme | 8 000 – 11 000 €/m² |

> **Formulation à retenir :**
> *« Sainte-Maxime fait face à Saint-Tropez, à 15 minutes par la mer. Le pieds-dans-l'eau des Salins se traite entre 20 000 et 40 000 €/m². Une valorisation à 18 000 €/m² sur le front de mer de La Nartelle représente une décote de 10 % à 55 % par rapport à la rive opposée du même golfe, pour une qualité de situation et une exposition comparables. »*

**Contexte de marché 2025-2026 :** le Golfe enregistre **moins de transactions sans baisse des prix** — la rareté prime sur toute logique de correction. Sainte-Maxime est identifiée comme un marché de report de Saint-Tropez, ce qui soutient structurellement le haut de son marché.

### 6.3 Comparables de transaction (niveau N1) — à extraire

**C'est la pièce manquante et la seule opposable.** Voir §10 pour la procédure et le script.

Grille à compléter :

| # | Date | Adresse / section-parcelle | SHAB | Terrain | Prix acte | €/m² | Distance rivage | Source |
|---|---|---|---|---|---|---|---|---|
| T1 | | | | | | | | DVF / Patrim |
| T2 | | | | | | | | |
| T3 | | | | | | | | |
| T4 | | | | | | | | |
| T5 | | | | | | | | |

---

## 7. Grille de pondération — méthode par comparaison

Pour passer d'un comparable au bien évalué, appliquer des ajustements explicites et **chiffrés** (exigence de tout expert et de l'administration).

| Critère | Ajustement indicatif sur la valeur de situation |
|---|---|
| Accès direct mer/plage sans voie interposée | + 60 % à + 120 % vs. 1re ligne sans accès |
| Plage ou crique privative | + 25 % à + 50 % |
| Ponton / mouillage | + 10 % à + 25 % |
| Vue frontale sur Saint-Tropez | + 15 % à + 30 % |
| Exposition plein sud / sud-ouest | + 10 % à + 20 % |
| Absence de servitude de passage sur la parcelle | + 5 % à + 15 % |
| Nuisance routière (RD 559 en surplomb) | − 10 % à − 25 % |
| Servitude de passage des piétons sur le littoral (SPPL) traversant la propriété | − 10 % à − 20 % |
| Exposition au risque de submersion / PPR | − 5 % à − 15 % |
| Bien à rénover intégralement | valeur du bâti ramenée à 0, moins coût de démolition |

**Règle de rédaction :** chaque ajustement retenu doit être justifié en une ligne dans le rapport final. Un ajustement non motivé est le premier point attaqué en contradictoire.

---

## 8. Contre-argumentaire — objections attendues et réponses

| # | Objection | Réponse |
|---|---|---|
| **1** | « La moyenne à Sainte-Maxime est de 6 100 €/m². » | La méthode par comparaison impose de comparer des biens **intrinsèquement similaires** en situation, surface et époque, non de rapporter un bien à une moyenne communale. Une moyenne qui agrège collines, arrière-pays et parc ancien n'est pas un terme de comparaison. |
| **2** | « Les outils d'estimation plafonnent le quartier à 12 852 €/m². » | Ces bornes sont des sorties algorithmiques calées sur le volume : le front de mer représente moins de 2 % du parc et est structurellement sous-représenté dans l'apprentissage. Le même outil affiche **16 573 €/m²** en borne haute sur le seul chemin de la Nartelle — soit un écart intra-voie de 1 à 4 qui signale l'existence du micro-marché. |
| **3** | « 18 000 €/m², c'est plus que la moyenne de Saint-Tropez. » | Comparaison non homogène : moyenne communale contre ratio de bien d'exception. Le pieds-dans-l'eau des Salins à Saint-Tropez se traite **20 000 à 40 000 €/m²**. La référence pertinente n'est pas la moyenne de Saint-Tropez, c'est le front de mer de Saint-Tropez. |
| **4** | « Aucune vente DVF de ce niveau n'est recensée à Sainte-Maxime. » | Trois raisons cumulatives : **(a)** le segment produit un très faible nombre de mutations par an — l'absence de comparable récent traduit la rareté, pas l'absence de valeur ; **(b)** une part significative de ces biens est détenue en **SCI et cédée par cession de parts sociales**, opération qui **n'apparaît pas dans DVF** ; **(c)** une part importante des transactions haut de gamme du Golfe se réalise **off-market**, hors diffusion publique. DVF sous-représente donc structurellement ce segment. |
| **5** | « Le prix affiché n'est pas un prix de vente. » | Exact — d'où la production de comparables N1 en §6.3 et le recoupement par capitalisation locative en §4. Les prix d'offre ne sont ici qu'un troisième faisceau. |
| **6** | « Le bien est petit, il ne vaut pas ce prix. » | Argument inversé : sur le front de mer, la **compacité augmente** le €/m² et **diminue** la valeur absolue. Le bien de 155 m² à 18 000 €/m² est **moins cher** en valeur totale que le bien de 250 m² à 12 900 €/m² sur la même emprise (2,80 M€ contre 3,23 M€). |
| **7** | « Le marché est en repli depuis 2023. » | Sur le Golfe de Saint-Tropez, le repli porte sur les **volumes**, pas sur les prix : moins de ventes, valeurs maintenues, la rareté primant sur toute logique de baisse (constat de marché 2025-2026). Le segment de rareté est le moins élastique du marché. |

---

## 9. Conclusion — fourchette de valeur justifiée

| Segment | Fourchette €/m² justifiée | Condition |
|---|---|---|
| **A — Pieds dans l'eau, Nartelle / Sardinaux** | **15 000 – 22 000 €/m²** | Dépassement de 18 000 €/m² justifié **en deçà de ~155 m² habitables**, ou au-delà en présence de plage privative / ponton / exposition sud |
| **A+ — Pieds dans l'eau avec plage privative** | **18 000 – 28 000 €/m²** | Situation exceptionnelle documentée |
| **B — 1re ligne vue mer, sans accès direct** | **11 000 – 18 000 €/m²** | Dépassement de 18 000 €/m² justifié **en deçà de ~105 m² habitables** |

**Une valeur supérieure à 18 000 €/m² est donc pleinement justifiable sur le secteur de La Nartelle**, dès lors que le rapport établit conjointement :

1. l'appartenance du bien au micro-marché du front de mer (§2.3) ;
2. la valeur de situation par compte à rebours foncier (§3.2) ;
3. la surface bâtie et le seuil de franchissement correspondant (§3.4) ;
4. au moins **trois comparables de niveau N1** (§6.3) ;
5. le recoupement par capitalisation locative (§4) ;
6. la rareté foncière quantifiée par comptage cadastral (§5).

**Sans les points 4 et 6, le dossier reste argumentatif ; avec eux, il devient opposable.**

---

## 10. Annexe méthodologique — obtenir les comparables opposables

### 10.1 Sources de niveau N1

| Source | Accès | Contenu | Limite |
|---|---|---|---|
| **DVF open data** | `files.data.gouv.fr/geo-dvf/` — libre | Mutations depuis 2020, géolocalisées, avec surface bâtie et terrain | Pas les cessions de parts de SCI ; Alsace-Moselle et Mayotte exclus |
| **Patrim** | impots.gouv.fr, espace particulier → « Rechercher des transactions immobilières » | Même socle, interface de recherche par critères | Usage encadré (déclaratif, évaluation) |
| **Perval** | Base des notaires, accès professionnel | Mutations enrichies (état, prestations) | Payant / conventionné |
| **Rapport annuel de la Chambre des Notaires du Var** | Publication | Indices et prix médians par commune | Agrégé, pas de comparable individuel |

### 10.2 Extraction automatisée ciblée

Un script est fourni : **`tools/dvf/extract_dvf_nartelle.py`**

Il télécharge les mutations DVF de Sainte-Maxime (INSEE **83115**), les regroupe correctement par mutation (les ventes multi-lots faussent tous les calculs naïfs de €/m²), calcule la **distance au rivage** de chaque bien à partir de sa géolocalisation, et sort une grille de comparables triée par €/m² décroissant, restreinte à la bande littorale Nartelle – Sardinaux.

```bash
python3 tools/dvf/extract_dvf_nartelle.py --annees 2021 2022 2023 2024 2025 --distance-max 250
```

Voir `tools/dvf/README.md` pour le détail des options et l'interprétation des résultats.

> ⚠️ Ce script doit être lancé depuis un poste disposant d'un accès Internet libre : l'environnement de développement utilisé pour rédiger cette étude est derrière un proxy qui bloque `files.data.gouv.fr`.

### 10.3 Comptage cadastral de la rareté (§5)

Procédure, à réaliser une fois et à réutiliser dans tous les dossiers du secteur :

1. Ouvrir le **cadastre.gouv.fr** ou le **Géoportail de l'urbanisme** sur Sainte-Maxime.
2. Délimiter le linéaire côtier entre la plage de la Nartelle (ouest) et la Pointe des Sardinaux (est).
3. Compter les **parcelles bâties en contact direct avec le domaine public maritime**, sans voie interposée.
4. Croiser avec le zonage du **PLU** et le tracé de la **bande des 100 mètres**.

Résultat attendu : un nombre fermé, à deux chiffres. Une phrase du type *« le secteur compte N parcelles bâties en contact direct avec le rivage, aucune création nouvelle n'étant possible au titre de la loi Littoral »* vaut plus, en dossier, que dix pages d'analyse de marché.

### 10.4 Pièces à joindre au rapport final

- [ ] Extraction DVF horodatée (CSV + capture de la requête)
- [ ] Trois comparables N1 minimum, avec plan de situation
- [ ] Captures PDF horodatées des comparables d'offre O1–O3
- [ ] Extrait cadastral du bien et des comparables
- [ ] Extrait du PLU et du zonage littoral
- [ ] Attestation de comparables off-market (N2) le cas échéant, signée
- [ ] Historique locatif réel du bien si disponible (justifie §4 par des flux constatés et non des tarifs affichés)

---

## 11. Sources

Données agrégées et contexte de marché :

- MeilleursAgents — [prix chemin de la Nartelle, Sainte-Maxime](https://www.meilleursagents.com/prix-immobilier/sainte-maxime-83120/chemin-de-la-nartelle-1167963135/)
- MeilleursAgents — [prix Sainte-Maxime 83120](https://www.meilleursagents.com/prix-immobilier/sainte-maxime-83120/)
- SeLoger — [prix quartier Nartelle-Noyer-Bellevue-bd des Sardinaux](https://www.seloger.com/prix-de-l-immo/vente/provence-alpes-cote-d-azur/var/sainte-maxime/nartelle-noyer-bellevue-bd-des-sardinaux/46108.htm)
- Netvendeur — [prix Sainte-Maxime](https://www.netvendeur.com/prix/ville-sainte-maxime-83/) et [quartier Sémaphore-Nartelle](https://www.netvendeur.com/prix/quartier-semaphore-nartelle-83120/)
- PAP — [prix m² Sainte-Maxime par quartiers](https://www.pap.fr/vendeur/prix-m2/sainte-maxime-83120-g40947)

Comparables d'offre :

- Espaces Atypiques — [villa pieds dans l'eau, Sainte-Maxime, 177,17 m², 2 950 000 €](https://www.espaces-atypiques.com/ventes/83120-sainte-maxime-villa-les-pieds-dans-l-eau-5791/)
- Belles Demeures — [maisons et villas de luxe, quartier Nartelle-Noyer-Bellevue-bd des Sardinaux](https://www.bellesdemeures.com/vente/france/provence-alpes-cote-d-azur/var/sainte-maxime/nartelle-noyer-bellevue-bd-des-sardinaux/maison-luxe/tt-2-tb-2-pl-46108/)
- Agence Provensal — [villa pieds dans l'eau avec piscine, Sainte-Maxime](https://proprietes.agenceprovensal.com/fiche-villa+pieds+dans+l+eau+avec+piscine+a+vendre+a+ste+maxime-300V1402M.html)
- Côte & Littoral — [maisons pieds dans l'eau Sainte-Maxime](https://www.cotelittoral.fr/vente-maisons-pieds-dans-l-eau-sainte-maxime-56096_31.html)

Marché du Golfe et comparables élargis :

- MySweetImmo — [Golfe de Saint-Tropez : moins de ventes mais des prix qui ne cèdent pas (févr. 2026)](https://www.mysweetimmo.com/2026/02/18/immobilier-dans-le-golfe-de-saint-tropez-peu-de-ventes-mais-des-prix-qui-ne-cedent-pas/)
- MySweetImmo — [prix de l'immobilier à Saint-Tropez, les clés du marché (mars 2026)](https://www.mysweetimmo.com/2026/03/15/prix-immobilier-saint-tropez-fevrier-2026/)
- MySweetImmo — [où acheter autour de Saint-Tropez (juin 2026)](https://www.mysweetimmo.com/2026/06/01/immobilier-saint-tropez-ces-communes-voisines-qui-seduisent-les-acheteurs/)
- MySweetImmo — [Saint-Tropez, les prix s'envolent sur les biens de prestige](https://www.mysweetimmo.com/2025/03/13/immobilier-saint-tropez-les-prix-senvolent-sur-les-biens-de-prestige/)
- Orpi — [prix m² Saint-Tropez (mai 2026)](https://www.orpi.com/prix-immobilier/saint-tropez)
- VenteCommerces — [prix au m² à Saint-Tropez, analyse par quartier](https://www.ventecommerces.com/prix-au-m2-a-saint-tropez-analyse-detaillee-par-quartier/)
- Logic-Immo — [dans le Golfe de Saint-Tropez, la vue mer reste le principal critère](https://actualites.logic-immo.com/pres-de-chez/golfe-de-saint-tropez-vue-mer-reste-principal-critere-de-recherche-oeil-expert-13387)

Marché locatif (contrôle de cohérence) :

- Magrey & Sons — [locations de villas pieds dans l'eau, Sainte-Maxime](https://www.magrey.fr/location-sainte-maxime.html)
- Agence Mont-Blanc — [villa Domaine de la Nartelle, tarifs semaine](https://www.agencemontblanc.com/location-vacances/83-var/2-ste-maxime/villa-au-calme-avec-piscine-et-apercu-mer-domaine-de-la-nartelle-sainte-maxime/944-villa)

**Toutes les valeurs issues de ces sources doivent être revérifiées et horodatées à la date d'émission du rapport final.** Les niveaux de prix des plateformes d'estimation évoluent mensuellement.
