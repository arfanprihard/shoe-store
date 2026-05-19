import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 left-6 z-40 p-3 rounded-2xl bg-brand text-white shadow-brand hover:shadow-glow hover:bg-brand-dark transition-all duration-200 animate-fade-in active:scale-90"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}
