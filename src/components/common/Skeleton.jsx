import React from 'react';

export default function Skeleton({ className = '', variant = 'rect' }) {
  const base = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl';
  if (variant === 'circle') return <div className={`${base} rounded-full ${className}`} />;
  if (variant === 'text') return <div className={`${base} h-4 rounded-lg ${className}`} />;
  return <div className={`${base} ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="card p-0 overflow-hidden">
      <Skeleton className="h-64 w-full rounded-none rounded-t-2xl" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
        <div className="flex gap-2">
          <Skeleton variant="text" className="w-1/3" />
          <Skeleton variant="text" className="w-1/4" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
