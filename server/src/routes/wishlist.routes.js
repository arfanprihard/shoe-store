import { Router } from 'express';
import prisma from '../config/database.js';
import { success, error } from '../utils/apiResponse.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);

// GET /api/wishlist
router.get('/', async (req, res, next) => {
  try {
    const items = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: {
            brand: { select: { name: true } },
            category: { select: { slug: true } },
            images: { orderBy: { sortOrder: 'asc' } },
            colors: true, sizes: { orderBy: { size: 'asc' } }, tags: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    const formatted = items.map(w => {
      const p = w.product;
      return {
        id: p.id, name: p.name, brand: p.brand.name, category: p.category.slug,
        price: p.price, originalPrice: p.originalPrice,
        image: p.images.find(i => i.isPrimary)?.url || p.images[0]?.url || '',
        images: p.images.map(i => i.url),
        colors: p.colors.map(c => c.hexValue), sizes: p.sizes.map(s => s.size),
        rating: p.rating, reviewCount: p.reviewCount, stock: p.stock,
        isNew: p.isNew, isBestSeller: p.isBestSeller, description: p.description,
        tags: p.tags.map(t => t.tag),
      };
    });
    return success(res, formatted);
  } catch (e) { next(e); }
});

// POST /api/wishlist (toggle)
router.post('/', async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) return error(res, 'productId wajib', 400);
    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId: req.user.id, productId: +productId } },
    });
    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      return success(res, { action: 'removed', productId: +productId });
    }
    await prisma.wishlist.create({ data: { userId: req.user.id, productId: +productId } });
    return success(res, { action: 'added', productId: +productId }, null, 201);
  } catch (e) { next(e); }
});

export default router;
