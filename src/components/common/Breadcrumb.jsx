import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center gap-1 text-sm">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={idx} className="flex items-center gap-1">
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
            {isLast
              ? <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">{item.label}</span>
              : <Link to={item.href} className="text-gray-500 dark:text-gray-400 hover:text-brand transition-colors">{item.label}</Link>
            }
          </span>
        );
      })}
    </nav>
  );
}
