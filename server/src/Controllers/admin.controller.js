import prisma from '../config/database.js';
import { sendSuccess, sendError, paginate } from '../Utils/response.helper.js';

const productInclude = {
  brand: { select: { id: true, name: true } },
  category: { select: { id: true, name: true } },
  images: { orderBy: { sortOrder: 'asc' } },
  colors: true,
  sizes: { orderBy: { size: 'asc' } },
  tags: true,
};

// ─── DASHBOARD STATS ────────────────────────────
const getStats = async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, totalRevenue, recentOrders] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'CANCELLED' } } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          items: { select: { name: true, qty: true } },
        },
      }),
    ]);
    return sendSuccess(res, 'Stats berhasil diambil', {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: totalRevenue._sum.total || 0,
      recentOrders: recentOrders.map(o => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customer: `${o.user.firstName} ${o.user.lastName}`,
        email: o.user.email,
        total: o.total,
        status: o.status,
        date: o.createdAt,
        itemCount: o.items.reduce((s, i) => s + i.qty, 0),
      })),
    });
  } catch (e) {
    return sendError(res, 'Gagal mengambil stats dashboard', e);
  }
};

// ─── PRODUCTS CRUD ──────────────────────────────
const getProducts = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    const where = {};
    if (search) where.OR = [
      { name: { contains: search } },
      { brand: { name: { contains: search } } },
    ];
    const { skip, take, page: p, limit: l } = paginate(page, limit);
    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, include: productInclude, orderBy: { createdAt: 'desc' }, skip, take }),
      prisma.product.count({ where }),
    ]);
    const formatted = products.map(p => ({
      ...p,
      variants: p.variants ? (typeof p.variants === 'string' ? JSON.parse(p.variants) : p.variants) : {},
    }));
    return sendSuccess(res, 'Produk berhasil diambil', formatted, 200, { page: p, limit: l, total, totalPages: Math.ceil(total / l) });
  } catch (e) {
    return sendError(res, 'Gagal mengambil produk admin', e);
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, slug, description, price, originalPrice, stock, brandId, categoryId, images, colors, sizes, tags, isNew, isBestSeller, variants } = req.body;
    const variantsStr = variants ? (typeof variants === 'string' ? variants : JSON.stringify(variants)) : null;
    const product = await prisma.product.create({
      data: {
        name, slug, description, price: +price, originalPrice: originalPrice ? +originalPrice : null,
        stock: +stock, brandId: +brandId, categoryId: +categoryId,
        isNew: !!isNew, isBestSeller: !!isBestSeller,
        variants: variantsStr,
        images: { create: (images || []).map((url, i) => ({ url, isPrimary: i === 0, sortOrder: i })) },
        colors: { create: (colors || []).map(c => ({ name: c.name, hexValue: c.hexValue })) },
        sizes: { create: (sizes || []).map(s => ({ size: +s.size, stock: +s.stock || 0 })) },
        tags: { create: (tags || []).map(t => ({ tag: t })) },
      },
      include: productInclude,
    });
    const parsedVariants = product.variants ? (typeof product.variants === 'string' ? JSON.parse(product.variants) : product.variants) : {};
    return sendSuccess(res, 'Produk berhasil dibuat', { ...product, variants: parsedVariants }, 201);
  } catch (e) {
    return sendError(res, 'Gagal membuat produk', e);
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = +req.params.id;
    const { name, slug, description, price, originalPrice, stock, brandId, categoryId, images, colors, sizes, tags, isNew, isBestSeller, isActive, variants } = req.body;
    const variantsStr = variants ? (typeof variants === 'string' ? variants : JSON.stringify(variants)) : null;

    // Delete existing related data to replace with new
    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId: id } }),
      prisma.productColor.deleteMany({ where: { productId: id } }),
      prisma.productSize.deleteMany({ where: { productId: id } }),
      prisma.productTag.deleteMany({ where: { productId: id } }),
    ]);

    const product = await prisma.product.update({
      where: { id },
      data: {
        name, slug, description, price: +price, originalPrice: originalPrice ? +originalPrice : null,
        stock: +stock, brandId: +brandId, categoryId: +categoryId,
        isNew: !!isNew, isBestSeller: !!isBestSeller, isActive: isActive !== false,
        variants: variantsStr,
        images: { create: (images || []).map((url, i) => ({ url, isPrimary: i === 0, sortOrder: i })) },
        colors: { create: (colors || []).map(c => ({ name: c.name, hexValue: c.hexValue })) },
        sizes: { create: (sizes || []).map(s => ({ size: +s.size, stock: +s.stock || 0 })) },
        tags: { create: (tags || []).map(t => ({ tag: t })) },
      },
      include: productInclude,
    });
    const parsedVariants = product.variants ? (typeof product.variants === 'string' ? JSON.parse(product.variants) : product.variants) : {};
    return sendSuccess(res, 'Produk berhasil diupdate', { ...product, variants: parsedVariants });
  } catch (e) {
    return sendError(res, 'Gagal mengupdate produk', e);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = +req.params.id;
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    return sendSuccess(res, 'Produk berhasil dinonaktifkan');
  } catch (e) {
    return sendError(res, 'Gagal menonaktifkan produk', e);
  }
};

