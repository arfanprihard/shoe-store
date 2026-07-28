import { Router } from 'express';
import shippingController from '../Controllers/shipping.controller.js';

const router = Router();

// GET /api/shipping/couriers
router.get('/couriers', shippingController.getCouriers);

// POST /api/shipping/calculate
router.post('/calculate', shippingController.calculateRates);

// GET /api/shipping/track/:waybill
router.get('/track/:waybill', shippingController.trackWaybill);

export default router;
