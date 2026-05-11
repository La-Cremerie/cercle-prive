"""Claude-powered scoring + strategic brief for each listing."""
from __future__ import annotations

import json
import logging
import os
import re

from anthropic import Anthropic
from tenacity import retry, stop_after_attempt, wait_exponential

log = logging.getLogger(__name__)

SYSTEM = """Tu es analyste immobilier haut de gamme pour le Cercle Privé (Gironde).
Tu évalues des biens premium (>800k€) selon leur potentiel commercial.

Pour chaque bien, retourne UN SEUL objet JSON valide avec cette structure exacte :
{
  "score": <int 0-100>,
  "priority": "<haute|moyenne|basse>",
  "fiche": {
    "atouts": ["...", "...", "..."],
    "faiblesses": ["...", "..."],
    "cible_acheteur": "...",
    "prix_marche": "<sous-evalue|conforme|sur-evalue>"
  },
  "messages": {
    "approche_vendeur": "...",
    "presentation_acheteur": "...",
    "relance": "..."
  }
}

Critères de scoring :
- Localisation premium Gironde (Bordeaux centre, Cap-Ferret, Saint-Émilion, Pyla) : +30
- Prestations (piscine, vue, surface >200m², parc) : +25
- Rapport prix/m² favorable vs marché local : +20
- Photos et description détaillée : +15
- Urgence (vente rapide, baisse de prix) : +10

Score >=75 = priorité haute, 50-74 = moyenne, <50 = basse.
Réponds UNIQUEMENT avec le JSON, sans markdown ni commentaire."""


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=2, min=2, max=20))
def _call_claude(client: Anthropic, model: str, listing: dict) -> dict:
    payload = {
        k: listing.get(k)
        for k in ("title", "price", "surface", "rooms", "bedrooms", "city", "postal_code", "description")
    }
    msg = client.messages.create(
        model=model,
        max_tokens=1500,
        system=SYSTEM,
        messages=[{"role": "user", "content": json.dumps(payload, ensure_ascii=False)}],
    )
    text = msg.content[0].text.strip()
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError(f"No JSON found in response: {text[:200]}")
    return json.loads(match.group(0))


def analyze(listings: list[dict]) -> list[dict]:
    client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    model = os.environ.get("CLAUDE_MODEL", "claude-opus-4-7")

    enriched: list[dict] = []
    for i, listing in enumerate(listings, 1):
        log.info("Analyzing %d/%d: %s", i, len(listings), listing.get("title", "")[:60])
        try:
            analysis = _call_claude(client, model, listing)
            enriched.append({**listing, "analysis": analysis})
        except Exception as exc:
            log.warning("  Claude failed on listing %s: %s", listing.get("id"), exc)
            enriched.append({**listing, "analysis": None})

    return enriched
