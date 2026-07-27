import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';
import api from '../../utils/api';
import Pagination from '../../components/common/Pagination';
import { useUIStore } from '../../store/uiStore';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const showToast = useUIStore(s => s.showToast);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/categories');
      setCategories(data.data);
      setCurrentPage(1);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return categories.slice(start, start + itemsPerPage);
  }, [categories, currentPage, itemsPerPage]);

  const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const resetForm = () => { setForm({ name: '', slug: '' }); setEditId(null); setShowAdd(false); };

  const handleNameChange = (val) => {
    setForm({
      name: val,
      slug: generateSlug(val),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        slug: form.slug || generateSlug(form.name),
      };

      if (editId) {
        await api.put(`/admin/categories/${editId}`, payload);
        showToast('Kategori diperbarui!', 'success');
      } else {
        await api.post('/admin/categories', payload);
        showToast('Kategori ditambahkan!', 'success');
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.error?.message || 'Gagal menyimpan', 'error');
    }
  };

  const startEdit = (cat) => { setEditId(cat.id); setForm({ name: cat.name, slug: cat.slug || generateSlug(cat.name) }); setShowAdd(true); };

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
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="text-xs text-gray-500 block mb-1">Nama Kategori</label>
              <input type="text" required value={form.name} onChange={e => handleNameChange(e.target.value)} className="input-base text-sm" placeholder="Contoh: Sneakers" />
              <p className="text-[11px] text-gray-400 mt-1">Slug otomatis: <code className="text-brand font-mono">{form.slug || '—'}</code></p>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary py-2.5 px-4 text-sm flex items-center gap-1.5"><Check className="w-4 h-4" /> Simpan</button>
              <button type="button" onClick={resetForm} className="btn-secondary py-2.5 px-4 text-sm"><X className="w-4 h-4" /></button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Loader2 className="w-7 h-7 animate-spin text-brand" /></div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left py-3.5 px-5 text-gray-500 dark:text-gray-400 font-semibold">Nama Kategori</th>
                    <th className="text-left py-3.5 px-5 text-gray-500 dark:text-gray-400 font-semibold">Slug URL</th>
                    <th className="text-left py-3.5 px-5 text-gray-500 dark:text-gray-400 font-semibold">Jumlah Produk</th>
                    <th className="text-right py-3.5 px-5 text-gray-500 dark:text-gray-400 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCategories.map(c => (
                    <tr key={c.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-gray-900 dark:text-white">{c.name}</td>
                      <td className="py-3.5 px-5 text-gray-500 font-mono text-xs">{c.slug}</td>
                      <td className="py-3.5 px-5 text-gray-600 dark:text-gray-300 font-medium">{c.productCount} produk</td>
                      <td className="py-3.5 px-5 text-right">
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

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={categories.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
