export const categories = [
  { id: 'all', name: 'Semua', icon: '👟' },
  { id: 'sneakers', name: 'Sneakers', icon: '🏃' },
  { id: 'running', name: 'Running', icon: '🎽' },
  { id: 'formal', name: 'Formal', icon: '👔' },
  { id: 'casual', name: 'Casual', icon: '😎' },
  { id: 'sandals', name: 'Sandals', icon: '🩴' },
  { id: 'boots', name: 'Boots', icon: '🥾' },
];

export const brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Converse', 'Vans', 'Reebok', 'Skechers'];

export const sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

export const colors = [
  { name: 'Hitam', value: '#1a1a1a' },
  { name: 'Putih', value: '#ffffff' },
  { name: 'Merah', value: '#ef4444' },
  { name: 'Biru', value: '#3b82f6' },
  { name: 'Abu-abu', value: '#6b7280' },
  { name: 'Coklat', value: '#92400e' },
  { name: 'Navy', value: '#1e3a5f' },
  { name: 'Hijau', value: '#16a34a' },
];

const shoeImages = {
  nike1: '/images/products/nike1.jpg',
  nike2: '/images/products/nike2.jpg',
  adidas1: '/images/products/adidas1.jpg',
  adidas2: '/images/products/adidas2.jpg',
  puma1: '/images/products/puma1.jpg',
  converse1: '/images/products/converse1.jpg',
  vans1: '/images/products/vans1.jpg',
  nb1: '/images/products/nb1.jpg',
  boot1: '/images/products/boot1.jpg',
  formal1: '/images/products/formal1.jpg',
};

export const getVariantStock = (product, colorHexOrName, size) => {
  if (!product || !colorHexOrName || !size) return 0;
  if (!product.variants) return Math.max(0, product.stock !== undefined ? product.stock : 5);

  const strColor = colorHexOrName.toString().toLowerCase().trim();
  const strSize = size.toString();
  const key = `${strColor}_${strSize}`;

  if (product.variants[key] !== undefined) {
    return Number(product.variants[key]);
  }

  // Fallback search if color name was passed instead of hex
  if (product.colors && Array.isArray(product.colors)) {
    const foundColorObj = product.colors.find(c => {
      const hex = (c.hexValue || c).toString().toLowerCase();
      const name = (c.name || c).toString().toLowerCase();
      return hex === strColor || name === strColor;
    });
    if (foundColorObj) {
      const cHex = (foundColorObj.hexValue || foundColorObj).toString().toLowerCase();
      const altKey = `${cHex}_${strSize}`;
      if (product.variants[altKey] !== undefined) return Number(product.variants[altKey]);
    }
  }

  return Math.max(0, product.stock !== undefined ? product.stock : 5);
};

export const decrementProductStock = (productId, colorHex, size, qty) => {
  const p = products.find(prod => prod.id === Number(productId));
  if (!p) return;

  // Decrement overall product stock
  p.stock = Math.max(0, (p.stock || 0) - Number(qty));

  // Initialize variants object if needed
  if (!p.variants) {
    p.variants = {};
  }
  const key = `${colorHex}_${size}`;
  const currentVariantStock = getVariantStock(p, colorHex, size);
  p.variants[key] = Math.max(0, currentVariantStock - Number(qty));
};

export const addProductToStore = (newProd) => {
  if (!newProd || !newProd.id) return;
  const existingIdx = products.findIndex(p => p.id === Number(newProd.id));
  if (existingIdx >= 0) {
    products[existingIdx] = { ...products[existingIdx], ...newProd };
  } else {
    products.unshift(newProd);
  }
};

