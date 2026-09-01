#!/usr/bin/env python3
"""
Extraction de comparables DVF pour le front de mer de Sainte-Maxime (La Nartelle).

Télécharge les mutations DVF géolocalisées (base open data « geo-dvf » d'Etalab),
les reconstitue au niveau de la mutation — et non de la ligne, ce qui est la
principale source d'erreur dans les calculs naïfs de €/m² — puis restreint le
résultat à la bande littorale Nartelle / Les Éléphants / Pointe des Sardinaux
par calcul de distance au rivage.

Usage :
    python3 extract_dvf_nartelle.py
    python3 extract_dvf_nartelle.py --annees 2022 2023 2024 2025 --distance-max 200
    python3 extract_dvf_nartelle.py --commune-entiere --top 40
    python3 extract_dvf_nartelle.py --code-commune 83119 --departement 83   # Saint-Tropez

Aucune dépendance externe (bibliothèque standard Python 3.8+).

⚠️ Nécessite un accès Internet libre vers files.data.gouv.fr.

Limites de la source DVF, à rappeler dans tout rapport :
  - les cessions de parts de SCI n'y figurent pas (fréquentes sur ce segment) ;
  - les ventes en VEFA et les adjudications ont un régime particulier ;
  - Alsace-Moselle et Mayotte sont hors périmètre ;
  - la surface habitable DVF est la « surface réelle bâtie » déclarée, qui peut
    différer de la surface loi Carrez ou de la surface annoncée en agence.
"""

from __future__ import annotations

import argparse
import csv
import io
import math
import sys
import urllib.error
import urllib.request
from collections import defaultdict
from datetime import date

BASE_URL = "https://files.data.gouv.fr/geo-dvf/latest/csv/{annee}/communes/{dep}/{commune}.csv"

# Rivage Nartelle -> Pointe des Sardinaux, d'ouest en est.
# Coordonnées approximatives (WGS84) : à affiner sur cadastre.gouv.fr si besoin,
# la distance calculée est un indicateur de tri, pas une donnée juridique.
RIVAGE_NARTELLE = [
    (43.3138, 6.6480),  # extrémité ouest de l'anse (Croisette / début Nartelle)
    (43.3120, 6.6540),
    (43.3100, 6.6600),  # plage de la Nartelle
    (43.3082, 6.6660),  # plage des Éléphants
    (43.3065, 6.6710),
    (43.3040, 6.6745),  # Pointe des Sardinaux
]

TYPES_BATI = {"Maison", "Appartement"}


# --------------------------------------------------------------------------- #
# Géométrie
# --------------------------------------------------------------------------- #

def _projete(lat: float, lon: float, lat_ref: float) -> tuple[float, float]:
    """Projection plane locale (equirectangulaire), en mètres. Exacte à ~1 m ici."""
    x = math.radians(lon) * 6371000.0 * math.cos(math.radians(lat_ref))
    y = math.radians(lat) * 6371000.0
    return x, y


def distance_au_rivage(lat: float, lon: float, rivage=RIVAGE_NARTELLE) -> float:
    """Distance en mètres du point à la polyligne du rivage."""
    lat_ref = rivage[0][0]
    px, py = _projete(lat, lon, lat_ref)
    meilleure = float("inf")
    for (lat1, lon1), (lat2, lon2) in zip(rivage, rivage[1:]):
        ax, ay = _projete(lat1, lon1, lat_ref)
        bx, by = _projete(lat2, lon2, lat_ref)
        dx, dy = bx - ax, by - ay
        norme = dx * dx + dy * dy
        t = 0.0 if norme == 0 else max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / norme))
        cx, cy = ax + t * dx, ay + t * dy
        meilleure = min(meilleure, math.hypot(px - cx, py - cy))
    return meilleure


# --------------------------------------------------------------------------- #
# Téléchargement et agrégation
# --------------------------------------------------------------------------- #

