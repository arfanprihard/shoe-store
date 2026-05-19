import React from 'react';

const variants = {
  new: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  sale: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  hot: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  default: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  brand: 'bg-brand text-white',
  outline: 'border border-brand text-brand',
};

export default function Badge({ variant = 'default', children, className = '' }) {
  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
