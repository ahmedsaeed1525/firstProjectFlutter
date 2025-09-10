export interface Product {
  sku: string;
  title: string;
  slug: string;
  price: number;
  currency: 'USD' | 'EUR' | 'AED';
  categories: string[];
  description: string;
  images: string[];
  glb_urls: {
    lod0: string;
    lod1: string;
    lod2: string;
  };
  usdz_url: string;
  inventory: number;
  // and so on...
}
