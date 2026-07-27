import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};
const styles = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
};

export default function Toast() {
  const { toast, showToast } = useUIStore();
  if (!toast) return null;
  const Icon = icons[toast.type] || Info;

  return (
    <div className="fixed top-20 right-6 max-sm:left-4 max-sm:right-4 z-[100] animate-slide-down">
      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-white shadow-2xl min-w-[280px] ${styles[toast.type]}`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium flex-1">{toast.message}</span>
        <button onClick={() => showToast(null)} className="hover:opacity-70 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
