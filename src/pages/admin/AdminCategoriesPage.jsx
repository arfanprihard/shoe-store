import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';
import api from '../../utils/api';
import { useUIStore } from '../../store/uiStore';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', icon: '' });
  const [showAdd, setShowAdd] = useState(false);
  const showToast = useUIStore(s => s.showToast);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/categories');
      setCategories(data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const resetForm = () => { setForm({ name: '', slug: '', icon: '' }); setEditId(null); setShowAdd(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/admin/categories/${editId}`, form);
        showToast('Kategori diperbarui!', 'success');
      } else {
        await api.post('/admin/categories', { ...form, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-') });
        showToast('Kategori ditambahkan!', 'success');
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.error?.message || 'Gagal menyimpan', 'error');
    }
  };

  const startEdit = (cat) => { setEditId(cat.id); setForm({ name: cat.name, slug: cat.slug, icon: cat.icon || '' }); setShowAdd(true); };

  const handleDelete = async (id, name) => {
    if (!confirm(`Hapus kategori "${name}"?`)) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      showToast('Kategori dihapus', 'success');
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.error?.message || 'Gagal menghapus', 'error');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{categories.length} kategori</p>
        <button onClick={() => { resetForm(); setShowAdd(true); }} className="btn-primary py-2.5 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Kategori
        </button>
      </div>

      {showAdd && (
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card p-5 animate-slide-up">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{editId ? 'Edit Kategori' : 'Kategori Baru'}</h3>
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs text-gray-500 block mb-1">Nama</label>
              <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-base text-sm" placeholder="Sneakers" />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs text-gray-500 block mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className="input-base text-sm" placeholder="sneakers" />
            </div>
            <div className="w-24">
              <label className="text-xs text-gray-500 block mb-1">Icon</label>
              <input type="text" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} className="input-base text-sm" placeholder="🏃" />
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
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Icon</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Nama</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Slug</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Produk</th>
                  <th className="text-right py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-4 text-2xl">{c.icon || '📁'}</td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{c.name}</td>
                    <td className="py-3 px-4 text-gray-500 font-mono text-xs">{c.slug}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{c.productCount}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => startEdit(c)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(c.id, c.name)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
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
