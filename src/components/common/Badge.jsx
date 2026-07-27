import React from 'react';

const variants = {
  new: 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20 backdrop-blur-md',
  sale: 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold shadow-md shadow-red-500/25 tracking-wide',
  hot: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-md shadow-orange-500/25',
  limited: 'bg-gray-900/90 text-amber-300 font-bold border border-amber-500/40 backdrop-blur-md shadow-md',
  default: 'bg-black/60 text-white font-semibold backdrop-blur-md border border-white/20',
  brand: 'bg-brand text-white font-bold shadow-md shadow-brand/30',
  outline: 'border border-brand text-brand font-semibold',
};

export default function Badge({ variant = 'default', children, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
