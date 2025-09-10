import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import type { Product } from 'shared';

// Load environment variables from .env file
dotenv.config();

// Initialize Firebase Admin SDK
// The SDK automatically finds the credentials from the GOOGLE_APPLICATION_CREDENTIALS env var.
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`
  });
  console.log('Firebase Admin SDK initialized successfully.');
} catch (error: any) {
  if (error.code === 'app/duplicate-app') {
    admin.app(); // Get the already initialized app
  } else {
    console.error('Firebase Admin SDK initialization error:', error);
    process.exit(1);
  }
}


const db = admin.firestore();

const products: Product[] = [
  {
    sku: 'SNKR-001',
    title: 'CosmoKnit Runner',
    slug: 'cosmoknit-runner',
    description: 'Lightweight and breathable, the CosmoKnit Runner is perfect for your daily run or a walk in the park. Made with sustainable materials.',
    price: 129.99,
    currency: 'USD',
    categories: ['footwear', 'running', 'sneakers'],
    images: ['/products/sneaker_v1_img1.jpg', '/products/sneaker_v1_img2.jpg'],
    glb_urls: {
      lod0: '/models/product_sneaker_v1_LOD0.glb',
      lod1: '/models/product_sneaker_v1_LOD1.glb',
      lod2: '/models/product_sneaker_v1_LOD2.glb',
    },
    usdz_url: '/models/sneaker_usdz_v1.usdz',
    inventory: 150,
    weight: { value: 0.8, unit: 'kg' },
    dimensions: { width: 30, height: 12, depth: 15, unit: 'cm' },
    attributes: { color: 'Nebula Blue', size: '10' },
    variants: [],
    rating: 4.8,
    reviewsCount: 215,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    sku: 'WTCH-001',
    title: 'Chrono-Titan Watch',
    slug: 'chrono-titan-watch',
    description: 'A masterpiece of engineering. The Chrono-Titan features a titanium case, sapphire crystal glass, and automatic movement.',
    price: 1850.00,
    currency: 'USD',
    categories: ['accessories', 'watches'],
    images: ['/products/watch_v1_img1.jpg'],
    glb_urls: {
      lod0: '/models/product_watch_v1_LOD0.glb',
      lod1: '/models/product_watch_v1_LOD1.glb',
      lod2: '/models/product_watch_v1_LOD2.glb',
    },
    usdz_url: '/models/watch_usdz_v1.usdz',
    inventory: 40,
    weight: { value: 0.5, unit: 'kg' },
    dimensions: { width: 10, height: 10, depth: 8, unit: 'cm' },
    attributes: { material: 'Titanium' },
    variants: [],
    rating: 4.9,
    reviewsCount: 88,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    sku: 'COFF-001',
    title: 'AeroPress Coffee Maker',
    slug: 'aeropress-coffee-maker',
    description: 'The classic AeroPress coffee maker, beloved by coffee enthusiasts worldwide. Brews smooth, rich coffee without the bitterness.',
    price: 39.95,
    currency: 'USD',
    categories: ['home', 'kitchen', 'coffee'],
    images: ['/products/coffee_v1_img1.jpg'],
    glb_urls: {
      lod0: '/models/product_coffee_v1_LOD0.glb',
      lod1: '/models/product_coffee_v1_LOD1.glb',
      lod2: '/models/product_coffee_v1_LOD2.glb',
    },
    usdz_url: '/models/coffee_usdz_v1.usdz',
    inventory: 300,
    weight: { value: 0.4, unit: 'kg' },
    dimensions: { width: 15, height: 30, depth: 15, unit: 'cm' },
    attributes: {},
    variants: [],
    rating: 4.7,
    reviewsCount: 1024,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

async function seedDatabase() {
  console.log('Starting to seed database...');
  const productsCollection = db.collection('products');

  for (const product of products) {
    console.log(`Adding product: ${product.title} (SKU: ${product.sku})`);
    // Use the SKU as the document ID
    await productsCollection.doc(product.sku).set(product);
  }

  console.log('Database seeding completed successfully!');
}

seedDatabase().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
