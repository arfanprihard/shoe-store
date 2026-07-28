import cartModel from '../Models/cart.model.js';
import { sendSuccess, sendError } from '../Utils/response.helper.js';
import prisma from '../config/database.js';

// GET /api/cart
const getCart = async (req, res) => {
  try {
    const items = await cartModel.getCartItems(req.user.id);
    return sendSuccess(res, 'Keranjang berhasil diambil', items.map(cartModel.formatCartItem));
  } catch (e) {
    return sendError(res, 'Gagal mengambil isi keranjang', e);
  }
};

// POST /api/cart/items
const addItem = async (req, res) => {
  try {
    const { productId, size, color, qty } = req.validated;
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return sendError(res, 'Produk tidak ditemukan', null, 404);
    if (product.stock < qty) return sendError(res, 'Stok tidak cukup', null, 400);

    const item = await cartModel.upsertCartItem(req.user.id, { productId, size, color, qty });
    return sendSuccess(res, 'Item berhasil ditambahkan ke keranjang', item, 201);
  } catch (e) {
    return sendError(res, 'Gagal menambahkan item ke keranjang', e);
  }
};

// PATCH /api/cart/items/:id
const updateItem = async (req, res) => {
  try {
    const item = await cartModel.findCartItemByUser(+req.params.id, req.user.id);
    if (!item) return sendError(res, 'Item tidak ditemukan', null, 404);
    const updated = await cartModel.updateCartItemQty(item.id, req.validated.qty);
    return sendSuccess(res, 'Jumlah item berhasil diupdate', updated);
  } catch (e) {
    return sendError(res, 'Gagal mengupdate jumlah item', e);
  }
};

// DELETE /api/cart/items/:id
const deleteItem = async (req, res) => {
  try {
    await cartModel.deleteCartItem(+req.params.id, req.user.id);
    return sendSuccess(res, 'Item dihapus dari keranjang');
  } catch (e) {
    return sendError(res, 'Gagal menghapus item dari keranjang', e);
  }
};

// DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    await cartModel.clearCartItems(req.user.id);
    return sendSuccess(res, 'Keranjang dikosongkan');
  } catch (e) {
    return sendError(res, 'Gagal mengosongkan keranjang', e);
  }
};

export default {
  getCart,
  addItem,
  updateItem,
  deleteItem,
  clearCart,
};
