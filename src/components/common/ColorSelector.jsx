import React from 'react';
import { Check } from 'lucide-react';
import { formatColorName } from '../../utils/helpers';

export default function ColorSelector({ colors = [], selected, onChange }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {colors.map(color => {
        const isSelected = selected === color;
        const isLight = color === '#ffffff' || color === '#f5f5f5';

        return (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            title={`Warna ${formatColorName(color)}`}
            className={`w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center relative cursor-pointer ${
              isSelected
                ? 'ring-2 ring-offset-2 ring-brand dark:ring-offset-dark-200 scale-110 shadow-md'
                : 'hover:scale-105 opacity-80 hover:opacity-100'
            } ${isLight ? 'border border-gray-300' : ''}`}
            style={{ backgroundColor: color }}
          >
            {isSelected && (
              <Check className={`w-4 h-4 ${isLight ? 'text-gray-700' : 'text-white'}`} />
            )}
          </button>
        );
      })}
    </div>
  );
}
