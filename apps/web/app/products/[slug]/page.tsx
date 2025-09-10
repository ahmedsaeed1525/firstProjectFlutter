'use client';

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Product3DViewer, ARButton, Button } from 'ui';
import type { Product } from 'shared';
import { notFound } from 'next/navigation';
import styles from './ProductPage.module.css';
import { useCartStore } from '../../../stores/cartStore';

// Client component for the interactive 3D display
function ProductDisplay({ product }: { product: Product }) {
  return (
    <div className={styles.displayContainer}>
      <div className={styles.viewerWrapper}>
        <Product3DViewer product={product} />
      </div>
      <div className={styles.arButtonWrapper}>
        <ARButton product={product} />
      </div>
    </div>
  );
}

// Client component for the product details and "Add to Cart" button
function ProductDetails({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart({
      sku: product.sku,
      title: product.title,
      priceAtAdd: product.price,
      image: product.images[0],
    });
    alert(`Added ${product.title} to the cart!`);
  };

  return (
    <div className={styles.details}>
      <h1 className={styles.title}>{product.title}</h1>
      <p className={styles.price}>{product.price} {product.currency}</p>
      <div className={styles.rating}>
        <span>{'⭐'.repeat(Math.round(product.rating))}</span>
        <span>{'☆'.repeat(5 - Math.round(product.rating))}</span>
        <span className={styles.reviewsCount}>({product.reviewsCount} reviews)</span>
      </div>
      <p className={styles.description}>{product.description}</p>
      <div className={styles.actions}>
        <Button onClick={handleAddToCart}>Add to Cart</Button>
      </div>
    </div>
  );
}


interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Data fetching remains on the server
async function getProductBySlug(slug: string): Promise<Product | null> {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, where('slug', '==', slug));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return {
      ...data,
      createdAt: data.createdAt?.toDate().toISOString() || null,
      updatedAt: data.updatedAt?.toDate().toISOString() || null,
    } as Product;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

// The page itself remains a server component, but passes data to client components
export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <div className={styles.gallery}>
        <ProductDisplay product={product} />
      </div>
      <ProductDetails product={product} />
    </div>
  );
}
