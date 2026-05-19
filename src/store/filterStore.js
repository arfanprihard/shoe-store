import { create } from 'zustand';

export const useFilterStore = create((set) => ({
  category: 'all',
  brands: [],
  priceRange: [0, 5000000],
  sizes: [],
  sortBy: 'popular',
  searchQuery: '',

  setCategory: (v) => set({ category: v }),
  toggleBrand: (b) => set(s => ({
    brands: s.brands.includes(b) ? s.brands.filter(x => x !== b) : [...s.brands, b]
  })),
  setPriceRange: (v) => set({ priceRange: v }),
  toggleSize: (sz) => set(s => ({
    sizes: s.sizes.includes(sz) ? s.sizes.filter(x => x !== sz) : [...s.sizes, sz]
  })),
  setSortBy: (v) => set({ sortBy: v }),
  setSearch: (v) => set({ searchQuery: v }),
  reset: () => set({ category: 'all', brands: [], priceRange: [0, 5000000], sizes: [], sortBy: 'popular', searchQuery: '' }),
}));
