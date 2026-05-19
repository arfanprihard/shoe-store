import React from 'react';
import { Check } from 'lucide-react';

export default function ColorSelector({ colors = [], selected, onChange }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {colors.map(color => {
        const isSelected = selected === color;
        const isLight = color === '#ffffff' || color === '#f5f5f5';
        return (
          <button
            key={color}
            onClick={() => onChange(color)}
            title={color}
            className={`w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center
              ${isSelected ? 'ring-2 ring-offset-2 ring-brand dark:ring-offset-dark-200 scale-110' : 'hover:scale-110'}
              ${isLight ? 'border border-gray-300' : ''}
            `}
            style={{ backgroundColor: color }}
          >
            {isSelected && <Check className={`w-4 h-4 ${isLight ? 'text-gray-700' : 'text-white'}`} />}
          </button>
        );
      })}
    </div>
  );
}
