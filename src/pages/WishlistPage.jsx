import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import ProductCard from '../components/product/ProductCard';
import { Heart, ShoppingBag, LogIn } from 'lucide-react';

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const user = useAuthStore(s => s.user);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-8xl mb-6">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Login Diperlukan</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Silakan login ke akun Anda terlebih dahulu untuk melihat dan menyimpan produk ke dalam Wishlist favorit Anda.
        </p>
        <Link to="/login" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5">
          <LogIn className="w-5 h-5" /> Login Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-7 h-7 text-brand fill-brand" />
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Wishlist</h1>
        <span className="badge bg-brand text-white">{items.length}</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-8xl mb-6">❤️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Wishlist Kosong</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Simpan produk favoritmu di sini</p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> Jelajahi Produk
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
