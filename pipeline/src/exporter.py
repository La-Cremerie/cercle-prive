"""CSV exporter: full dataset + priority-only file, sorted by score."""
from __future__ import annotations

import logging
import os
from datetime import datetime
from pathlib import Path

import pandas as pd

log = logging.getLogger(__name__)


def _flatten(listing: dict) -> dict:
    analysis = listing.get("analysis") or {}
    fiche = analysis.get("fiche") or {}
    messages = analysis.get("messages") or {}
    return {
        "score": analysis.get("score"),
        "priority": analysis.get("priority"),
        "source": listing.get("source"),
        "title": listing.get("title"),
        "price": listing.get("price"),
        "surface": listing.get("surface"),
        "price_per_m2": (
            round(listing["price"] / listing["surface"])
            if listing.get("price") and listing.get("surface")
            else None
        ),
        "rooms": listing.get("rooms"),
        "bedrooms": listing.get("bedrooms"),
        "city": listing.get("city"),
        "postal_code": listing.get("postal_code"),
        "url": listing.get("url"),
        "atouts": " | ".join(fiche.get("atouts", [])),
        "faiblesses": " | ".join(fiche.get("faiblesses", [])),
        "cible_acheteur": fiche.get("cible_acheteur"),
        "prix_marche": fiche.get("prix_marche"),
        "message_vendeur": messages.get("approche_vendeur"),
        "message_acheteur": messages.get("presentation_acheteur"),
        "message_relance": messages.get("relance"),
    }


def export(listings: list[dict]) -> tuple[Path, Path]:
    out_dir = Path(os.environ.get("OUTPUT_DIR", "./output"))
    out_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    rows = [_flatten(item) for item in listings]
    df = pd.DataFrame(rows).sort_values("score", ascending=False, na_position="last")

    full_path = out_dir / f"listings_{timestamp}.csv"
    priority_path = out_dir / f"priority_{timestamp}.csv"

    df.to_csv(full_path, index=False, encoding="utf-8-sig")
    df[df["priority"] == "haute"].to_csv(priority_path, index=False, encoding="utf-8-sig")

    log.info("Exported %d listings -> %s", len(df), full_path)
    log.info("Exported %d priority listings -> %s", (df["priority"] == "haute").sum(), priority_path)
    return full_path, priority_path