// ─── UPLOAD ─────────────────────────────────────
const uploadImages = (req, res) => {
  const urls = req.files.map(f => `/images/products/${f.filename}`);
  return sendSuccess(res, 'Gambar berhasil diupload', urls, 201);
};

// ─── ORDERS ─────────────────────────────────────
const getOrders = async (req, res) => {
  try {
    const { status, page, limit } = req.query;
    const where = {};
    if (status && status !== 'all') where.status = status;
    const { skip, take, page: p, limit: l } = paginate(page, limit);
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          items: true,
          address: true,
        },
        orderBy: { createdAt: 'desc' },
        skip, take,
      }),
      prisma.order.count({ where }),
    ]);
    return sendSuccess(res, 'Daftar order berhasil diambil', orders.map(o => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customer: `${o.user.firstName} ${o.user.lastName}`,
      email: o.user.email,
      total: o.total,
      subtotal: o.subtotal,
      shippingCost: o.shippingCost,
      discount: o.discount,
      status: o.status,
      courier: o.courier,
      paymentMethod: o.paymentMethod,
      date: o.createdAt,
      items: o.items,
      address: o.address,
    })), 200, { page: p, limit: l, total, totalPages: Math.ceil(total / l) });
  } catch (e) {
    return sendError(res, 'Gagal mengambil daftar order', e);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) return sendError(res, 'Status tidak valid', null, 400);
    const order = await prisma.order.update({
      where: { id: +req.params.id },
      data: { status },
    });
    return sendSuccess(res, 'Status order berhasil diupdate', { orderNumber: order.orderNumber, status: order.status });
  } catch (e) {
    return sendError(res, 'Gagal mengupdate status order', e);
  }
};

// ─── PROMO CODES ────────────────────────────────
const getPromos = async (req, res) => {
  try {
    const promos = await prisma.promoCode.findMany({ orderBy: { id: 'desc' } });
    return sendSuccess(res, 'Daftar promo berhasil diambil', promos);
  } catch (e) {
    return sendError(res, 'Gagal mengambil daftar promo', e);
  }
};

const createPromo = async (req, res) => {
  try {
    const { code, type, value, minPurchase, maxDiscount, usageLimit, startDate, endDate } = req.body;
    const promo = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(), type, value: +value,
        minPurchase: minPurchase ? +minPurchase : null,
        maxDiscount: maxDiscount ? +maxDiscount : null,
        usageLimit: usageLimit ? +usageLimit : null,
        startDate: new Date(startDate), endDate: new Date(endDate),
      },
    });
    return sendSuccess(res, 'Promo berhasil dibuat', promo, 201);
  } catch (e) {
    return sendError(res, 'Gagal membuat promo baru', e);
  }
};

