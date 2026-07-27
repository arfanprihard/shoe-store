import { create } from 'zustand';
import api from '../utils/api';
import { products as initialProducts, getVariantStock as getStockHelper } from '../data/products';

export const useProductStore = create((set, get) => ({
  products: initialProducts,
  loading: false,

  fetchProductsFromDB: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/products', { params: { limit: 100 } });
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        set({ products: res.data.data, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (err) {
      console.warn('Could not fetch DB products:', err);
      set({ loading: false });
    }
  },

  addProduct: (newProd) => {
    if (!newProd || !newProd.id) return;
    set(state => {
      const idx = state.products.findIndex(p => p.id === Number(newProd.id));
      if (idx >= 0) {
        const updated = [...state.products];
        updated[idx] = { ...updated[idx], ...newProd };
        return { products: updated };
      }
      return { products: [newProd, ...state.products] };
    });
    // Trigger background sync from database
    setTimeout(() => {
      get().fetchProductsFromDB();
    }, 500);
  },

  decrementStock: (productId, colorHex, size, qty) => {
    set(state => {
      const updated = state.products.map(p => {
        if (p.id === Number(productId)) {
          const newStock = Math.max(0, (p.stock || 0) - Number(qty));
          const newVariants = { ...(p.variants || {}) };
          const key = `${colorHex}_${size}`;
          const currentVariantStock = getStockHelper(p, colorHex, size);
          newVariants[key] = Math.max(0, currentVariantStock - Number(qty));
          return { ...p, stock: newStock, variants: newVariants };
        }
        return p;
      });
      return { products: updated };
    });
  }
}));

// Auto fetch products from database on app startup
useProductStore.getState().fetchProductsFromDB();