export const products = [
  {
    id: 1, name: 'Nike Air Max 270', brand: 'Nike', category: 'sneakers',
    price: 1850000, originalPrice: 2200000,
    image: shoeImages.nike1,
    images: [shoeImages.nike1, shoeImages.nike2, shoeImages.adidas1],
    colors: ['#ef4444', '#1a1a1a', '#ffffff'],
    sizes: [38,39,40,41,42,43,44],
    rating: 4.8, reviewCount: 245, stock: 15,
    isNew: false, isBestSeller: true,
    variants: {
      '#ef4444_40': 2, // Warna Merah, Ukuran 40 -> 2 Stok
      '#ef4444_41': 1, // Warna Merah, Ukuran 41 -> 1 Stok
      '#1a1a1a_42': 5, // Warna Hitam, Ukuran 42 -> 5 Stok
      '#1a1a1a_43': 3, // Warna Hitam, Ukuran 43 -> 3 Stok
      '#ffffff_39': 4, // Warna Putih, Ukuran 39 -> 4 Stok
      '#ffffff_40': 2, // Warna Putih, Ukuran 40 -> 2 Stok
    },
    description: 'Nike Air Max 270 menghadirkan kenyamanan maksimal dengan unit Air terbesar di tumit. Desain modern dan ringan untuk aktivitas harian maupun olahraga kasual.',
    tags: ['trending', 'comfortable', 'lifestyle'],
  },
  {
    id: 2, name: 'Adidas Ultraboost 22', brand: 'Adidas', category: 'running',
    price: 2100000, originalPrice: 2600000,
    image: shoeImages.adidas1,
    images: [shoeImages.adidas1, shoeImages.adidas2],
    colors: ['#1a1a1a', '#3b82f6', '#ffffff'],
    sizes: [39,40,41,42,43,44,45],
    rating: 4.9, reviewCount: 312, stock: 8,
    isNew: false, isBestSeller: true,
    description: 'Adidas Ultraboost 22 adalah sepatu lari performa tinggi dengan teknologi Boost yang memberikan energi balik luar biasa di setiap langkah.',
    tags: ['running', 'performance', 'boost'],
  },
  {
    id: 3, name: 'Nike Air Force 1', brand: 'Nike', category: 'sneakers',
    price: 1450000, originalPrice: null,
    image: shoeImages.nike2,
    images: [shoeImages.nike2, shoeImages.nike1],
    colors: ['#ffffff', '#1a1a1a'],
    sizes: [36,37,38,39,40,41,42,43,44,45],
    rating: 4.7, reviewCount: 189, stock: 24,
    isNew: false, isBestSeller: true,
    description: 'Ikon abadi fashion street style. Nike Air Force 1 hadir dengan upper kulit premium dan sol udara yang telah diuji selama puluhan tahun.',
    tags: ['classic', 'streetwear', 'iconic'],
  },
  {
    id: 4, name: 'Adidas Stan Smith', brand: 'Adidas', category: 'casual',
    price: 950000, originalPrice: 1200000,
    image: shoeImages.adidas2,
    images: [shoeImages.adidas2, shoeImages.adidas1],
    colors: ['#ffffff', '#16a34a'],
    sizes: [37,38,39,40,41,42,43],
    rating: 4.6, reviewCount: 421, stock: 30,
    isNew: false, isBestSeller: false,
    description: 'Stan Smith adalah simbol kesederhanaan dan keeleganan. Sepatu tenis klasik yang telah menjadi bagian dari budaya pop selama dekade.',
    tags: ['classic', 'minimalist', 'tennis'],
  },
  {
    id: 5, name: 'Puma RS-X Toys', brand: 'Puma', category: 'sneakers',
    price: 1150000, originalPrice: 1350000,
    image: shoeImages.puma1,
    images: [shoeImages.puma1],
    colors: ['#ffffff', '#ef4444', '#3b82f6'],
    sizes: [38,39,40,41,42,43,44],
    rating: 4.5, reviewCount: 98, stock: 12,
    isNew: true, isBestSeller: false,
    description: 'Puma RS-X Toys terinspirasi dari desain sneaker era 80an dengan sentuhan warna cerah yang berani dan chunky sole yang ikonik.',
    tags: ['chunky', 'colorful', 'retro'],
  },
  {
    id: 6, name: 'Converse Chuck Taylor All Star', brand: 'Converse', category: 'casual',
    price: 750000, originalPrice: null,
    image: shoeImages.converse1,
    images: [shoeImages.converse1],
    colors: ['#1a1a1a', '#ffffff', '#ef4444', '#3b82f6'],
    sizes: [36,37,38,39,40,41,42,43,44,45],
    rating: 4.7, reviewCount: 658, stock: 50,
    isNew: false, isBestSeller: true,
    description: 'Chuck Taylor All Star adalah sepatu kanvas ikonik yang telah menemani generasi demi generasi. Simpel, timeless, dan cocok dengan semua outfit.',
    tags: ['classic', 'canvas', 'versatile'],
  },
  {
    id: 7, name: 'Vans Old Skool', brand: 'Vans', category: 'casual',
    price: 850000, originalPrice: null,
    image: shoeImages.vans1,
    images: [shoeImages.vans1],
    colors: ['#1a1a1a', '#6b7280', '#ef4444'],
    sizes: [37,38,39,40,41,42,43,44],
    rating: 4.8, reviewCount: 502, stock: 22,
    isNew: false, isBestSeller: false,
    description: 'Vans Old Skool dengan side stripe ikonik adalah pilihan favorit para skater dan pecinta streetwear sejak 1977.',
    tags: ['skate', 'streetwear', 'classic'],
  },
  {
    id: 8, name: 'New Balance 574', brand: 'New Balance', category: 'casual',
    price: 1250000, originalPrice: 1500000,
    image: shoeImages.nb1,
    images: [shoeImages.nb1],
    colors: ['#6b7280', '#1e3a5f', '#92400e'],
    sizes: [39,40,41,42,43,44,45],
    rating: 4.6, reviewCount: 167, stock: 18,
    isNew: false, isBestSeller: false,
    description: 'New Balance 574 menggabungkan desain retro 80an dengan teknologi ENCAP modern untuk kenyamanan sepanjang hari.',
    tags: ['retro', 'comfortable', 'lifestyle'],
  },
  {
    id: 9, name: 'Nike React Infinity Run', brand: 'Nike', category: 'running',
    price: 1950000, originalPrice: 2300000,
    image: shoeImages.nike1,
    images: [shoeImages.nike1, shoeImages.nike2],
    colors: ['#1a1a1a', '#ef4444'],
    sizes: [38,39,40,41,42,43,44,45],
    rating: 4.7, reviewCount: 143, stock: 10,
    isNew: true, isBestSeller: false,
    description: 'Nike React Infinity Run dirancang untuk membantu mengurangi risiko cedera sambil memberikan kenyamanan sepanjang jarak lari.',
    tags: ['running', 'injury-prevention', 'performance'],
  },
  {
    id: 10, name: 'Adidas Forum Low', brand: 'Adidas', category: 'sneakers',
    price: 1100000, originalPrice: null,
    image: shoeImages.adidas1,
    images: [shoeImages.adidas1, shoeImages.adidas2],
    colors: ['#ffffff', '#1a1a1a'],
    sizes: [37,38,39,40,41,42,43,44],
    rating: 4.5, reviewCount: 89, stock: 16,
    isNew: true, isBestSeller: false,
    description: 'Adidas Forum Low hadir kembali dengan desain basketball klasik yang dimodernisasi. Strap ankle ikonik dengan material premium.',
    tags: ['basketball', 'retro', 'lifestyle'],
  },
  {
    id: 11, name: 'Dr. Martens 1460', brand: 'Reebok', category: 'boots',
    price: 2500000, originalPrice: 2800000,
    image: shoeImages.boot1,
    images: [shoeImages.boot1],
    colors: ['#1a1a1a', '#92400e'],
    sizes: [37,38,39,40,41,42,43,44,45],
    rating: 4.9, reviewCount: 278, stock: 9,
    isNew: false, isBestSeller: false,
    description: 'Boots 8-lubang ikonik dengan sol AirWair bouncing yang legendaris. Dibuat dari kulit Smooth berkualitas tinggi yang semakin indah seiring waktu.',
    tags: ['boots', 'durable', 'punk', 'leather'],
  },
  {
    id: 12, name: 'Skechers GO Walk 6', brand: 'Skechers', category: 'casual',
    price: 650000, originalPrice: 850000,
    image: shoeImages.vans1,
    images: [shoeImages.vans1],
    colors: ['#1a1a1a', '#6b7280', '#1e3a5f'],
    sizes: [36,37,38,39,40,41,42,43,44,45],
    rating: 4.4, reviewCount: 334, stock: 40,
    isNew: false, isBestSeller: false,
    description: 'Skechers GO Walk 6 hadir dengan teknologi ULTRA GO dan MAXCUSHIONING untuk kenyamanan berjalan sepanjang hari tanpa rasa lelah.',
    tags: ['walking', 'comfortable', 'lightweight'],
  },
  {
    id: 13, name: 'Nike Blazer Mid 77', brand: 'Nike', category: 'sneakers',
    price: 1350000, originalPrice: 1600000,
    image: shoeImages.nike2,
    images: [shoeImages.nike2, shoeImages.nike1],
    colors: ['#ffffff', '#1a1a1a', '#ef4444'],
    sizes: [38,39,40,41,42,43,44],
    rating: 4.8, reviewCount: 203, stock: 14,
    isNew: false, isBestSeller: false,
    description: 'Nike Blazer Mid 77 Vintage membawa kembali estetika basketball tahun 70an dengan sentuhan retro yang timeless dan gaya yang tak lekang waktu.',
    tags: ['basketball', 'vintage', 'lifestyle'],
  },
  {
    id: 14, name: 'Adidas NMD R1', brand: 'Adidas', category: 'running',
    price: 1750000, originalPrice: 2000000,
    image: shoeImages.adidas2,
    images: [shoeImages.adidas2, shoeImages.adidas1],
    colors: ['#1a1a1a', '#ffffff', '#ef4444'],
    sizes: [39,40,41,42,43,44,45],
    rating: 4.6, reviewCount: 176, stock: 11,
    isNew: false, isBestSeller: true,
    description: 'Adidas NMD R1 menggabungkan teknologi Boost dengan elemen desain urban yang modern. Ringan, responsif, dan stylish untuk gaya hidup aktif.',
    tags: ['boost', 'urban', 'lifestyle'],
  },
  {
    id: 15, name: 'Formal Oxford Brogue', brand: 'Skechers', category: 'formal',
    price: 850000, originalPrice: 1050000,
    image: shoeImages.formal1,
    images: [shoeImages.formal1],
    colors: ['#1a1a1a', '#92400e'],
    sizes: [38,39,40,41,42,43,44,45],
    rating: 4.5, reviewCount: 67, stock: 20,
    isNew: false, isBestSeller: false,
    description: 'Oxford Brogue klasik dengan detail perforasi elegan. Dibuat dari kulit asli yang nyaman untuk dipakai seharian di kantor maupun acara formal.',
    tags: ['formal', 'oxford', 'leather', 'office'],
  },
  {
    id: 16, name: 'Puma Suede Classic', brand: 'Puma', category: 'casual',
    price: 900000, originalPrice: null,
    image: shoeImages.puma1,
    images: [shoeImages.puma1],
    colors: ['#1a1a1a', '#1e3a5f', '#ef4444'],
    sizes: [37,38,39,40,41,42,43,44],
    rating: 4.7, reviewCount: 298, stock: 25,
    isNew: false, isBestSeller: false,
    description: 'Puma Suede Classic telah menjadi ikon budaya sejak 1968. Dengan upper suede premium dan Formstrip ikonik, sepatu ini melampaui tren.',
    tags: ['suede', 'classic', 'streetwear'],
  },
  {
    id: 17, name: 'Nike Free Run 5.0', brand: 'Nike', category: 'running',
    price: 1550000, originalPrice: 1800000,
    image: shoeImages.nike1,
    images: [shoeImages.nike1],
    colors: ['#1a1a1a', '#ffffff', '#3b82f6'],
    sizes: [38,39,40,41,42,43,44],
    rating: 4.6, reviewCount: 122, stock: 17,
    isNew: true, isBestSeller: false,
    description: 'Nike Free Run 5.0 dengan sol fleksibel yang mengikuti gerakan alami kaki. Sempurna untuk lari kasual dan latihan gym.',
    tags: ['running', 'flexible', 'gym'],
  },
  {
    id: 18, name: 'Adidas Gazelle', brand: 'Adidas', category: 'casual',
    price: 1050000, originalPrice: null,
    image: shoeImages.adidas1,
    images: [shoeImages.adidas1],
    colors: ['#6b7280', '#1e3a5f', '#92400e'],
    sizes: [36,37,38,39,40,41,42,43],
    rating: 4.8, reviewCount: 387, stock: 19,
    isNew: false, isBestSeller: false,
    description: 'Adidas Gazelle adalah sepatu suede klasik yang telah menjadi pilihan fashion sejak 1968. Siluet bersih dengan 3-Stripes yang tidak pernah ketinggalan zaman.',
    tags: ['suede', 'classic', 'fashion'],
  },
  {
    id: 19, name: 'New Balance 990v5', brand: 'New Balance', category: 'running',
    price: 2850000, originalPrice: 3200000,
    image: shoeImages.nb1,
    images: [shoeImages.nb1],
    colors: ['#6b7280', '#1a1a1a'],
    sizes: [39,40,41,42,43,44,45],
    rating: 4.9, reviewCount: 145, stock: 6,
    isNew: false, isBestSeller: true,
    description: 'New Balance 990v5 adalah puncak dari engineering sepatu lari premium. Dibuat di USA dengan material ENCAP dan ABZORB terbaik.',
    tags: ['premium', 'made-in-usa', 'performance'],
  },
  {
    id: 20, name: 'Reebok Classic Leather', brand: 'Reebok', category: 'casual',
    price: 850000, originalPrice: 1000000,
    image: shoeImages.vans1,
    images: [shoeImages.vans1],
    colors: ['#ffffff', '#1a1a1a', '#6b7280'],
    sizes: [37,38,39,40,41,42,43,44],
    rating: 4.5, reviewCount: 213, stock: 28,
    isNew: false, isBestSeller: false,
    description: 'Reebok Classic Leather hadir dengan upper kulit premium dan sol EVA yang ringan. Desain clean dan minimalis yang pas untuk berbagai kesempatan.',
    tags: ['leather', 'classic', 'minimalist'],
  },
  {
    id: 21, name: 'Vans Slip-On', brand: 'Vans', category: 'casual',
    price: 650000, originalPrice: null,
    image: shoeImages.vans1,
    images: [shoeImages.vans1],
    colors: ['#1a1a1a', '#ffffff'],
    sizes: [36,37,38,39,40,41,42,43,44],
    rating: 4.7, reviewCount: 445, stock: 35,
    isNew: false, isBestSeller: true,
    description: 'Vans Slip-On klasik dengan elastic gores untuk kemudahan pemakaian. Kanvas ringan dan sol waffle ikonik yang sudah teruji sejak 1977.',
    tags: ['slip-on', 'casual', 'skate'],
  },
  {
    id: 22, name: 'Nike Jordan 1 Retro', brand: 'Nike', category: 'sneakers',
    price: 3200000, originalPrice: 3800000,
    image: shoeImages.nike2,
    images: [shoeImages.nike2, shoeImages.nike1],
    colors: ['#ef4444', '#1a1a1a', '#ffffff'],
    sizes: [40,41,42,43,44,45],
    rating: 4.9, reviewCount: 892, stock: 4,
    isNew: false, isBestSeller: true,
    description: 'Air Jordan 1 Retro High OG adalah sepatu basket ikonik yang melahirkan era sneaker culture. Desain abadi yang terus relevan hingga hari ini.',
    tags: ['basketball', 'iconic', 'premium', 'jordan'],
  },
  {
    id: 23, name: 'Adidas Yeezy Boost 350', brand: 'Adidas', category: 'sneakers',
    price: 3500000, originalPrice: 4200000,
    image: shoeImages.adidas2,
    images: [shoeImages.adidas2],
    colors: ['#6b7280', '#1a1a1a', '#92400e'],
    sizes: [39,40,41,42,43,44],
    rating: 4.8, reviewCount: 567, stock: 3,
    isNew: false, isBestSeller: true,
    description: 'Yeezy Boost 350 V2 dengan upper Primeknit yang mengikuti bentuk kaki dan teknologi Boost penuh untuk kenyamanan premium.',
    tags: ['yeezy', 'premium', 'boost', 'limited'],
  },
  {
    id: 24, name: 'Converse Run Star Hike', brand: 'Converse', category: 'sneakers',
    price: 1100000, originalPrice: 1300000,
    image: shoeImages.converse1,
    images: [shoeImages.converse1],
    colors: ['#1a1a1a', '#ffffff'],
    sizes: [37,38,39,40,41,42,43],
    rating: 4.6, reviewCount: 134, stock: 13,
    isNew: true, isBestSeller: false,
    description: 'Converse Run Star Hike membawa ulang silhouette Chuck Taylor klasik dengan platform chunky yang dramatis dan outsole bergerigi.',
    tags: ['platform', 'chunky', 'fashion'],
  },
];

export const reviews = [
  { id: 1, productId: 1, user: 'Ahmad R.', avatar: 'AR', rating: 5, comment: 'Sangat nyaman dipakai! Kualitas sesuai harga, pengiriman cepat. Recommended!', date: '2024-03-10', helpful: 24 },
  { id: 2, productId: 1, user: 'Sarah L.', avatar: 'SL', rating: 5, comment: 'Ukurannya pas sesuai size chart. Bahan premium, sol tebal dan empuk.', date: '2024-02-28', helpful: 18 },
  { id: 3, productId: 1, user: 'Budi S.', avatar: 'BS', rating: 4, comment: 'Bagus, tapi pengiriman agak lama. Overall puas dengan produknya.', date: '2024-02-15', helpful: 7 },
  { id: 4, productId: 2, user: 'Rina W.', avatar: 'RW', rating: 5, comment: 'Sepatu lari terbaik yang pernah saya pakai. Sangat ringan dan responsif!', date: '2024-03-05', helpful: 31 },
  { id: 5, productId: 2, user: 'Doni P.', avatar: 'DP', rating: 5, comment: 'Teknologi Boost benar-benar terasa. Cocok untuk marathon!', date: '2024-01-20', helpful: 22 },
];