def telecharger(annee: int, dep: str, commune: str) -> str | None:
    url = BASE_URL.format(annee=annee, dep=dep, commune=commune)
    try:
        with urllib.request.urlopen(url, timeout=120) as reponse:
            return reponse.read().decode("utf-8")
    except urllib.error.HTTPError as err:
        if err.code == 404:
            print(f"  {annee} : pas de fichier publié (404)", file=sys.stderr)
        else:
            print(f"  {annee} : erreur HTTP {err.code}", file=sys.stderr)
    except Exception as err:  # réseau, proxy, TLS…
        print(f"  {annee} : échec du téléchargement — {err}", file=sys.stderr)
    return None


def _flottant(valeur: str) -> float:
    try:
        return float(valeur)
    except (TypeError, ValueError):
        return 0.0


def agreger(lignes) -> dict[str, dict]:
    """
    Reconstitue les mutations à partir des lignes DVF.

    Une mutation DVF s'étale sur plusieurs lignes (un local, une parcelle, une
    nature de culture par ligne) et `valeur_fonciere` est répétée à l'identique
    sur chacune. Sommer les lignes sans déduplication surestime les surfaces et
    fausse tous les €/m². On déduplique donc explicitement.
    """
    mutations: dict[str, dict] = {}
    locaux_vus: set[tuple] = set()
    parcelles_terrain: dict[str, dict[str, float]] = defaultdict(dict)

    for ligne in lignes:
        identifiant = ligne.get("id_mutation")
        if not identifiant:
            continue

        mutation = mutations.setdefault(
            identifiant,
            {
                "id_mutation": identifiant,
                "date_mutation": ligne.get("date_mutation", ""),
                "nature_mutation": ligne.get("nature_mutation", ""),
                "nom_commune": ligne.get("nom_commune", ""),
                "valeur_fonciere": _flottant(ligne.get("valeur_fonciere", "")),
                "surface_bati": 0.0,
                "pieces": 0,
                "types": set(),
                "adresses": set(),
                "parcelles": set(),
                "latitude": None,
                "longitude": None,
            },
        )

        # valeur_fonciere : identique sur toutes les lignes, on garde le maximum
        # (certaines lignes sont vides sur les millésimes anciens).
        mutation["valeur_fonciere"] = max(
            mutation["valeur_fonciere"], _flottant(ligne.get("valeur_fonciere", ""))
        )

        type_local = (ligne.get("type_local") or "").strip()
        if type_local:
            mutation["types"].add(type_local)

        if type_local in TYPES_BATI:
            cle = (
                identifiant,
                ligne.get("id_parcelle", ""),
                type_local,
                ligne.get("surface_reelle_bati", ""),
                ligne.get("nombre_pieces_principales", ""),
                ligne.get("numero_volume", ""),
                ligne.get("adresse_numero", ""),
                ligne.get("adresse_nom_voie", ""),
            )
            if cle not in locaux_vus:
                locaux_vus.add(cle)
                mutation["surface_bati"] += _flottant(ligne.get("surface_reelle_bati", ""))
                mutation["pieces"] += int(_flottant(ligne.get("nombre_pieces_principales", "")))

        parcelle = ligne.get("id_parcelle", "")
        if parcelle:
            mutation["parcelles"].add(parcelle)
            # Une parcelle apparaît une fois par nature de culture : on retient
            # la surface la plus grande plutôt que de cumuler des doublons.
            surface = _flottant(ligne.get("surface_terrain", ""))
            precedente = parcelles_terrain[identifiant].get(parcelle, 0.0)
            parcelles_terrain[identifiant][parcelle] = max(precedente, surface)

        voie = " ".join(
            part for part in (ligne.get("adresse_numero", ""), ligne.get("adresse_nom_voie", "")) if part
        ).strip()
        if voie:
            mutation["adresses"].add(voie)

        if mutation["latitude"] is None and ligne.get("latitude"):
            mutation["latitude"] = _flottant(ligne["latitude"])
            mutation["longitude"] = _flottant(ligne.get("longitude", ""))

    for identifiant, mutation in mutations.items():
        mutation["surface_terrain"] = sum(parcelles_terrain[identifiant].values())

    return mutations


