import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import ProductFormModal from '../../components/admin/ProductFormModal';
import Pagination from '../../components/common/Pagination';
import { useUIStore } from '../../store/uiStore';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const showToast = useUIStore(s => s.showToast);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, brandRes, catRes] = await Promise.all([
        api.get('/admin/products', { params: { search, limit: 100 } }),
        api.get('/admin/brands'),
        api.get('/admin/categories'),
      ]);
      setProducts(prodRes.data.data);
      setBrands(brandRes.data.data);
      setCategories(catRes.data.data);
      setCurrentPage(1);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return products.slice(start, start + itemsPerPage);
  }, [products, currentPage, itemsPerPage]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Nonaktifkan produk "${name}"?`)) return;
    try {
      await api.delete(`/admin/products/${id}`);
      showToast('Produk dinonaktifkan', 'success');
      fetchProducts();
    } catch {
      showToast('Gagal menghapus produk', 'error');
    }
  };

  const handleSaved = () => {
    setShowModal(false);
    setEditProduct(null);
    showToast(editProduct ? 'Produk diperbarui!' : 'Produk ditambahkan!', 'success');
    fetchProducts();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" placeholder="Cari produk..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="input-base pl-10 py-2.5 text-sm"
          />
        </div>
        <button onClick={() => { setEditProduct(null); setShowModal(true); }} className="btn-primary py-2.5 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Produk
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Loader2 className="w-7 h-7 animate-spin text-brand" /></div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left py-3.5 px-4 text-gray-500 dark:text-gray-400 font-semibold">Produk</th>
                    <th className="text-left py-3.5 px-4 text-gray-500 dark:text-gray-400 font-semibold">Brand</th>
                    <th className="text-left py-3.5 px-4 text-gray-500 dark:text-gray-400 font-semibold">Harga</th>
                    <th className="text-left py-3.5 px-4 text-gray-500 dark:text-gray-400 font-semibold">Stok</th>
                    <th className="text-left py-3.5 px-4 text-gray-500 dark:text-gray-400 font-semibold">Status</th>
                    <th className="text-right py-3.5 px-4 text-gray-500 dark:text-gray-400 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map(p => (
                    <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                            {p.images?.[0]?.url ? (
                              <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">📦</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">{p.name}</p>
                            <p className="text-xs text-gray-400 truncate">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">{p.brand?.name}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">Rp {p.price.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${p.stock <= 5 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>{p.stock}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${p.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {p.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setEditProduct(p); setShowModal(true); }}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(p.id, p.name)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <p className="text-center text-gray-400 py-12">Belum ada produk</p>
              )}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={products.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ProductFormModal
          product={editProduct}
          brands={brands}
          categories={categories}
          onClose={() => { setShowModal(false); setEditProduct(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
