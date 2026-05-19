import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size, color, qty = 1) => {
        const { items } = get();
        const key = `${product.id}-${size}-${color}`;
        const existing = items.find(i => i.key === key);
        if (existing) {
          set({ items: items.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i) });
        } else {
          set({ items: [...items, { ...product, size, color, qty, key }] });
        }
      },

      removeItem: (key) => set(s => ({ items: s.items.filter(i => i.key !== key) })),

      updateQty: (key, qty) => {
        if (qty < 1) return;
        set(s => ({ items: s.items.map(i => i.key === key ? { ...i, qty } : i) }));
      },

      clearCart: () => set({ items: [] }),

      get totalItems() { return get().items.reduce((s, i) => s + i.qty, 0); },
      get totalPrice() { return get().items.reduce((s, i) => s + i.price * i.qty, 0); },
    }),
    { name: 'shoe-cart' }
  )
);
