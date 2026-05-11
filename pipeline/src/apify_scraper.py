"""Apify scraping for Leboncoin / SeLoger / Bien'ici.

Community actor IDs change frequently. If a run returns nothing, browse
https://apify.com/store, search the portal name, and update ACTORS below.
"""
from __future__ import annotations

import logging
import os
from typing import Iterable

from apify_client import ApifyClient

log = logging.getLogger(__name__)

ACTORS: dict[str, dict] = {
    "leboncoin": {
        "actor_id": "natanielsantos/leboncoin-scraper",
        "build_input": lambda cfg: {
            "startUrls": [
                {
                    "url": (
                        "https://www.leboncoin.fr/recherche?"
                        f"category=9&locations=d_{cfg['department']}"
                        f"&price={cfg['min_price']}-{cfg['max_price']}"
                        "&real_estate_type=1,2"
                    )
                }
            ],
            "maxItems": cfg["max_items"],
        },
    },
    "seloger": {
        "actor_id": "epctex/seloger-scraper",
        "build_input": lambda cfg: {
            "startUrls": [
                {
                    "url": (
                        "https://www.seloger.com/list.htm?"
                        "projects=2,5&types=1,2"
                        f"&places=[{{cp:{cfg['department']}}}]"
                        f"&price={cfg['min_price']}/{cfg['max_price']}"
                    )
                }
            ],
            "maxItems": cfg["max_items"],
        },
    },
    "bienici": {
        "actor_id": "jupri/bienici-scraper",
        "build_input": lambda cfg: {
            "filter": {
                "department": cfg["department"],
                "priceMin": cfg["min_price"],
                "priceMax": cfg["max_price"],
                "transactionType": "buy",
            },
            "maxItems": cfg["max_items"],
        },
    },
}


def _normalize(raw: dict, source: str) -> dict:
    """Map disparate actor outputs to a common schema."""
    return {
        "source": source,
        "id": str(raw.get("id") or raw.get("listingId") or raw.get("url") or ""),
        "url": raw.get("url") or raw.get("link") or "",
        "title": raw.get("title") or raw.get("subject") or "",
        "price": _to_int(raw.get("price") or raw.get("priceValue")),
        "surface": _to_int(raw.get("surface") or raw.get("livingArea")),
        "rooms": _to_int(raw.get("rooms") or raw.get("roomsQuantity")),
        "bedrooms": _to_int(raw.get("bedrooms") or raw.get("bedroomsQuantity")),
        "city": raw.get("city") or raw.get("location", {}).get("city") if isinstance(raw.get("location"), dict) else raw.get("city"),
        "postal_code": str(raw.get("zipCode") or raw.get("postalCode") or ""),
        "description": (raw.get("description") or raw.get("body") or "")[:4000],
        "images": raw.get("images") or raw.get("photos") or [],
        "agent": raw.get("agent") or raw.get("contactName") or "",
        "raw": raw,
    }


def _to_int(value) -> int | None:
    if value in (None, ""):
        return None
    try:
        if isinstance(value, str):
            value = "".join(c for c in value if c.isdigit())
        return int(value) if value else None
    except (TypeError, ValueError):
        return None


def _dedupe(listings: Iterable[dict]) -> list[dict]:
    """Deduplicate on (price, surface, postal_code) — same flat across portals."""
    seen: dict[tuple, dict] = {}
    for item in listings:
        key = (item.get("price"), item.get("surface"), item.get("postal_code"))
        if not all(key):
            key = (item["source"], item["id"])
        existing = seen.get(key)
        if existing is None or (item.get("description") and len(item["description"]) > len(existing.get("description") or "")):
            seen[key] = item
    return list(seen.values())


def scrape_all(max_items: int = 100) -> list[dict]:
    token = os.environ["APIFY_API_TOKEN"]
    cfg = {
        "department": os.environ.get("DEPARTMENT_CODE", "33"),
        "min_price": int(os.environ.get("MIN_PRICE", "800000")),
        "max_price": int(os.environ.get("MAX_PRICE", "10000000")),
        "max_items": max_items,
    }

    client = ApifyClient(token)
    results: list[dict] = []

    for source, actor in ACTORS.items():
        log.info("Running actor %s for %s", actor["actor_id"], source)
        try:
            run = client.actor(actor["actor_id"]).call(run_input=actor["build_input"](cfg))
            items = client.dataset(run["defaultDatasetId"]).iterate_items()
            count = 0
            for raw in items:
                if not _matches_department(raw, cfg["department"]):
                    continue
                results.append(_normalize(raw, source))
                count += 1
            log.info("  -> %d listings from %s", count, source)
        except Exception as exc:
            log.warning("Actor %s failed: %s", source, exc)

    deduped = _dedupe(results)
    log.info("Total %d listings (%d after dedupe)", len(results), len(deduped))
    return deduped


def _matches_department(raw: dict, dept: str) -> bool:
    cp = str(raw.get("zipCode") or raw.get("postalCode") or "")
    return cp.startswith(dept) if cp else True
