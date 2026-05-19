import React, { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useFilterStore } from '../../store/filterStore';
import { brands, sizes } from '../../data/products';
import { formatCurrency } from '../../utils/helpers';

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 pb-5 mb-5">
      <button className="flex items-center justify-between w-full mb-4" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-gray-900 dark:text-white text-sm">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && children}
    </div>
  );
}

export default function FilterPanel({ onClose }) {
  const { brands: selBrands, sizes: selSizes, priceRange, toggleBrand, toggleSize, setPriceRange, reset } = useFilterStore();

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand" />
          <h2 className="font-bold text-gray-900 dark:text-white">Filter</h2>
        </div>
        <button onClick={reset} className="text-xs text-brand hover:underline flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <Section title="Brand">
        <div className="flex flex-col gap-2">
          {brands.map(b => (
            <label key={b} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selBrands.includes(b)}
                onChange={() => toggleBrand(b)}
                className="w-4 h-4 rounded accent-brand"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-brand transition-colors">{b}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Ukuran">
        <div className="flex flex-wrap gap-2">
          {sizes.map(sz => (
            <button
              key={sz}
              onClick={() => toggleSize(sz)}
              className={`w-10 h-10 rounded-lg text-sm font-medium border-2 transition-all ${
                selSizes.includes(sz)
                  ? 'border-brand bg-brand text-white'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand hover:text-brand'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Harga">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </div>
          <input
            type="range" min={0} max={5000000} step={50000}
            value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-brand"
          />
        </div>
      </Section>

      {onClose && (
        <button onClick={onClose} className="w-full btn-primary mt-2">
          Terapkan Filter
        </button>
      )}
    </div>
  );
}
