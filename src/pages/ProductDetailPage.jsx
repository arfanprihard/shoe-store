import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ChevronLeft, Truck, Shield, RotateCcw, Share2, CheckCircle2, AlertCircle } from 'lucide-react';
import { reviews, getVariantStock } from '../data/products';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useUIStore } from '../store/uiStore';
import { formatCurrency, calcDiscount, formatColorName } from '../utils/helpers';
import SizeSelector from '../components/common/SizeSelector';
import ColorSelector from '../components/common/ColorSelector';
import QuantitySelector from '../components/common/QuantitySelector';
import Rating from '../components/common/Rating';
import Badge from '../components/common/Badge';
import Breadcrumb from '../components/common/Breadcrumb';
import ProductCard from '../components/product/ProductCard';
import { useAuthStore } from '../store/authStore';

export default function ProductDetailPage() {
  const products = useProductStore(s => s.products);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  const product = products.find(p => p.slug === slug || String(p.id) === String(slug));

  // Default color & size initialization
  const initialColor = product?.colors[0] || null;

  // Find first size for initial color that has stock > 0, otherwise default to first size
  const initialSize = useMemo(() => {
    if (!product || !initialColor) return null;
    const available = product.sizes.find(s => getVariantStock(product, initialColor, s) > 0);
    return available || product.sizes[0];
  }, [product, initialColor]);

  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const REVIEWS_LIMIT = 6;

  const addItem = useCartStore(s => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const showToast = useUIStore(s => s.showToast);
  const user = useAuthStore(s => s.user);

  // Compute disabled sizes for selected color (Sizes with 0 stock)
  const outOfStockSizes = useMemo(() => {
    if (!product || !selectedColor) return [];
    return product.sizes.filter(size => getVariantStock(product, selectedColor, size) === 0);
  }, [product, selectedColor]);

  // Current stock for current color + size pair
  const currentVariantStock = useMemo(() => {
    if (!product || !selectedColor || !selectedSize) return 0;
    return getVariantStock(product, selectedColor, selectedSize);
  }, [product, selectedColor, selectedSize]);

  // Product reviews list (DB reviews or fallback mock reviews)
  const productReviews = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.reviews) && product.reviews.length > 0) {
      return product.reviews;
    }
    return reviews[product.id] || reviews[1] || [];
  }, [product]);

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">👟</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Produk tidak ditemukan</h2>
        <Link to="/shop" className="btn-primary">Kembali ke Toko</Link>
      </div>
    </div>
  );

  // Handle color change: switch color and auto-select available size if current size has 0 stock
  const handleColorChange = (newColor) => {
    setSelectedColor(newColor);
    const stockForCurrentSize = getVariantStock(product, newColor, selectedSize);
    if (stockForCurrentSize === 0) {
      const firstAvailSize = product.sizes.find(s => getVariantStock(product, newColor, s) > 0);
      if (firstAvailSize) setSelectedSize(firstAvailSize);
    }
  };

  const handleSizeChange = (newSize) => {
    setSelectedSize(newSize);
  };

  const discount = calcDiscount(product.price, product.originalPrice);
  const wishlisted = isWishlisted(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddCart = () => {
    if (!selectedSize) { showToast('Pilih ukuran terlebih dahulu!', 'warning'); return; }
    if (currentVariantStock === 0) { showToast('Stok varian ini sedang habis!', 'error'); return; }
    addItem(product, selectedSize, selectedColor, qty, currentVariantStock);
    showToast(`${product.name} (Uk. ${selectedSize}) ditambahkan ke keranjang! 🛒`, 'success');
  };

  const handleBuyNow = () => {
    if (!selectedSize) { showToast('Pilih ukuran terlebih dahulu!', 'warning'); return; }
    if (currentVariantStock === 0) { showToast('Stok varian ini sedang habis!', 'error'); return; }
    addItem(product, selectedSize, selectedColor, qty, currentVariantStock);
    navigate('/cart');
  };

  const handleWishlist = () => {
    if (!user) {
      showToast('Silakan login terlebih dahulu untuk menyukai produk!', 'warning');
      navigate('/login');
      return;
    }
    toggle(product);
    showToast(wishlisted ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist ❤️', wishlisted ? 'info' : 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Beranda', href: '/' },
        { label: 'Toko', href: '/shop' },
        { label: product.category, href: `/shop?category=${product.category}` },
        { label: product.name, href: '#' },
      ]} />

      <div className="mt-6 grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="relative rounded-3xl overflow-hidden bg-gray-50 dark:bg-dark-card aspect-square mb-4">
            <img
              src={product.images[activeImg] || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <div className="absolute top-4 left-4">
                <Badge variant="sale" className="text-sm px-3 py-1">-{discount}%</Badge>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? 'border-brand' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-brand font-semibold mb-1">{product.brand}</p>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <Rating value={product.rating} showValue />
            <span className="text-sm text-gray-400">({product.reviewCount} ulasan)</span>

            {/* Variant Stock Indicator Badge */}
            {currentVariantStock > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold rounded-lg text-xs border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Tersisa {currentVariantStock} pasang
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 font-bold rounded-lg text-xs border border-red-500/20">
                <AlertCircle className="w-3.5 h-3.5" /> Stok Habis untuk varian ini
              </span>
            )}
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-brand">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="ml-3 text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Color Selector */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Pilih Warna: <span className="font-normal text-brand dark:text-brand-light capitalize ml-1">{formatColorName(selectedColor)}</span></p>
            </div>
            <ColorSelector
              colors={product.colors}
              selected={selectedColor}
              onChange={handleColorChange}
            />
          </div>

          {/* Size Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Pilih Ukuran</p>
              <button className="text-xs text-brand hover:underline">Panduan Ukuran</button>
            </div>
            <SizeSelector
              sizes={product.sizes}
              selected={selectedSize}
              onChange={handleSizeChange}
              outOfStock={outOfStockSizes}
            />
            {!selectedSize && <p className="text-xs text-amber-500 mt-2">* Pilih ukuran</p>}
          </div>

          {/* Qty Selector */}
          <div className="flex items-center gap-4 mb-6">
            <p className="font-semibold text-gray-900 dark:text-white text-sm">Jumlah</p>
            <QuantitySelector
              value={qty}
              max={currentVariantStock > 0 ? currentVariantStock : 1}
              onChange={setQty}
              disabled={currentVariantStock === 0}
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddCart}
              disabled={currentVariantStock === 0}
              className={`btn-outline flex-1 flex items-center justify-center gap-2 ${
                currentVariantStock === 0 ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400' : ''
              }`}
            >
              <ShoppingCart className="w-5 h-5" /> Keranjang
            </button>
            <button
              onClick={handleBuyNow}
              disabled={currentVariantStock === 0}
              className={`btn-primary flex-1 ${
                currentVariantStock === 0 ? 'opacity-50 cursor-not-allowed bg-gray-400 border-gray-400' : ''
              }`}
            >
              {currentVariantStock > 0 ? 'Beli Sekarang' : 'Stok Habis'}
            </button>
            <button
              onClick={handleWishlist}
              className={`p-3 rounded-xl border-2 transition-all ${wishlisted ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-500' : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-red-500 hover:text-red-500'}`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-500' : ''}`} />
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, text: 'Gratis Ongkir' },
              { icon: Shield, text: '100% Original' },
              { icon: RotateCcw, text: '30 Hari Retur' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 dark:bg-dark-card rounded-xl text-center">
                <Icon className="w-5 h-5 text-brand" />
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ulasan Pelanggan</h2>
          <p className="text-xs text-gray-400 mt-1">Ulasan dari pembeli terverifikasi</p>
        </div>

        {productReviews.length > 0 ? (
          <div>
            <div className="grid md:grid-cols-2 gap-4">
              {(showAllReviews ? productReviews : productReviews.slice(0, REVIEWS_LIMIT)).map((r, idx) => (
                <div key={r.id || idx} className="card p-5 hover:border-brand/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm shadow-sm">
                      {r.avatar || (r.user ? r.user.charAt(0) : 'U')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{r.user || 'Pembeli'}</p>
                      <p className="text-xs text-gray-400">{r.date || 'Terbaru'}</p>
                    </div>
                    <div className="ml-auto"><Rating value={r.rating} showValue={false} /></div>
                  </div>
                </div>
              ))}
            </div>
            {productReviews.length > REVIEWS_LIMIT && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAllReviews(prev => !prev)}
                  className="px-6 py-2.5 rounded-xl border border-brand/30 text-brand text-sm font-semibold hover:bg-brand hover:text-white transition-all duration-200"
                >
                  {showAllReviews ? `Sembunyikan Ulasan` : `Lihat Semua Ulasan (${productReviews.length})`}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="card p-8 text-center bg-gray-50/50 dark:bg-dark-card/50">
            <Star className="w-10 h-10 text-amber-400/50 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Belum ada ulasan untuk produk ini</p>
            <p className="text-xs text-gray-400 mt-1">Ulasan akan muncul setelah pembeli memberikan penilaian dari paket yang telah diterima.</p>
          </div>
        )}
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Produk Terkait</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
