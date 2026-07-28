import prisma from '../config/database.js';

// ─── Formatter ───────────────────────────────────────────────────
const formatCartItem = (i) => ({
  id: i.id,
  productId: i.product.id,
  name: i.product.name,
  brand: i.product.brand.name,
  price: i.product.price,
  image: i.product.images[0]?.url || '',
  stock: i.product.stock,
  size: i.size,
  color: i.color,
  qty: i.qty,
  key: `${i.productId}-${i.size}-${i.color}`,
});

// ─── Shared include ──────────────────────────────────────────────
const cartInclude = {
  product: {
    include: {
      brand: { select: { name: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
  },
};

// ─── Queries ─────────────────────────────────────────────────────

/**
 * Get all cart items for a user.
 * @param {number} userId
 */
const getCartItems = (userId) =>
  prisma.cartItem.findMany({ where: { userId }, include: cartInclude, orderBy: { createdAt: 'desc' } });

/**
 * Add or increment an item in the cart.
 * @param {number} userId
 * @param {{ productId: number, size: number, color: string, qty: number }} data
 */
const upsertCartItem = (userId, { productId, size, color, qty }) =>
  prisma.cartItem.upsert({
    where: { userId_productId_size_color: { userId, productId, size, color } },
    update: { qty: { increment: qty } },
    create: { userId, productId, size, color, qty },
  });

/**
 * Find a cart item that belongs to the given user.
 * @param {number} id
 * @param {number} userId
 */
const findCartItemByUser = (id, userId) =>
  prisma.cartItem.findFirst({ where: { id, userId } });

/**
 * Update the quantity of a cart item by its ID.
 * @param {number} id
 * @param {number} qty
 */
const updateCartItemQty = (id, qty) =>
  prisma.cartItem.update({ where: { id }, data: { qty } });

/**
 * Delete a single cart item owned by the given user.
 * @param {number} id
 * @param {number} userId
 */
const deleteCartItem = (id, userId) =>
  prisma.cartItem.deleteMany({ where: { id, userId } });

/**
 * Clear all cart items for a user.
 * @param {number} userId
 */
const clearCartItems = (userId) =>
  prisma.cartItem.deleteMany({ where: { userId } });

export default {
  formatCartItem,
  getCartItems,
  upsertCartItem,
  findCartItemByUser,
  updateCartItemQty,
  deleteCartItem,
  clearCartItems,
};
