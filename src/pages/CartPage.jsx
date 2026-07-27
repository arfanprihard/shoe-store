import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Tag, X, CheckCircle2, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { formatCurrency, formatColorName } from '../utils/helpers';
import QuantitySelector from '../components/common/QuantitySelector';
import api from '../utils/api';

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart } = useCartStore();
  const showToast = useUIStore(s => s.showToast);
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null); // { code, discount, type, value }
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = total > 300000 ? 0 : 20000;
  const discount = appliedPromo?.discount || 0;
  const finalTotal = total + shipping - discount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const res = await api.post('/promos/validate', { code: promoCode.trim(), subtotal: total });
      setAppliedPromo(res.data.data);
      showToast(`Kode promo "${res.data.data.code}" berhasil dipakai!`, 'success');
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Kode promo tidak valid';
      setPromoError(msg);
      setAppliedPromo(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

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
            <div key={`${item.id}-${item.size}-${item.color}`} className="card p-5 flex gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl shrink-0 bg-gray-100"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">{item.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Ukuran: {item.size} · Warna: {formatColorName ? formatColorName(item.color) : item.color}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id, item.size, item.color)}
                    className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <QuantitySelector
                    value={item.qty}
                    onChange={val => updateQty(item.id, item.size, item.color, val)}
                    min={1}
                    max={10}
                  />
                  <p className="font-bold text-brand">{formatCurrency(item.price * item.qty)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="font-bold text-gray-900 dark:text-white mb-5 text-lg">Ringkasan Pesanan</h2>

            {/* Promo code input */}
            {!appliedPromo ? (
              <div className="mb-5">
                <div className="flex gap-2">
                  <input
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleApplyPromo()}
                    placeholder="Kode promo"
                    className="input-base flex-1 text-sm py-2"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={promoLoading || !promoCode.trim()}
                    className="btn-outline py-2 px-3 text-sm flex-shrink-0 flex items-center gap-1 disabled:opacity-50"
                  >
                    {promoLoading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <><Tag className="w-4 h-4" /> Pakai</>
                    }
                  </button>
                </div>
                {promoError && (
                  <p className="text-xs text-red-500 mt-1.5">{promoError}</p>
                )}
              </div>
            ) : (
              <div className="mb-5 flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-3 py-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{appliedPromo.code}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-500">
                      Hemat {formatCurrency(appliedPromo.discount)}
                    </p>
                  </div>
                </div>
                <button onClick={handleRemovePromo} className="text-gray-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} item)</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Ongkos kirim</span>
                <span>{shipping === 0 ? <span className="text-emerald-500 font-medium">GRATIS</span> : formatCurrency(shipping)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Diskon promo</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span className="text-brand">{formatCurrency(finalTotal)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout', { state: { appliedPromo } })}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
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
