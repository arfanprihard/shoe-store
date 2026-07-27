import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';

const router = Router();

// GET /api/products/featured
router.get('/featured', productController.getFeatured);

// GET /api/products/new-arrivals
router.get('/new-arrivals', productController.getNewArrivals);

// GET /api/products/search?q=
router.get('/search', productController.search);

// POST /api/products/:id/reviews
router.post('/:id/reviews', productController.addReview);

// GET /api/products/:id
router.get('/:id', productController.getById);

// GET /api/products — list with filters (keep this below specific sub-paths)
router.get('/', productController.getAll);

export default router;
