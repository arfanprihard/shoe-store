import { Router } from 'express';
import { auth } from '../Middleware/auth.js';
import { validate } from '../Middleware/validate.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../Validators/schemas.js';
import authController from '../Controllers/auth.controller.js';

const router = Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), authController.register);

// POST /api/auth/login
router.post('/login', validate(loginSchema), authController.login);

// GET /api/auth/me
router.get('/me', auth, authController.me);

// PATCH /api/auth/me
router.patch('/me', auth, validate(updateProfileSchema), authController.updateMe);

export default router;
