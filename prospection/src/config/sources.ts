export interface ApifyRunConfig {
  department: string;
  min_price: number;
  max_price: number;
  max_items: number;
}

export interface SourceConfig {
  name: string;
  enabled: boolean;
  apify_actor_id?: string;
  build_input?: (cfg: ApifyRunConfig) => Record<string, unknown>;
  note?: string;
}

/**
 * Acteurs Apify communautaires : leurs IDs changent.
 * Si un actor ne renvoie rien, vérifier sur apify.com/store et mettre à jour ici.
 */
export const SOURCES: SourceConfig[] = [
  {
    name: "leboncoin",
    enabled: true,
    apify_actor_id: "natanielsantos/leboncoin-scraper",
    build_input: (cfg) => ({
      startUrls: [
        {
          url: `https://www.leboncoin.fr/recherche?category=9&locations=d_${cfg.department}&price=${cfg.min_price}-${cfg.max_price}&real_estate_type=1,2`,
        },
      ],
      maxItems: cfg.max_items,
    }),
    note: "Vérifier l'ID sur apify.com/store si 0 résultat.",
  },
  {
    name: "seloger",
    enabled: true,
    apify_actor_id: "epctex/seloger-scraper",
    build_input: (cfg) => ({
      startUrls: [
        {
          url: `https://www.seloger.com/list.htm?projects=2,5&types=1,2&places=[{cp:${cfg.department}}]&price=${cfg.min_price}/${cfg.max_price}`,
        },
      ],
      maxItems: cfg.max_items,
    }),
  },
  {
    name: "bienici",
    enabled: true,
    apify_actor_id: "jupri/bienici-scraper",
    build_input: (cfg) => ({
      filter: {
        department: cfg.department,
        priceMin: cfg.min_price,
        priceMax: cfg.max_price,
        transactionType: "buy",
      },
      maxItems: cfg.max_items,
    }),
  },
  {
    name: "logic-immo",
    enabled: false,
    note: "Pas d'actor Apify fiable identifié. Fallback : import CSV manuel.",
  },
  {
    name: "pap",
    enabled: false,
    note: "Pas d'actor Apify fiable identifié. Fallback : import CSV manuel.",
  },
  {
    name: "figaro-immo",
    enabled: false,
    note: "Pas d'actor Apify fiable identifié. Fallback : import CSV manuel.",
  },
];

export const DEFAULT_RUN_CONFIG: ApifyRunConfig = {
  department: "33",
  min_price: 200_000,
  max_price: 5_000_000,
  max_items: 100,
};
