import React from 'react';

export default function SizeSelector({ sizes = [], selected, onChange, outOfStock = [] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map(size => {
        const isOOS = outOfStock.includes(size);
        const isSelected = selected === size;

        return (
          <button
            key={size}
            type="button"
            disabled={isOOS}
            onClick={() => !isOOS && onChange(size)}
            title={isOOS ? `Ukuran ${size} (Tidak Tersedia)` : `Ukuran ${size}`}
            className={`w-12 h-12 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
              isSelected
                ? 'border-brand bg-brand text-white scale-105 shadow-md'
                : isOOS
                  ? 'border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-600 line-through cursor-not-allowed bg-gray-100/50 dark:bg-dark-card/50 opacity-40'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand hover:text-brand cursor-pointer'
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
