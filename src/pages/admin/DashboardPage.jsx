import React, { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  PAID: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PROCESSING: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  SHIPPED: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  DELIVERED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const statusLabels = {
  PENDING: 'Menunggu', PAID: 'Dibayar', PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim', DELIVERED: 'Selesai', CANCELLED: 'Dibatalkan',
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(res => {
      setStats(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-brand" />
    </div>
  );

  const cards = [
    { label: 'Total Produk', value: stats?.totalProducts || 0, icon: Package, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Total Pesanan', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Pendapatan', value: `Rp ${(stats?.totalRevenue || 0).toLocaleString('id-ID')}`, icon: DollarSign, color: 'from-green-500 to-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Total Pelanggan', value: stats?.totalUsers || 0, icon: Users, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 bg-gradient-to-r ${card.color} bg-clip-text`} style={{ color: card.color.includes('blue') ? '#3b82f6' : card.color.includes('purple') ? '#a855f7' : card.color.includes('green') ? '#22c55e' : '#f97316' }} />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white font-display">{card.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card p-6">
        <h3 className="font-display font-semibold text-lg text-gray-900 dark:text-white mb-4">Pesanan Terbaru</h3>
        {stats?.recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-3 px-3 text-gray-500 dark:text-gray-400 font-medium">Order</th>
                  <th className="text-left py-3 px-3 text-gray-500 dark:text-gray-400 font-medium">Pelanggan</th>
                  <th className="text-left py-3 px-3 text-gray-500 dark:text-gray-400 font-medium">Total</th>
                  <th className="text-left py-3 px-3 text-gray-500 dark:text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-3 text-gray-500 dark:text-gray-400 font-medium">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-3 font-medium text-gray-900 dark:text-white">{order.orderNumber}</td>
                    <td className="py-3 px-3 text-gray-600 dark:text-gray-300">{order.customer}</td>
                    <td className="py-3 px-3 font-medium text-gray-900 dark:text-white">Rp {order.total.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">Belum ada pesanan</p>
        )}
      </div>
    </div>
  );
}
