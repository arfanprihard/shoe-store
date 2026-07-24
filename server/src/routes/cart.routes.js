import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { cartItemSchema, updateCartSchema } from '../validators/schemas.js';
import * as cartController from '../controllers/cart.controller.js';

const router = Router();
router.use(auth);

// GET /api/cart
router.get('/', cartController.getCart);

// POST /api/cart/items
router.post('/items', validate(cartItemSchema), cartController.addItem);

// PATCH /api/cart/items/:id
router.patch('/items/:id', validate(updateCartSchema), cartController.updateItem);

// DELETE /api/cart/items/:id
router.delete('/items/:id', cartController.deleteItem);

// DELETE /api/cart
router.delete('/', cartController.clearCart);

export default router;
