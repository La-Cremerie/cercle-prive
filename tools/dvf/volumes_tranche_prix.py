#!/usr/bin/env python3
"""
Comptage des mutations enregistrées dans une tranche de prix — étude de volume.

Répond à la question : « combien de ventes ont réellement été actées entre 7 et
12 M€ sur le Golfe de Saint-Tropez, et à quel rythme ? »

Contrairement à `extract_dvf_nartelle.py` qui travaille commune par commune, ce
script télécharge le fichier DVF du département entier (un fichier gzip par
millésime) et compte les mutations par commune et par année dans la tranche
demandée. C'est le seul moyen d'obtenir un dénombrement exhaustif sans connaître
à l'avance le code INSEE de chaque commune.

Usage :
    python3 volumes_tranche_prix.py
    python3 volumes_tranche_prix.py --min 7000000 --max 12000000 --annees 2020 2021 2022 2023 2024 2025
    python3 volumes_tranche_prix.py --min 5000000 --max 99000000 --communes "SAINT-TROPEZ,RAMATUELLE"
    python3 volumes_tranche_prix.py --departement 06 --min 10000000

Aucune dépendance externe (bibliothèque standard Python 3.8+).

⚠️ Nécessite un accès Internet libre vers files.data.gouv.fr, et télécharge
plusieurs dizaines de Mo par millésime.

LIMITE MAJEURE SUR CE SEGMENT — à citer dans tout rapport :
DVF ne recense que les mutations à titre onéreux publiées au fichier immobilier.
Sur la tranche haute, une part importante des biens est détenue en SCI et cédée
par cession de parts sociales : l'opération ne change pas le propriétaire du
bien au fichier immobilier et n'apparaît donc pas ici. Le comptage produit par
ce script est un PLANCHER, pas un total.
"""

from __future__ import annotations

import argparse
import csv
import gzip
import io
import sys
import urllib.error
import urllib.request
from collections import Counter, defaultdict
from datetime import date

sys.path.insert(0, str(__import__("pathlib").Path(__file__).resolve().parent))
from extract_dvf_nartelle import agreger, _nombre  # noqa: E402

URL_DEPARTEMENT = "https://files.data.gouv.fr/geo-dvf/latest/csv/{annee}/departements/{dep}.csv.gz"

# Communes du Golfe de Saint-Tropez, par nom (le nom évite d'avoir à relever
# douze codes INSEE ; DVF porte le nom en clair dans `nom_commune`).
GOLFE = [
    "SAINTE-MAXIME", "SAINT-TROPEZ", "RAMATUELLE", "GASSIN", "GRIMAUD",
    "COGOLIN", "LA CROIX-VALMER", "CAVALAIRE-SUR-MER", "LE PLAN-DE-LA-TOUR",
    "LA MOLE", "RAYOL-CANADEL-SUR-MER", "LE RAYOL-CANADEL-SUR-MER",
]


def telecharger_departement(annee: int, dep: str) -> str | None:
    url = URL_DEPARTEMENT.format(annee=annee, dep=dep)
    print(f"Téléchargement DVF {annee}, département {dep}…", file=sys.stderr)
    try:
        with urllib.request.urlopen(url, timeout=600) as reponse:
            brut = reponse.read()
    except urllib.error.HTTPError as err:
        print(f"  {annee} : HTTP {err.code} — millésime probablement non publié", file=sys.stderr)
        return None
    except Exception as err:
        print(f"  {annee} : échec — {err}", file=sys.stderr)
        return None
    print(f"  {len(brut) / 1e6:.1f} Mo reçus, décompression…", file=sys.stderr)
    return gzip.decompress(brut).decode("utf-8")


def normaliser(nom: str) -> str:
    """Comparaison de noms de communes insensible aux accents et à la casse."""
    table = str.maketrans("ÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸàâäçéèêëîïôöùûüÿ", "AAACEEEEIIOOUUUYaaaceeeeiioouuuy")
    return nom.upper().translate(table).replace("-", " ").replace("'", " ").strip()


