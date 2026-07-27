/**
 * seed.js â€” Master seeder yang mencerminkan kondisi database production saat ini.
 *
 * Data yang di-seed:
 *   1. Brands (8)
 *   2. Categories (6)
 *   3. Products (16) â€” dengan rating & reviewCount aktual dari DB
 *   4. Users: 1 demo customer, 1 admin, 40 buyer dummy
 *   5. Reviews â€” random per produk dari buyer dummy (comment kosong, rating 3â€“5)
 *   6. PromoCode: WELCOME10
 *
 * Jalankan: node prisma/seed.js
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const brands = [
  { name: "Nike", slug: "nike" },
  { name: "Adidas", slug: "adidas" },
  { name: "Puma", slug: "puma" },
  { name: "New Balance", slug: "new-balance" },
  { name: "Converse", slug: "converse" },
  { name: "Vans", slug: "vans" },
  { name: "Reebok", slug: "reebok" },
  { name: "Skechers", slug: "skechers" },
];

const categories = [
  { name: "Sneakers", slug: "sneakers" },
  { name: "Running", slug: "running" },
  { name: "Formal", slug: "formal" },
  { name: "Casual", slug: "casual" },
  { name: "Sandals", slug: "sandals" },
  { name: "Boots", slug: "boots" },
];

const img = {
  nike1: "/images/products/nike1.jpg",
  nike2: "/images/products/nike2.jpg",
  adidas1: "/images/products/adidas1.jpg",
  adidas2: "/images/products/adidas2.jpg",
  puma1: "/images/products/puma1.jpg",
  converse1: "/images/products/converse1.jpg",
  vans1: "/images/products/vans1.jpg",
  nb1: "/images/products/nb1.jpg",
  boot1: "/images/products/boot1.jpg",
  formal1: "/images/products/formal1.jpg",
};

const colorMap = {
  "#1a1a1a": "Hitam",
  "#ffffff": "Putih",
  "#ef4444": "Merah",
  "#3b82f6": "Biru",
  "#6b7280": "Abu-abu",
  "#92400e": "Coklat",
  "#1e3a5f": "Navy",
  "#16a34a": "Hijau",
};

const products = [
  {
    name: "Nike Air Max 270",
    slug: "nike-air-max-270",
    brand: "Nike",
    category: "sneakers",
    price: 1850000,
    originalPrice: 2200000,
    stock: 15,
    rating: 4.5,
    reviewCount: 39,
    isNew: false,
    isBestSeller: true,
    description:
      "Nike Air Max 270 menghadirkan kenyamanan maksimal dengan unit Air terbesar di tumit.",
    images: [img.nike1, img.nike2, img.adidas1],
    colors: ["#1a1a1a", "#ffffff", "#ef4444"],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    tags: ["trending", "comfortable", "lifestyle"],
  },
  {
    name: "Adidas Ultraboost 22",
    slug: "adidas-ultraboost-22",
    brand: "Adidas",
    category: "running",
    price: 2100000,
    originalPrice: 2600000,
    stock: 8,
    rating: 4.6,
    reviewCount: 39,
    isNew: false,
    isBestSeller: true,
    description:
      "Adidas Ultraboost 22 adalah sepatu lari performa tinggi dengan teknologi Boost.",
    images: [img.adidas1, img.adidas2],
    colors: ["#1a1a1a", "#3b82f6", "#ffffff"],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    tags: ["running", "performance", "boost"],
  },
  {
    name: "Nike Air Force 1",
    slug: "nike-air-force-1",
    brand: "Nike",
    category: "sneakers",
    price: 1450000,
    originalPrice: null,
    stock: 24,
    rating: 4.7,
    reviewCount: 38,
    isNew: false,
    isBestSeller: true,
    description: "Ikon abadi fashion street style.",
    images: [img.nike2, img.nike1],
    colors: ["#ffffff", "#1a1a1a"],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    tags: ["classic", "streetwear", "iconic"],
  },
  {
    name: "Adidas Stan Smith",
    slug: "adidas-stan-smith",
    brand: "Adidas",
    category: "casual",
    price: 950000,
    originalPrice: 1200000,
    stock: 30,
    rating: 4.5,
    reviewCount: 33,
    isNew: false,
    isBestSeller: false,
    description: "Stan Smith adalah simbol kesederhanaan dan keeleganan.",
    images: [img.adidas2, img.adidas1],
    colors: ["#ffffff", "#16a34a"],
    sizes: [37, 38, 39, 40, 41, 42, 43],
    tags: ["classic", "minimalist"],
  },
  {
    name: "Puma RS-X Toys",
    slug: "puma-rsx-toys",
    brand: "Puma",
    category: "sneakers",
    price: 1150000,
    originalPrice: 1350000,
    stock: 12,
    rating: 4.3,
    reviewCount: 31,
    isNew: true,
    isBestSeller: false,
    description: "Puma RS-X Toys terinspirasi dari desain sneaker era 80an.",
    images: [img.puma1],
    colors: ["#ffffff", "#ef4444", "#3b82f6"],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    tags: ["chunky", "retro"],
  },
  {
    name: "Converse Chuck Taylor",
    slug: "converse-chuck-taylor",
    brand: "Converse",
    category: "casual",
    price: 750000,
    originalPrice: null,
    stock: 41,
    rating: 4.6,
    reviewCount: 37,
    isNew: false,
    isBestSeller: true,
    description: "Chuck Taylor All Star sepatu kanvas ikonik.",
    images: [img.converse1],
    colors: ["#1a1a1a", "#ffffff", "#ef4444", "#3b82f6"],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    tags: ["classic", "canvas"],
  },
  {
    name: "Vans Old Skool",
    slug: "vans-old-skool",
    brand: "Vans",
    category: "casual",
    price: 850000,
    originalPrice: null,
    stock: 22,
    rating: 4.7,
    reviewCount: 33,
    isNew: false,
    isBestSeller: false,
    description: "Vans Old Skool pilihan favorit para skater.",
    images: [img.vans1],
    colors: ["#1a1a1a", "#6b7280", "#ef4444"],
    sizes: [37, 38, 39, 40, 41, 42, 43, 44],
    tags: ["skate", "streetwear"],
  },
  {
    name: "New Balance 574",
    slug: "new-balance-574",
    brand: "New Balance",
    category: "casual",
    price: 1250000,
    originalPrice: 1500000,
    stock: 18,
    rating: 4.5,
    reviewCount: 29,
    isNew: false,
    isBestSeller: false,
    description: "Desain retro 80an dengan teknologi ENCAP modern.",
    images: [img.nb1],
    colors: ["#6b7280", "#1e3a5f", "#92400e"],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    tags: ["retro", "comfortable"],
  },
  {
    name: "Nike React Infinity Run",
    slug: "nike-react-infinity",
    brand: "Nike",
    category: "running",
    price: 1950000,
    originalPrice: 2300000,
    stock: 10,
    rating: 4.5,
    reviewCount: 27,
    isNew: true,
    isBestSeller: false,
    description: "Dirancang untuk mengurangi risiko cedera saat lari.",
    images: [img.nike1, img.nike2],
    colors: ["#1a1a1a", "#ef4444"],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    tags: ["running", "performance"],
  },
  {
    name: "Adidas Forum Low",
    slug: "adidas-forum-low",
    brand: "Adidas",
    category: "sneakers",
    price: 1100000,
    originalPrice: null,
    stock: 16,
    rating: 4.4,
    reviewCount: 25,
    isNew: true,
    isBestSeller: false,
    description: "Desain basketball klasik yang dimodernisasi.",
    images: [img.adidas1, img.adidas2],
    colors: ["#ffffff", "#1a1a1a"],
    sizes: [37, 38, 39, 40, 41, 42, 43, 44],
    tags: ["basketball", "retro"],
  },
  {
    name: "Dr. Martens 1460",
    slug: "dr-martens-1460",
    brand: "Reebok",
    category: "boots",
    price: 2500000,
    originalPrice: 2800000,
    stock: 9,
    rating: 4.6,
    reviewCount: 24,
    isNew: false,
    isBestSeller: false,
    description: "Boots 8-lubang ikonik dengan sol AirWair.",
    images: [img.boot1],
    colors: ["#1a1a1a", "#92400e"],
    sizes: [37, 38, 39, 40, 41, 42, 43, 44, 45],
    tags: ["boots", "durable"],
  },
  {
    name: "Skechers GO Walk 6",
    slug: "skechers-go-walk-6",
    brand: "Skechers",
    category: "casual",
    price: 650000,
    originalPrice: 850000,
    stock: 40,
    rating: 4.3,
    reviewCount: 30,
    isNew: false,
    isBestSeller: false,
    description: "Kenyamanan berjalan sepanjang hari.",
    images: [img.vans1],
    colors: ["#1a1a1a", "#6b7280", "#1e3a5f"],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    tags: ["walking", "comfortable"],
  },
  {
    name: "Nike Jordan 1 Retro",
    slug: "nike-jordan-1-retro",
    brand: "Nike",
    category: "sneakers",
    price: 3200000,
    originalPrice: 3800000,
    stock: 4,
    rating: 4.7,
    reviewCount: 35,
    isNew: false,
    isBestSeller: true,
    description: "Air Jordan 1 Retro High OG sepatu basket ikonik.",
    images: [img.nike2, img.nike1],
    colors: ["#ef4444", "#1a1a1a", "#ffffff"],
    sizes: [40, 41, 42, 43, 44, 45],
    tags: ["basketball", "iconic", "premium"],
  },
  {
    name: "Adidas Yeezy Boost 350",
    slug: "adidas-yeezy-350",
    brand: "Adidas",
    category: "sneakers",
    price: 3500000,
    originalPrice: 4200000,
    stock: 3,
    rating: 4.6,
    reviewCount: 32,
    isNew: false,
    isBestSeller: true,
    description: "Yeezy Boost 350 V2 dengan upper Primeknit.",
    images: [img.adidas2],
    colors: ["#6b7280", "#1a1a1a", "#92400e"],
    sizes: [39, 40, 41, 42, 43, 44],
    tags: ["yeezy", "premium", "limited"],
  },
  {
    name: "Formal Oxford Brogue",
    slug: "formal-oxford-brogue",
    brand: "Skechers",
    category: "formal",
    price: 850000,
    originalPrice: 1050000,
    stock: 20,
    rating: 4.4,
    reviewCount: 22,
    isNew: false,
    isBestSeller: false,
    description: "Oxford Brogue klasik dari kulit asli.",
    images: [img.formal1],
    colors: ["#1a1a1a", "#92400e"],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    tags: ["formal", "oxford"],
  },
  {
    name: "Adidas NMD R1",
    slug: "adidas-nmd-r1",
    brand: "Adidas",
    category: "running",
    price: 1750000,
    originalPrice: 2000000,
    stock: 11,
    rating: 4.5,
    reviewCount: 28,
    isNew: false,
    isBestSeller: true,
    description: "Teknologi Boost dengan desain urban modern.",
    images: [img.adidas2, img.adidas1],
    colors: ["#1a1a1a", "#ffffff", "#ef4444"],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    tags: ["boost", "urban"],
  },
];

const buyerUsers = [
  { firstName: "Budi", lastName: "Santoso" },
  { firstName: "Rina", lastName: "Wijaya" },
  { firstName: "Agus", lastName: "Pratama" },
  { firstName: "Siti", lastName: "Nurhaliza" },
  { firstName: "Dewa", lastName: "Gede" },
  { firstName: "Maya", lastName: "Anggraini" },
  { firstName: "Rizky", lastName: "Febrian" },
  { firstName: "Eka", lastName: "Putri" },
  { firstName: "Hendra", lastName: "Gunawan" },
  { firstName: "Fajar", lastName: "Nugraha" },
  { firstName: "Anisa", lastName: "Rahma" },
  { firstName: "Kevin", lastName: "Sanjaya" },
  { firstName: "Gading", lastName: "Marten" },
  { firstName: "Clarissa", lastName: "Tan" },
  { firstName: "Bayu", lastName: "Skak" },
  { firstName: "Dimas", lastName: "Anggara" },
  { firstName: "Nadia", lastName: "Saphira" },
  { firstName: "Reza", lastName: "Rahadian" },
  { firstName: "Indah", lastName: "Permata" },
  { firstName: "Taufik", lastName: "Hidayat" },
  { firstName: "Aditya", lastName: "Pradana" },
  { firstName: "Fitri", lastName: "Handayani" },
  { firstName: "Gilang", lastName: "Ramadhan" },
  { firstName: "Hana", lastName: "Saraswati" },
  { firstName: "Irfan", lastName: "Hakim" },
  { firstName: "Jessica", lastName: "Mila" },
  { firstName: "Kiki", lastName: "Amalia" },
  { firstName: "Lukman", lastName: "Sardi" },
  { firstName: "Mega", lastName: "Utami" },
  { firstName: "Naufal", lastName: "Samudra" },
  { firstName: "Olivia", lastName: "Jensen" },
  { firstName: "Putra", lastName: "Perdana" },
  { firstName: "Qory", lastName: "Gore" },
  { firstName: "Raditya", lastName: "Dika" },
  { firstName: "Siska", lastName: "Kohl" },
  { firstName: "Tora", lastName: "Sudiro" },
  { firstName: "Uus", lastName: "Kartika" },
  { firstName: "Vino", lastName: "Bastian" },
  { firstName: "Wulan", lastName: "Guritno" },
  { firstName: "Yura", lastName: "Yunita" },
];

const addressesSeed = [
  {
    userKey: "admin",
    name: "Arfan Bengbeng",
    phone: "08080845663",
    address: "KP SUKAPURA",
    city: "Jakarta Utara",
    zipCode: "14140",
  },
  {
    userKey: "demo",
    name: "Arfan Bengbeng",
    phone: "0808080",
    address: "KP SUKAPURA",
    city: "Jakarta Utara",
    zipCode: "14140",
  },
  {
    userKey: "demo",
    name: "Arfan Bengbeng",
    phone: "080808080",
    address: "KP SUKAPURA",
    city: "Jakarta",
    zipCode: "12345",
  },
  {
    userKey: "demo",
    name: "Arfan Bengbeng",
    phone: "080808088",
    address: "KP SUKAPURA",
    city: "Jakarta",
    zipCode: "12345",
  },
  {
    userKey: "demo",
    name: "Arfan Bengbeng",
    phone: "080808080",
    address: "KP SUKAPURA",
    city: "Jakarta",
    zipCode: "12345",
  },
  {
    userKey: "demo",
    name: "Arfan Bengbeng",
    phone: "80808080",
    address: "KP SUKAPURA",
    city: "Jakarta",
    zipCode: "12345",
  },
  {
    userKey: "demo",
    name: "Arfan Bengbeng",
    phone: "080808080",
    address: "KP SUKAPURA",
    city: "Amerika",
    zipCode: "12345",
  },
  {
    userKey: "demo",
    name: "Arfan Bengbeng",
    phone: "080808080",
    address: "KP SUKAPURA",
    city: "Jakarta",
    zipCode: "12345",
  },
  {
    userKey: "demo",
    name: "Arfan Bengbeng",
    phone: "07070779",
    address: "KP SUKAPURA",
    city: "Jakarta",
    zipCode: "12345",
  },
  {
    userKey: "demo",
    name: "Arfan Bengbeng",
    phone: "0808080",
    address: "KP SUKAPURA",
    city: "Jakarta",
    zipCode: "12345",
  },
];

const ordersSeed = [
  {
    orderNumber: "SL-4966292",
    userKey: "admin",
    addressIdx: 0,
    status: "DELIVERED",
    subtotal: 3400000,
    shippingCost: 15000,
    discount: 0,
    total: 3415000,
    courier: "jne",
    courierEta: "2-3 hari",
    paymentMethod: "transfer",
    items: [
      {
        productSlug: "formal-oxford-brogue",
        name: "Formal Oxford Brogue",
        image: "/images/products/formal1.jpg",
        price: 850000,
        size: 39,
        color: "#1a1a1a",
        qty: 4,
      },
    ],
  },
  {
    orderNumber: "SL-2768094",
    userKey: "demo",
    addressIdx: 1,
    status: "PENDING",
    subtotal: 750000,
    shippingCost: 15000,
    discount: 0,
    total: 765000,
    courier: "jne",
    courierEta: "2-3 hari",
    paymentMethod: "transfer",
    items: [
      {
        productSlug: "converse-chuck-taylor",
        name: "Converse Chuck Taylor",
        image: "/images/products/converse1.jpg",
        price: 750000,
        size: 41,
        color: "#1a1a1a",
        qty: 1,
      },
    ],
  },
  {
    orderNumber: "SL-3047657",
    userKey: "demo",
    addressIdx: 2,
    status: "PENDING",
    subtotal: 750000,
    shippingCost: 15000,
    discount: 0,
    total: 765000,
    courier: "jne",
    courierEta: "2-3 hari",
    paymentMethod: "transfer",
    items: [
      {
        productSlug: "converse-chuck-taylor",
        name: "Converse Chuck Taylor",
        image: "/images/products/converse1.jpg",
        price: 750000,
        size: 40,
        color: "#1a1a1a",
        qty: 1,
      },
    ],
  },
  {
    orderNumber: "SL-5102554",
    userKey: "demo",
    addressIdx: 3,
    status: "PAID",
    subtotal: 750000,
    shippingCost: 15000,
    discount: 0,
    total: 765000,
    courier: "jne",
    courierEta: "2-3 hari",
    paymentMethod: "ewallet",
    items: [
      {
        productSlug: "converse-chuck-taylor",
        name: "Converse Chuck Taylor",
        image: "/images/products/converse1.jpg",
        price: 750000,
        size: 40,
        color: "#1a1a1a",
        qty: 1,
      },
    ],
  },
  {
    orderNumber: "SL-4614371",
    userKey: "demo",
    addressIdx: 4,
    status: "PAID",
    subtotal: 750000,
    shippingCost: 12000,
    discount: 0,
    total: 762000,
    courier: "jnt",
    courierEta: "2-3 hari",
    paymentMethod: "card",
    items: [
      {
        productSlug: "converse-chuck-taylor",
        name: "Converse Chuck Taylor",
        image: "/images/products/converse1.jpg",
        price: 750000,
        size: 40,
        color: "#1a1a1a",
        qty: 1,
      },
    ],
  },
  {
    orderNumber: "SL-8672372",
    userKey: "demo",
    addressIdx: 5,
    status: "PAID",
    subtotal: 750000,
    shippingCost: 15000,
    discount: 0,
    total: 765000,
    courier: "jne",
    courierEta: "2-3 hari",
    paymentMethod: "ewallet",
    items: [
      {
        productSlug: "converse-chuck-taylor",
        name: "Converse Chuck Taylor",
        image: "/images/products/converse1.jpg",
        price: 750000,
        size: 40,
        color: "#1a1a1a",
        qty: 1,
      },
    ],
  },
  {
    orderNumber: "SL-2131025",
    userKey: "demo",
    addressIdx: 6,
    status: "SHIPPED",
    subtotal: 750000,
    shippingCost: 15000,
    discount: 0,
    total: 765000,
    courier: "jne",
    courierEta: "2-3 hari",
    paymentMethod: "ewallet",
    items: [
      {
        productSlug: "converse-chuck-taylor",
        name: "Converse Chuck Taylor",
        image: "/images/products/converse1.jpg",
        price: 750000,
        size: 40,
        color: "#1a1a1a",
        qty: 1,
      },
    ],
  },
  {
    orderNumber: "SL-6637438",
    userKey: "demo",
    addressIdx: 7,
    status: "PAID",
    subtotal: 750000,
    shippingCost: 15000,
    discount: 0,
    total: 765000,
    courier: "jne",
    courierEta: "2-3 hari",
    paymentMethod: "ewallet",
    items: [
      {
        productSlug: "converse-chuck-taylor",
        name: "Converse Chuck Taylor",
        image: "/images/products/converse1.jpg",
        price: 750000,
        size: 40,
        color: "#1a1a1a",
        qty: 1,
      },
    ],
  },
  {
    orderNumber: "SL-926847",
    userKey: "demo",
    addressIdx: 8,
    status: "PAID",
    subtotal: 750000,
    shippingCost: 15000,
    discount: 0,
    total: 765000,
    courier: "jne",
    courierEta: "2-3 hari",
    paymentMethod: "ewallet",
    items: [
      {
        productSlug: "converse-chuck-taylor",
        name: "Converse Chuck Taylor",
        image: "/images/products/converse1.jpg",
        price: 750000,
        size: 40,
        color: "#1a1a1a",
        qty: 1,
      },
    ],
  },
  {
    orderNumber: "SL-5431936",
    userKey: "demo",
    addressIdx: 9,
    status: "DELIVERED",
    subtotal: 750000,
    shippingCost: 15000,
    discount: 0,
    total: 765000,
    courier: "jne",
    courierEta: "2-3 hari",
    paymentMethod: "ewallet",
    items: [
      {
        productSlug: "converse-chuck-taylor",
        name: "Converse Chuck Taylor",
        image: "/images/products/converse1.jpg",
        price: 750000,
        size: 40,
        color: "#1a1a1a",
        qty: 1,
      },
    ],
  },
];

async function main() {
  console.log("Seeding database...");

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "order_items", "orders", "reviews", "cart_items", "wishlists",
      "product_tags", "product_sizes", "product_colors", "product_images",
      "products", "addresses", "users", "brands", "categories", "promo_codes"
    RESTART IDENTITY CASCADE;
  `);
  console.log("All tables truncated");

  const brandMap = {};
  for (const b of brands) {
    const created = await prisma.brand.create({ data: b });
    brandMap[b.name] = created.id;
  }
  console.log(`${brands.length} brands created`);

  const catMap = {};
  for (const c of categories) {
    const created = await prisma.category.create({ data: c });
    catMap[c.slug] = created.id;
  }
  console.log(`${categories.length} categories created`);

  const productIds = [];
  for (const p of products) {
    const stockPerSize = Math.max(1, Math.floor(p.stock / p.sizes.length));
    const created = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        stock: p.stock,
        rating: p.rating,
        reviewCount: p.reviewCount,
        isNew: p.isNew,
        isBestSeller: p.isBestSeller,
        brandId: brandMap[p.brand],
        categoryId: catMap[p.category],
        images: {
          create: p.images.map((url, i) => ({
            url,
            isPrimary: i === 0,
            sortOrder: i,
          })),
        },
        colors: {
          create: p.colors.map((hex) => ({
            name: colorMap[hex] || hex,
            hexValue: hex,
          })),
        },
        sizes: {
          create: p.sizes.map((size) => ({ size, stock: stockPerSize })),
        },
        tags: { create: (p.tags || []).map((tag) => ({ tag })) },
      },
    });
    productIds.push(created.id);
  }
  console.log(`âœ… ${products.length} products created`);

  const pw = await bcrypt.hash("password123", 12);
  const demoUser = await prisma.user.create({
    data: {
      email: "demo@stepluxe.id",
      password: pw,
      firstName: "John",
      lastName: "Doe",
      phone: "08123456789",
      role: "CUSTOMER",
    },
  });
  const demoUserId = demoUser.id;

  const adminPw = await bcrypt.hash("admin123", 12);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@stepluxe.id",
      password: adminPw,
      firstName: "Admin",
      lastName: "StepLuxe",
      phone: "08199999999",
      role: "ADMIN",
    },
  });
  const adminUserId = adminUser.id;
  console.log(
    "Demo user (demo@stepluxe.id / password123) & admin (admin@stepluxe.id / admin123) created",
  );

  const buyerPw = await bcrypt.hash("password123", 10);
  const buyerIds = [];
  for (let i = 0; i < buyerUsers.length; i++) {
    const u = buyerUsers[i];
    const email = `buyer_${i + 1}@stepluxe.id`;
    const created = await prisma.user.create({
      data: {
        email,
        password: buyerPw,
        firstName: u.firstName,
        lastName: u.lastName,
        role: "CUSTOMER",
      },
    });
    buyerIds.push(created.id);
  }
  console.log(`âœ… ${buyerUsers.length} buyer dummy users created`);

  for (const productId of productIds) {
    const targetProduct = products[productIds.indexOf(productId)];
    const targetCount = targetProduct.reviewCount;

    const shuffled = [...buyerIds].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(targetCount, buyerIds.length));

    for (const userId of selected) {
      const r = Math.random();
      const rating = r > 0.35 ? 5 : r > 0.08 ? 4 : 3;
      await prisma.review.create({
        data: { productId, userId, rating, comment: "" },
      });
    }

    const allReviews = await prisma.review.findMany({ where: { productId } });
    const avgRating =
      allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length,
      },
    });
  }
  console.log(`âœ… Reviews seeded for all ${productIds.length} products`);

  await prisma.promoCode.create({
    data: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: 10,
      minPurchase: 500000,
      maxDiscount: 200000,
      usageLimit: 100,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2026-12-31"),
    },
  });
  await prisma.promoCode.create({
    data: {
      code: "DISKON50K",
      type: "FIXED",
      value: 50000,
      minPurchase: 300000,
      maxDiscount: null,
      usageLimit: 200,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2026-12-31"),
    },
  });
  console.log("âœ… Promo codes created: WELCOME10, DISKON50K");

  const userIdMap = { demo: demoUserId, admin: adminUserId };
  const addressIds = [];
  for (const a of addressesSeed) {
    const created = await prisma.address.create({
      data: {
        userId: userIdMap[a.userKey],
        name: a.name,
        phone: a.phone,
        address: a.address,
        city: a.city,
        zipCode: a.zipCode,
      },
    });
    addressIds.push(created.id);
  }
  console.log(`âœ… ${addressIds.length} addresses created`);

  const allProducts = await prisma.product.findMany({
    select: { id: true, slug: true },
  });
  const productSlugMap = {};
  for (const prod of allProducts) productSlugMap[prod.slug] = prod.id;

  for (const o of ordersSeed) {
    const order = await prisma.order.create({
      data: {
        orderNumber: o.orderNumber,
        userId: userIdMap[o.userKey],
        addressId: addressIds[o.addressIdx],
        status: o.status,
        subtotal: o.subtotal,
        shippingCost: o.shippingCost,
        discount: o.discount,
        total: o.total,
        courier: o.courier,
        courierEta: o.courierEta,
        paymentMethod: o.paymentMethod,
        items: {
          create: o.items.map((item) => ({
            productId: productSlugMap[item.productSlug],
            name: item.name,
            image: item.image,
            price: item.price,
            size: item.size,
            color: item.color,
            qty: item.qty,
          })),
        },
      },
    });
  }
  console.log(`${ordersSeed.length} orders + order items created`);

  console.log("\nSeeding selesai! Database siap dipakai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
