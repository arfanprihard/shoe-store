import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, User, Heart, LogOut, Settings, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';

const statusStyle = {
  'Menunggu Pembayaran': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Dibayar': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Diproses': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Dikirim': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  'Selesai': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Dibatalkan': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function ProfilePage() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: Package, label: 'Pesanan Saya', to: '/orders', count: orders.length },
    { icon: Heart, label: 'Wishlist', to: '/wishlist' },
    { icon: Settings, label: 'Pengaturan Akun', to: '#' },
  ];

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`;
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-8">Profil Saya</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          {/* Avatar */}
          <div className="card p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-brand to-primary-400 rounded-full flex items-center justify-center mx-auto mb-4">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-white">{initials}</span>
              )}
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</h2>
            <p className="text-sm text-gray-400">{user?.email}</p>
            {joinDate && <p className="text-xs text-gray-400 mt-1">Member sejak {joinDate}</p>}
            {user?.phone && <p className="text-xs text-gray-400 mt-0.5">{user.phone}</p>}
          </div>

          {/* Menu */}
          <div className="card p-2">
            {menuItems.map(({ icon: Icon, label, to, count }) => (
              <Link key={label} to={to}
                className="flex items-center justify-between px-4 py-3 rounded-xl transition-colors group hover:bg-gray-50 dark:hover:bg-dark-200">
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-brand" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {count > 0 && <span className="badge bg-brand text-white">{count}</span>}
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </Link>
            ))}
            {/* Logout button */}
            <button onClick={handleLogout}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors group hover:bg-red-50 dark:hover:bg-red-900/20">
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-500" />
                <span className="text-sm font-medium text-red-500">Keluar</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Orders */}
        <div className="md:col-span-2">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Pesanan Terbaru</h2>
          {loadingOrders ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-brand" />
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{order.id}</p>
                      <p className="text-xs text-gray-400">{order.date}</p>
                    </div>
                    <span className={`badge ${statusStyle[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{order.items?.length || 0} produk</span>
                    <span className="font-bold text-brand">Rp {order.total?.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Belum ada pesanan</p>
              <Link to="/shop" className="text-brand text-sm hover:underline mt-2 inline-block">Mulai belanja →</Link>
            </div>
          )}
          {orders.length > 0 && (
            <Link to="/orders" className="block text-center text-sm text-brand hover:underline mt-4">
              Lihat semua pesanan →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
