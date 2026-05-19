import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Sun, Moon, Menu, X, User, Package } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import SearchBar from '../common/SearchBar';

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/shop', label: 'Toko' },
  { to: '/shop?category=sneakers', label: 'Sneakers' },
  { to: '/shop?category=running', label: 'Running' },
  { to: '/shop?category=formal', label: 'Formal' },
];

export default function Navbar() {
  const { isDarkMode, toggleDark } = useUIStore();
  const cartItems = useCartStore(s => s.items);
  const wishItems = useWishlistStore(s => s.items);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const totalCart = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-dark-100/95 backdrop-blur-md shadow-md' : 'bg-white dark:bg-dark-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-brand to-primary-400 rounded-xl flex items-center justify-center shadow-brand">
              <span className="text-white text-lg">👟</span>
            </div>
            <span className="font-display font-bold text-xl text-gray-900 dark:text-white hidden sm:block">
              Step<span className="text-brand">Luxe</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-brand bg-brand/10' : 'text-gray-600 dark:text-gray-300 hover:text-brand hover:bg-brand/5'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Search Desktop */}
          <SearchBar className="hidden md:block w-64 lg:w-72" />

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleDark}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link to="/wishlist" className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors">
              <Heart className="w-5 h-5" />
              {wishItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishItems.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalCart > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-slow">
                  {totalCart}
                </span>
              )}
            </Link>

            <Link to="/profile" className="hidden sm:flex p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors">
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-100 dark:border-gray-800 animate-slide-down">
            <SearchBar className="mt-4 mb-3" />
            <nav className="flex flex-col gap-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'text-brand bg-brand/10' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-card'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink to="/profile" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors flex items-center gap-2">
                <User className="w-4 h-4" /> Profil Saya
              </NavLink>
              <NavLink to="/orders" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors flex items-center gap-2">
                <Package className="w-4 h-4" /> Pesanan Saya
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
