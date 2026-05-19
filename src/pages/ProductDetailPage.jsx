import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ChevronLeft, Truck, Shield, RotateCcw, Share2 } from 'lucide-react';
import { products, reviews } from '../data/products';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useUIStore } from '../store/uiStore';
import { formatCurrency, calcDiscount } from '../utils/helpers';
import SizeSelector from '../components/common/SizeSelector';
import ColorSelector from '../components/common/ColorSelector';
import QuantitySelector from '../components/common/QuantitySelector';
import Rating from '../components/common/Rating';
import Badge from '../components/common/Badge';
import Breadcrumb from '../components/common/Breadcrumb';
import ProductCard from '../components/product/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === Number(id));
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const addItem = useCartStore(s => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const showToast = useUIStore(s => s.showToast);

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">👟</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Produk tidak ditemukan</h2>
        <Link to="/shop" className="btn-primary">Kembali ke Toko</Link>
      </div>
    </div>
  );

  const discount = calcDiscount(product.price, product.originalPrice);
  const wishlisted = isWishlisted(product.id);
  const productReviews = reviews.filter(r => r.productId === product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddCart = () => {
    if (!selectedSize) { showToast('Pilih ukuran terlebih dahulu!', 'warning'); return; }
    addItem(product, selectedSize, selectedColor, qty);
    showToast(`${product.name} (Uk. ${selectedSize}) ditambahkan ke keranjang! 🛒`, 'success');
  };

  const handleBuyNow = () => {
    if (!selectedSize) { showToast('Pilih ukuran terlebih dahulu!', 'warning'); return; }
    addItem(product, selectedSize, selectedColor, qty);
    navigate('/cart');
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

          <div className="flex items-center gap-4 mb-4">
            <Rating value={product.rating} showValue />
            <span className="text-sm text-gray-400">({product.reviewCount} ulasan)</span>
            {product.stock <= 10 && (
              <Badge variant="sale">Stok: {product.stock}</Badge>
            )}
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-brand">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="ml-3 text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Color */}
          <div className="mb-5">
            <p className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Warna</p>
            <ColorSelector colors={product.colors} selected={selectedColor} onChange={setSelectedColor} />
          </div>

          {/* Size */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Ukuran</p>
              <button className="text-xs text-brand hover:underline">Panduan Ukuran</button>
            </div>
            <SizeSelector sizes={product.sizes} selected={selectedSize} onChange={setSelectedSize} />
            {!selectedSize && <p className="text-xs text-amber-500 mt-2">* Pilih ukuran</p>}
          </div>

          {/* Qty */}
          <div className="flex items-center gap-4 mb-6">
            <p className="font-semibold text-gray-900 dark:text-white text-sm">Jumlah</p>
            <QuantitySelector value={qty} max={product.stock} onChange={setQty} />
          </div>

          {/* CTA */}
          <div className="flex gap-3 mb-6">
            <button onClick={handleAddCart} className="btn-outline flex-1 flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Keranjang
            </button>
            <button onClick={handleBuyNow} className="btn-primary flex-1">
              Beli Sekarang
            </button>
            <button
              onClick={() => { toggle(product); showToast(wishlisted ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist ❤️', wishlisted ? 'info' : 'success'); }}
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

      {/* Reviews */}
      {productReviews.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ulasan Pelanggan</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {productReviews.map(r => (
              <div key={r.id} className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center font-bold text-brand text-sm">{r.avatar}</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{r.user}</p>
                    <p className="text-xs text-gray-400">{r.date}</p>
                  </div>
                  <div className="ml-auto"><Rating value={r.rating} showValue={false} /></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{r.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related */}
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
