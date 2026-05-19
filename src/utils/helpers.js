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
  result = result.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

  switch (filters.sortBy) {
    case 'price-asc':  return result.sort((a, b) => a.price - b.price);
    case 'price-desc': return result.sort((a, b) => b.price - a.price);
    case 'rating':     return result.sort((a, b) => b.rating - a.rating);
    case 'newest':     return result.filter(p => p.isNew).concat(result.filter(p => !p.isNew));
    default:           return result.sort((a, b) => b.reviewCount - a.reviewCount);
  }
};
