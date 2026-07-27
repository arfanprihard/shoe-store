import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFilterStore } from '../../store/filterStore';
import { products } from '../../data/products';

export default function SearchBar({ className = '' }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();
  const setSearch = useFilterStore(s => s.setSearch);

  useEffect(() => {
    if (query.length > 1) {
      const q = query.toLowerCase();
      setSuggestions(products.filter(p =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      ).slice(0, 5));
      setOpen(true);
    } else {
      setSuggestions([]);
      setOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (q = query) => {
    if (!q.trim()) return;
    setSearch(q);
    navigate('/shop');
    setOpen(false);
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSearch(); };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-dark-card rounded-xl px-3 py-2">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Cari sepatu..."
          className="bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 w-full"
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false); setSearch(''); }}>
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-slide-down">
          {suggestions.map(p => (
            <button
              key={p.id}
              onClick={() => { navigate(`/product/${p.slug || p.id}`); setOpen(false); setQuery(''); }}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors text-left"
            >
              <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</p>
                <p className="text-xs text-gray-400">{p.brand}</p>
              </div>
            </button>
          ))}
          <button
            onClick={() => handleSearch()}
            className="w-full px-4 py-3 text-sm text-brand font-medium hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors border-t border-gray-100 dark:border-gray-800"
          >
            Lihat semua hasil untuk "{query}"
          </button>
        </div>
      )}
    </div>
  );
}
