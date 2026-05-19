import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    headline: 'Langkah Besar\nDimulai dari Sini',
    sub: 'Temukan koleksi sepatu premium untuk setiap momen kehidupanmu',
    cta: 'Belanja Sekarang',
    ctaLink: '/shop',
    badge: '🔥 Sale hingga 40%',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80',
    accent: 'from-orange-600 to-red-700',
  },
  {
    id: 2,
    headline: 'Koleksi Running\nPremium 2025',
    sub: 'Teknologi terbaru untuk performa lari terbaikmu',
    cta: 'Lihat Koleksi',
    ctaLink: '/shop?category=running',
    badge: '⚡ New Arrival',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&q=80',
    accent: 'from-blue-600 to-indigo-700',
  },
  {
    id: 3,
    headline: 'Sneakers Edisi\nTerbatas',
    sub: 'Koleksi eksklusif yang tidak akan kamu temukan di tempat lain',
    cta: 'Dapatkan Sekarang',
    ctaLink: '/shop?category=sneakers',
    badge: '💎 Limited Edition',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200&q=80',
    accent: 'from-purple-600 to-pink-700',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent(i => (i + 1) % slides.length);
  const prev = () => setCurrent(i => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative h-[600px] md:h-[680px] overflow-hidden">
      {/* Background image */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={s.image} alt="" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-r ${s.accent} opacity-75`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full glass text-white text-sm font-medium mb-6 animate-fade-in">
              {slide.badge}
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight whitespace-pre-line animate-slide-up">
              {slide.headline}
            </h1>
            <p className="text-lg text-white/80 mb-8 animate-slide-up animate-delay-100">
              {slide.sub}
            </p>
            <div className="flex items-center gap-4 animate-slide-up animate-delay-200">
              <Link
                to={slide.ctaLink}
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-7 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all active:scale-95 shadow-lg"
              >
                {slide.cta} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/shop" className="text-white/80 hover:text-white font-medium transition-colors">
                Lihat Semua
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 glass rounded-xl text-white hover:bg-white/20 transition-colors">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 glass rounded-xl text-white hover:bg-white/20 transition-colors">
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'}`}
          />
        ))}
      </div>
    </section>
  );
}
