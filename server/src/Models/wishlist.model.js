import prisma from '../config/database.js';

// ─── Formatter ───────────────────────────────────────────────────
const formatWishlistItem = (w) => {
  const p = w.product;
  return {
    id: p.id,
    name: p.name,
    brand: p.brand.name,
    category: p.category.slug,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.images?.find((i) => i.isPrimary)?.url || p.images?.[0]?.url || '',
    images: p.images?.map((i) => i.url) || [],
    colors: p.colors?.map((c) => c.hexValue) || [],
    sizes: p.sizes?.map((s) => s.size) || [],
    rating: p.rating,
    reviewCount: p.reviewCount,
    stock: p.stock,
    isNew: p.isNew,
    isBestSeller: p.isBestSeller,
    description: p.description,
    tags: p.tags?.map((t) => t.tag) || [],
  };
};

// ─── Shared include ──────────────────────────────────────────────
const wishlistInclude = {
  product: {
    include: {
      brand: { select: { name: true } },
      category: { select: { slug: true } },
      images: { orderBy: { sortOrder: 'asc' } },
      colors: true,
      sizes: { orderBy: { size: 'asc' } },
      tags: true,
    },
  },
};

// ─── Queries ─────────────────────────────────────────────────────

/**
 * Get all wishlist items for a user (formatted).
 * @param {number} userId
 */
const getWishlistItems = async (userId) => {
  const items = await prisma.wishlist.findMany({ where: { userId }, include: wishlistInclude, orderBy: { createdAt: 'desc' } });
  return items.map(formatWishlistItem);
};

/**
 * Toggle a product in the user's wishlist.
 * Returns { action: 'added' | 'removed', productId }.
 * @param {number} userId
 * @param {number} productId
 */
const toggleWishlistItem = async (userId, productId) => {
  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
    return { action: 'removed', productId };
  }

  await prisma.wishlist.create({ data: { userId, productId } });
  return { action: 'added', productId };
};

export default {
  formatWishlistItem,
  getWishlistItems,
  toggleWishlistItem,
};
