import React from 'react';
import { Link } from 'react-router-dom';
import { brands } from '../../data/products';

const localBrandLogos = {
  'Nike': '/logos/nike-seeklogo.png',
  'Adidas': '/logos/adidas-seeklogo.png',
  'Puma': '/logos/puma-seeklogo.png',
  'New Balance': '/logos/new-balance-seeklogo.png',
  'Converse': '/logos/converse-2017-seeklogo.png',
  'Vans': '/logos/vans-seeklogo.png',
  'Reebok': '/logos/reebok-seeklogo.png',
  'Skechers': '/logos/skechers-seeklogo.png',
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
        <div className="flex gap-6 animate-[marquee_25s_linear_infinite]">
          {doubled.map((brand, i) => (
            <Link
              key={i}
              to={`/shop?brand=${encodeURIComponent(brand)}`}
              className="flex-shrink-0 px-8 sm:px-10 py-6 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-brand transition-all flex items-center justify-center cursor-pointer group min-w-[170px] sm:min-w-[210px] h-24 sm:h-28"
            >
              <img
                src={localBrandLogos[brand]}
                alt={`${brand} logo`}
                className="h-12 sm:h-16 max-w-[140px] sm:max-w-[170px] w-auto object-contain dark:brightness-0 dark:invert opacity-90 group-hover:opacity-100 transition-all group-hover:scale-110"
              />
            </Link>
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
