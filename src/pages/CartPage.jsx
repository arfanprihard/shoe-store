import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { formatCurrency } from '../utils/helpers';
import QuantitySelector from '../components/common/QuantitySelector';

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart } = useCartStore();
  const showToast = useUIStore(s => s.showToast);
  const navigate = useNavigate();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = total > 300000 ? 0 : 20000;
  const finalTotal = total + shipping;

  if (items.length === 0) return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Keranjang Kosong</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Belum ada produk. Yuk mulai belanja!</p>
        <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" /> Mulai Belanja
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Keranjang Belanja</h1>
        <button onClick={() => { clearCart(); showToast('Keranjang dikosongkan', 'info'); }}
          className="text-sm text-red-500 hover:underline flex items-center gap-1">
          <Trash2 className="w-4 h-4" /> Kosongkan
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.key} className="card p-5 flex gap-4">
              <Link to={`/product/${item.id}`}>
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{item.brand}</p>
                    <Link to={`/product/${item.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-brand text-sm line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Uk. {item.size}</p>
                  </div>
                  <button onClick={() => { removeItem(item.key); showToast('Produk dihapus', 'info'); }}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <QuantitySelector value={item.qty} max={item.stock} onChange={qty => updateQty(item.key, qty)} />
                  <span className="font-bold text-brand">{formatCurrency(item.price * item.qty)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="font-bold text-gray-900 dark:text-white mb-5 text-lg">Ringkasan Pesanan</h2>
            <div className="flex gap-2 mb-5">
              <input placeholder="Kode promo" className="input-base flex-1 text-sm py-2" />
              <button className="btn-outline py-2 px-3 text-sm flex-shrink-0 flex items-center gap-1">
                <Tag className="w-4 h-4" /> Pakai
              </button>
            </div>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} item)</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Ongkos kirim</span>
                <span>{shipping === 0 ? <span className="text-emerald-500 font-medium">GRATIS</span> : formatCurrency(shipping)}</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span className="text-brand">{formatCurrency(finalTotal)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="w-full btn-primary flex items-center justify-center gap-2">
              Checkout <ArrowRight className="w-5 h-5" />
            </button>
            <Link to="/shop" className="block text-center text-sm text-gray-500 hover:text-brand mt-3">
              Lanjut Belanja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
