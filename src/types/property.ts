export interface Property {
  id: string;
  name: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  surface: number;
  images: string[];
  description: string;
  features: string[];
  type: 'villa' | 'appartement' | 'penthouse';
  yield?: number; // Rendement annuel en euros
  isVisible?: boolean; // Visibilité du bien sur le site
}