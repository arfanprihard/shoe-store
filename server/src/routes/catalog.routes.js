import { Router } from 'express';
import prisma from '../config/database.js';
import { success } from '../utils/apiResponse.js';

const catRouter = Router();
const brandRouter = Router();

// GET /api/categories
catRouter.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
    return success(res, categories.map(c => ({
      id: c.slug, name: c.name, icon: c.icon, productCount: c._count.products,
    })));
  } catch (e) { next(e); }
});

// GET /api/brands
brandRouter.get('/', async (req, res, next) => {
  try {
    const brands = await prisma.brand.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
    return success(res, brands.map(b => ({
      id: b.id, name: b.name, slug: b.slug, logo: b.logo, productCount: b._count.products,
    })));
  } catch (e) { next(e); }
});

export { catRouter, brandRouter };
