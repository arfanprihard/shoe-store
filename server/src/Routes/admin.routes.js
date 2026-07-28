import { Router } from 'express';
import { auth } from '../Middleware/auth.js';
import { requireAdmin } from '../Middleware/adminAuth.js';
import { upload } from '../Middleware/upload.js';
import adminController from '../Controllers/admin.controller.js';

const router = Router();
router.use(auth);
router.use(requireAdmin);

// ─── DASHBOARD STATS ────────────────────────────
router.get('/stats', adminController.getStats);

// ─── PRODUCTS CRUD ──────────────────────────────
router.get('/products', adminController.getProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// ─── UPLOAD ─────────────────────────────────────
router.post('/upload', upload.array('images', 10), adminController.uploadImages);

// ─── ORDERS ─────────────────────────────────────
router.get('/orders', adminController.getOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);

// ─── PROMO CODES ────────────────────────────────
router.get('/promos', adminController.getPromos);
router.post('/promos', adminController.createPromo);
router.delete('/promos/:id', adminController.deletePromo);

// ─── USERS ──────────────────────────────────────
router.get('/users', adminController.getUsers);
router.patch('/users/:id/role', adminController.updateUserRole);

// ─── CATEGORIES ─────────────────────────────────
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// ─── BRANDS ─────────────────────────────────────
router.get('/brands', adminController.getBrands);
router.post('/brands', adminController.createBrand);
router.put('/brands/:id', adminController.updateBrand);
router.delete('/brands/:id', adminController.deleteBrand);

export default router;
