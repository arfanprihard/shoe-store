import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) { setSubmitted(true); setEmail(''); }
  };

  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-brand/10 to-primary-100 dark:from-brand/10 dark:to-dark-card rounded-3xl p-10 border border-brand/20">
          <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-7 h-7 text-brand" />
          </div>
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Dapatkan Penawaran Eksklusif
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Subscribe newsletter kami dan dapatkan diskon 10% untuk pembelian pertamamu!
          </p>
          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle className="w-5 h-5" /> Terima kasih! Cek email kamu. 🎉
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="input-base flex-1"
              />
              <button type="submit" className="btn-primary flex items-center gap-2 flex-shrink-0">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
          <p className="text-xs text-gray-400 mt-4">Tidak ada spam. Berhenti berlangganan kapan saja.</p>
        </div>
      </div>
    </section>
  );
}
