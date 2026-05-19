import React from 'react';
import { formatCurrency, calcDiscount } from '../../utils/helpers';

export default function PriceTag({ price, originalPrice, size = 'md' }) {
  const discount = calcDiscount(price, originalPrice);
  const textSize = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`font-bold text-brand ${textSize[size]}`}>
        {formatCurrency(price)}
      </span>
      {originalPrice && (
        <>
          <span className="text-gray-400 dark:text-gray-500 line-through text-sm">
            {formatCurrency(originalPrice)}
          </span>
          <span className="badge bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            -{discount}%
          </span>
        </>
      )}
    </div>
  );
}
