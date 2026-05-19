import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const { items } = get();
        const exists = items.find(i => i.id === product.id);
        set({ items: exists ? items.filter(i => i.id !== product.id) : [...items, product] });
      },
      isWishlisted: (id) => get().items.some(i => i.id === id),
    }),
    { name: 'shoe-wishlist' }
  )
);
