import prisma from '../config/database.js';
import { success, error } from '../utils/apiResponse.js';

// POST /api/promos/validate
// body: { code, subtotal }
export const validatePromo = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;

    if (!code || subtotal === undefined) {
      return error(res, 'Kode promo dan subtotal wajib diisi', 400);
    }

    const promo = await prisma.promoCode.findFirst({
      where: { code: code.toUpperCase(), isActive: true },
    });

    if (!promo) {
      return error(res, 'Kode promo tidak ditemukan atau tidak aktif', 404);
    }

    const now = new Date();
    if (now < promo.startDate || now > promo.endDate) {
      return error(res, 'Kode promo sudah kadaluarsa atau belum aktif', 400);
    }

    if (promo.usageLimit !== null && promo.usageCount >= promo.usageLimit) {
      return error(res, 'Kode promo sudah habis digunakan', 400);
    }

    if (promo.minPurchase !== null && subtotal < promo.minPurchase) {
      return error(
        res,
        `Minimum pembelian untuk promo ini adalah Rp${promo.minPurchase.toLocaleString('id-ID')}`,
        400
      );
    }

    // Calculate discount
    let discount = 0;
    if (promo.type === 'PERCENTAGE') {
      discount = Math.floor((subtotal * promo.value) / 100);
      if (promo.maxDiscount !== null) {
        discount = Math.min(discount, promo.maxDiscount);
      }
    } else {
      // FIXED
      discount = Math.min(promo.value, subtotal);
    }

    return success(res, {
      code: promo.code,
      type: promo.type,
      value: promo.value,
      discount,
    });
  } catch (e) {
    next(e);
  }
};
