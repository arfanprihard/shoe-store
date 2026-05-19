import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const mockOrders = [
  { id: 'SL-10234', date: '18 Mei 2025', status: 'Dikirim', total: 1850000, items: [{ name: 'Nike Air Max 270', qty: 1, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80' }] },
  { id: 'SL-10198', date: '10 Mei 2025', status: 'Selesai', total: 3200000, items: [{ name: 'Nike Jordan 1 Retro', qty: 1, img: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=80&q=80' }, { name: 'Vans Old Skool', qty: 1, img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=80&q=80' }] },
  { id: 'SL-10145', date: '2 Mei 2025', status: 'Selesai', total: 950000, items: [{ name: 'Adidas Stan Smith', qty: 1, img: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=80&q=80' }] },
];

const statusStyle = {
  'Dikirim': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Selesai': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Diproses': 'bg-amber-100 text-amber-700',
};

export default function OrderHistoryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Package className="w-7 h-7 text-brand" />
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Pesanan Saya</h1>
      </div>

      <div className="space-y-5">
        {mockOrders.map(order => (
          <div key={order.id} className="card p-5">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{order.id}</p>
                <p className="text-xs text-gray-400">{order.date}</p>
              </div>
              <span className={`badge ${statusStyle[order.status]}`}>{order.status}</span>
            </div>
            <div className="space-y-3 mb-4">
              {order.items.map(item => (
                <div key={item.name} className="flex items-center gap-3">
                  <img src={item.img} alt={item.name} className="w-14 h-14 object-cover rounded-xl" />
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
    </div>
  );
}
