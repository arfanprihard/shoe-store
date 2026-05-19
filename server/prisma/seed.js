import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Converse', 'Vans', 'Reebok', 'Skechers'];

const categories = [
  { name: 'Sneakers', slug: 'sneakers', icon: '🏃' },
  { name: 'Running', slug: 'running', icon: '🎽' },
  { name: 'Formal', slug: 'formal', icon: '👔' },
  { name: 'Casual', slug: 'casual', icon: '😎' },
  { name: 'Sandals', slug: 'sandals', icon: '🩴' },
  { name: 'Boots', slug: 'boots', icon: '🥾' },
];

const colorMap = {
  '#1a1a1a': 'Hitam', '#ffffff': 'Putih', '#ef4444': 'Merah',
  '#3b82f6': 'Biru', '#6b7280': 'Abu-abu', '#92400e': 'Coklat',
  '#1e3a5f': 'Navy', '#16a34a': 'Hijau',
};

const img = {
  nike1: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  nike2: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80',
  adidas1: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
  adidas2: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
  puma1: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80',
  converse1: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=600&q=80',
  vans1: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
  nb1: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&q=80',
  boot1: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&q=80',
  formal1: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80',
};

const products = [
  { name: 'Nike Air Max 270', slug: 'nike-air-max-270', brand: 'Nike', category: 'sneakers', price: 1850000, originalPrice: 2200000, images: [img.nike1, img.nike2, img.adidas1], colors: ['#1a1a1a','#ffffff','#ef4444'], sizes: [38,39,40,41,42,43,44], rating: 4.8, reviewCount: 245, stock: 15, isNew: false, isBestSeller: true, description: 'Nike Air Max 270 menghadirkan kenyamanan maksimal dengan unit Air terbesar di tumit.', tags: ['trending','comfortable','lifestyle'] },
  { name: 'Adidas Ultraboost 22', slug: 'adidas-ultraboost-22', brand: 'Adidas', category: 'running', price: 2100000, originalPrice: 2600000, images: [img.adidas1, img.adidas2], colors: ['#1a1a1a','#3b82f6','#ffffff'], sizes: [39,40,41,42,43,44,45], rating: 4.9, reviewCount: 312, stock: 8, isNew: false, isBestSeller: true, description: 'Adidas Ultraboost 22 adalah sepatu lari performa tinggi dengan teknologi Boost.', tags: ['running','performance','boost'] },
  { name: 'Nike Air Force 1', slug: 'nike-air-force-1', brand: 'Nike', category: 'sneakers', price: 1450000, originalPrice: null, images: [img.nike2, img.nike1], colors: ['#ffffff','#1a1a1a'], sizes: [36,37,38,39,40,41,42,43,44,45], rating: 4.7, reviewCount: 189, stock: 24, isNew: false, isBestSeller: true, description: 'Ikon abadi fashion street style.', tags: ['classic','streetwear','iconic'] },
  { name: 'Adidas Stan Smith', slug: 'adidas-stan-smith', brand: 'Adidas', category: 'casual', price: 950000, originalPrice: 1200000, images: [img.adidas2, img.adidas1], colors: ['#ffffff','#16a34a'], sizes: [37,38,39,40,41,42,43], rating: 4.6, reviewCount: 421, stock: 30, isNew: false, isBestSeller: false, description: 'Stan Smith adalah simbol kesederhanaan dan keeleganan.', tags: ['classic','minimalist'] },
  { name: 'Puma RS-X Toys', slug: 'puma-rsx-toys', brand: 'Puma', category: 'sneakers', price: 1150000, originalPrice: 1350000, images: [img.puma1], colors: ['#ffffff','#ef4444','#3b82f6'], sizes: [38,39,40,41,42,43,44], rating: 4.5, reviewCount: 98, stock: 12, isNew: true, isBestSeller: false, description: 'Puma RS-X Toys terinspirasi dari desain sneaker era 80an.', tags: ['chunky','retro'] },
  { name: 'Converse Chuck Taylor', slug: 'converse-chuck-taylor', brand: 'Converse', category: 'casual', price: 750000, originalPrice: null, images: [img.converse1], colors: ['#1a1a1a','#ffffff','#ef4444','#3b82f6'], sizes: [36,37,38,39,40,41,42,43,44,45], rating: 4.7, reviewCount: 658, stock: 50, isNew: false, isBestSeller: true, description: 'Chuck Taylor All Star sepatu kanvas ikonik.', tags: ['classic','canvas'] },
  { name: 'Vans Old Skool', slug: 'vans-old-skool', brand: 'Vans', category: 'casual', price: 850000, originalPrice: null, images: [img.vans1], colors: ['#1a1a1a','#6b7280','#ef4444'], sizes: [37,38,39,40,41,42,43,44], rating: 4.8, reviewCount: 502, stock: 22, isNew: false, isBestSeller: false, description: 'Vans Old Skool pilihan favorit para skater.', tags: ['skate','streetwear'] },
  { name: 'New Balance 574', slug: 'new-balance-574', brand: 'New Balance', category: 'casual', price: 1250000, originalPrice: 1500000, images: [img.nb1], colors: ['#6b7280','#1e3a5f','#92400e'], sizes: [39,40,41,42,43,44,45], rating: 4.6, reviewCount: 167, stock: 18, isNew: false, isBestSeller: false, description: 'Desain retro 80an dengan teknologi ENCAP modern.', tags: ['retro','comfortable'] },
  { name: 'Nike React Infinity Run', slug: 'nike-react-infinity', brand: 'Nike', category: 'running', price: 1950000, originalPrice: 2300000, images: [img.nike1, img.nike2], colors: ['#1a1a1a','#ef4444'], sizes: [38,39,40,41,42,43,44,45], rating: 4.7, reviewCount: 143, stock: 10, isNew: true, isBestSeller: false, description: 'Dirancang untuk mengurangi risiko cedera saat lari.', tags: ['running','performance'] },
  { name: 'Adidas Forum Low', slug: 'adidas-forum-low', brand: 'Adidas', category: 'sneakers', price: 1100000, originalPrice: null, images: [img.adidas1, img.adidas2], colors: ['#ffffff','#1a1a1a'], sizes: [37,38,39,40,41,42,43,44], rating: 4.5, reviewCount: 89, stock: 16, isNew: true, isBestSeller: false, description: 'Desain basketball klasik yang dimodernisasi.', tags: ['basketball','retro'] },
  { name: 'Dr. Martens 1460', slug: 'dr-martens-1460', brand: 'Reebok', category: 'boots', price: 2500000, originalPrice: 2800000, images: [img.boot1], colors: ['#1a1a1a','#92400e'], sizes: [37,38,39,40,41,42,43,44,45], rating: 4.9, reviewCount: 278, stock: 9, isNew: false, isBestSeller: false, description: 'Boots 8-lubang ikonik dengan sol AirWair.', tags: ['boots','durable'] },
  { name: 'Skechers GO Walk 6', slug: 'skechers-go-walk-6', brand: 'Skechers', category: 'casual', price: 650000, originalPrice: 850000, images: [img.vans1], colors: ['#1a1a1a','#6b7280','#1e3a5f'], sizes: [36,37,38,39,40,41,42,43,44,45], rating: 4.4, reviewCount: 334, stock: 40, isNew: false, isBestSeller: false, description: 'Kenyamanan berjalan sepanjang hari.', tags: ['walking','comfortable'] },
  { name: 'Nike Jordan 1 Retro', slug: 'nike-jordan-1-retro', brand: 'Nike', category: 'sneakers', price: 3200000, originalPrice: 3800000, images: [img.nike2, img.nike1], colors: ['#ef4444','#1a1a1a','#ffffff'], sizes: [40,41,42,43,44,45], rating: 4.9, reviewCount: 892, stock: 4, isNew: false, isBestSeller: true, description: 'Air Jordan 1 Retro High OG sepatu basket ikonik.', tags: ['basketball','iconic','premium'] },
  { name: 'Adidas Yeezy Boost 350', slug: 'adidas-yeezy-350', brand: 'Adidas', category: 'sneakers', price: 3500000, originalPrice: 4200000, images: [img.adidas2], colors: ['#6b7280','#1a1a1a','#92400e'], sizes: [39,40,41,42,43,44], rating: 4.8, reviewCount: 567, stock: 3, isNew: false, isBestSeller: true, description: 'Yeezy Boost 350 V2 dengan upper Primeknit.', tags: ['yeezy','premium','limited'] },
  { name: 'Formal Oxford Brogue', slug: 'formal-oxford-brogue', brand: 'Skechers', category: 'formal', price: 850000, originalPrice: 1050000, images: [img.formal1], colors: ['#1a1a1a','#92400e'], sizes: [38,39,40,41,42,43,44,45], rating: 4.5, reviewCount: 67, stock: 20, isNew: false, isBestSeller: false, description: 'Oxford Brogue klasik dari kulit asli.', tags: ['formal','oxford'] },
  { name: 'Adidas NMD R1', slug: 'adidas-nmd-r1', brand: 'Adidas', category: 'running', price: 1750000, originalPrice: 2000000, images: [img.adidas2, img.adidas1], colors: ['#1a1a1a','#ffffff','#ef4444'], sizes: [39,40,41,42,43,44,45], rating: 4.6, reviewCount: 176, stock: 11, isNew: false, isBestSeller: true, description: 'Teknologi Boost dengan desain urban modern.', tags: ['boost','urban'] },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Clear all
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.productColor.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.promoCode.deleteMany();

  // Create brands
  const brandMap = {};
  for (const name of brands) {
    const b = await prisma.brand.create({ data: { name, slug: name.toLowerCase().replace(/\s+/g, '-') } });
    brandMap[name] = b.id;
  }
  console.log(`✅ ${brands.length} brands created`);

  // Create categories
  const catMap = {};
  for (const cat of categories) {
    const c = await prisma.category.create({ data: cat });
    catMap[cat.slug] = c.id;
  }
  console.log(`✅ ${categories.length} categories created`);

  // Create products
  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name, slug: p.slug, description: p.description,
        price: p.price, originalPrice: p.originalPrice, stock: p.stock,
        rating: p.rating, reviewCount: p.reviewCount,
        isNew: p.isNew, isBestSeller: p.isBestSeller,
        brandId: brandMap[p.brand], categoryId: catMap[p.category],
        images: { create: p.images.map((url, i) => ({ url, isPrimary: i === 0, sortOrder: i })) },
        colors: { create: p.colors.map(hex => ({ name: colorMap[hex] || hex, hexValue: hex })) },
        sizes: { create: p.sizes.map(size => ({ size, stock: Math.floor(p.stock / p.sizes.length) + 1 })) },
        tags: { create: (p.tags || []).map(tag => ({ tag })) },
      },
    });
  }
  console.log(`✅ ${products.length} products created`);

  // Create demo user
  const pw = await bcrypt.hash('password123', 12);
  await prisma.user.create({
    data: { email: 'demo@stepluxe.id', password: pw, firstName: 'John', lastName: 'Doe', phone: '08123456789', role: 'CUSTOMER' },
  });
  console.log('✅ Demo user created (demo@stepluxe.id / password123)');

  // Create admin user
  const adminPw = await bcrypt.hash('admin123', 12);
  await prisma.user.create({
    data: { email: 'admin@stepluxe.id', password: adminPw, firstName: 'Admin', lastName: 'StepLuxe', phone: '08199999999', role: 'ADMIN' },
  });
  console.log('✅ Admin user created (admin@stepluxe.id / admin123)');

  // Create promo code
  await prisma.promoCode.create({
    data: {
      code: 'WELCOME10', type: 'PERCENTAGE', value: 10,
      minPurchase: 500000, maxDiscount: 200000, usageLimit: 100,
      startDate: new Date('2024-01-01'), endDate: new Date('2026-12-31'),
    },
  });
  console.log('✅ Promo code WELCOME10 created');

  console.log('\n🎉 Seeding completed!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
