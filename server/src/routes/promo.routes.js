import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import * as promoController from '../controllers/promo.controller.js';

const router = Router();
router.use(auth);

// POST /api/promos/validate
router.post('/validate', promoController.validatePromo);

export default router;
