import { Router } from 'express';
import paymentController from '../Controllers/payment.controller.js';

const router = Router();

// POST /api/payment/charge
router.post('/charge', paymentController.createPaymentCharge);

// GET /api/payment/status/:orderNumber
router.get('/status/:orderNumber', paymentController.checkPaymentStatus);

export default router;
