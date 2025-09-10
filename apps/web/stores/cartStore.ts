import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from 'shared';

interface CartState {
  items: CartItem[];
  addToCart: (newItem: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (newItem) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(item => item.sku === newItem.sku);

        if (existingItemIndex > -1) {
          // Item exists, increment quantity
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += 1;
          set({ items: updatedItems });
        } else {
          // Item does not exist, add it
          set({ items: [...items, { ...newItem, quantity: 1 }] });
        }
      },

      removeFromCart: (sku) => {
        set({ items: get().items.filter(item => item.sku !== sku) });
      },

      updateQuantity: (sku, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(sku);
        } else {
          set({
            items: get().items.map(item =>
              item.sku === sku ? { ...item, quantity } : item
            ),
          });
        }
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: '3d-bazaar-cart-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

// Selectors for convenience
export const selectCartItems = (state: CartState) => state.items;
export const selectCartTotalItems = (state: CartState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotalPrice = (state: CartState) =>
  state.items.reduce((total, item) => total + item.priceAtAdd * item.quantity, 0);
