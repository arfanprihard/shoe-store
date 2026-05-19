import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedProducts from '../components/home/FeaturedProducts';
import PromoSection from '../components/home/PromoSection';
import BrandShowcase from '../components/home/BrandShowcase';
import Newsletter from '../components/home/Newsletter';
import ProductCard from '../components/product/ProductCard';
import { products } from '../data/products';
import { Shield, Truck, RotateCcw, Headphones } from 'lucide-react';

const features = [
  { icon: Truck, title: 'Gratis Ongkir', desc: 'Pembelian di atas Rp 300.000' },
  { icon: Shield, title: 'Produk Original', desc: '100% resmi dan bergaransi' },
  { icon: RotateCcw, title: 'Retur Mudah', desc: '30 hari retur gratis' },
  { icon: Headphones, title: 'CS 24/7', desc: 'Siap membantu kapan saja' },
];

export default function HomePage() {
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  return (
    <>
      <HeroBanner />

      {/* Features strip */}
      <div className="bg-white dark:bg-dark-100 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CategoryGrid />
      <FeaturedProducts />
      <PromoSection />

      {/* New arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <h2 className="section-title">Produk Terbaru</h2>
            <p className="section-subtitle">Koleksi terkini yang baru tiba</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <BrandShowcase />
      <Newsletter />
    </>
  );
}
