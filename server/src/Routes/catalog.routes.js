import { Router } from 'express';
import catalogController from '../Controllers/catalog.controller.js';

const catRouter = Router();
const brandRouter = Router();

// GET /api/categories
catRouter.get('/', catalogController.getCategories);

// GET /api/brands
brandRouter.get('/', catalogController.getBrands);

export { catRouter, brandRouter };
