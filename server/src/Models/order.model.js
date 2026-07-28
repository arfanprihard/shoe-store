import prisma from '../config/database.js';

// ─── Constants ───────────────────────────────────────────────────
const COURIERS = {
  jne:       { price: 15000, eta: '2-3 hari' },
  jnt:       { price: 12000, eta: '2-3 hari' },
  sicepat:   { price: 10000, eta: '1-2 hari' },
  'same-day':{ price: 35000, eta: 'Hari ini' },
};

const STATUS_LABEL = {
  PENDING:    'Menunggu Pembayaran',
  PAID:       'Dibayar',
  PROCESSING: 'Diproses',
  SHIPPED:    'Dikirim',
  DELIVERED:  'Selesai',
  CANCELLED:  'Dibatalkan',
};

// ─── Formatter ───────────────────────────────────────────────────
const formatOrder = (o) => ({
  id: o.orderNumber,
  orderNumber: o.orderNumber,
  date: o.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
  status: STATUS_LABEL[o.status] || o.status,
  total: o.total,
  courier: o.courier ? o.courier.toUpperCase() : 'JNE REG',
  items: o.items.map((i) => ({
    id: i.productId,
    productId: i.productId,
    name: i.name,
    qty: i.qty,
    img: i.image,
    size: i.size,
    color: i.color,
  })),
});

// ─── Queries ─────────────────────────────────────────────────────

/**
 * Get all cart items for a user (used during checkout).
 * @param {number} userId
 */
const getCartItemsForCheckout = (userId) =>
  prisma.cartItem.findMany({
    where: { userId },
    include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
  });

/**
 * Validate and return a promo code object, or null if invalid.
 * @param {string} code
 * @param {number} subtotal
 */
const resolvePromo = async (code, subtotal) => {
  if (!code) return { discount: 0, promo: null };
  const promo = await prisma.promoCode.findUnique({ where: { code } });
  if (!promo || !promo.isActive) return { discount: 0, promo: null };
  const now = new Date();
  if (now < promo.startDate || now > promo.endDate) return { discount: 0, promo: null };
  if (promo.minPurchase && subtotal < promo.minPurchase) return { discount: 0, promo: null };

  const discount =
    promo.type === 'PERCENTAGE'
      ? Math.min(Math.round((subtotal * promo.value) / 100), promo.maxDiscount ?? Infinity)
      : promo.value;

  return { discount, promo };
};

/**
 * Create a complete order in a transaction: address → order → order items → stock decrement → clear cart.
 * @param {number} userId
 * @param {object} params
 */
const createOrderTx = async (userId, { addr, courier, paymentMethod, promoCode, notes, cartItems, subtotal, shippingCost, discount }) => {
  const total = subtotal + shippingCost - discount;
  const orderNum = `SL-${Date.now().toString().slice(-5)}${Math.floor(Math.random() * 100)}`;

  return prisma.$transaction(async (tx) => {
    const address = await tx.address.create({
      data: { userId, name: addr.name, phone: addr.phone, address: addr.address, city: addr.city, zipCode: addr.zipCode, province: addr.province },
    });

    const order = await tx.order.create({
      data: {
        orderNumber: orderNum, userId, addressId: address.id,
        subtotal, shippingCost, discount, total, courier,
        status: paymentMethod === 'cod' ? 'PENDING' : 'PAID',
        courierEta: COURIERS[courier]?.eta, paymentMethod, promoCode, notes,
        items: {
          create: cartItems.map((i) => ({
            productId: i.productId, name: i.product.name,
            image: i.product.images[0]?.url || '', price: i.product.price,
            size: i.size, color: i.color, qty: i.qty,
          })),
        },
      },
      include: { items: true },
    });

    for (const item of cartItems)
      await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.qty } } });

    await tx.cartItem.deleteMany({ where: { userId } });

    return order;
  });
};

/**
 * Get all orders for a user, formatted for frontend.
 * @param {number} userId
 */
const findOrdersByUser = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  return orders.map(formatOrder);
};

/**
 * Find a single order by its order number (with address).
 * @param {string} orderNumber
 */
const findOrderByNumber = (orderNumber) =>
  prisma.order.findUnique({ where: { orderNumber }, include: { items: true, address: true } });

export default {
  COURIERS,
  formatOrder,
  getCartItemsForCheckout,
  resolvePromo,
  createOrderTx,
  findOrdersByUser,
  findOrderByNumber,
};
