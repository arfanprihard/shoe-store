import { Router } from 'express';
import { getCouriers, calculateRates, trackWaybill } from '../controllers/shipping.controller.js';

const router = Router();

// GET /api/shipping/couriers
router.get('/couriers', getCouriers);

// POST /api/shipping/calculate
router.post('/calculate', calculateRates);

// GET /api/shipping/track/:waybill
router.get('/track/:waybill', trackWaybill);

export default router;
