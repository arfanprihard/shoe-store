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
            disabled={isOOS}
            onClick={() => onChange(size)}
            className={`w-12 h-12 rounded-xl text-sm font-semibold border-2 transition-all duration-200
              ${isSelected
                ? 'border-brand bg-brand text-white shadow-brand'
                : isOOS
                  ? 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 line-through cursor-not-allowed'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand hover:text-brand'
              }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
