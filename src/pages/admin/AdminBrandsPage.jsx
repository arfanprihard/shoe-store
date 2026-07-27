import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';
import api from '../../utils/api';
import Pagination from '../../components/common/Pagination';
import { useUIStore } from '../../store/uiStore';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', logo: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const showToast = useUIStore(s => s.showToast);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/brands');
      setBrands(data.data);
      setCurrentPage(1);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchBrands(); }, []);

  const totalPages = Math.ceil(brands.length / itemsPerPage);
  const paginatedBrands = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return brands.slice(start, start + itemsPerPage);
  }, [brands, currentPage, itemsPerPage]);

  const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const resetForm = () => { setForm({ name: '', slug: '', logo: '' }); setEditId(null); setShowAdd(false); };

  const handleNameChange = (val) => {
    setForm(p => ({
      ...p,
      name: val,
      slug: generateSlug(val),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        slug: form.slug || generateSlug(form.name),
      };

      if (editId) {
        await api.put(`/admin/brands/${editId}`, payload);
        showToast('Brand diperbarui!', 'success');
      } else {
        await api.post('/admin/brands', payload);
        showToast('Brand ditambahkan!', 'success');
      }
      resetForm();
      fetchBrands();
    } catch (err) {
      showToast(err.response?.data?.error?.message || 'Gagal menyimpan', 'error');
    }
  };

  const startEdit = (brand) => { setEditId(brand.id); setForm({ name: brand.name, slug: brand.slug || generateSlug(brand.name), logo: brand.logo || '' }); setShowAdd(true); };

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
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="text-xs text-gray-500 block mb-1">Nama Brand</label>
              <input type="text" required value={form.name} onChange={e => handleNameChange(e.target.value)} className="input-base text-sm" placeholder="Contoh: Nike" />
              <p className="text-[11px] text-gray-400 mt-1">Slug otomatis: <code className="text-brand font-mono">{form.slug || '—'}</code></p>
            </div>
            <div className="flex-1 w-full">
              <label className="text-xs text-gray-500 block mb-1">Logo URL (Opsional)</label>
              <input type="text" value={form.logo} onChange={e => setForm(p => ({ ...p, logo: e.target.value }))} className="input-base text-sm" placeholder="https://..." />
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
                    <th className="text-left py-3.5 px-5 text-gray-500 dark:text-gray-400 font-semibold">Nama Brand</th>
                    <th className="text-left py-3.5 px-5 text-gray-500 dark:text-gray-400 font-semibold">Slug URL</th>
                    <th className="text-left py-3.5 px-5 text-gray-500 dark:text-gray-400 font-semibold">Jumlah Produk</th>
                    <th className="text-right py-3.5 px-5 text-gray-500 dark:text-gray-400 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBrands.map(b => (
                    <tr key={b.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          {b.logo ? (
                            <img src={b.logo} alt={b.name} className="w-8 h-8 rounded-lg object-contain bg-gray-100 dark:bg-gray-800 shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand font-bold text-sm shrink-0">{b.name[0]}</div>
                          )}
                          <span className="font-semibold text-gray-900 dark:text-white">{b.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-gray-500 font-mono text-xs">{b.slug}</td>
                      <td className="py-3.5 px-5 text-gray-600 dark:text-gray-300 font-medium">{b.productCount} produk</td>
                      <td className="py-3.5 px-5 text-right">
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

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={brands.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