const deletePromo = async (req, res) => {
  try {
    await prisma.promoCode.delete({ where: { id: +req.params.id } });
    return sendSuccess(res, 'Promo berhasil dihapus');
  } catch (e) {
    return sendError(res, 'Gagal menghapus promo', e);
  }
};

// ─── USERS ──────────────────────────────────────
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, email: true, firstName: true, lastName: true, phone: true,
        role: true, createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, 'Daftar user berhasil diambil', users.map(u => ({
      ...u, orderCount: u._count.orders, _count: undefined,
    })));
  } catch (e) {
    return sendError(res, 'Gagal mengambil daftar user', e);
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['CUSTOMER', 'ADMIN'].includes(role)) return sendError(res, 'Role tidak valid', null, 400);
    const user = await prisma.user.update({
      where: { id: +req.params.id },
      data: { role },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
    return sendSuccess(res, 'Role user berhasil diupdate', user);
  } catch (e) {
    return sendError(res, 'Gagal mengupdate role user', e);
  }
};

// ─── CATEGORIES ─────────────────────────────────
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
    return sendSuccess(res, 'Daftar kategori berhasil diambil', categories.map(c => ({ ...c, productCount: c._count.products, _count: undefined })));
  } catch (e) {
    return sendError(res, 'Gagal mengambil daftar kategori', e);
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug, icon } = req.body;
    const cat = await prisma.category.create({ data: { name, slug, icon } });
    return sendSuccess(res, 'Kategori berhasil dibuat', cat, 201);
  } catch (e) {
    return sendError(res, 'Gagal membuat kategori baru', e);
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, slug, icon } = req.body;
    const cat = await prisma.category.update({ where: { id: +req.params.id }, data: { name, slug, icon } });
    return sendSuccess(res, 'Kategori berhasil diupdate', cat);
  } catch (e) {
    return sendError(res, 'Gagal mengupdate kategori', e);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const count = await prisma.product.count({ where: { categoryId: +req.params.id } });
    if (count > 0) return sendError(res, `Tidak bisa hapus, masih ada ${count} produk di kategori ini`, null, 400);
    await prisma.category.delete({ where: { id: +req.params.id } });
    return sendSuccess(res, 'Kategori berhasil dihapus');
  } catch (e) {
    return sendError(res, 'Gagal menghapus kategori', e);
  }
};

// ─── BRANDS ─────────────────────────────────────
const getBrands = async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
    return sendSuccess(res, 'Daftar brand berhasil diambil', brands.map(b => ({ ...b, productCount: b._count.products, _count: undefined })));
  } catch (e) {
    return sendError(res, 'Gagal mengambil daftar brand', e);
  }
};

const createBrand = async (req, res) => {
  try {
    const { name, slug, logo } = req.body;
    const brand = await prisma.brand.create({ data: { name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), logo } });
    return sendSuccess(res, 'Brand berhasil dibuat', brand, 201);
  } catch (e) {
    return sendError(res, 'Gagal membuat brand baru', e);
  }
};

const updateBrand = async (req, res) => {
  try {
    const { name, slug, logo } = req.body;
    const brand = await prisma.brand.update({ where: { id: +req.params.id }, data: { name, slug, logo } });
    return sendSuccess(res, 'Brand berhasil diupdate', brand);
  } catch (e) {
    return sendError(res, 'Gagal mengupdate brand', e);
  }
};

const deleteBrand = async (req, res) => {
  try {
    const count = await prisma.product.count({ where: { brandId: +req.params.id } });
    if (count > 0) return sendError(res, `Tidak bisa hapus, masih ada ${count} produk dari brand ini`, null, 400);
    await prisma.brand.delete({ where: { id: +req.params.id } });
    return sendSuccess(res, 'Brand berhasil dihapus');
  } catch (e) {
    return sendError(res, 'Gagal menghapus brand', e);
  }
};

export default {
  getStats,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
  getOrders,
  updateOrderStatus,
  getPromos,
  createPromo,
  deletePromo,
  getUsers,
  updateUserRole,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
};
