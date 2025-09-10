import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ProductCard } from 'ui';
import type { Product } from 'shared';
import styles from './ProductsPage.module.css';

async function getProducts(): Promise<Product[]> {
  try {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map(doc => {
      const data = doc.data();
      // Note: Firestore Timestamps need to be converted for Next.js server components
      // For simplicity here, we'll assume they are serializable or handle it.
      // A robust solution would use a utility to convert Timestamps to strings or numbers.
      return {
        ...data,
        id: doc.id,
        // A real implementation would need to properly serialize this
        createdAt: data.createdAt?.toDate().toISOString() || null,
        updatedAt: data.updatedAt?.toDate().toISOString() || null,
      } as Product;
    });
    return productList;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>All Products</h1>
      {products.length > 0 ? (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
      ) : (
        <p>No products found. Try seeding the database!</p>
      )}
    </div>
  );
}
