'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '../../../stores/cartStore';
import styles from './SuccessPage.module.css';

export default function OrderSuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  // Clear the cart when the user lands on the success page.
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <span>✔️</span>
        </div>
        <h1>Thank You For Your Order!</h1>
        <p>Your payment was successful and your order is being processed.</p>
        <p>You will receive a confirmation email shortly.</p>
        <Link href="/products" className={styles.continueShopping}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
