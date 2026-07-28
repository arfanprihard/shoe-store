import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../Utils/response.helper.js';

// GET /api/products/:productId/reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: +req.params.productId },
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, 'Ulasan berhasil diambil', reviews.map(r => ({
      id: r.id,
      user: `${r.user.firstName} ${r.user.lastName.charAt(0)}.`,
      avatar: `${r.user.firstName.charAt(0)}${r.user.lastName.charAt(0)}`,
      rating: r.rating, comment: r.comment,
      date: r.createdAt.toISOString().split('T')[0],
      helpful: r.helpful,
    })));
  } catch (e) {
    return sendError(res, 'Gagal mengambil ulasan', e);
  }
};

// POST /api/products/:productId/reviews
const createReview = async (req, res) => {
  try {
    const productId = +req.params.productId;
    const existing = await prisma.review.findUnique({
      where: { productId_userId: { productId, userId: req.user.id } },
    });
    if (existing) return sendError(res, 'Anda sudah memberikan review', null, 409);

    const review = await prisma.review.create({
      data: { productId, userId: req.user.id, ...req.validated },
    });

    // Update product average rating
    const agg = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { id: true },
    });
    await prisma.product.update({
      where: { id: productId },
      data: { rating: Math.round(agg._avg.rating * 10) / 10, reviewCount: agg._count.id },
    });

    return sendSuccess(res, 'Ulasan berhasil dibuat', review, 201);
  } catch (e) {
    return sendError(res, 'Gagal membuat ulasan', e);
  }
};

export default {
  getReviews,
  createReview,
};
