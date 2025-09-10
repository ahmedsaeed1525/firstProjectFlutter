// Represents the physical dimensions of a product.
export interface Dimension {
  width: number;
  height: number;
  depth: number;
  unit: 'cm' | 'in';
}

// Represents the weight of a product.
export interface Weight {
  value: number;
  unit: 'kg' | 'g' | 'lb';
}

// Represents a specific variant of a product, e.g., based on color or size.
export interface ProductVariant {
  sku: string; // Variant-specific SKU
  attributes: ProductAttribute;
  price_override?: number;
  image_url?: string;
  inventory: number;
}

// Represents the selectable attributes for a product.
export interface ProductAttribute {
  color?: string;
  size?: string;
  material?: string;
}

/**
 * Represents a product in the Firestore database.
 * The document ID for a product is its unique SKU.
 */
export interface Product {
  sku: string; // Master SKU for the product
  title: string;
  slug: string;
  description: string;
  price: number;
  currency: 'USD' | 'EUR' | 'AED';
  categories: string[];

  images: string[]; // URLs for standard 2D images
  glb_urls: {
    lod0: string; // High detail
    lod1: string; // Medium detail
    lod2: string; // Low detail
  };
  usdz_url: string; // For iOS AR Quick Look

  inventory: number; // Total inventory for the master product

  weight: Weight;
  dimensions: Dimension;

  attributes: ProductAttribute; // Default or common attributes
  variants: ProductVariant[];

  rating: number; // Average rating (e.g., 0 to 5)
  reviewsCount: number;

  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}
