import catalogModel from '../Models/catalog.model.js';
import { sendSuccess, sendError } from '../Utils/response.helper.js';

// GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await catalogModel.findAllCategories();
    return sendSuccess(res, 'Daftar kategori berhasil diambil', categories);
  } catch (e) {
    return sendError(res, 'Gagal mengambil daftar kategori', e);
  }
};

// GET /api/brands
const getBrands = async (req, res) => {
  try {
    const brands = await catalogModel.findAllBrands();
    return sendSuccess(res, 'Daftar brand berhasil diambil', brands);
  } catch (e) {
    return sendError(res, 'Gagal mengambil daftar brand', e);
  }
};

export default {
  getCategories,
  getBrands,
};
