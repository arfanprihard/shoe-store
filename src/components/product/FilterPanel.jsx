import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, SlidersHorizontal, RotateCcw } from 'lucide-react';
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
  const [searchParams, setSearchParams] = useSearchParams();

  const selBrands = searchParams.get('brand') ? searchParams.get('brand').split(',').filter(Boolean) : [];
  const selSizes = searchParams.get('size') ? searchParams.get('size').split(',').map(Number).filter(Boolean) : [];
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 5000000;
  const priceRange = [minPrice, maxPrice];

  const updateParam = (key, val) => {
    const params = new URLSearchParams(searchParams);
    if (!val || (Array.isArray(val) && val.length === 0)) {
      params.delete(key);
    } else if (Array.isArray(val)) {
      params.set(key, val.join(','));
    } else {
      params.set(key, val.toString());
    }
    setSearchParams(params, { replace: true });
  };

  const toggleBrand = (b) => {
    const next = selBrands.includes(b) ? selBrands.filter(x => x !== b) : [...selBrands, b];
    updateParam('brand', next);
  };

  const toggleSize = (sz) => {
    const next = selSizes.includes(sz) ? selSizes.filter(x => x !== sz) : [...selSizes, sz];
    updateParam('size', next);
  };

  const setPrice = (val) => {
    const params = new URLSearchParams(searchParams);
    if (val >= 5000000) {
      params.delete('maxPrice');
    } else {
      params.set('maxPrice', val.toString());
    }
    setSearchParams(params, { replace: true });
  };

  const reset = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const isSale = searchParams.get('sale') === 'true' || searchParams.get('discount') === 'true';
  const isNew = searchParams.get('new') === 'true' || searchParams.get('isNew') === 'true';

  const toggleSale = () => {
    const params = new URLSearchParams(searchParams);
    if (isSale) {
      params.delete('sale');
      params.delete('discount');
    } else {
      params.set('sale', 'true');
    }
    setSearchParams(params, { replace: true });
  };

  const toggleNew = () => {
    const params = new URLSearchParams(searchParams);
    if (isNew) {
      params.delete('new');
      params.delete('isNew');
    } else {
      params.set('new', 'true');
    }
    setSearchParams(params, { replace: true });
  };

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

      <Section title="Penawaran Khusus">
        <div className="flex flex-col gap-2.5">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={isSale}
              onChange={toggleSale}
              className="w-4 h-4 rounded accent-red-500"
            />
            <span className="text-sm font-semibold text-red-600 dark:text-red-400 group-hover:text-red-500 transition-colors flex items-center gap-1.5">
              Flash Sale / Diskon
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={isNew}
              onChange={toggleNew}
              className="w-4 h-4 rounded accent-amber-500"
            />
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 group-hover:text-amber-500 transition-colors flex items-center gap-1.5">
              Produk Terbaru (New Arrival)
            </span>
          </label>
        </div>
      </Section>

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
              className={`w-10 h-10 rounded-lg text-sm font-medium border-2 transition-all ${selSizes.includes(sz)
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
            onChange={e => setPrice(Number(e.target.value))}
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
