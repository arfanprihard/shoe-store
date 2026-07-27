import { Router } from 'express';
import { createPaymentCharge, checkPaymentStatus } from '../controllers/payment.controller.js';

const router = Router();

// POST /api/payment/charge
router.post('/charge', createPaymentCharge);

// GET /api/payment/status/:orderNumber
router.get('/status/:orderNumber', checkPaymentStatus);

export default router;
