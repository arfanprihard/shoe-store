import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Sun, Moon, User, Menu, X, ChevronRight, Zap, Sparkles } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import SearchBar from '../common/SearchBar';

const categoryMenus = [
  { id: 'home', name: 'Beranda', to: '/' },
  { id: 'sneakers', name: 'Sneakers', to: '/shop?category=sneakers' },
  { id: 'running', name: 'Running', to: '/shop?category=running' },
  { id: 'formal', name: 'Formal', to: '/shop?category=formal' },
  { id: 'casual', name: 'Casual', to: '/shop?category=casual' },
  { id: 'sandals', name: 'Sandals', to: '/shop?category=sandals' },
  { id: 'boots', name: 'Boots', to: '/shop?category=boots' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { isDarkMode, toggleDark, showToast } = useUIStore();
  const cartItems = useCartStore(s => s.items);
  const wishItems = useWishlistStore(s => s.items);
  const user = useAuthStore(s => s.user);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, searchParams]);

  const totalCart = cartItems.reduce((s, i) => s + i.qty, 0);
  const currentCategory = searchParams.get('category') || 'all';

  const handleWishlistClick = (e) => {
    if (!user) {
      e.preventDefault();
      showToast('Silakan login terlebih dahulu untuk melihat Wishlist!', 'warning');
      navigate('/login');
    }
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 border-b border-gray-100 dark:border-gray-800 ${scrolled ? 'bg-white/95 dark:bg-dark-100/95 backdrop-blur-md' : 'bg-white dark:bg-dark-100'}`}>
      {/* Row 1: Mobile Hamburger, Logo, SearchBar, Action Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Hamburger button (Mobile only) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
            className="sm:hidden p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors flex-shrink-0"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-brand to-primary-400 rounded-xl flex items-center justify-center shadow-md shadow-brand/20">
              <span className="text-white text-lg">👟</span>
            </div>
            <span className="font-display font-bold text-lg sm:text-xl text-gray-900 dark:text-white">
              Step<span className="text-brand">Luxe</span>
            </span>
          </Link>

          {/* SearchBar */}
          <div className="flex-1 max-w-xl mx-2 sm:mx-4">
            <SearchBar className="w-full" />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              title="Toggle Theme"
              className="p-2 sm:p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              onClick={handleWishlistClick}
              title="Wishlist"
              className="relative p-2 sm:p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishItems.length}
                </span>
              )}
            </Link>

            {/* Checkout / Cart Icon */}
            <Link
              to="/cart"
              title="Keranjang / Checkout"
              className="relative p-2 sm:p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCart > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-slow">
                  {totalCart}
                </span>
              )}
            </Link>

            {/* Profile Icon */}
            <Link
              to={user ? "/profile" : "/login"}
              title={user ? "Profil Saya" : "Login"}
              className="p-2 sm:p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors flex items-center gap-2"
            >
              <User className="w-5 h-5" />
              {user && (
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 hidden md:inline">
                  {user.firstName}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Row 2: Desktop Category Navigation Links (Hidden on Mobile) */}
      <div className="hidden sm:block bg-gray-50/80 dark:bg-dark-card/50 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-2 py-2 overflow-x-auto no-scrollbar whitespace-nowrap">
            {categoryMenus.map((cat) => {
              let isActive = false;
              if (cat.id === 'home') {
                isActive = location.pathname === '/' && !searchParams.get('category') && !searchParams.get('sale') && !searchParams.get('new');
              } else {
                isActive = location.pathname === '/shop' && currentCategory === cat.id;
              }

              return (
                <Link
                  key={cat.id}
                  to={cat.to}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand hover:bg-white dark:hover:bg-dark-100'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu (Visible when Hamburger Tapped) */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sliding Panel */}
          <div className="relative w-4/5 max-w-xs bg-white dark:bg-dark-100 h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-dark-card/50">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-brand to-primary-400 rounded-xl flex items-center justify-center">
                  <span className="text-white text-base">👟</span>
                </div>
                <span className="font-display font-bold text-lg text-gray-900 dark:text-white">
                  Step<span className="text-brand">Luxe</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Special Promo Badges */}
            <div className="p-4 space-y-2 border-b border-gray-100 dark:border-gray-800">
              <Link
                to="/shop?sale=true"
                className="flex items-center justify-between p-3 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs"
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-red-500 fill-red-500" /> Flash Sale & Promo Diskon
                </span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop?new=true"
                className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Koleksi Terbaru (New Arrival)
                </span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Category Navigation Links */}
            <div className="p-4 flex-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">
                Kategori Produk
              </p>
              <nav className="space-y-1">
                {categoryMenus.map((cat) => {
                  let isActive = false;
                  if (cat.id === 'home') {
                    isActive = location.pathname === '/' && !searchParams.get('category') && !searchParams.get('sale') && !searchParams.get('new');
                  } else {
                    isActive = location.pathname === '/shop' && currentCategory === cat.id;
                  }

                  return (
                    <Link
                      key={cat.id}
                      to={cat.to}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-brand text-white font-bold shadow-md shadow-brand/20'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-card'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer Account Section */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-dark-card/50">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand/10 text-brand font-bold flex items-center justify-center">
                      {user.firstName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/profile" className="p-2 text-brand hover:underline text-xs font-bold">
                    Profil
                  </Link>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="w-full btn-primary py-2.5 text-center flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" /> Login / Daftar
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
