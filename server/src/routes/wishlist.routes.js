import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import * as wishlistController from '../controllers/wishlist.controller.js';

const router = Router();
router.use(auth);

// GET /api/wishlist
router.get('/', wishlistController.getWishlist);

// POST /api/wishlist (toggle)
router.post('/', wishlistController.toggleWishlist);

export default router;
