import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Package, Loader2 } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
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

export default function OrderHistoryPage() {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!token) {
    return <Navigate to="/login?redirect=/orders" replace />;
  }

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Package className="w-7 h-7 text-brand" />
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Pesanan Saya</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand" />
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-5">
          {orders.map(order => (
            <div key={order.id} className="card p-5">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white font-mono">{order.id}</p>
                  <p className="text-xs text-gray-400">{order.date}</p>
                </div>
                <span className={`badge ${statusStyle[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
              </div>
              <div className="space-y-3 mb-4">
                {order.items?.map(item => (
                  <div key={item.name} className="flex items-center gap-3">
                    {item.img ? (
                      <img src={item.img} alt={item.name} className="w-14 h-14 object-cover rounded-xl" />
                    ) : (
                      <div className="w-14 h-14 bg-gray-100 dark:bg-dark-200 rounded-xl flex items-center justify-center text-lg">👟</div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-gray-400">×{item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-brand">{formatCurrency(order.total)}</span>
                {order.status === 'Selesai' && (
                  <Link to="/shop" className="btn-secondary text-sm py-2 px-4">Beli Lagi</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Belum ada pesanan</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Kamu belum pernah melakukan pemesanan apapun.</p>
          <Link to="/shop" className="btn-primary">Mulai Belanja</Link>
        </div>
      )}
    </div>
  );
}
