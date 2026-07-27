import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Sparkles } from 'lucide-react';

export default function PromoSection() {
  return (
    <section className="py-16 sm:py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Main Promo Card (Whole Card Clickable) */}
          <Link
            to="/shop?sale=true"
            className="group relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-br from-brand to-primary-700 text-white hover:shadow-2xl hover:shadow-brand/20 transition-all duration-500 flex flex-col justify-between cursor-pointer min-h-[320px]"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4 blur-2xl group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full translate-y-1/3 -translate-x-1/4 blur-xl" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full mb-6 border border-white/20 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> Flash Sale Spesial
              </span>
              <h3 className="font-display text-4xl sm:text-5xl font-black mb-3 leading-tight tracking-tight">
                DISKON<br />HINGGA 40%
              </h3>
              <p className="text-white/85 text-sm sm:text-base font-medium max-w-sm">
                Untuk semua produk brand ternama. Penawaran terbatas minggu ini!
              </p>
            </div>

            <div className="relative z-10 mt-8">
              <span className="inline-flex items-center gap-2 bg-white text-brand px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg group-hover:bg-gray-100 transition-all duration-300">
                Belanja Sekarang
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
            </div>
          </Link>

          {/* Two Mini Promo Cards (Whole Cards Clickable) */}
          <div className="flex flex-col gap-6">
            {/* Running Promo */}
            <Link
              to="/shop?category=running"
              className="group relative overflow-hidden rounded-3xl p-7 bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex-1 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-500 flex items-center justify-between cursor-pointer min-h-[150px]"
            >
              <img
                src="/images/banners/running_promo.jpg"
                alt="Koleksi Running"
                className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-35 group-hover:scale-110 group-hover:opacity-45 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-700/90 to-transparent" />

              <div className="relative z-10">
                <span className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1 block">
                  Koleksi Running
                </span>
                <h4 className="font-display text-2xl font-extrabold mb-3">
                  Performa Terbaik
                </h4>
                <span className="text-xs font-bold flex items-center gap-2 text-white/90 group-hover:text-white transition-colors">
                  Belanja Sekarang
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            {/* Casual / New Arrival Promo */}
            <Link
              to="/shop?new=true"
              className="group relative overflow-hidden rounded-3xl p-7 bg-gradient-to-br from-amber-500 to-orange-700 text-white flex-1 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-500 flex items-center justify-between cursor-pointer min-h-[150px]"
            >
              <img
                src="/images/banners/casual_promo.jpg"
                alt="New Arrival"
                className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-35 group-hover:scale-110 group-hover:opacity-45 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-amber-600/90 to-transparent" />

              <div className="relative z-10">
                <span className="text-amber-100 text-xs font-bold uppercase tracking-wider mb-1 block">
                  Koleksi Terbaru
                </span>
                <h4 className="font-display text-2xl font-extrabold mb-3 flex items-center gap-2">
                  New Arrival <Sparkles className="w-4 h-4 text-amber-200" />
                </h4>
                <span className="text-xs font-bold flex items-center gap-2 text-white/90 group-hover:text-white transition-colors">
                  Lihat Koleksi
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
