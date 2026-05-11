export type CityTier = "premium" | "core" | "secondaire";

export interface GirondeCity {
  name: string;
  postal_codes: string[];
  tier: CityTier;
}

export const GIRONDE_DEPARTMENT_PREFIX = "33";

export const PRIORITY_CITIES: GirondeCity[] = [
  { name: "Bordeaux", postal_codes: ["33000", "33100", "33200", "33300", "33800"], tier: "premium" },
  { name: "Caudéran", postal_codes: ["33200"], tier: "premium" },
  { name: "Le Bouscat", postal_codes: ["33110"], tier: "premium" },
  { name: "Talence", postal_codes: ["33400"], tier: "core" },
  { name: "Pessac", postal_codes: ["33600"], tier: "core" },
  { name: "Mérignac", postal_codes: ["33700"], tier: "core" },
  { name: "Arcachon", postal_codes: ["33120"], tier: "premium" },
  { name: "La Teste-de-Buch", postal_codes: ["33260"], tier: "premium" },
  { name: "Pyla-sur-Mer", postal_codes: ["33115"], tier: "premium" },
  { name: "Lège-Cap-Ferret", postal_codes: ["33950"], tier: "premium" },
  { name: "Andernos-les-Bains", postal_codes: ["33510"], tier: "core" },
  { name: "Libourne", postal_codes: ["33500"], tier: "secondaire" },
  { name: "Saint-Émilion", postal_codes: ["33330"], tier: "premium" },
];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

function findCity(postalCode: string | null, city: string | null): GirondeCity | null {
  const cityNorm = city ? normalize(city) : null;
  for (const candidate of PRIORITY_CITIES) {
    if (postalCode && candidate.postal_codes.includes(postalCode)) return candidate;
    if (cityNorm && normalize(candidate.name) === cityNorm) return candidate;
  }
  return null;
}

export function isInPriorityZone(postalCode: string | null, city: string | null): boolean {
  return findCity(postalCode, city) !== null;
}

export function cityTier(postalCode: string | null, city: string | null): CityTier | null {
  return findCity(postalCode, city)?.tier ?? null;
}
