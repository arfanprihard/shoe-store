import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const categoryData = [
  {
    id: 'sneakers',
    name: 'Sneakers',
    subtitle: 'Gaya Kasual & Trendi',
    image: '/images/categories/sneakers.jpg',
    tag: 'Populer 🔥',
  },
  {
    id: 'running',
    name: 'Running',
    subtitle: 'Performa & Ringan',
    image: '/images/categories/running.jpg',
    tag: 'Sport',
  },
  {
    id: 'formal',
    name: 'Formal',
    subtitle: 'Elegan & Profesional',
    image: '/images/categories/formal.jpg',
    tag: 'Executive',
  },
  {
    id: 'casual',
    name: 'Casual',
    subtitle: 'Kenyamanan Harian',
    image: '/images/categories/casual.jpg',
    tag: 'Santai',
  },
  {
    id: 'sandals',
    name: 'Sandals',
    subtitle: 'Ringan & Fleksibel',
    image: '/images/categories/sandals.jpg',
    tag: 'Summer',
  },
  {
    id: 'boots',
    name: 'Boots',
    subtitle: 'Tangguh & Maskulin',
    image: '/images/categories/boots.jpg',
    tag: 'Outdoor',
  },
];

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Eksplorasi Gaya
          </span>
          <h2 className="section-title text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            Kategori Pilihan
          </h2>
          <p className="section-subtitle mt-1 text-gray-500 dark:text-gray-400">
            Temukan koleksi sepatu terbaik yang dirancang sesuai aktivitasmu
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-primary-600 transition-colors group"
        >
          Lihat Semua Produk
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Grid Layout - 3 columns, 2 rows (Zero Empty Space) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryData.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.id}`}
            className="group relative overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 transition-all duration-500 cursor-pointer h-64 sm:h-72"
          >
            {/* Background Image */}
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

            {/* Top Tag Pill */}
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 text-xs font-semibold text-white/90 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                {cat.tag}
              </span>
            </div>

            {/* Top Right Action Arrow */}
            <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-80 group-hover:opacity-100 group-hover:bg-brand group-hover:border-brand transition-all duration-300 transform group-hover:rotate-45">
              <ArrowUpRight className="w-4 h-4" />
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10 transform transition-transform duration-300 group-hover:-translate-y-1">
              <h3 className="font-display text-2xl font-bold text-white mb-1 group-hover:text-brand-300 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 font-medium line-clamp-1">
                {cat.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
