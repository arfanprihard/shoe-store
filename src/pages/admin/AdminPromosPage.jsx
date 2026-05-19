import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import { useUIStore } from '../../store/uiStore';

export default function AdminPromosPage() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const showToast = useUIStore(s => s.showToast);

  const [form, setForm] = useState({
    code: '', type: 'PERCENTAGE', value: '', minPurchase: '', maxDiscount: '',
    usageLimit: '', startDate: '', endDate: '',
  });

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/promos');
      setPromos(data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchPromos(); }, []);

  const update = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/promos', form);
      showToast('Promo berhasil ditambahkan!', 'success');
      setShowForm(false);
      setForm({ code: '', type: 'PERCENTAGE', value: '', minPurchase: '', maxDiscount: '', usageLimit: '', startDate: '', endDate: '' });
      fetchPromos();
    } catch (err) {
      showToast(err.response?.data?.error?.message || 'Gagal menambah promo', 'error');
    }
    setSaving(false);
  };

  const handleDelete = async (id, code) => {
    if (!confirm(`Hapus promo "${code}"?`)) return;
    try {
      await api.delete(`/admin/promos/${id}`);
      showToast('Promo dihapus', 'success');
      fetchPromos();
    } catch {
      showToast('Gagal menghapus promo', 'error');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{promos.length} kode promo</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary py-2.5 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Promo
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card p-5 animate-slide-up">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Promo Baru</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <input type="text" required value={form.code} onChange={update('code')} className="input-base text-sm" placeholder="Kode (cth: DISKON20)" />
            <select value={form.type} onChange={update('type')} className="input-base text-sm">
              <option value="PERCENTAGE">Persentase (%)</option>
              <option value="FIXED">Nominal (Rp)</option>
            </select>
            <input type="number" required value={form.value} onChange={update('value')} className="input-base text-sm" placeholder={form.type === 'PERCENTAGE' ? 'Nilai (%)' : 'Nilai (Rp)'} />
            <input type="number" value={form.minPurchase} onChange={update('minPurchase')} className="input-base text-sm" placeholder="Min. Belanja (Rp)" />
            <input type="number" value={form.maxDiscount} onChange={update('maxDiscount')} className="input-base text-sm" placeholder="Maks. Diskon (Rp)" />
            <input type="number" value={form.usageLimit} onChange={update('usageLimit')} className="input-base text-sm" placeholder="Batas Pemakaian" />
            <input type="date" required value={form.startDate} onChange={update('startDate')} className="input-base text-sm" />
            <input type="date" required value={form.endDate} onChange={update('endDate')} className="input-base text-sm" />
            <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary py-2 text-sm">Batal</button>
              <button type="submit" disabled={saving} className="btn-primary py-2 text-sm flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Loader2 className="w-7 h-7 animate-spin text-brand" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Kode</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Tipe</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Nilai</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Min. Belanja</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Pemakaian</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Berlaku</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {promos.map(promo => {
                  const now = new Date();
                  const active = promo.isActive && new Date(promo.startDate) <= now && new Date(promo.endDate) >= now;
                  return (
                    <tr key={promo.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-brand">{promo.code}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{promo.type === 'PERCENTAGE' ? 'Persentase' : 'Nominal'}</td>
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{promo.type === 'PERCENTAGE' ? `${promo.value}%` : `Rp ${promo.value.toLocaleString('id-ID')}`}</td>
                      <td className="py-3 px-4 text-gray-500">{promo.minPurchase ? `Rp ${promo.minPurchase.toLocaleString('id-ID')}` : '-'}</td>
                      <td className="py-3 px-4 text-gray-500">{promo.usageCount}/{promo.usageLimit || '∞'}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {new Date(promo.startDate).toLocaleDateString('id-ID')} — {new Date(promo.endDate).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => handleDelete(promo.id, promo.code)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {promos.length === 0 && <p className="text-center text-gray-400 py-12">Belum ada kode promo</p>}
          </div>
        )}
      </div>
    </div>
  );
}
