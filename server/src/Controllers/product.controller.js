import productModel from '../Models/product.model.js';
import { sendSuccess, sendError, paginate } from '../Utils/response.helper.js';

// GET /api/products — list with filters
const getAll = async (req, res) => {
  try {
    const { category, brands, minPrice, maxPrice, sizes, search, sortBy, page, limit } = req.query;
    const { skip, take, page: p, limit: l } = paginate(page, limit);
    const { products, total } = await productModel.findProducts(
      { category, brands, minPrice, maxPrice, sizes, search, sortBy },
      { skip, take },
    );
    return sendSuccess(res, 'Produk berhasil diambil', products.map(productModel.formatProduct), 200, { page: p, limit: l, total, totalPages: Math.ceil(total / l) });
  } catch (e) {
    return sendError(res, 'Gagal mengambil daftar produk', e);
  }
};

// GET /api/products/featured
const getFeatured = async (req, res) => {
  try {
    const products = await productModel.findFeaturedProducts();
    return sendSuccess(res, 'Featured produk berhasil diambil', products.map(productModel.formatProduct));
  } catch (e) {
    return sendError(res, 'Gagal mengambil featured produk', e);
  }
};

// GET /api/products/new-arrivals
const getNewArrivals = async (req, res) => {
  try {
    const products = await productModel.findNewArrivals();
    return sendSuccess(res, 'Produk terbaru berhasil diambil', products.map(productModel.formatProduct));
  } catch (e) {
    return sendError(res, 'Gagal mengambil produk terbaru', e);
  }
};

// GET /api/products/search?q=
const search = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q || q.length < 2) return sendSuccess(res, 'Pencarian kosong', []);
    const products = await productModel.searchProductSuggestions(q);
    return sendSuccess(res, 'Rekomendasi pencarian berhasil diambil', products.map((p) => ({ id: p.id, name: p.name, brand: p.brand.name, image: p.images[0]?.url || '' })));
  } catch (e) {
    return sendError(res, 'Gagal melakukan pencarian', e);
  }
};

// GET /api/products/:id
const getById = async (req, res) => {
  try {
    const product = await productModel.findProductById(+req.params.id);
    if (!product) return sendError(res, 'Produk tidak ditemukan', null, 404);
    return sendSuccess(res, 'Produk detail berhasil diambil', productModel.formatProduct(product));
  } catch (e) {
    return sendError(res, 'Gagal mengambil detail produk', e);
  }
};

// POST /api/products/:id/reviews
const addReview = async (req, res) => {
  try {
    const productId = +req.params.id;
    const userId = req.user?.id || req.body.userId || 1;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5)
      return sendError(res, 'Rating harus antara 1 sampai 5 bintang', null, 400);

    const review = await productModel.upsertReview(productId, userId, +rating, comment);

    return sendSuccess(res, 'Ulasan berhasil disimpan', {
      id: review.id,
      user: `${review.user?.firstName || 'Pelanggan'} ${review.user?.lastName ? review.user.lastName.charAt(0) + '.' : ''}`,
      avatar: `${(review.user?.firstName || 'P').charAt(0)}${(review.user?.lastName || 'U').charAt(0)}`,
      rating: review.rating,
      comment: review.comment,
      date: review.createdAt.toISOString().split('T')[0],
      helpful: review.helpful || 0,
    }, 201);
  } catch (e) {
    return sendError(res, 'Gagal menambahkan ulasan', e);
  }
};

export default {
  getAll,
  getFeatured,
  getNewArrivals,
  search,
  getById,
  addReview,
};
