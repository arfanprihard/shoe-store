import { Router } from 'express';
import prisma from '../config/database.js';
import { success, error } from '../utils/apiResponse.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { cartItemSchema, updateCartSchema } from '../validators/schemas.js';

const router = Router();
router.use(auth);

const cartInclude = {
  product: {
    include: {
      brand: { select: { name: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
  },
};

// GET /api/cart
router.get('/', async (req, res, next) => {
  try {
    const items = await prisma.cartItem.findMany({ where: { userId: req.user.id }, include: cartInclude, orderBy: { createdAt: 'desc' } });
    const formatted = items.map(i => ({
      id: i.id, productId: i.product.id, name: i.product.name, brand: i.product.brand.name,
      price: i.product.price, image: i.product.images[0]?.url || '', stock: i.product.stock,
      size: i.size, color: i.color, qty: i.qty, key: `${i.productId}-${i.size}-${i.color}`,
    }));
    return success(res, formatted);
  } catch (e) { next(e); }
});

// POST /api/cart/items
router.post('/items', validate(cartItemSchema), async (req, res, next) => {
  try {
    const { productId, size, color, qty } = req.validated;
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return error(res, 'Produk tidak ditemukan', 404);
    if (product.stock < qty) return error(res, 'Stok tidak cukup', 400);

    const item = await prisma.cartItem.upsert({
      where: { userId_productId_size_color: { userId: req.user.id, productId, size, color } },
      update: { qty: { increment: qty } },
      create: { userId: req.user.id, productId, size, color, qty },
    });
    return success(res, item, null, 201);
  } catch (e) { next(e); }
});

// PATCH /api/cart/items/:id
router.patch('/items/:id', validate(updateCartSchema), async (req, res, next) => {
  try {
    const item = await prisma.cartItem.findFirst({ where: { id: +req.params.id, userId: req.user.id } });
    if (!item) return error(res, 'Item tidak ditemukan', 404);

    const updated = await prisma.cartItem.update({ where: { id: item.id }, data: { qty: req.validated.qty } });
    return success(res, updated);
  } catch (e) { next(e); }
});

// DELETE /api/cart/items/:id
router.delete('/items/:id', async (req, res, next) => {
  try {
    await prisma.cartItem.deleteMany({ where: { id: +req.params.id, userId: req.user.id } });
    return success(res, { message: 'Item dihapus' });
  } catch (e) { next(e); }
});

// DELETE /api/cart
router.delete('/', async (req, res, next) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    return success(res, { message: 'Keranjang dikosongkan' });
  } catch (e) { next(e); }
});

export default router;
