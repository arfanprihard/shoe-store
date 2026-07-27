import prisma from '../config/database.js';
import { success, error, paginate } from '../utils/apiResponse.js';

const productInclude = {
  brand: { select: { id: true, name: true, slug: true } },
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { sortOrder: 'asc' } },
  colors: true,
  sizes: { orderBy: { size: 'asc' } },
  tags: true,
  reviews: { include: { user: { select: { firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } },
};

// Helper: format product to match frontend shape
const formatProduct = (p) => {
  let variantMap = {};
  if (p.colors && p.sizes) {
    p.colors.forEach(c => {
      p.sizes.forEach(s => {
        const key = `${c.hexValue}_${s.size}`;
        variantMap[key] = s.stock !== undefined ? s.stock : 5;
      });
    });
  }

  let parsedVariants = null;
  if (p.variants) {
    try {
      parsedVariants = typeof p.variants === 'string' ? JSON.parse(p.variants) : p.variants;
    } catch (e) {}
  }

  const finalVariants = (parsedVariants && Object.keys(parsedVariants).length > 0) ? parsedVariants : variantMap;

  return {
    id: p.id, name: p.name, slug: p.slug, brand: p.brand?.name || '', category: p.category?.slug || '',
    price: p.price, originalPrice: p.originalPrice,
    image: p.images?.find(i => i.isPrimary)?.url || p.images?.[0]?.url || '',
    images: p.images?.map(i => i.url) || [],
    colors: p.colors?.map(c => c.hexValue) || [],
    sizes: p.sizes?.map(s => s.size) || [],
    variants: finalVariants,
    tags: p.tags?.map(t => t.tag) || [],
    rating: p.rating || 5.0, reviewCount: p.reviewCount || 0, stock: p.stock,
    isNew: p.isNew, isBestSeller: p.isBestSeller,
    description: p.description,
    reviews: p.reviews?.map(r => ({
      id: r.id, user: `${r.user.firstName} ${r.user.lastName.charAt(0)}.`,
      avatar: `${r.user.firstName.charAt(0)}${r.user.lastName.charAt(0)}`,
      rating: r.rating, comment: r.comment, date: r.createdAt.toISOString().split('T')[0], helpful: r.helpful,
    })),
  };
};

// GET /api/products — list with filters
export const getAll = async (req, res, next) => {
  try {
    const { category, brands, minPrice, maxPrice, sizes, search, sortBy, page, limit } = req.query;
    const where = { isActive: true };

    if (category && category !== 'all') where.category = { slug: category };
    if (brands) where.brand = { name: { in: brands.split(',') } };
    if (minPrice || maxPrice) where.price = { ...(minPrice && { gte: +minPrice }), ...(maxPrice && { lte: +maxPrice }) };
    if (sizes) where.sizes = { some: { size: { in: sizes.split(',').map(Number) } } };
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { brand: { name: { contains: search, mode: 'insensitive' } } },
      { description: { contains: search, mode: 'insensitive' } },
    ];

    const orderBy = {
      'price-asc': { price: 'asc' },
      'price-desc': { price: 'desc' },
      'rating': { rating: 'desc' },
      'newest': { createdAt: 'desc' },
    }[sortBy] || { reviewCount: 'desc' };

    const { skip, take, page: p, limit: l } = paginate(page, limit);
    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, include: productInclude, orderBy, skip, take }),
      prisma.product.count({ where }),
    ]);

    const formatted = products.map(formatProduct);
    return success(res, formatted, { page: p, limit: l, total, totalPages: Math.ceil(total / l) });
  } catch (e) { next(e); }
};

// GET /api/products/featured
export const getFeatured = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isBestSeller: true }, include: productInclude, take: 8, orderBy: { reviewCount: 'desc' },
    });
    return success(res, products.map(formatProduct));
  } catch (e) { next(e); }
};

// GET /api/products/new-arrivals
export const getNewArrivals = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isNew: true }, include: productInclude, take: 8, orderBy: { createdAt: 'desc' },
    });
    return success(res, products.map(formatProduct));
  } catch (e) { next(e); }
};

// GET /api/products/search?q=
export const search = async (req, res, next) => {
  try {
    const q = req.query.q;
    if (!q || q.length < 2) return success(res, []);
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { brand: { name: { contains: q, mode: 'insensitive' } } },
        ],
      },
      include: { brand: { select: { name: true } }, images: { where: { isPrimary: true }, take: 1 } },
      take: 5,
    });
    return success(res, products.map(p => ({
      id: p.id, name: p.name, brand: p.brand.name,
      image: p.images[0]?.url || '',
    })));
  } catch (e) { next(e); }
};

// GET /api/products/:id
export const getById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: +req.params.id },
      include: { ...productInclude, reviews: { include: { user: { select: { firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' }, take: 10 } },
    });
    if (!product) return error(res, 'Produk tidak ditemukan', 404, 'NOT_FOUND');
    return success(res, formatProduct(product));
  } catch (e) { next(e); }
};

// POST /api/products/:id/reviews
export const addReview = async (req, res, next) => {
  try {
    const productId = +req.params.id;
    const userId = req.user?.id || req.body.userId || 1;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return error(res, 'Rating harus antara 1 sampai 5 bintang', 400);
    }

    const review = await prisma.review.upsert({
      where: { productId_userId: { productId, userId } },
      create: { productId, userId, rating: +rating, comment: comment || '' },
      update: { rating: +rating, comment: comment || '' },
      include: { user: { select: { firstName: true, lastName: true } } },
    });

    // Recalculate product overall rating and reviewCount
    const allReviews = await prisma.review.findMany({ where: { productId } });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length,
      },
    });

    return success(res, {
      id: review.id,
      user: `${review.user?.firstName || 'Pelanggan'} ${review.user?.lastName ? review.user.lastName.charAt(0) + '.' : ''}`,
      avatar: `${(review.user?.firstName || 'P').charAt(0)}${(review.user?.lastName || 'U').charAt(0)}`,
      rating: review.rating,
      comment: review.comment,
      date: review.createdAt.toISOString().split('T')[0],
      helpful: review.helpful || 0,
    }, 'Ulasan berhasil disimpan');
  } catch (e) { next(e); }
};
