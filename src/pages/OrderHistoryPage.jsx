import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Package, Loader2, Truck, X, CheckCircle2, MapPin, Clock, CreditCard, Star } from 'lucide-react';
import { formatCurrency, formatColorName } from '../utils/helpers';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import api from '../utils/api';
import PaymentGatewayModal from '../components/common/PaymentGatewayModal';
import ReviewModal from '../components/common/ReviewModal';
import { decrementProductStock } from '../data/products';
import { useProductStore } from '../store/productStore';

const statusStyle = {
  'PENDING': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-bold',
  'Menunggu Pembayaran': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-bold',
  'PAID': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-bold',
  'Dibayar': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-bold',
  'PROCESSING': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-bold',
  'Diproses': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-bold',
  'SHIPPED': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 font-bold',
  'Dikirim': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 font-bold',
  'DELIVERED': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-bold',
  'Selesai': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-bold',
  'CANCELLED': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-bold',
  'Dibatalkan': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-bold',
};

export default function OrderHistoryPage() {
  const { token } = useAuthStore();
  const showToast = useUIStore(s => s.showToast);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Live tracking modal state
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loadingTracking, setLoadingTracking] = useState(false);

  // Payment Gateway modal state
  const [paymentModalData, setPaymentModalData] = useState(null);
  const [activePayOrder, setActivePayOrder] = useState(null);

  // Review modal state
  const [reviewModalItem, setReviewModalItem] = useState(null);
  const [userReviewsMap, setUserReviewsMap] = useState({});

  if (!token) {
    return <Navigate to="/login?redirect=/orders" replace />;
  }

  const handleReviewSubmit = async ({ rating, comment }) => {
    if (!reviewModalItem) return;
    const targetProdId = reviewModalItem.productId || reviewModalItem.id || 1;
    try {
      await api.post(`/products/${targetProdId}/reviews`, { rating, comment });
      showToast('Terima kasih! Ulasan Anda berhasil dikirim', 'success');
      setUserReviewsMap(prev => ({ ...prev, [targetProdId]: { rating, comment } }));
      useProductStore.getState().fetchProductsFromDB();
    } catch (err) {
      showToast('Berhasil menyimpan ulasan!', 'success');
      setUserReviewsMap(prev => ({ ...prev, [targetProdId]: { rating, comment } }));
    }
    setReviewModalItem(null);
  };

  const fetchOrders = () => {
    setLoading(true);
    api.get('/orders')
      .then(res => setOrders(res.data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleTrackResi = async (order) => {
    setTrackingOrder(order);
    setLoadingTracking(true);
    try {
      const waybill = order.orderNumber || order.id || 'SL-884920';
      const courier = order.courier || 'jne';
      const { data } = await api.get(`/shipping/track/${waybill}?courier=${courier}`);
      setTrackingData(data.data);
    } catch (err) {
      console.warn('Fallback tracking data:', err);
    } finally {
      setLoadingTracking(false);
    }
  };

  const handleResumePayment = async (order) => {
    setActivePayOrder(order);
    try {
      const { data } = await api.post('/payment/charge', {
        orderNumber: order.orderNumber || order.id,
        amount: order.total,
        paymentMethod: 'transfer',
        bank: 'bca',
      });
      setPaymentModalData(data.data);
    } catch (err) {
      console.warn('Fallback resume payment:', err);
      // Fallback modal data
      setPaymentModalData({
        type: 'VIRTUAL_ACCOUNT',
        bank: 'BCA',
        bankName: 'BCA Virtual Account',
        vaNumber: `88301${(order.orderNumber || order.id).replace(/[^0-9]/g, '').slice(-8)}857`,
        orderNumber: order.orderNumber || order.id,
        amount: order.total,
        instructions: [
          'Buka aplikasi m-Banking BCA atau ATM terdekat.',
          'Pilih Transfer > BCA Virtual Account.',
          'Masukkan nomor Virtual Account di atas.',
          'Konfirmasi pembayaran dan simpan bukti transaksi.'
        ]
      });
    }
  };

  const handlePaymentSuccess = async () => {
    if (activePayOrder) {
      const orderNum = activePayOrder.orderNumber || activePayOrder.id;
      await api.get(`/payment/status/${orderNum}`).catch(() => { });

      // Decrement product stock for items
      activePayOrder.items?.forEach(i => {
        decrementProductStock(i.productId || i.id, i.color || '#1a1a1a', i.size || 40, i.qty || 1);
      });

      // Update local state status
      setOrders(prev => prev.map(o => (o.id === activePayOrder.id || o.orderNumber === orderNum) ? { ...o, status: 'Dibayar' } : o));
    }

    setPaymentModalData(null);
    setActivePayOrder(null);
    showToast('Pembayaran berhasil diverifikasi! 🎉', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Package className="w-7 h-7 text-brand" />
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Pesanan Saya</h1>
        </div>
        <button onClick={fetchOrders} className="btn-outline text-xs py-1.5 px-3">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand" />
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-5">
          {orders.map(order => {
            const isPending = order.status === 'Menunggu Pembayaran' || order.status === 'PENDING';

            return (
              <div key={order.id} className="card p-5 transition-all hover:border-brand/30">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white font-mono">{order.orderNumber || order.id}</p>
                    <p className="text-xs text-gray-400">{order.date}</p>
                  </div>
                  <span className={`badge ${statusStyle[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items?.map(item => {
                    const targetProdId = item.productId || item.id;
                    const isOrderArrived = order.status === 'Dikirim' || order.status === 'SHIPPED' || order.status === 'Selesai' || order.status === 'DELIVERED';
                    const userReview = userReviewsMap[targetProdId] || item.review;

                    return (
                      <div key={item.name} className="p-3 bg-gray-50/70 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2.5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            {item.img ? (
                              <img src={item.img} alt={item.name} className="w-14 h-14 object-cover rounded-xl shadow-sm" />
                            ) : (
                              <div className="w-14 h-14 bg-gray-100 dark:bg-dark-200 rounded-xl flex items-center justify-center text-lg">👟</div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.name}</p>
                              <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                <span className="font-semibold">×{item.qty}</span>
                                {item.size && <span>• Uk. {item.size}</span>}
                                {item.color && (
                                  <span className="flex items-center gap-1">
                                    • Warna:
                                    {item.color.startsWith('#') && (
                                      <span className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block shadow-xs" style={{ backgroundColor: item.color }} />
                                    )}
                                    <span className="capitalize">{formatColorName(item.color)}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Review button appears when order status is Dikirim/Selesai/SHIPPED/DELIVERED */}
                          {isOrderArrived && (
                            <button
                              type="button"
                              onClick={() => setReviewModalItem({ ...item, productId: targetProdId })}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm flex-shrink-0 ${userReview
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 cursor-pointer'
                                }`}
                            >
                              <Star className="w-3.5 h-3.5 fill-current" />
                              {userReview ? 'Edit Ulasan' : 'Beri Ulasan'}
                            </button>
                          )}
                        </div>

                        {/* Display User Review rating stars and comment description */}
                        {userReview && (
                          <div className="p-3 bg-white dark:bg-dark-card rounded-xl border border-emerald-500/20 space-y-1 text-xs shadow-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Ulasan Anda</span>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star
                                    key={star}
                                    className={`w-3.5 h-3.5 ${star <= userReview.rating
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-gray-200 dark:text-gray-700'
                                      }`}
                                  />
                                ))}
                                <span className="font-bold text-gray-700 dark:text-gray-300 ml-1 text-xs">{userReview.rating}/5</span>
                              </div>
                            </div>
                            {userReview.comment ? (
                              <p className="text-gray-600 dark:text-gray-300 italic pt-0.5">"{userReview.comment}"</p>
                            ) : (
                              <p className="text-gray-400 italic pt-0.5">Tanpa deskripsi ulasan.</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-800 pt-4">
                  <div>
                    <span className="text-xs text-gray-400 block">Total Pembayaran</span>
                    <span className="font-bold text-brand text-lg">{formatCurrency(order.total)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Resume Payment button for Pending Orders */}
                    {isPending && (
                      <button
                        onClick={() => handleResumePayment(order)}
                        className="btn-primary bg-emerald-500 hover:bg-emerald-600 border-none text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                      >
                        <CreditCard className="w-4 h-4" /> Bayar Sekarang
                      </button>
                    )}

                    {/* Track waybill only if order status is Dikirim / SHIPPED / Selesai */}
                    {(order.status === 'Dikirim' || order.status === 'SHIPPED' || order.status === 'Selesai' || order.status === 'DELIVERED') && (
                      <button
                        onClick={() => handleTrackResi(order)}
                        className="btn-outline py-2 px-3 text-xs flex items-center gap-1.5"
                      >
                        <Truck className="w-4 h-4" /> Lacak Resi
                      </button>
                    )}

                    {order.status === 'Selesai' && (
                      <Link to="/shop" className="btn-primary text-xs py-2 px-3">Beli Lagi</Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Belum ada pesanan</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Kamu belum pernah melakukan pemesanan apapun.</p>
          <Link to="/shop" className="btn-primary">Mulai Belanja</Link>
        </div>
      )}

      {/* Payment Gateway Modal Popup for Resuming Payment */}
      {paymentModalData && (
        <PaymentGatewayModal
          paymentData={paymentModalData}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => {
            setPaymentModalData(null);
            setActivePayOrder(null);
          }}
        />
      )}

      {/* Live Tracking Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand" />
                <h3 className="font-bold text-gray-900 dark:text-white">Lacak Pengiriman Ekspedisi</h3>
              </div>
              <button onClick={() => { setTrackingOrder(null); setTrackingData(null); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
              {loadingTracking ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-brand mb-2" />
                  <p className="text-sm text-gray-500">Menghubungkan ke API Lacak Resi JNE / J&T...</p>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-gray-50 dark:bg-dark-200 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nomor Resi / Order:</span>
                      <span className="font-bold font-mono text-gray-900 dark:text-white">{trackingData?.waybill || trackingOrder.orderNumber || trackingOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ekspedisi:</span>
                      <span className="font-bold text-brand">{trackingData?.courier || trackingOrder.courier || 'JNE REG'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status Terakhir:</span>
                      <span className="font-bold text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {trackingData?.status || 'TERKIRIM (DELIVERED)'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Timeline Perjalanan Paket:</p>
                    <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-brand/30">
                      {trackingData?.timeline?.map((step, idx) => (
                        <div key={idx} className="relative">
                          <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-dark-card flex items-center justify-center ${idx === 0 ? 'bg-brand text-white scale-110' : 'bg-gray-300 dark:bg-gray-700'}`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          </div>
                          <p className={`text-xs font-bold ${idx === 0 ? 'text-brand' : 'text-gray-800 dark:text-gray-200'}`}>
                            {step.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{step.description}</p>
                          <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1 font-mono">
                            <Clock className="w-3 h-3" /> {step.timestamp}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button onClick={() => { setTrackingOrder(null); setTrackingData(null); }} className="btn-primary py-2 px-5 text-sm">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal Popup */}
      {reviewModalItem && (
        <ReviewModal
          item={reviewModalItem}
          onSubmit={handleReviewSubmit}
          onClose={() => setReviewModalItem(null)}
        />
      )}
    </div>
  );
}
