import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { orderSchema } from '../validators/schemas.js';
import * as orderController from '../controllers/order.controller.js';

const router = Router();
router.use(auth);

// POST /api/orders
router.post('/', validate(orderSchema), orderController.createOrder);

// GET /api/orders
router.get('/', orderController.getOrders);

// GET /api/orders/:orderNumber
router.get('/:orderNumber', orderController.getOrderByNumber);

export default router;
