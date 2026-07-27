export const formatCurrency = (amount) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

export const calcDiscount = (price, original) =>
  original ? Math.round(((original - price) / original) * 100) : 0;

export const getFilteredProducts = (products, filters) => {
  let result = [...products];

  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }
  if (filters.category !== 'all') result = result.filter(p => p.category === filters.category);
  if (filters.brands.length) result = result.filter(p => filters.brands.includes(p.brand));
  if (filters.sizes.length) result = result.filter(p => p.sizes.some(s => filters.sizes.includes(s)));
  if (filters.onSale) result = result.filter(p => p.originalPrice && p.originalPrice > p.price);
  if (filters.isNewOnly) result = result.filter(p => p.isNew);
  result = result.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

  switch (filters.sortBy) {
    case 'price-asc':  return result.sort((a, b) => a.price - b.price);
    case 'price-desc': return result.sort((a, b) => b.price - a.price);
    case 'rating':     return result.sort((a, b) => b.rating - a.rating);
    case 'newest':     return result.filter(p => p.isNew).concat(result.filter(p => !p.isNew));
    default:           return result.sort((a, b) => b.reviewCount - a.reviewCount);
  }
};

export const COLOR_MAP = {
  '#000000': 'Hitam',
  '#1a1a1a': 'Hitam',
  '#111827': 'Hitam Pekat',
  '#1e293b': 'Hitam Gelap',
  '#ffffff': 'Putih',
  '#f8fafc': 'Putih',
  '#f3f4f6': 'Putih Tulang',
  '#ef4444': 'Merah',
  '#b91c1c': 'Merah Marun',
  '#dc2626': 'Merah',
  '#3b82f6': 'Biru',
  '#1d4ed8': 'Biru Tua',
  '#1e40af': 'Navy',
  '#0284c7': 'Biru Muda',
  '#22c55e': 'Hijau',
  '#15803d': 'Hijau Tua',
  '#16a34a': 'Hijau',
  '#eab308': 'Kuning',
  '#ca8a04': 'Kuning Emas',
  '#f59e0b': 'Kuning / Oranye',
  '#f97316': 'Oranye',
  '#ea580c': 'Oranye',
  '#a855f7': 'Ungu',
  '#7e22ce': 'Ungu Tua',
  '#ec4899': 'Pink',
  '#be185d': 'Pink Tua',
  '#64748b': 'Abu-Abu',
  '#6b7280': 'Abu-Abu',
  '#9ca3af': 'Abu-Abu Muda',
  '#374151': 'Abu-Abu Gelap',
  '#78350f': 'Cokelat',
  '#854d0e': 'Cokelat',
  '#d97706': 'Cokelat Muda',
  'black': 'Hitam',
  'white': 'Putih',
  'red': 'Merah',
  'blue': 'Biru',
  'green': 'Hijau',
  'yellow': 'Kuning',
  'orange': 'Oranye',
  'purple': 'Ungu',
  'pink': 'Pink',
  'grey': 'Abu-Abu',
  'gray': 'Abu-Abu',
  'brown': 'Cokelat',
  'navy': 'Navy',
};

export const formatColorName = (color) => {
  if (!color) return '';
  const trimmed = color.trim().toLowerCase();
  if (COLOR_MAP[trimmed]) return COLOR_MAP[trimmed];

  if (trimmed.startsWith('#')) {
    const hex = trimmed.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      if (r < 60 && g < 60 && b < 60) return 'Hitam';
      if (r > 200 && g > 200 && b > 200) return 'Putih';
      if (r > 150 && g < 80 && b < 80) return 'Merah';
      if (b > 150 && r < 80 && g < 150) return 'Biru';
      if (g > 150 && r < 80 && b < 80) return 'Hijau';
    }
  }

  return color.charAt(0).toUpperCase() + color.slice(1);
};
