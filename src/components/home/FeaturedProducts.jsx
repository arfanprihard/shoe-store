import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProductStore } from '../../store/productStore';
import ProductCard from '../product/ProductCard';

export default function FeaturedProducts() {
  const products = useProductStore(s => s.products);
  const featured = products
    .filter(p => p.isBestSeller || p.isNew)
    .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
    .slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="section-title">Produk Terlaris</h2>
          <p className="section-subtitle">Pilihan favorit pelanggan kami</p>
        </div>
        <Link to="/shop" className="hidden sm:flex items-center gap-2 text-brand font-semibold hover:gap-3 transition-all">
          Lihat Semua <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      <div className="mt-8 text-center sm:hidden">
        <Link to="/shop" className="btn-outline inline-flex items-center gap-2">
          Lihat Semua Produk <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
