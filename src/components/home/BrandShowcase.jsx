import React from 'react';
import { brands } from '../../data/products';

const brandLogos = {
  'Nike': '🏃‍♂️ Nike', 'Adidas': '⚡ Adidas', 'Puma': '🐆 Puma',
  'New Balance': '🏅 New Balance', 'Converse': '⭐ Converse',
  'Vans': '🛹 Vans', 'Reebok': '💪 Reebok', 'Skechers': '👟 Skechers',
};

export default function BrandShowcase() {
  const doubled = [...brands, ...brands];

  return (
    <section className="py-14 overflow-hidden border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h2 className="section-title">Brand Pilihan</h2>
        <p className="section-subtitle">Koleksi dari brand terkemuka dunia</p>
      </div>
      <div className="relative">
        <div className="flex gap-6 animate-[marquee_20s_linear_infinite]">
          {doubled.map((brand, i) => (
            <div
              key={i}
              className="flex-shrink-0 px-8 py-4 bg-white dark:bg-dark-card rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 font-bold text-gray-700 dark:text-gray-300 hover:border-brand hover:text-brand dark:hover:border-brand dark:hover:text-brand transition-colors cursor-pointer whitespace-nowrap"
            >
              {brandLogos[brand] || brand}
            </div>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </section>
  );
}
