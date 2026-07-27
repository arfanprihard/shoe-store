import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Rss, Video, Mail, Phone, MapPin, Heart } from 'lucide-react';

const footerLinks = {
  'Produk': [
    { label: 'Sneakers', to: '/shop?category=sneakers' },
    { label: 'Running', to: '/shop?category=running' },
    { label: 'Formal', to: '/shop?category=formal' },
    { label: 'Casual', to: '/shop?category=casual' },
    { label: 'Boots', to: '/shop?category=boots' },
  ],
  'Layanan': [
    { label: 'Tentang Kami', to: '/about' },
    { label: 'Cara Berbelanja', to: '/guide' },
    { label: 'Kebijakan Retur', to: '/returns' },
    { label: 'Panduan Ukuran', to: '/size-guide' },
    { label: 'FAQ', to: '/faq' },
  ],
  'Akun': [
    { label: 'Login', to: '/login' },
    { label: 'Daftar', to: '/register' },
    { label: 'Profil', to: '/profile' },
    { label: 'Pesanan Saya', to: '/orders' },
    { label: 'Wishlist', to: '/wishlist' },
  ],
};

const socials = [
  { Icon: Globe, href: '#', label: 'Instagram' },
  { Icon: MessageCircle, href: '#', label: 'Twitter' },
  { Icon: Rss, href: '#', label: 'Facebook' },
  { Icon: Video, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-dark-300 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-brand to-primary-400 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">👟</span>
              </div>
              <span className="font-display font-bold text-2xl text-white">
                Step<span className="text-brand">Luxe</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 max-w-xs leading-relaxed">
              Temukan koleksi sepatu original terbaik untuk setiap gaya dan aktivitas Anda. Kualitas terjamin, pengiriman cepat, harga terjangkau.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand flex-shrink-0" /> Jl. Sudirman No.123, Jakarta Selatan</div>
              <a
                href="https://wa.me/6285717578072?text=Halo%20CS%20StepLuxe,%20saya%20ingin%20melapor%20/%20bertanya%20mengenai%20layanan."
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> +62 857-1757-8072 (Lapor CS WA)
              </a>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand flex-shrink-0" /> hello@stepluxe.id</div>
            </div>
            <div className="flex gap-3 mt-6">
              {socials.map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-xl bg-gray-800 dark:bg-dark-card flex items-center justify-center hover:bg-brand transition-colors group">
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-semibold text-white mb-4">{heading}</h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-gray-400 hover:text-brand transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2025 StepLuxe. All rights reserved.</p>
          <p className="text-xs text-gray-500">Platform Toko Sepatu Original</p>
        </div>
      </div>
    </footer>
  );
}
