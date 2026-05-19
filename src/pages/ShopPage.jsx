import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import FilterPanel from '../components/product/FilterPanel';
import SortDropdown from '../components/product/SortDropdown';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { useFilterStore } from '../store/filterStore';
import { products, categories } from '../data/products';
import { getFilteredProducts } from '../utils/helpers';

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { category, setCategory, searchQuery, reset } = useFilterStore();
  const filters = useFilterStore();

  // Sync category from URL param
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [filters.category, filters.brands, filters.sortBy, filters.priceRange, filters.sizes]);

  const filtered = useMemo(() => getFilteredProducts(products, filters), [filters]);
  const currentCat = categories.find(c => c.id === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
          {currentCat?.id !== 'all' ? `${currentCat?.icon} ${currentCat?.name}` : '🛍️ Semua Produk'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{filtered.length} produk ditemukan</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              category === cat.id
                ? 'bg-brand text-white shadow-brand'
                : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-brand hover:text-brand'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      <div className="flex gap-8">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <FilterPanel />
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:border-brand transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filter
            </button>
            <div className="flex items-center gap-3 ml-auto">
              {searchQuery && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand rounded-lg text-sm">
                  <Search className="w-3.5 h-3.5" /> "{searchQuery}"
                  <button onClick={() => useFilterStore.getState().setSearch('')}><X className="w-3.5 h-3.5" /></button>
                </span>
              )}
              <SortDropdown />
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">🔍</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Produk tidak ditemukan</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Coba ubah filter atau kata kunci pencarian</p>
              <button onClick={reset} className="btn-primary">Reset Filter</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-dark-100 p-4 overflow-y-auto animate-slide-in-left">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 dark:text-white">Filter</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-card">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterPanel onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
