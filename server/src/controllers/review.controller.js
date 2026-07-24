import prisma from '../config/database.js';
import { success, error } from '../utils/apiResponse.js';

// GET /api/products/:productId/reviews
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: +req.params.productId },
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, reviews.map(r => ({
      id: r.id,
      user: `${r.user.firstName} ${r.user.lastName.charAt(0)}.`,
      avatar: `${r.user.firstName.charAt(0)}${r.user.lastName.charAt(0)}`,
      rating: r.rating, comment: r.comment,
      date: r.createdAt.toISOString().split('T')[0],
      helpful: r.helpful,
    })));
  } catch (e) { next(e); }
};

// POST /api/products/:productId/reviews
export const createReview = async (req, res, next) => {
  try {
    const productId = +req.params.productId;
    const existing = await prisma.review.findUnique({
      where: { productId_userId: { productId, userId: req.user.id } },
    });
    if (existing) return error(res, 'Anda sudah memberikan review', 409);

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

    return success(res, review, null, 201);
  } catch (e) { next(e); }
};
