import { Router } from 'express';
import { auth } from '../Middleware/auth.js';
import promoController from '../Controllers/promo.controller.js';

const router = Router();
router.use(auth);

// POST /api/promos/validate
router.post('/validate', promoController.validatePromo);

export default router;
