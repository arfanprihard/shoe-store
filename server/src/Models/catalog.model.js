import prisma from '../config/database.js';

// ─── Formatter ───────────────────────────────────────────────────
const formatCategory = (c) => ({
  id: c.slug,
  name: c.name,
  icon: c.icon,
  productCount: c._count.products,
});

const formatBrand = (b) => ({
  id: b.id,
  name: b.name,
  slug: b.slug,
  logo: b.logo,
  productCount: b._count.products,
});

// ─── Queries ─────────────────────────────────────────────────────

/**
 * Get all categories with their product count.
 */
const findAllCategories = async () => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
  return categories.map(formatCategory);
};

/**
 * Get all brands with their product count.
 */
const findAllBrands = async () => {
  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
  return brands.map(formatBrand);
};

export default {
  formatCategory,
  formatBrand,
  findAllCategories,
  findAllBrands,
};
