import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useFilterStore } from '../../store/filterStore';

const sortOptions = [
  { value: 'popular', label: 'Terpopuler' },
  { value: 'newest', label: 'Terbaru' },
  { value: 'rating', label: 'Rating Tertinggi' },
  { value: 'price-asc', label: 'Harga Terendah' },
  { value: 'price-desc', label: 'Harga Tertinggi' },
];

export default function SortDropdown() {
  const { sortBy, setSortBy } = useFilterStore();
  const [open, setOpen] = useState(false);
  const current = sortOptions.find(o => o.value === sortBy);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-brand transition-colors"
      >
        {current?.label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-card rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-20 animate-slide-down">
          {sortOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => { setSortBy(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                sortBy === opt.value
                  ? 'text-brand bg-brand/5 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
