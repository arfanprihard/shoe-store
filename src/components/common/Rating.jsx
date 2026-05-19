import React from 'react';
import { Star } from 'lucide-react';

export default function Rating({ value = 0, max = 5, readonly = true, size = 'sm', showValue = true, onChange }) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  const s = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-1">
      {stars.map(star => (
        <button
          key={star}
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <Star
            className={`${s} ${star <= value ? 'fill-amber-400 text-amber-400' : 'fill-none text-gray-300 dark:text-gray-600'}`}
          />
        </button>
      ))}
      {showValue && <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{value.toFixed(1)}</span>}
    </div>
  );
}
