import promoModel from '../Models/promo.model.js';
import { sendSuccess, sendError } from '../Utils/response.helper.js';

// POST /api/promos/validate
// body: { code, subtotal }
const validatePromo = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code || subtotal === undefined)
      return sendError(res, 'Kode promo dan subtotal wajib diisi', null, 400);

    const promo = await promoModel.findPromoCode(code);
    if (!promo) return sendError(res, 'Kode promo tidak ditemukan atau tidak aktif', null, 404);

    const now = new Date();
    if (now < promo.startDate || now > promo.endDate)
      return sendError(res, 'Kode promo sudah kadaluarsa atau belum aktif', null, 400);

    if (promo.usageLimit !== null && promo.usageCount >= promo.usageLimit)
      return sendError(res, 'Kode promo sudah habis digunakan', null, 400);

    if (promo.minPurchase !== null && subtotal < promo.minPurchase)
      return sendError(res, `Minimum pembelian untuk promo ini adalah Rp${promo.minPurchase.toLocaleString('id-ID')}`, null, 400);

    const discount = promoModel.calculateDiscount(promo, subtotal);

    return sendSuccess(res, 'Promo berhasil divalidasi', { code: promo.code, type: promo.type, value: promo.value, discount });
  } catch (e) {
    return sendError(res, 'Gagal memvalidasi promo', e);
  }
};

export default {
  validatePromo,
};
