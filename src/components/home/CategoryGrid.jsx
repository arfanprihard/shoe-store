import React from 'react';
import { Link } from 'react-router-dom';
import { useFilterStore } from '../../store/filterStore';
import { categories } from '../../data/products';

const catImages = {
  all: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
  sneakers: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&q=80',
  running: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80',
  formal: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&q=80',
  casual: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80',
  sandals: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80',
  boots: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400&q=80',
};

const gradients = [
  'from-orange-500 to-red-600', 'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600', 'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600', 'from-cyan-500 to-blue-600',
];

export default function CategoryGrid() {
  const setCategory = useFilterStore(s => s.setCategory);
  const display = categories.filter(c => c.id !== 'all');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="section-title">Kategori Pilihan</h2>
        <p className="section-subtitle">Temukan sepatu sesuai kebutuhanmu</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {display.map((cat, idx) => (
          <Link
            key={cat.id}
            to="/shop"
            onClick={() => setCategory(cat.id)}
            className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer"
          >
            <img
              src={catImages[cat.id]}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${gradients[idx % gradients.length]} opacity-60 group-hover:opacity-75 transition-opacity`} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="text-3xl mb-2">{cat.icon}</span>
              <span className="font-bold text-sm">{cat.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
