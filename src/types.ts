/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Core Types for Stationery Research Database

export interface Brand {
  id: string;
  name: string;
  englishName: string;
  country: string;
  foundedYear: string;
  founder: string;
  website: string;
  instagram: string;
  xiaohongshu: string;
  marketTier: 'Premium' | 'Mid-range' | 'Budget';
  style: 'Minimalist' | 'Vintage' | 'Cute/Illustrative' | 'Industrial' | 'Eco-Green' | 'Traditional';
  brandStory: string;
  representativeProducts: string[]; // text titles
  competitors: string[]; // brand IDs or text
  notes: string;
  imageUrl?: string;
  tags: string[];
  brandType?: 'established' | 'independent'; // Categorize into Famous/Established brand vs Independent Creator
}

export interface Product {
  id: string;
  brandId: string;
  name: string;
  releaseDate: string;
  category: 'Notebook' | 'Planner' | 'Envelope/Letter' | 'Writing Instrument' | 'Desk Organizer' | 'Accessory';
  dimensions: string; // e.g. "105 x 148 mm"
  sizeId?: string; // Links to Size db
  pageCount?: number;
  paperType: string; // text description
  materialIds: string[]; // links to Material db (e.g. Tomoe River)
  bindingMethod: string; // e.g. "Thread sewn"
  bindingId?: string; // links to Binding db
  craftIds: string[]; // links to Craft db
  price: string;
  imageUrl?: string;
  websiteUrl?: string;
  purchaseUrl?: string;
  tags: string[];
  notes: string;
  favorited?: boolean;
  designStyle?: string;
  productFunction?: string;
}

export interface Material {
  id: string;
  name: string;
  category: 'Paper' | 'Leather' | 'Book Cloth' | 'Plastic' | 'Metal' | 'Other';
  origin: string; // e.g. "Japan", "Italy"
  features: string; // Text bullet list of features
  suitableScenario: string;
  representativeBrands: string[]; // text or brand IDs
  imageUrl?: string;
  tags: string[];
  notes: string;
  referenceImages?: string[];
}

export interface Craft {
  id: string;
  name: string;
  definition: string;
  prosAndCons: string; // Text listing pros & cons
  costLevel: 'High' | 'Medium' | 'Low';
  typicalApplications: string;
  imageUrl?: string;
  notes: string;
}

export interface Binding {
  id: string;
  name: string;
  structure: string;
  prosAndCons: string;
  suitableScenario: string;
  imageUrl?: string;
  notes: string;
}

export interface Size {
  id: string;
  name: string; // e.g. "A5", "TN Standard"
  dimensions: string; // e.g. "148 x 210 mm"
  aspectRatio: string; // e.g. "1:1.414"
  suitableScenario: string;
  typicalProducts: string;
  imageUrl?: string;
}

export interface Trend {
  id: string;
  year: string;
  title: string;
  keywords: string[];
  description: string;
  caseBrands: string[]; // text or links to Brand IDs
  referenceLink?: string;
  notes: string;
}

export interface Inspiration {
  id: string;
  title: string;
  source: string; // e.g. "Exhibition", "Suntory Packaging", "Brutalist Architecture"
  category: 'Architecture' | 'Books' | 'Exhibition' | 'Art' | 'Packaging' | 'Industrial' | 'Fashion' | 'Other';
  keywords: string[];
  imageUrl?: string;
  designAnalysis: string;
  stationeryLessons: string; // Key takeaways for notebook design
  notes: string;
}

export interface Designer {
  id: string;
  name: string;
  country: string;
  profile: string;
  representativeWorks: string[];
  designStyle: string;
  cooperatedBrands: string[]; // brand names or brand IDs
  website?: string;
  imageUrl?: string;
  notes: string;
}

export interface ProductRecord {
  id: string;
  title: string;
  brandName?: string;
  imageUrl: string; // Base64 string of high-quality snaps
  notes: string;    // Product observation diary and design reflections
  date: string;
  tags: string[];
}

export type ViewTab =
  | 'dashboard'
  | 'brands'
  | 'products'
  | 'materials'
  | 'crafts'
  | 'bindings'
  | 'sizes'
  | 'trends'
  | 'inspirations'
  | 'designers'
  | 'comparison'
  | 'graph'
  | 'records'
  | 'material_crafts'
  | 'simulator';
