import wishlistModel from '../Models/wishlist.model.js';
import { sendSuccess, sendError } from '../Utils/response.helper.js';

// GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    const items = await wishlistModel.getWishlistItems(req.user.id);
    return sendSuccess(res, 'Wishlist berhasil diambil', items);
  } catch (e) {
    return sendError(res, 'Gagal mengambil wishlist', e);
  }
};

// POST /api/wishlist (toggle)
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return sendError(res, 'productId wajib', null, 400);
    const result = await wishlistModel.toggleWishlistItem(req.user.id, +productId);
    return sendSuccess(res, result.action === 'added' ? 'Produk ditambahkan ke wishlist' : 'Produk dihapus dari wishlist', result, result.action === 'added' ? 201 : 200);
  } catch (e) {
    return sendError(res, 'Gagal mengupdate wishlist', e);
  }
};

export default {
  getWishlist,
  toggleWishlist,
};
