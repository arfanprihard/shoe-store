import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';
import api from '../../utils/api';
import { useUIStore } from '../../store/uiStore';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', logo: '' });
  const [showAdd, setShowAdd] = useState(false);
  const showToast = useUIStore(s => s.showToast);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/brands');
      setBrands(data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchBrands(); }, []);

  const resetForm = () => { setForm({ name: '', slug: '', logo: '' }); setEditId(null); setShowAdd(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/admin/brands/${editId}`, form);
        showToast('Brand diperbarui!', 'success');
      } else {
        await api.post('/admin/brands', { ...form, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-') });
        showToast('Brand ditambahkan!', 'success');
      }
      resetForm();
      fetchBrands();
    } catch (err) {
      showToast(err.response?.data?.error?.message || 'Gagal menyimpan', 'error');
    }
  };

  const startEdit = (brand) => { setEditId(brand.id); setForm({ name: brand.name, slug: brand.slug, logo: brand.logo || '' }); setShowAdd(true); };

  const handleDelete = async (id, name) => {
    if (!confirm(`Hapus brand "${name}"?`)) return;
    try {
      await api.delete(`/admin/brands/${id}`);
      showToast('Brand dihapus', 'success');
      fetchBrands();
    } catch (err) {
      showToast(err.response?.data?.error?.message || 'Gagal menghapus', 'error');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{brands.length} brand</p>
        <button onClick={() => { resetForm(); setShowAdd(true); }} className="btn-primary py-2.5 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Brand
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card p-5 animate-slide-up">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{editId ? 'Edit Brand' : 'Brand Baru'}</h3>
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs text-gray-500 block mb-1">Nama</label>
              <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-base text-sm" placeholder="Nike" />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs text-gray-500 block mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className="input-base text-sm" placeholder="nike" />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs text-gray-500 block mb-1">Logo URL</label>
              <input type="text" value={form.logo} onChange={e => setForm(p => ({ ...p, logo: e.target.value }))} className="input-base text-sm" placeholder="https://..." />
            </div>
            <button type="submit" className="btn-primary py-2.5 px-4 text-sm"><Check className="w-4 h-4" /></button>
            <button type="button" onClick={resetForm} className="btn-secondary py-2.5 px-4 text-sm"><X className="w-4 h-4" /></button>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Loader2 className="w-7 h-7 animate-spin text-brand" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Brand</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Slug</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Produk</th>
                  <th className="text-right py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {brands.map(b => (
                  <tr key={b.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {b.logo ? (
                          <img src={b.logo} alt={b.name} className="w-8 h-8 rounded-lg object-contain bg-gray-100 dark:bg-gray-800" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand font-bold text-sm">{b.name[0]}</div>
                        )}
                        <span className="font-medium text-gray-900 dark:text-white">{b.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono text-xs">{b.slug}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{b.productCount}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => startEdit(b)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(b.id, b.name)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
