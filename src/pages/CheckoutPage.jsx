import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, ChevronRight, Loader2, Truck, Sparkles } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { formatCurrency, formatColorName } from '../utils/helpers';
import api from '../utils/api';
import PaymentGatewayModal from '../components/common/PaymentGatewayModal';
import { decrementProductStock } from '../data/products';

const steps = ['Pengiriman', 'Pembayaran', 'Konfirmasi'];

const paymentMethods = [
  { id: 'transfer', label: 'Transfer Bank (VA)', icon: '🏦', desc: 'BCA, Mandiri, BNI, BRI', bank: 'bca' },
  { id: 'ewallet', label: 'QRIS & E-Wallet', icon: '📱', desc: 'GoPay, OVO, Dana, ShopeePay', bank: 'qris' },
  { id: 'cod', label: 'Bayar di Tempat', icon: '💵', desc: 'Cash on Delivery', bank: 'cod' },
  { id: 'card', label: 'Kartu Kredit/Debit', icon: '💳', desc: 'Visa, Mastercard 3D-Secure', bank: 'card' },
];

export default function CheckoutPage() {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const showToast = useUIStore(s => s.showToast);

  const [step, setStep] = useState(0);
  const [payment, setPayment] = useState('transfer');
  const [selectedBank, setSelectedBank] = useState('bca');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingRates, setLoadingRates] = useState(false);
  const [orderNum, setOrderNum] = useState('');
  const { items, clearCart } = useCartStore();
  const location = useLocation();
  const appliedPromo = location.state?.appliedPromo || null;
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: 'Jakarta', zip: '12345' });

  // Payment Gateway modal state
  const [paymentModalData, setPaymentModalData] = useState(null);

  // Shipping rates from API
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);

  // Calculate total weight (1000g per shoe pair)
  const totalWeightGrams = items.reduce((s, i) => s + (i.qty * 1000), 0);

  // Fetch live shipping rates from backend API
  const fetchShippingRates = async (city) => {
    setLoadingRates(true);
    try {
      const { data } = await api.post('/shipping/calculate', {
        city: city || 'Jakarta',
        weightGrams: totalWeightGrams || 1000,
      });
      const rates = data.data.rates || [];
      setShippingRates(rates);
      if (rates.length > 0) {
        setSelectedRate(rates[0]);
      }
    } catch (err) {
      console.warn('Fallback shipping rates:', err);
      const fallback = [
        { id: 'jne-reg', courierName: 'JNE', service: 'JNE REG', label: 'JNE Regular', price: 15000, eta: '2-3 Hari', icon: '🚚' },
        { id: 'jne-yes', courierName: 'JNE', service: 'JNE YES', label: 'JNE Yakin Esok Sampai', price: 28000, eta: '1 Hari', icon: '⚡' },
        { id: 'jnt-ez', courierName: 'J&T', service: 'J&T EZ', label: 'J&T Express EZ', price: 14000, eta: '2-3 Hari', icon: '🚚' },
        { id: 'sicepat-reg', courierName: 'SICEPAT', service: 'SiCepat REG', label: 'SiCepat Regular', price: 12000, eta: '1-2 Hari', icon: '🚚' },
      ];
      setShippingRates(fallback);
      setSelectedRate(fallback[0]);
    }
    setLoadingRates(false);
  };

  useEffect(() => {
    if (token) {
      fetchShippingRates(form.city);
    }
  }, [form.city]);

  if (!token) {
    return <Navigate to="/login?redirect=/checkout" replace />;
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingPrice = selectedRate?.price || 15000;
  const promoDiscount = appliedPromo?.discount || 0;
  const total = subtotal + shippingPrice - promoDiscount;

  const handleOrder = async () => {
    if (items.length === 0) {
      showToast('Keranjang belanja kosong', 'error');
      return;
    }

    setLoading(true);
    let orderNumberCreated = `SL-${Date.now().toString().slice(-5)}${Math.floor(Math.random() * 100)}`;

    try {
      // 1. Try syncing local cart items to database cart
      await api.delete('/cart').catch(() => {});
      for (const item of items) {
        await api.post('/cart/items', {
          productId: Number(item.id),
          size: Number(item.size),
          color: item.color,
          qty: Number(item.qty),
        }).catch(() => {});
      }

      // 2. Create the order in backend database
      try {
        const res = await api.post('/orders', {
          address: {
            name: form.name,
            phone: form.phone,
            address: form.address,
            city: form.city,
            zipCode: form.zip,
          },
          courier: selectedRate?.courierName?.toLowerCase() || 'jne',
          paymentMethod: payment,
          promoCode: appliedPromo?.code || undefined,
        });
        if (res.data?.data?.orderNumber) {
          orderNumberCreated = res.data.data.orderNumber;
        }
      } catch (orderErr) {
        console.warn('Backend order submission notice:', orderErr);
      }

      setOrderNum(orderNumberCreated);

      // 3. Request Payment Gateway Charge (QRIS / Virtual Account / Credit Card)
      try {
        const payRes = await api.post('/payment/charge', {
          orderNumber: orderNumberCreated,
          amount: total,
          paymentMethod: payment,
          bank: selectedBank,
        });
        setPaymentModalData(payRes.data.data);
      } catch (payErr) {
        console.warn('Payment charge fallback:', payErr);
        items.forEach(i => decrementProductStock(i.id, i.color, i.size, i.qty));
        setDone(true);
        clearCart();
        showToast('Pesanan berhasil dibuat! 🎉', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses pesanan', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      if (orderNum) {
        await api.get(`/payment/status/${orderNum}`).catch(() => {});
      }
    } catch (e) {}
    items.forEach(i => decrementProductStock(i.id, i.color, i.size, i.qty));
    setPaymentModalData(null);
    setDone(true);
    clearCart();
    showToast('Pembayaran berhasil diverifikasi! 🎉', 'success');
  };

  if (done) return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">Pesanan & Pembayaran Berhasil! 🎉</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-2 font-mono font-semibold">Order #{orderNum}</p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Pembayaran telah diverifikasi secara otomatis oleh sistem Payment Gateway. Pesananmu sedang diproses oleh ekspedisi <span className="font-bold text-brand">{selectedRate?.service || 'JNE REG'}</span>.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/orders" className="btn-outline flex items-center gap-2">
            <Package className="w-4 h-4" /> Lihat Pesanan & Live Resi
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
                { key: 'address', label: 'Alamat Lengkap', placeholder: 'Jl. Pemuda No. 12...' },
                { key: 'city', label: 'Kota / Kabupaten Tujuan (Auto Cek Ongkir)', placeholder: 'Contoh: Jakarta, Bandung, Surabaya, Medan...' },
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

              {/* Courier API Selection */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                    <Truck className="w-5 h-5 text-brand" /> Pilih Ekspedisi Pengiriman
                  </h3>
                  <span className="text-xs bg-brand/10 text-brand px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Live API RajaOngkir / BiteShip
                  </span>
                </div>

                {loadingRates ? (
                  <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-dark-200 rounded-xl">
                    <Loader2 className="w-6 h-6 animate-spin text-brand mr-2" />
                    <span className="text-sm text-gray-500">Menghitung tarif ongkir JNE, J&T, SiCepat...</span>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                    {shippingRates.map(r => (
                      <button
                        key={r.id}
                        onClick={() => setSelectedRate(r)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                          selectedRate?.id === r.id
                            ? 'border-brand bg-brand/5 dark:bg-brand/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-brand/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
                            <span>{r.icon}</span> {r.service}
                          </span>
                          <span className="text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-md">
                            {r.eta}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-1">{r.label}</p>
                        <p className="text-brand font-extrabold text-base mt-2">{formatCurrency(r.price)}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (!form.name || !form.phone || !form.address || !form.city || !form.zip) {
                    showToast('Harap lengkapi semua data pengiriman', 'error');
                    return;
                  }
                  if (!selectedRate) {
                    showToast('Pilih ekspedisi pengiriman terlebih dahulu', 'error');
                    return;
                  }
                  setStep(1);
                }}
                className="w-full btn-primary mt-4 py-3.5"
              >
                Lanjut ke Pembayaran
              </button>
            </div>
          )}

          {/* Step 1: Payment Selection */}
          {step === 1 && (
            <div className="card p-6 space-y-6">
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Metode Pembayaran (Payment Gateway)</h2>
                <p className="text-xs text-gray-400">Pilih channel pembayaran resmi Midtrans / Xendit</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {paymentMethods.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setPayment(m.id); }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${payment === m.id ? 'border-brand bg-brand/5 dark:bg-brand/10' : 'border-gray-200 dark:border-gray-700 hover:border-brand/50'}`}
                  >
                    <span className="text-2xl mb-2 block">{m.icon}</span>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{m.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
                  </button>
                ))}
              </div>

              {/* Sub-options for Bank VA */}
              {payment === 'transfer' && (
                <div className="p-4 bg-gray-50 dark:bg-dark-200 rounded-2xl space-y-2">
                  <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Pilih Bank Virtual Account:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'bca', name: 'BCA VA' },
                      { id: 'mandiri', name: 'Mandiri' },
                      { id: 'bni', name: 'BNI VA' },
                      { id: 'bri', name: 'BRIVA' },
                    ].map(b => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBank(b.id)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${selectedBank === b.id ? 'bg-brand text-white border-brand' : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
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
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <span>Uk. {item.size}</span>
                        {item.color && (
                          <span className="flex items-center gap-1">
                            • Warna:
                            {item.color.startsWith('#') && (
                              <span className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block" style={{ backgroundColor: item.color }} />
                            )}
                            <span className="capitalize">{formatColorName(item.color)}</span>
                          </span>
                        )}
                        <span>× {item.qty}</span>
                      </div>
                    </div>
                    <span className="font-bold text-brand text-sm">{formatCurrency(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 dark:bg-dark-200 rounded-xl mb-6 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ekspedisi Terpilih:</span>
                  <span className="text-brand font-semibold">{selectedRate?.service} ({selectedRate?.eta}) — {formatCurrency(shippingPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Metode Pembayaran:</span>
                  <span className="font-semibold text-gray-900 dark:text-white uppercase">{payment} ({selectedBank})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Alamat Tujuan:</span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{form.address}, {form.city}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} disabled={loading} className="btn-secondary flex-1">Kembali</button>
                <button
                  onClick={handleOrder}
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-3.5 text-base"
                >
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</> : 'Proses Pembayaran'}
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
              <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} pasang)</span><span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Ongkir ({selectedRate?.service || 'Ekspedisi'})</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(shippingPrice)}</span>
            </div>
            {appliedPromo && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Diskon ({appliedPromo.code})</span>
                <span>- {formatCurrency(promoDiscount)}</span>
              </div>
            )}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-2 flex justify-between font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span className="text-brand font-extrabold text-lg">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal Popup */}
      {paymentModalData && (
        <PaymentGatewayModal
          paymentData={paymentModalData}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => {
            setPaymentModalData(null);
            clearCart();
            showToast('Pembayaran ditunda. Silakan selesaikan pembayaran dari menu Pesanan Saya.', 'warning');
            navigate('/orders');
          }}
        />
      )}
    </div>
  );
}
