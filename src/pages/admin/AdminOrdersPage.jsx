import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../../utils/api';
import { useUIStore } from '../../store/uiStore';

const statusOptions = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const statusLabels = {
  PENDING: 'Menunggu', PAID: 'Dibayar', PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim', DELIVERED: 'Selesai', CANCELLED: 'Dibatalkan',
};
const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  PAID: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PROCESSING: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  SHIPPED: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  DELIVERED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const showToast = useUIStore(s => s.showToast);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/orders', { params: { status: filter, limit: 50 } });
      setOrders(data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status });
      showToast('Status pesanan diperbarui!', 'success');
      fetchOrders();
    } catch {
      showToast('Gagal memperbarui status', 'error');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'all' ? 'bg-brand text-white shadow-brand' : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-card'}`}>
          Semua
        </button>
        {statusOptions.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === s ? 'bg-brand text-white shadow-brand' : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-card'}`}>
            {statusLabels[s]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Loader2 className="w-7 h-7 animate-spin text-brand" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Order</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Pelanggan</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Total</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Kurir</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{order.orderNumber}</td>
                    <td className="py-3 px-4">
                      <p className="text-gray-700 dark:text-gray-200">{order.customer}</p>
                      <p className="text-xs text-gray-400">{order.email}</p>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">Rp {order.total.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300 uppercase text-xs font-semibold">{order.courier}</td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        className={`rounded-full text-xs font-semibold px-3 py-1.5 border-0 cursor-pointer focus:ring-2 focus:ring-brand ${statusColors[order.status]}`}
                      >
                        {statusOptions.map(s => (
                          <option key={s} value={s}>{statusLabels[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <p className="text-center text-gray-400 py-12">Belum ada pesanan</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
