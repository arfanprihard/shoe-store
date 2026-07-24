import prisma from '../config/database.js';
import { success, error } from '../utils/apiResponse.js';

const COURIERS = {
  jne: { price: 15000, eta: '2-3 hari' },
  jnt: { price: 12000, eta: '2-3 hari' },
  sicepat: { price: 10000, eta: '1-2 hari' },
  'same-day': { price: 35000, eta: 'Hari ini' },
};

const statusLabel = (s) => {
  return { PENDING: 'Menunggu Pembayaran', PAID: 'Dibayar', PROCESSING: 'Diproses', SHIPPED: 'Dikirim', DELIVERED: 'Selesai', CANCELLED: 'Dibatalkan' }[s] || s;
};

// POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { address: addr, courier, paymentMethod, promoCode, notes } = req.validated;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
    });
    if (!cartItems.length) return error(res, 'Keranjang kosong', 400);

    const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);
    const shippingCost = COURIERS[courier]?.price || 0;
    let discount = 0;

    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({ where: { code: promoCode } });
      if (promo && promo.isActive && new Date() >= promo.startDate && new Date() <= promo.endDate) {
        if (!promo.minPurchase || subtotal >= promo.minPurchase) {
          discount = promo.type === 'PERCENTAGE'
            ? Math.min(Math.round(subtotal * promo.value / 100), promo.maxDiscount || Infinity)
            : promo.value;
          await prisma.promoCode.update({ where: { id: promo.id }, data: { usageCount: { increment: 1 } } });
        }
      }
    }

    const total = subtotal + shippingCost - discount;
    const orderNum = `SL-${Date.now().toString().slice(-5)}${Math.floor(Math.random() * 100)}`;

    const order = await prisma.$transaction(async (tx) => {
      const address = await tx.address.create({
        data: { userId: req.user.id, name: addr.name, phone: addr.phone, address: addr.address, city: addr.city, zipCode: addr.zipCode, province: addr.province },
      });

      const created = await tx.order.create({
        data: {
          orderNumber: orderNum, userId: req.user.id, addressId: address.id,
          subtotal, shippingCost, discount, total, courier,
          courierEta: COURIERS[courier]?.eta, paymentMethod, promoCode, notes,
          items: {
            create: cartItems.map(i => ({
              productId: i.productId, name: i.product.name,
              image: i.product.images[0]?.url || '', price: i.product.price,
              size: i.size, color: i.color, qty: i.qty,
            })),
          },
        },
        include: { items: true },
      });

      // Reduce stock
      for (const item of cartItems) {
        await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.qty } } });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { userId: req.user.id } });
      return created;
    });

    return success(res, {
      orderNumber: order.orderNumber, status: order.status,
      subtotal: order.subtotal, shippingCost: order.shippingCost,
      discount: order.discount, total: order.total,
      itemCount: order.items.length,
    }, null, 201);
  } catch (e) { next(e); }
};

// GET /api/orders
export const getOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    const formatted = orders.map(o => ({
      id: o.orderNumber, date: o.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: statusLabel(o.status), total: o.total,
      items: o.items.map(i => ({ name: i.name, qty: i.qty, img: i.image })),
    }));
    return success(res, formatted);
  } catch (e) { next(e); }
};

// GET /api/orders/:orderNumber
export const getOrderByNumber = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: req.params.orderNumber },
      include: { items: true, address: true },
    });
    if (!order || order.userId !== req.user.id) return error(res, 'Pesanan tidak ditemukan', 404);
    return success(res, order);
  } catch (e) { next(e); }
};
