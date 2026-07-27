import React, { useState } from 'react';
import { X, Star, Loader2, Send, Package } from 'lucide-react';

const ratingLabels = {
  1: 'Sangat Buruk',
  2: 'Kurang Puas',
  3: 'Cukup Baik',
  4: 'Bagus & Puas',
  5: 'Sangat Memuaskan',
};

export default function ReviewModal({ item, onSubmit, onClose }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit({ rating, comment });
    setSubmitting(false);
  };

  const activeRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-dark-card rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h3 className="font-bold text-gray-900 dark:text-white">Beri Ulasan Produk</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-xl hover:bg-gray-200/50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Product Thumbnail */}
          <div className="flex items-center gap-3.5 p-3.5 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800">
            {item.img ? (
              <img src={item.img} alt={item.name} className="w-14 h-14 object-cover rounded-xl shadow-sm" />
            ) : (
              <div className="w-14 h-14 bg-brand/10 text-brand rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-brand" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs text-brand font-semibold mb-0.5">Produk Telah Diterima</p>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{item.name}</h4>
              {item.size && <p className="text-xs text-gray-400">Ukuran: {item.size}</p>}
            </div>
          </div>

          {/* Interactive Star Rating */}
          <div className="text-center py-2">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-2">
              BAGAIMANA KUALITAS PRODUK INI?
            </label>
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-9 h-9 transition-colors ${
                      star <= activeRating
                        ? 'text-amber-400 fill-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]'
                        : 'text-gray-200 dark:text-gray-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-amber-500 h-4">
              {ratingLabels[activeRating]}
            </p>
          </div>

          {/* Comment input */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
              Ulasan Pengalaman Anda (Opsional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input-base text-xs resize-none"
              placeholder="Ceritakan bahan, kenyamanan, kerapihan packing, atau respon penjual..."
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2.5 text-xs font-semibold">
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-none shadow-lg shadow-amber-500/20"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</>
              ) : (
                <><Send className="w-4 h-4" /> Kirim Ulasan</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
