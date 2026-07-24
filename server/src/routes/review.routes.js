import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { reviewSchema } from '../validators/schemas.js';
import * as reviewController from '../controllers/review.controller.js';

const router = Router();

// GET /api/products/:productId/reviews
router.get('/:productId/reviews', reviewController.getReviews);

// POST /api/products/:productId/reviews
router.post('/:productId/reviews', auth, validate(reviewSchema), reviewController.createReview);

export default router;
