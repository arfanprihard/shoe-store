import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ChevronRight, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { formatCurrency } from '../utils/helpers';
import api from '../utils/api';

const steps = ['Pengiriman', 'Pembayaran', 'Konfirmasi'];

const paymentMethods = [
  { id: 'transfer', label: 'Transfer Bank', icon: '🏦', desc: 'BCA, Mandiri, BNI, BRI' },
  { id: 'ewallet', label: 'E-Wallet', icon: '📱', desc: 'GoPay, OVO, Dana, ShopeePay' },
  { id: 'cod', label: 'Bayar di Tempat', icon: '💵', desc: 'Cash on Delivery' },
  { id: 'card', label: 'Kartu Kredit/Debit', icon: '💳', desc: 'Visa, Mastercard' },
];

const couriers = [
  { id: 'jne', label: 'JNE Regular', price: 15000, eta: '2-3 hari' },
  { id: 'jnt', label: 'J&T Express', price: 12000, eta: '2-3 hari' },
  { id: 'sicepat', label: 'SiCepat', price: 10000, eta: '1-2 hari' },
  { id: 'same-day', label: 'Same Day', price: 35000, eta: 'Hari ini' },
];

export default function CheckoutPage() {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const showToast = useUIStore(s => s.showToast);

  const [step, setStep] = useState(0);
  const [courier, setCourier] = useState('jne');
  const [payment, setPayment] = useState('transfer');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderNum, setOrderNum] = useState('');
  const { items, clearCart } = useCartStore();
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', zip: '' });

  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/login?redirect=/checkout" replace />;
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const selectedCourier = couriers.find(c => c.id === courier);
  const total = subtotal + (selectedCourier?.price || 0);

  const handleOrder = async () => {
    if (items.length === 0) {
      showToast('Keranjang belanja kosong', 'error');
      return;
    }

    setLoading(true);
    try {
      // 1. Sync local cart items to the database cart
      await api.delete('/cart');
      for (const item of items) {
        await api.post('/cart/items', {
          productId: Number(item.id),
          size: Number(item.size),
          color: item.color,
          qty: Number(item.qty),
        });
      }

      // 2. Create the order in the backend database
      const res = await api.post('/orders', {
        address: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          zipCode: form.zip,
        },
        courier: courier,
        paymentMethod: payment,
      });

      const order = res.data.data;
      setOrderNum(order.orderNumber);
      setDone(true);
      clearCart();
      showToast('Pesanan berhasil dibuat! 🎉', 'success');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error?.message || 'Gagal memproses pesanan';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">Pesanan Berhasil! 🎉</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-2 font-mono font-semibold">Order #{orderNum}</p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Pesananmu sedang diproses. Kamu bisa memantau status pesananmu di halaman riwayat transaksi.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/orders" className="btn-outline flex items-center gap-2">
            <Package className="w-4 h-4" /> Lihat Pesanan
          </Link>
          <Link to="/shop" className="btn-primary">Belanja Lagi</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-10">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 ${i <= step ? 'text-brand' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= step ? 'bg-brand text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>{i + 1}</div>
              <span className="text-sm font-medium hidden sm:block">{s}</span>
            </div>
            {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 flex-1" />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 0: Shipping */}
          {step === 0 && (
            <div className="card p-6 space-y-4">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Alamat Pengiriman</h2>
              {[
                { key: 'name', label: 'Nama Lengkap', placeholder: 'John Doe' },
                { key: 'phone', label: 'Nomor HP', placeholder: '08xxxxxxxxxx' },
                { key: 'address', label: 'Alamat Lengkap', placeholder: 'Jl. ...' },
                { key: 'city', label: 'Kota', placeholder: 'Jakarta' },
                { key: 'zip', label: 'Kode Pos', placeholder: '12345' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{f.label}</label>
                  <input
                    value={form[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="input-base"
                  />
                </div>
              ))}
              <h3 className="font-semibold text-gray-900 dark:text-white pt-4">Pilih Kurir</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {couriers.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCourier(c.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${courier === c.id ? 'border-brand bg-brand/5' : 'border-gray-200 dark:border-gray-700 hover:border-brand/50'}`}
                  >
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{c.label}</p>
                    <p className="text-xs text-gray-400">{c.eta}</p>
                    <p className="text-brand font-bold text-sm mt-1">{formatCurrency(c.price)}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  if (!form.name || !form.phone || !form.address || !form.city || !form.zip) {
                    showToast('Harap lengkapi semua data pengiriman', 'error');
                    return;
                  }
                  setStep(1);
                }}
                className="w-full btn-primary mt-4"
              >
                Lanjut ke Pembayaran
              </button>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Metode Pembayaran</h2>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {paymentMethods.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setPayment(m.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${payment === m.id ? 'border-brand bg-brand/5' : 'border-gray-200 dark:border-gray-700 hover:border-brand/50'}`}
                  >
                    <span className="text-2xl mb-2 block">{m.icon}</span>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{m.label}</p>
                    <p className="text-xs text-gray-400">{m.desc}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="btn-secondary flex-1">Kembali</button>
                <button onClick={() => setStep(2)} className="btn-primary flex-1">Review Pesanan</button>
              </div>
            </div>
          )}

          {/* Step 2: Confirm */}
          {step === 2 && (
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Konfirmasi Pesanan</h2>
              <div className="space-y-3 mb-6 animate-fade-in">
                {items.map(item => (
                  <div key={item.key} className="flex gap-3 items-center">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400">Uk. {item.size} × {item.qty}</p>
                    </div>
                    <span className="font-bold text-brand text-sm">{formatCurrency(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} disabled={loading} className="btn-secondary flex-1">Kembali</button>
                <button
                  onClick={handleOrder}
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
                >
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</> : 'Bayar Sekarang'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Ringkasan</h3>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Ongkir ({selectedCourier?.label})</span>
              <span>{formatCurrency(selectedCourier?.price || 0)}</span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-2 flex justify-between font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span className="text-brand font-extrabold text-lg">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

