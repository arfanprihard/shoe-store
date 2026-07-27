import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, Star } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency, calcDiscount } from '../../utils/helpers';
import Badge from '../common/Badge';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { toggle, isWishlisted } = useWishlistStore();
  const showToast = useUIStore(s => s.showToast);
  const user = useAuthStore(s => s.user);
  const wishlisted = isWishlisted(product.id);
  const discount = calcDiscount(product.price, product.originalPrice);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Silakan login terlebih dahulu untuk menyukai produk!', 'warning');
      navigate('/login');
      return;
    }
    toggle(product);
    showToast(
      wishlisted ? 'Dihapus dari wishlist' : `${product.name} ditambahkan ke wishlist ❤️`,
      wishlisted ? 'info' : 'success'
    );
  };

  return (
    <Link to={`/product/${product.slug || product.id}`} className="group block">
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
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            {product.isNew && <Badge variant="new">Baru</Badge>}
            {product.isBestSeller && <Badge variant="hot">🔥 Terlaris</Badge>}
            {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
          </div>
          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-xl transition-all duration-200 ${wishlisted ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-dark-card/90 text-gray-400 hover:text-red-500'}`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
          </button>
          {/* View Details CTA */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="w-full bg-brand text-white py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors">
              <Eye className="w-4 h-4" /> Lihat Detail Produk
            </div>
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
