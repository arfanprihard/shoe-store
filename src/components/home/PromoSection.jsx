import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';

export default function PromoSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 to-dark-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Main promo */}
          <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-br from-brand to-primary-700 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
                <Zap className="w-3.5 h-3.5" /> Flash Sale
              </span>
              <h3 className="font-display text-4xl font-black mb-2">DISKON<br />HINGGA 40%</h3>
              <p className="text-white/80 mb-6">Untuk semua produk brand ternama. Penawaran terbatas!</p>
              <Link to="/shop" className="inline-flex items-center gap-2 bg-white text-brand px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                Belanja Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Two mini promos */}
          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex-1">
              <img
                src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&q=80"
                alt="Running"
                className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-40"
              />
              <div className="relative">
                <p className="text-blue-200 text-sm mb-1">Koleksi Running</p>
                <h4 className="font-display text-2xl font-black mb-3">Performa Terbaik</h4>
                <Link to="/shop?category=running" className="text-sm font-semibold hover:gap-3 flex items-center gap-2 transition-all">
                  Belanja Sekarang <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white flex-1">
              <img
                src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300&q=80"
                alt="New"
                className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-40"
              />
              <div className="relative">
                <p className="text-amber-100 text-sm mb-1">Koleksi Terbaru</p>
                <h4 className="font-display text-2xl font-black mb-3">New Arrival ✨</h4>
                <Link to="/shop?category=sneakers" className="text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                  Lihat Koleksi <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
