import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Sparkles, Flame } from 'lucide-react';

const slides = [
  {
    id: 1,
    headline: 'Langkah Besar\nDimulai dari Sini',
    sub: 'Temukan koleksi sepatu original edisi terbatas untuk setiap momen gaya hidupmu.',
    cta: 'Belanja Sekarang',
    ctaLink: '/shop',
    badge: 'Sale Spesial Hingga 40%',
    badgeIcon: Flame,
    image: '/images/banners/hero_slide_1.jpg',
    tagColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  },
  {
    id: 2,
    headline: 'Koleksi Running\nOriginal 2025',
    sub: 'Performa lari maksimal dengan teknologi bantalan mutakhir & kenyamanan tanpa batas.',
    cta: 'Lihat Koleksi Running',
    ctaLink: '/shop?category=running',
    badge: 'New Arrival 2025',
    badgeIcon: Zap,
    image: '/images/banners/hero_slide_2.jpg',
    tagColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  },
  {
    id: 3,
    headline: 'Sneakers Premium\nEdisi Eksklusif',
    sub: 'Koleksi sneaker paling ikonik dari brand ternama dunia dengan kualitas 100% Original.',
    cta: 'Dapatkan Sekarang',
    ctaLink: '/shop?category=sneakers',
    badge: 'High-End Exclusive',
    badgeIcon: Sparkles,
    image: '/images/banners/hero_slide_3.jpg',
    tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent(i => (i + 1) % slides.length);
  const prev = () => setCurrent(i => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[current];
  const BadgeIcon = slide.badgeIcon;

  return (
    <section className="relative h-[540px] sm:h-[620px] lg:h-[680px] overflow-hidden bg-gray-950 text-white">
      {/* Slides Background */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
        >
          {/* High-res background image with smooth zoom effect */}
          <img
            src={s.image}
            alt={s.headline}
            className={`w-full h-full object-cover transition-transform duration-10000 ease-out ${i === current ? 'scale-105' : 'scale-100'
              }`}
          />
          {/* Gradient overlays for crisp text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent w-full md:w-3/4" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-black/30" />
        </div>
      ))}

      {/* Slide Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            {/* Badge Pill */}
            <div className="mb-4 sm:mb-6">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md text-xs sm:text-sm font-bold border ${slide.tagColor} shadow-lg tracking-wide uppercase`}>
                <BadgeIcon className="w-4 h-4" />
                {slide.badge}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-[1.1] whitespace-pre-line tracking-tight drop-shadow-md">
              {slide.headline}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-gray-300 font-medium mb-6 sm:mb-10 max-w-xl leading-relaxed drop-shadow">
              {slide.sub}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={slide.ctaLink}
                className="inline-flex items-center gap-2.5 bg-brand hover:bg-primary-600 text-white px-7 py-4 rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 active:scale-95 group"
              >
                {slide.cta}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm sm:text-base text-gray-300 hover:text-white bg-white/10 hover:bg-white/15 backdrop-blur-md transition-all duration-200 border border-white/10"
              >
                Lihat Semua Katalog
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrow Controls */}
      <button
        onClick={prev}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-2xl bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-110 active:scale-95 hidden sm:flex items-center justify-center"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-2xl bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-110 active:scale-95 hidden sm:flex items-center justify-center"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-brand shadow-sm shadow-brand' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
          />
        ))}
      </div>
    </section>
  );
}