# --------------------------------------------------------------------------- #
# Pipeline
# --------------------------------------------------------------------------- #

def collecter(annees, dep, commune) -> list[dict]:
    toutes: dict[str, dict] = {}
    for annee in annees:
        print(f"Téléchargement DVF {annee} — commune {commune}…", file=sys.stderr)
        contenu = telecharger(annee, dep, commune)
        if contenu is None:
            continue
        lignes = list(csv.DictReader(io.StringIO(contenu)))
        print(f"  {len(lignes)} lignes", file=sys.stderr)
        toutes.update(agreger(lignes))
    return list(toutes.values())


def filtrer(mutations, surface_min, valeur_min, maisons_seules) -> list[dict]:
    retenues = []
    for mutation in mutations:
        if mutation["nature_mutation"] != "Vente":
            continue
        if mutation["valeur_fonciere"] < valeur_min:
            continue
        if mutation["surface_bati"] < surface_min:
            continue
        if maisons_seules and "Maison" not in mutation["types"]:
            continue
        # Ventes multi-biens (plusieurs maisons dans un même acte) : le €/m²
        # reste calculable, mais on le signale pour tri manuel.
        mutation["prix_m2"] = mutation["valeur_fonciere"] / mutation["surface_bati"]
        if mutation["latitude"]:
            mutation["distance_rivage"] = distance_au_rivage(
                mutation["latitude"], mutation["longitude"]
            )
        else:
            mutation["distance_rivage"] = None
        retenues.append(mutation)
    return retenues


def _nombre(valeur: float) -> str:
    """Format français : espace insécable fine comme séparateur de milliers."""
    return f"{valeur:,.0f}".replace(",", "\u202f")


def formater_tableau(mutations, titre) -> str:
    lignes = [
        f"\n### {titre}\n",
        "| Date | Adresse | Type | SHAB | Terrain | Prix acte | €/m² | Dist. rivage | Parcelle |",
        "|---|---|---|---:|---:|---:|---:|---:|---|",
    ]
    for mutation in mutations:
        distance = mutation.get("distance_rivage")
        lignes.append(
            "| {date} | {adresse} | {types} | {shab} m² | {terrain} m² | "
            "{prix} € | **{pm2} €** | {dist} | {parcelle} |".format(
                date=mutation["date_mutation"],
                adresse="; ".join(sorted(mutation["adresses"])) or "n.c.",
                types="/".join(sorted(mutation["types"] & TYPES_BATI)) or "n.c.",
                shab=_nombre(mutation["surface_bati"]),
                terrain=_nombre(mutation["surface_terrain"]),
                prix=_nombre(mutation["valeur_fonciere"]),
                pm2=_nombre(mutation["prix_m2"]),
                dist=f"{distance:.0f} m" if distance is not None else "n.c.",
                parcelle="; ".join(sorted(mutation["parcelles"]))[:60],
            )
        )
    return "\n".join(lignes)


def ecrire_csv(mutations, chemin) -> None:
    colonnes = [
        "date_mutation", "adresses", "types", "surface_bati", "surface_terrain",
        "valeur_fonciere", "prix_m2", "distance_rivage", "pieces", "parcelles",
        "latitude", "longitude", "id_mutation",
    ]
    with open(chemin, "w", newline="", encoding="utf-8") as fichier:
        redacteur = csv.writer(fichier, delimiter=";")
        redacteur.writerow(colonnes)
        for mutation in mutations:
            redacteur.writerow([
                mutation["date_mutation"],
                "; ".join(sorted(mutation["adresses"])),
                "/".join(sorted(mutation["types"])),
                round(mutation["surface_bati"], 1),
                round(mutation["surface_terrain"], 1),
                round(mutation["valeur_fonciere"], 2),
                round(mutation["prix_m2"], 0),
                round(mutation["distance_rivage"], 0) if mutation.get("distance_rivage") is not None else "",
                mutation["pieces"],
                "; ".join(sorted(mutation["parcelles"])),
                mutation["latitude"] or "",
                mutation["longitude"] or "",
                mutation["id_mutation"],
            ])


