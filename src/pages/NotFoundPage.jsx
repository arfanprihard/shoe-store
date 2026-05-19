import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-display text-9xl font-black text-gray-200 dark:text-gray-800 mb-4 select-none">404</div>
        <div className="text-6xl mb-6 animate-bounce-slow">👟</div>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          Sepertinya sepatu yang kamu cari tidak ada di sini. Yuk kembali ke beranda dan temukan koleksi terbaik kami!
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="btn-secondary flex items-center gap-2">
            <Home className="w-4 h-4" /> Beranda
          </Link>
          <Link to="/shop" className="btn-primary flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" /> Belanja Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
