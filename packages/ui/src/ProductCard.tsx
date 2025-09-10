import React from 'react';
import type { Product } from 'shared/types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const primaryImage = product.images?.[0] || '/placeholder.png';

  return (
    <div className={styles.card}>
      <img src={primaryImage} alt={product.title} className={styles.image} />
      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.price}>
          {product.price} {product.currency}
        </p>
        <div className={styles.rating}>
          <span>{'⭐'.repeat(Math.round(product.rating))}</span>
          <span>{'☆'.repeat(5 - Math.round(product.rating))}</span>
          <span className={styles.reviewsCount}>({product.reviewsCount})</span>
        </div>
      </div>
    </div>
  );
};
