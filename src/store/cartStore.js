import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size, color, qty = 1, maxStock = null) => {
        const { items } = get();
        const key = `${product.id}-${size}-${color}`;
        const existing = items.find(i => i.key === key);

        // Determine maximum stock allowed for this variant
        const variantStock = maxStock !== null && maxStock !== undefined
          ? maxStock
          : (existing?.variantStock !== undefined ? existing.variantStock : (product.stock || 99));

        if (existing) {
          const newQty = Math.min(variantStock, existing.qty + qty);
          set({ items: items.map(i => i.key === key ? { ...i, qty: newQty, variantStock } : i) });
        } else {
          const newQty = Math.min(variantStock, qty);
          set({ items: [...items, { ...product, size, color, qty: newQty, key, variantStock }] });
        }
      },

      removeItem: (key) => set(s => ({ items: s.items.filter(i => i.key !== key) })),

      updateQty: (key, qty) => {
        if (qty < 1) return;
        set(s => ({
          items: s.items.map(i => {
            if (i.key === key) {
              const max = i.variantStock !== undefined ? i.variantStock : (i.stock || 99);
              return { ...i, qty: Math.min(max, qty) };
            }
            return i;
          })
        }));
      },

      clearCart: () => set({ items: [] }),

      get totalItems() { return get().items.reduce((s, i) => s + i.qty, 0); },
      get totalPrice() { return get().items.reduce((s, i) => s + i.price * i.qty, 0); },
    }),
    { name: 'shoe-cart' }
  )
);
