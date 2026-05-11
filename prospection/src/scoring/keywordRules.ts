export interface CategoryWeights {
  travaux: number;
  presentation_faible: number;
  ameublement: number;
  premium: number;
  marchand: number;
  urgence: number;
}

// Plafond par catégorie (somme max = 100)
export const CATEGORY_MAX: CategoryWeights = {
  travaux: 25,
  presentation_faible: 15,
  ameublement: 15,
  premium: 20,
  marchand: 15,
  urgence: 10,
};

export const RENOVATION_KEYWORDS: string[] = [
  "à rénover",
  "travaux à prévoir",
  "rafraîchissement",
  "fort potentiel",
  "potentiel",
  "rénovation",
  "ancien",
  "maison de famille",
  "à moderniser",
  "redistribution",
  "plateau",
  "combles",
  "extension possible",
  "division possible",
  "dépendance",
  "garage transformable",
  "terrain divisible",
  "surélévation",
  "gros potentiel",
  "produit rare à repenser",
];

export const FURNISHING_KEYWORDS: string[] = [
  "vendu vide",
  "meublé possible",
  "résidence secondaire",
  "investissement locatif",
  "location saisonnière",
  "airbnb",
  "lmnp",
  "rendement",
  "colocation",
  "étudiant",
  "pied-à-terre",
];

export const PREMIUM_KEYWORDS: string[] = [
  "bordeaux",
  "caudéran",
  "le bouscat",
  "chartrons",
  "jardin public",
  "triangle d'or",
  "arcachon",
  "pyla",
  "cap ferret",
  "bassin d'arcachon",
  "vue",
  "terrasse",
  "jardin",
  "piscine",
  "garage",
  "parking",
  "dernier étage",
  "échoppe",
  "maison bourgeoise",
  "pierre",
  "immeuble ancien",
  "belle adresse",
  "emplacement recherché",
];

export const MARCHAND_KEYWORDS: string[] = [
  "division possible",
  "plusieurs lots",
  "immeuble",
  "local transformable",
  "plateau à aménager",
  "dépendance",
  "garage",
  "combles",
  "terrain",
  "à diviser",
];

export const URGENCY_KEYWORDS: string[] = [
  "baisse de prix",
  "prix en baisse",
  "remise en ligne",
  "vacant",
  "succession",
  "vente rapide",
  "négociable",
  "à saisir",
];

// Titres trop génériques = présentation pauvre
export const GENERIC_TITLE_PATTERNS: RegExp[] = [
  /^maison\s+\d+\s*pi[èe]ces?$/i,
  /^appartement\s+\d+\s*pi[èe]ces?$/i,
  /^t\d+\s+\d+\s*m2?$/i,
];

// Seuils ajustables
export const THRESHOLDS = {
  photos_low: 6,
  description_short: 250,
  large_surface_m2: 200,
  old_listing_days: 60,
  very_old_listing_days: 90,
};

// Points par occurrence de mot-clé dans chaque catégorie
export const POINTS_PER_KEYWORD = {
  renovation: 4,
  renovation_strong_bonus: 6,
  furnishing: 4,
  premium: 2,
  marchand: 3,
  urgency: 3,
};