def main() -> int:
    annee_courante = date.today().year
    analyseur = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    analyseur.add_argument("--code-commune", default="83115", help="code INSEE (défaut : 83115, Sainte-Maxime)")
    analyseur.add_argument("--departement", default="83")
    analyseur.add_argument("--annees", nargs="+", type=int,
                           default=list(range(annee_courante - 5, annee_courante + 1)))
    analyseur.add_argument("--distance-max", type=float, default=250.0,
                           help="distance maximale au rivage, en mètres (défaut : 250)")
    analyseur.add_argument("--surface-min", type=float, default=40.0)
    analyseur.add_argument("--valeur-min", type=float, default=500_000.0)
    analyseur.add_argument("--maisons-seules", action="store_true",
                           help="ne retenir que les mutations comportant une maison")
    analyseur.add_argument("--commune-entiere", action="store_true",
                           help="ignorer le filtre littoral et sortir le haut de marché communal")
    analyseur.add_argument("--top", type=int, default=30)
    analyseur.add_argument("--csv", default="comparables_dvf.csv")
    arguments = analyseur.parse_args()

    mutations = collecter(arguments.annees, arguments.departement, arguments.code_commune)
    if not mutations:
        print(
            "\nAucune donnée récupérée. Vérifiez l'accès réseau à files.data.gouv.fr "
            "(ce script ne fonctionne pas derrière un proxy filtrant).",
            file=sys.stderr,
        )
        return 1

    retenues = filtrer(mutations, arguments.surface_min, arguments.valeur_min, arguments.maisons_seules)
    print(f"\n{len(retenues)} mutations retenues sur {len(mutations)} lues.", file=sys.stderr)

    littoral = [
        mutation for mutation in retenues
        if mutation.get("distance_rivage") is not None
        and mutation["distance_rivage"] <= arguments.distance_max
    ]

    sortie = []
    if not arguments.commune_entiere:
        littoral.sort(key=lambda mutation: mutation["prix_m2"], reverse=True)
        sortie.append(formater_tableau(
            littoral[: arguments.top],
            f"Bande littorale Nartelle – Sardinaux (≤ {arguments.distance_max:.0f} m du rivage) "
            f"— {len(littoral)} mutations",
        ))

    haut_de_marche = sorted(retenues, key=lambda mutation: mutation["prix_m2"], reverse=True)
    sortie.append(formater_tableau(
        haut_de_marche[: arguments.top],
        f"Haut de marché communal, toutes zones — top {arguments.top} en €/m²",
    ))

    if littoral:
        prix = sorted(mutation["prix_m2"] for mutation in littoral)
        milieu = len(prix) // 2
        mediane = prix[milieu] if len(prix) % 2 else (prix[milieu - 1] + prix[milieu]) / 2
        sortie.append(
            "\n### Synthèse bande littorale\n\n"
            f"- Mutations : **{len(prix)}**\n"
            f"- Médiane : **{_nombre(mediane)} €/m²**\n"
            f"- Maximum : **{_nombre(prix[-1])} €/m²**\n"
            f"- Minimum : **{_nombre(prix[0])} €/m²**\n"
            f"- Au-delà de 18 000 €/m² : **{sum(1 for p in prix if p >= 18000)}** mutation(s)\n"
        )

    rapport = "\n".join(sortie)
    print(rapport)

    a_exporter = haut_de_marche if arguments.commune_entiere else (littoral or haut_de_marche)
    ecrire_csv(a_exporter, arguments.csv)
    print(f"\nCSV écrit : {arguments.csv}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
