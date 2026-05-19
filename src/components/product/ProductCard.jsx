import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import { formatCurrency, calcDiscount } from '../../utils/helpers';
import Badge from '../common/Badge';

export default function ProductCard({ product }) {
  const { toggle, isWishlisted } = useWishlistStore();
  const addItem = useCartStore(s => s.addItem);
  const showToast = useUIStore(s => s.showToast);
  const wishlisted = isWishlisted(product.id);
  const discount = calcDiscount(product.price, product.originalPrice);

  const handleAddCart = (e) => {
    e.preventDefault();
    const defaultSize = product.sizes[Math.floor(product.sizes.length / 2)];
    const defaultColor = product.colors[0];
    addItem(product, defaultSize, defaultColor, 1);
    showToast(`${product.name} ditambahkan ke keranjang! 🛒`, 'success');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(product);
    showToast(
      wishlisted ? 'Dihapus dari wishlist' : `${product.name} ditambahkan ke wishlist ❤️`,
      wishlisted ? 'info' : 'success'
    );
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="card overflow-hidden">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50 dark:bg-dark-200">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && <Badge variant="new">Baru</Badge>}
            {product.isBestSeller && <Badge variant="hot">🔥 Terlaris</Badge>}
            {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
            {product.stock <= 5 && <Badge variant="sale">Stok Terbatas</Badge>}
          </div>
          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-xl transition-all duration-200 ${wishlisted ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-dark-card/90 text-gray-400 hover:text-red-500'}`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
          </button>
          {/* Quick add */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddCart}
              className="w-full bg-brand text-white py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors"
            >
              <ShoppingCart className="w-4 h-4" /> Tambah ke Keranjang
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{product.brand}</p>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-2 group-hover:text-brand transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-brand">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
