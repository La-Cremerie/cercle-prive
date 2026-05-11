"""Entry point: scrape -> analyze -> export."""
from __future__ import annotations

import argparse
import logging
import sys

from dotenv import load_dotenv

from src.apify_scraper import scrape_all
from src.claude_analyzer import analyze
from src.exporter import export


def main() -> int:
    parser = argparse.ArgumentParser(description="Cercle Privé real estate pipeline")
    parser.add_argument("--max", type=int, default=100, help="Max listings per source")
    parser.add_argument("--verbose", "-v", action="store_true")
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%H:%M:%S",
    )
    load_dotenv()

    listings = scrape_all(max_items=args.max)
    if not listings:
        logging.error("No listings scraped. Check actor IDs in src/apify_scraper.py")
        return 1

    enriched = analyze(listings)
    export(enriched)
    return 0


if __name__ == "__main__":
    sys.exit(main())
