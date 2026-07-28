import { Router } from 'express';
import { auth } from '../Middleware/auth.js';
import { validate } from '../Middleware/validate.js';
import { reviewSchema } from '../Validators/schemas.js';
import reviewController from '../Controllers/review.controller.js';

const router = Router();

// GET /api/products/:productId/reviews
router.get('/:productId/reviews', reviewController.getReviews);

// POST /api/products/:productId/reviews
router.post('/:productId/reviews', auth, validate(reviewSchema), reviewController.createReview);

export default router;
