import { Router } from 'express';
import { auth } from '../Middleware/auth.js';
import wishlistController from '../Controllers/wishlist.controller.js';

const router = Router();
router.use(auth);

// GET /api/wishlist
router.get('/', wishlistController.getWishlist);

// POST /api/wishlist (toggle)
router.post('/', wishlistController.toggleWishlist);

export default router;
