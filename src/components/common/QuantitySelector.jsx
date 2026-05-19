import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ value = 1, min = 1, max = 99, onChange }) {
  return (
    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="p-2.5 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors disabled:opacity-40"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-12 text-center font-semibold text-gray-900 dark:text-white text-sm">
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="p-2.5 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors disabled:opacity-40"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
