import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const ref = useRef();
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        ref={ref}
        className={`relative bg-white dark:bg-dark-100 rounded-2xl shadow-2xl w-full ${sizes[size]} animate-slide-up`}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-card transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
