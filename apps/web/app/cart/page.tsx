'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore, selectCartTotalPrice } from '../../stores/cartStore';
import styles from './CartPage.module.css';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe.js with the publishable key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const totalPrice = useCartStore(selectCartTotalPrice);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const functions = getFunctions();
      const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
      const response = await createCheckoutSession({ items });
      const { id: sessionId } = response.data as { id: string };

      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error("Stripe redirect error:", error);
          alert(`Error: ${error.message}`);
        }
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred during checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className={styles.emptyCartContainer}>
        <h1>Your Cart is Empty</h1>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link href="/products" className={styles.continueShopping}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1>Your Shopping Cart</h1>
      <div className={styles.cartLayout}>
        <div className={styles.itemsList}>
          {items.map((item) => (
            <div key={item.sku} className={styles.item}>
              <img src={item.image} alt={item.title} className={styles.itemImage} />
              <div className={styles.itemDetails}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <p className={styles.itemPrice}>{item.priceAtAdd.toFixed(2)}</p>
              </div>
              <div className={styles.itemActions}>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.sku, parseInt(e.target.value, 10))}
                  className={styles.quantityInput}
                />
                <button onClick={() => removeFromCart(item.sku)} className={styles.removeButton}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.summary}>
          <h2>Cart Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <button onClick={handleCheckout} disabled={isLoading} className={styles.checkoutButton}>
            {isLoading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}
