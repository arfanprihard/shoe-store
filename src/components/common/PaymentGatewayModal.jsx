import React, { useState } from 'react';
import { X, Copy, CheckCircle2, ShieldCheck, QrCode, CreditCard, Building2, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

export default function PaymentGatewayModal({ paymentData, onPaymentSuccess, onClose }) {
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);

  if (!paymentData) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulatePayment = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      onPaymentSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-dark-card rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-800 animate-slide-up">
        {/* Gateway Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center font-black text-sm">
              S
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                StepLuxe Payment Gateway <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-[11px] text-gray-300 font-mono">Midtrans / Xendit Secure Payment</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Summary */}
        <div className="p-5 bg-gray-50 dark:bg-dark-200/60 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Total Pembayaran</p>
            <p className="text-2xl font-black text-brand font-display">{formatCurrency(paymentData.amount || 0)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-gray-400">Order ID</p>
            <p className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200">{paymentData.orderNumber}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* QRIS Mode */}
          {paymentData.type === 'QRIS' && (
            <div className="text-center space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <QrCode className="w-4 h-4" /> Scan QRIS (All E-Wallet & M-Banking)
              </span>

              <div className="relative w-56 h-56 mx-auto bg-white p-3 rounded-2xl border-2 border-dashed border-gray-300 shadow-md flex items-center justify-center">
                <img src={paymentData.qrisUrl} alt="QRIS Code" className="w-full h-full object-contain" />
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-500">
                <span>GoPay</span> • <span>OVO</span> • <span>DANA</span> • <span>ShopeePay</span> • <span>BCA Mobile</span>
              </div>
            </div>
          )}

          {/* Virtual Account Mode */}
          {paymentData.type === 'VIRTUAL_ACCOUNT' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-brand/5 border border-brand/20">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                  <Building2 className="w-4 h-4 text-brand" /> Bank {paymentData.bank} Virtual Account
                </p>
                <div className="flex items-center justify-between bg-white dark:bg-dark-card p-3 rounded-xl border border-gray-200 dark:border-gray-700 mt-2">
                  <span className="font-mono text-lg font-black tracking-wider text-gray-900 dark:text-white">
                    {paymentData.vaNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(paymentData.vaNumber)}
                    className="flex items-center gap-1.5 text-xs font-bold text-brand bg-brand/10 hover:bg-brand/20 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Tersalin!' : 'Salin VA'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Instructions list */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Petunjuk Cara Bayar:</p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
              {paymentData.instructions?.map((inst, idx) => (
                <li key={idx} className="leading-relaxed">{inst}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-dark-card/50 space-y-2">
          <button
            onClick={handleSimulatePayment}
            disabled={verifying}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-emerald-500/20"
          >
            {verifying ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Verifikasi Otomatis...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Simulasi Pembayaran Berhasil (Test Direct)</>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 py-1"
          >
            Bayar Nanti (Kembali ke Pesanan)
          </button>
        </div>
      </div>
    </div>
  );
}
