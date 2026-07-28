import prisma from '../config/database.js';

// ─── Queries ─────────────────────────────────────────────────────

/**
 * Find a promo code by its code string (case-insensitive match via uppercase).
 * @param {string} code
 */
const findPromoCode = (code) =>
  prisma.promoCode.findFirst({ where: { code: code.toUpperCase(), isActive: true } });

/**
 * Calculate the discount amount for a given promo against a subtotal.
 * Returns 0 if the promo is invalid / expired / limit reached / below minimum.
 * @param {object} promo  – Prisma PromoCode record
 * @param {number} subtotal
 * @returns {number} discount amount in IDR
 */
const calculateDiscount = (promo, subtotal) => {
  const now = new Date();
  if (now < promo.startDate || now > promo.endDate) return 0;
  if (promo.usageLimit !== null && promo.usageCount >= promo.usageLimit) return 0;
  if (promo.minPurchase !== null && subtotal < promo.minPurchase) return 0;

  if (promo.type === 'PERCENTAGE') {
    const raw = Math.floor((subtotal * promo.value) / 100);
    return promo.maxDiscount !== null ? Math.min(raw, promo.maxDiscount) : raw;
  }
  // FIXED
  return Math.min(promo.value, subtotal);
};

/**
 * Increment the usage counter for a promo code.
 * @param {number} promoId
 */
const incrementPromoUsage = (promoId) =>
  prisma.promoCode.update({ where: { id: promoId }, data: { usageCount: { increment: 1 } } });

export default {
  findPromoCode,
  calculateDiscount,
  incrementPromoUsage,
};
