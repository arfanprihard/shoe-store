import orderModel from '../Models/order.model.js';
import promoModel from '../Models/promo.model.js';
import { sendSuccess, sendError } from '../Utils/response.helper.js';

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { address: addr, courier, paymentMethod, promoCode, notes } = req.validated;
    const cartItems = await orderModel.getCartItemsForCheckout(req.user.id);
    if (!cartItems.length) return sendError(res, 'Keranjang kosong', null, 400);

    const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);
    const shippingCost = orderModel.COURIERS[courier]?.price || 0;
    const { discount, promo } = await orderModel.resolvePromo(promoCode, subtotal);

    // Increment promo usage if applied
    if (promo) {
      await promoModel.incrementPromoUsage(promo.id);
    }

    const order = await orderModel.createOrderTx(req.user.id, {
      addr, courier, paymentMethod, promoCode, notes,
      cartItems, subtotal, shippingCost, discount,
    });

    return sendSuccess(res, 'Pesanan berhasil dibuat', {
      orderNumber: order.orderNumber, status: order.status,
      subtotal: order.subtotal, shippingCost: order.shippingCost,
      discount: order.discount, total: order.total,
      itemCount: order.items.length,
    }, 201);
  } catch (e) {
    return sendError(res, 'Gagal membuat pesanan', e);
  }
};

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    const orders = await orderModel.findOrdersByUser(req.user.id);
    return sendSuccess(res, 'Daftar pesanan berhasil diambil', orders);
  } catch (e) {
    return sendError(res, 'Gagal mengambil daftar pesanan', e);
  }
};

// GET /api/orders/:orderNumber
const getOrderByNumber = async (req, res) => {
  try {
    const order = await orderModel.findOrderByNumber(req.params.orderNumber);
    if (!order || order.userId !== req.user.id) return sendError(res, 'Pesanan tidak ditemukan', null, 404);
    return sendSuccess(res, 'Detail pesanan berhasil diambil', order);
  } catch (e) {
    return sendError(res, 'Gagal mengambil detail pesanan', e);
  }
};

export default {
  createOrder,
  getOrders,
  getOrderByNumber,
};
