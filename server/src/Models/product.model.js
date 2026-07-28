import prisma from '../config/database.js';

// ─── Shared include shape ────────────────────────────────────────
const productInclude = {
  brand: { select: { id: true, name: true, slug: true } },
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { sortOrder: 'asc' } },
  colors: true,
  sizes: { orderBy: { size: 'asc' } },
  tags: true,
  reviews: {
    include: { user: { select: { firstName: true, lastName: true } } },
    orderBy: { createdAt: 'desc' },
  },
};

// ─── Formatter ───────────────────────────────────────────────────
const formatProduct = (p) => {
  let variantMap = {};
  if (p.colors && p.sizes) {
    p.colors.forEach((c) => {
      p.sizes.forEach((s) => {
        variantMap[`${c.hexValue}_${s.size}`] = s.stock !== undefined ? s.stock : 5;
      });
    });
  }

  let parsedVariants = null;
  if (p.variants) {
    try {
      parsedVariants = typeof p.variants === 'string' ? JSON.parse(p.variants) : p.variants;
    } catch (_) {}
  }

  const finalVariants =
    parsedVariants && Object.keys(parsedVariants).length > 0 ? parsedVariants : variantMap;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand?.name || '',
    category: p.category?.slug || '',
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.images?.find((i) => i.isPrimary)?.url || p.images?.[0]?.url || '',
    images: p.images?.map((i) => i.url) || [],
    colors: p.colors?.map((c) => c.hexValue) || [],
    sizes: p.sizes?.map((s) => s.size) || [],
    variants: finalVariants,
    tags: p.tags?.map((t) => t.tag) || [],
    rating: p.rating || 5.0,
    reviewCount: p.reviewCount || 0,
    stock: p.stock,
    isNew: p.isNew,
    isBestSeller: p.isBestSeller,
    description: p.description,
    reviews: p.reviews?.map((r) => ({
      id: r.id,
      user: `${r.user.firstName} ${r.user.lastName.charAt(0)}.`,
      avatar: `${r.user.firstName.charAt(0)}${r.user.lastName.charAt(0)}`,
      rating: r.rating,
      comment: r.comment,
      date: r.createdAt.toISOString().split('T')[0],
      helpful: r.helpful,
    })),
  };
};

// ─── Queries ─────────────────────────────────────────────────────

/**
 * Fetch a paginated, filtered list of active products.
 * @param {object} filters – { category, brands, minPrice, maxPrice, sizes, search, sortBy }
 * @param {object} pagination – { skip, take }
 * @returns {{ products: Product[], total: number }}
 */
const findProducts = async (filters = {}, pagination = {}) => {
  const { category, brands, minPrice, maxPrice, sizes, search, sortBy } = filters;
  const { skip = 0, take = 20 } = pagination;

  const where = { isActive: true };
  if (category && category !== 'all') where.category = { slug: category };
  if (brands) where.brand = { name: { in: brands.split(',') } };
  if (minPrice || maxPrice)
    where.price = { ...(minPrice && { gte: +minPrice }), ...(maxPrice && { lte: +maxPrice }) };
  if (sizes)
    where.sizes = { some: { size: { in: sizes.split(',').map(Number) } } };
  if (search)
    where.OR = [
      { name: { contains: search } },
      { brand: { name: { contains: search } } },
      { description: { contains: search } },
    ];

  const orderBy =
    { 'price-asc': { price: 'asc' }, 'price-desc': { price: 'desc' }, rating: { rating: 'desc' }, newest: { createdAt: 'desc' } }[sortBy] ||
    { reviewCount: 'desc' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, include: productInclude, orderBy, skip, take }),
    prisma.product.count({ where }),
  ]);

  return { products, total };
};

/**
 * Fetch featured (best-seller) products.
 * @param {number} limit
 */
const findFeaturedProducts = (limit = 8) =>
  prisma.product.findMany({
    where: { isActive: true, isBestSeller: true },
    include: productInclude,
    take: limit,
    orderBy: { reviewCount: 'desc' },
  });

/**
 * Fetch new-arrival products.
 * @param {number} limit
 */
const findNewArrivals = (limit = 8) =>
  prisma.product.findMany({
    where: { isActive: true, isNew: true },
    include: productInclude,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

/**
 * Quick search suggestions (name / brand match).
 * @param {string} q – search query (min length: 2)
 * @param {number} limit
 */
const searchProductSuggestions = (q, limit = 5) =>
  prisma.product.findMany({
    where: {
      isActive: true,
      OR: [{ name: { contains: q } }, { brand: { name: { contains: q } } }],
    },
    include: {
      brand: { select: { name: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
    take: limit,
  });

/**
 * Find a single product by its numeric ID (with full include).
 * @param {number} id
 */
const findProductById = (id) =>
  prisma.product.findUnique({
    where: { id },
    include: {
      ...productInclude,
      reviews: {
        include: { user: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

/**
 * Upsert a product review and recalculate the product's aggregate rating.
 * @param {number} productId
 * @param {number} userId
 * @param {number} rating  1–5
 * @param {string} comment
 */
const upsertReview = async (productId, userId, rating, comment) => {
  const review = await prisma.review.upsert({
    where: { productId_userId: { productId, userId } },
    create: { productId, userId, rating, comment: comment || '' },
    update: { rating, comment: comment || '' },
    include: { user: { select: { firstName: true, lastName: true } } },
  });

  // Recalculate aggregate rating
  const allReviews = await prisma.review.findMany({ where: { productId } });
  const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
  await prisma.product.update({
    where: { id: productId },
    data: { rating: Math.round(avg * 10) / 10, reviewCount: allReviews.length },
  });

  return review;
};

export default {
  productInclude,
  formatProduct,
  findProducts,
  findFeaturedProducts,
  findNewArrivals,
  searchProductSuggestions,
  findProductById,
  upsertReview,
};
