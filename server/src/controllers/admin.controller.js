import prisma from '../config/database.js';
import { success, error, paginate } from '../utils/apiResponse.js';

const productInclude = {
  brand: { select: { id: true, name: true } },
  category: { select: { id: true, name: true } },
  images: { orderBy: { sortOrder: 'asc' } },
  colors: true,
  sizes: { orderBy: { size: 'asc' } },
  tags: true,
};

// ─── DASHBOARD STATS ────────────────────────────
export const getStats = async (req, res, next) => {
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
    return success(res, {
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
  } catch (e) { next(e); }
};

// ─── PRODUCTS CRUD ──────────────────────────────
export const getProducts = async (req, res, next) => {
  try {
    const { search, page, limit } = req.query;
    const where = {};
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { brand: { name: { contains: search, mode: 'insensitive' } } },
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
    return success(res, formatted, { page: p, limit: l, total, totalPages: Math.ceil(total / l) });
  } catch (e) { next(e); }
};

export const createProduct = async (req, res, next) => {
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
    return success(res, { ...product, variants: parsedVariants }, null, 201);
  } catch (e) { next(e); }
};

export const updateProduct = async (req, res, next) => {
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
    return success(res, { ...product, variants: parsedVariants });
  } catch (e) { next(e); }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const id = +req.params.id;
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    return success(res, { message: 'Produk dinonaktifkan' });
  } catch (e) { next(e); }
};

// ─── UPLOAD ─────────────────────────────────────
export const uploadImages = (req, res) => {
  const urls = req.files.map(f => `/images/products/${f.filename}`);
  return success(res, urls, null, 201);
};

// ─── ORDERS ─────────────────────────────────────
export const getOrders = async (req, res, next) => {
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
    return success(res, orders.map(o => ({
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
    })), { page: p, limit: l, total, totalPages: Math.ceil(total / l) });
  } catch (e) { next(e); }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) return error(res, 'Status tidak valid', 400);
    const order = await prisma.order.update({
      where: { id: +req.params.id },
      data: { status },
    });
    return success(res, { orderNumber: order.orderNumber, status: order.status });
  } catch (e) { next(e); }
};

// ─── PROMO CODES ────────────────────────────────
export const getPromos = async (req, res, next) => {
  try {
    const promos = await prisma.promoCode.findMany({ orderBy: { id: 'desc' } });
    return success(res, promos);
  } catch (e) { next(e); }
};

export const createPromo = async (req, res, next) => {
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
    return success(res, promo, null, 201);
  } catch (e) { next(e); }
};

export const deletePromo = async (req, res, next) => {
  try {
    await prisma.promoCode.delete({ where: { id: +req.params.id } });
    return success(res, { message: 'Promo dihapus' });
  } catch (e) { next(e); }
};

// ─── USERS ──────────────────────────────────────
export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, email: true, firstName: true, lastName: true, phone: true,
        role: true, createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, users.map(u => ({
      ...u, orderCount: u._count.orders, _count: undefined,
    })));
  } catch (e) { next(e); }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['CUSTOMER', 'ADMIN'].includes(role)) return error(res, 'Role tidak valid', 400);
    const user = await prisma.user.update({
      where: { id: +req.params.id },
      data: { role },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
    return success(res, user);
  } catch (e) { next(e); }
};

// ─── CATEGORIES ─────────────────────────────────
export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
    return success(res, categories.map(c => ({ ...c, productCount: c._count.products, _count: undefined })));
  } catch (e) { next(e); }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, slug, icon } = req.body;
    const cat = await prisma.category.create({ data: { name, slug, icon } });
    return success(res, cat, null, 201);
  } catch (e) { next(e); }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name, slug, icon } = req.body;
    const cat = await prisma.category.update({ where: { id: +req.params.id }, data: { name, slug, icon } });
    return success(res, cat);
  } catch (e) { next(e); }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const count = await prisma.product.count({ where: { categoryId: +req.params.id } });
    if (count > 0) return error(res, `Tidak bisa hapus, masih ada ${count} produk di kategori ini`, 400);
    await prisma.category.delete({ where: { id: +req.params.id } });
    return success(res, { message: 'Kategori dihapus' });
  } catch (e) { next(e); }
};

// ─── BRANDS ─────────────────────────────────────
export const getBrands = async (req, res, next) => {
  try {
    const brands = await prisma.brand.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
    return success(res, brands.map(b => ({ ...b, productCount: b._count.products, _count: undefined })));
  } catch (e) { next(e); }
};

export const createBrand = async (req, res, next) => {
  try {
    const { name, slug, logo } = req.body;
    const brand = await prisma.brand.create({ data: { name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), logo } });
    return success(res, brand, null, 201);
  } catch (e) { next(e); }
};

export const updateBrand = async (req, res, next) => {
  try {
    const { name, slug, logo } = req.body;
    const brand = await prisma.brand.update({ where: { id: +req.params.id }, data: { name, slug, logo } });
    return success(res, brand);
  } catch (e) { next(e); }
};

export const deleteBrand = async (req, res, next) => {
  try {
    const count = await prisma.product.count({ where: { brandId: +req.params.id } });
    if (count > 0) return error(res, `Tidak bisa hapus, masih ada ${count} produk dari brand ini`, 400);
    await prisma.brand.delete({ where: { id: +req.params.id } });
    return success(res, { message: 'Brand dihapus' });
  } catch (e) { next(e); }
};