def main() -> int:
    annee_courante = date.today().year
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--departement", default="83")
    ap.add_argument("--annees", nargs="+", type=int, default=list(range(annee_courante - 6, annee_courante + 1)))
    ap.add_argument("--min", type=float, default=7_000_000.0, help="borne basse de la tranche (défaut : 7 M€)")
    ap.add_argument("--max", type=float, default=12_000_000.0, help="borne haute de la tranche (défaut : 12 M€)")
    ap.add_argument("--communes", default=",".join(GOLFE),
                    help="noms de communes séparés par des virgules ; « TOUTES » pour le département entier")
    ap.add_argument("--detail", action="store_true", help="lister chaque mutation retenue")
    ap.add_argument("--csv", default="volumes_tranche.csv")
    args = ap.parse_args()

    if args.communes.strip().upper() == "TOUTES":
        filtre = None
    else:
        filtre = {normaliser(nom) for nom in args.communes.split(",") if nom.strip()}

    retenues = []
    total_ventes_perimetre = Counter()   # dénominateur : toutes les ventes du périmètre

    for annee in args.annees:
        contenu = telecharger_departement(annee, args.departement)
        if contenu is None:
            continue

        # On ne garde en mémoire que les lignes du périmètre : le fichier
        # départemental complet est trop volumineux pour être agrégé en bloc.
        lignes_perimetre = []
        for ligne in csv.DictReader(io.StringIO(contenu)):
            nom = ligne.get("nom_commune", "")
            if filtre is None or normaliser(nom) in filtre:
                lignes_perimetre.append(ligne)
        print(f"  {len(lignes_perimetre)} lignes dans le périmètre", file=sys.stderr)

        for mutation in agreger(lignes_perimetre).values():
            if mutation["nature_mutation"] != "Vente":
                continue
            commune = mutation.get("nom_commune", "")
            total_ventes_perimetre[(annee, commune)] += 1
            valeur = mutation["valeur_fonciere"]
            if args.min <= valeur <= args.max:
                mutation["annee"] = annee
                retenues.append(mutation)

    if not total_ventes_perimetre:
        print("\nAucune donnée récupérée. Vérifiez l'accès réseau à files.data.gouv.fr.", file=sys.stderr)
        return 1

    tranche = f"{_nombre(args.min)} € – {_nombre(args.max)} €"
    print(f"\n## Ventes actées dans la tranche {tranche}\n")

    # Tableau croisé commune × année
    communes = sorted({m["nom_commune"] for m in retenues} |
                      {c for _, c in total_ventes_perimetre if total_ventes_perimetre[(_, c)]})
    annees = sorted({a for a, _ in total_ventes_perimetre})
    par_case = Counter((m["annee"], m["nom_commune"]) for m in retenues)

    print("| Commune | " + " | ".join(str(a) for a in annees) + " | Total | Ventes totales | Part |")
    print("|---" * (len(annees) + 4) + "|")
    for commune in communes:
        cells = [par_case[(a, commune)] for a in annees]
        total = sum(cells)
        base = sum(total_ventes_perimetre[(a, commune)] for a in annees)
        part = f"{total / base * 100:.2f} %" if base else "—"
        print(f"| {commune} | " + " | ".join(str(c) for c in cells) +
              f" | **{total}** | {_nombre(base)} | {part} |")

    total_general = len(retenues)
    base_generale = sum(total_ventes_perimetre.values())
    print(f"| **Périmètre entier** | " +
          " | ".join(str(sum(par_case[(a, c)] for c in communes)) for a in annees) +
          f" | **{total_general}** | {_nombre(base_generale)} | "
          f"{total_general / base_generale * 100:.3f} % |")

    if annees:
        print(f"\n**Rythme moyen : {total_general / len(annees):.1f} mutation(s) par an** "
              f"sur {len(annees)} millésime(s), pour {len(communes)} commune(s).")
    print("\n> Ce comptage est un **plancher** : les cessions de parts de SCI et les ventes "
          "off-market n'apparaissent pas dans DVF, et leur poids est maximal sur cette tranche.")

    if args.detail and retenues:
        print("\n### Détail des mutations\n")
        print("| Date | Commune | Adresse | SHAB | Terrain | Prix | €/m² |")
        print("|---|---|---|---:|---:|---:|---:|")
        for m in sorted(retenues, key=lambda x: x["date_mutation"]):
            pm2 = m["valeur_fonciere"] / m["surface_bati"] if m["surface_bati"] else 0
            print(f"| {m['date_mutation']} | {m['nom_commune']} | "
                  f"{'; '.join(sorted(m['adresses'])) or 'n.c.'} | "
                  f"{_nombre(m['surface_bati'])} m² | {_nombre(m['surface_terrain'])} m² | "
                  f"{_nombre(m['valeur_fonciere'])} € | "
                  f"{_nombre(pm2) if pm2 else 'n.c.'} |")

    with open(args.csv, "w", newline="", encoding="utf-8") as fichier:
        redacteur = csv.writer(fichier, delimiter=";")
        redacteur.writerow(["annee", "date_mutation", "commune", "adresses", "types",
                            "surface_bati", "surface_terrain", "valeur_fonciere", "prix_m2",
                            "latitude", "longitude", "id_mutation"])
        for m in sorted(retenues, key=lambda x: x["date_mutation"]):
            redacteur.writerow([
                m["annee"], m["date_mutation"], m["nom_commune"],
                "; ".join(sorted(m["adresses"])), "/".join(sorted(m["types"])),
                round(m["surface_bati"], 1), round(m["surface_terrain"], 1),
                round(m["valeur_fonciere"], 2),
                round(m["valeur_fonciere"] / m["surface_bati"]) if m["surface_bati"] else "",
                m["latitude"] or "", m["longitude"] or "", m["id_mutation"],
            ])
    print(f"\nCSV écrit : {args.csv}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
