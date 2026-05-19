import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-brand text-white hover:bg-brand-dark shadow-brand hover:shadow-glow',
  secondary: 'bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:border-brand hover:text-brand',
  outline: 'border-2 border-brand text-brand hover:bg-brand hover:text-white',
  ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  xl: 'px-8 py-4 text-lg rounded-2xl',
  icon: 'p-2.5 rounded-xl',
};

export default function Button({
  variant = 'primary', size = 'md', loading = false,
  disabled = false, icon: Icon, iconRight, children, className = '', ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon && <Icon className="w-4 h-4" />}
      {children}
      {iconRight && <iconRight className="w-4 h-4" />}
    </button>
  );
}
