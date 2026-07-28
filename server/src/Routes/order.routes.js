import { Router } from 'express';
import { auth } from '../Middleware/auth.js';
import { validate } from '../Middleware/validate.js';
import { orderSchema } from '../Validators/schemas.js';
import orderController from '../Controllers/order.controller.js';

const router = Router();
router.use(auth);

// POST /api/orders
router.post('/', validate(orderSchema), orderController.createOrder);

// GET /api/orders
router.get('/', orderController.getOrders);

// GET /api/orders/:orderNumber
router.get('/:orderNumber', orderController.getOrderByNumber);

export default router;
