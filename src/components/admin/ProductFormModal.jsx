import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';
import api from '../../utils/api';

export default function ProductFormModal({ product, brands, categories, onClose, onSaved }) {
  const isEdit = !!product;
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || '',
    originalPrice: product?.originalPrice || '',
    stock: product?.stock || 0,
    brandId: product?.brand?.id || product?.brandId || '',
    categoryId: product?.category?.id || product?.categoryId || '',
    isNew: product?.isNew || false,
    isBestSeller: product?.isBestSeller || false,
    images: product?.images?.map(i => i.url || i) || [],
    colors: product?.colors || [],
    sizes: product?.sizes?.map(s => ({ size: s.size || s, stock: s.stock || 0 })) || [],
    tags: product?.tags?.map(t => t.tag || t) || [],
  });

  const [newColor, setNewColor] = useState({ name: '', hexValue: '#000000' });
  const [newSize, setNewSize] = useState({ size: '', stock: 0 });
  const [newTag, setNewTag] = useState('');

  const update = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(p => ({
      ...p,
      [field]: val,
      ...(field === 'name' && !isEdit ? { slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') } : {}),
    }));
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(f => formData.append('images', f));
      const { data } = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm(p => ({ ...p, images: [...p.images, ...data.data] }));
    } catch (err) {
      setError('Gagal upload gambar');
    }
    setUploading(false);
  };

  const removeImage = (idx) => setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));

  const addColor = () => {
    if (!newColor.name) return;
    setForm(p => ({ ...p, colors: [...p.colors, { ...newColor }] }));
    setNewColor({ name: '', hexValue: '#000000' });
  };

  const removeColor = (idx) => setForm(p => ({ ...p, colors: p.colors.filter((_, i) => i !== idx) }));

  const addSize = () => {
    if (!newSize.size) return;
    setForm(p => ({ ...p, sizes: [...p.sizes, { size: +newSize.size, stock: +newSize.stock }] }));
    setNewSize({ size: '', stock: 0 });
  };

  const removeSize = (idx) => setForm(p => ({ ...p, sizes: p.sizes.filter((_, i) => i !== idx) }));

  const addTag = () => {
    if (!newTag.trim()) return;
    setForm(p => ({ ...p, tags: [...p.tags, newTag.trim()] }));
    setNewTag('');
  };

  const removeTag = (idx) => setForm(p => ({ ...p, tags: p.tags.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, price: +form.price, originalPrice: form.originalPrice ? +form.originalPrice : null, stock: +form.stock };
      if (isEdit) {
        await api.put(`/admin/products/${product.id}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Gagal menyimpan produk');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto bg-black/50">
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-2xl animate-slide-up my-4">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">
            {isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Name & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Nama Produk</label>
              <input type="text" required value={form.name} onChange={update('name')} className="input-base" placeholder="Nike Air Max 270" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Slug</label>
              <input type="text" required value={form.slug} onChange={update('slug')} className="input-base" placeholder="nike-air-max-270" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Deskripsi</label>
            <textarea required value={form.description} onChange={update('description')} rows={3} className="input-base resize-none" placeholder="Deskripsi produk..." />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Harga (Rp)</label>
              <input type="number" required value={form.price} onChange={update('price')} className="input-base" placeholder="1850000" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Harga Asli (Rp)</label>
              <input type="number" value={form.originalPrice} onChange={update('originalPrice')} className="input-base" placeholder="Kosongkan jika tidak ada" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Stok</label>
              <input type="number" required value={form.stock} onChange={update('stock')} className="input-base" />
            </div>
          </div>

          {/* Brand & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Brand</label>
              <select required value={form.brandId} onChange={update('brandId')} className="input-base">
                <option value="">Pilih Brand</option>
                {brands?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Kategori</label>
              <select required value={form.categoryId} onChange={update('categoryId')} className="input-base">
                <option value="">Pilih Kategori</option>
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Flags */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isNew} onChange={update('isNew')} className="accent-brand w-4 h-4" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Produk Baru</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isBestSeller} onChange={update('isBestSeller')} className="accent-brand w-4 h-4" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Best Seller</span>
            </label>
          </div>

          {/* Images Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Gambar Produk</label>
            <div className="flex flex-wrap gap-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                  {i === 0 && <span className="absolute top-1 left-1 bg-brand text-white text-[10px] px-1.5 py-0.5 rounded-full font-semibold">Utama</span>}
                </div>
              ))}
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-gray-400 hover:text-brand hover:border-brand transition-colors">
                {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Upload className="w-6 h-6" /><span className="text-[10px] mt-1">Upload</span></>}
              </button>
              <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Warna</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.colors.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full text-xs font-medium">
                  <span className="w-3.5 h-3.5 rounded-full border border-gray-300" style={{ backgroundColor: c.hexValue }} />
                  {c.name}
                  <button type="button" onClick={() => removeColor(i)} className="text-gray-400 hover:text-red-500 ml-1">✕</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="color" value={newColor.hexValue} onChange={e => setNewColor(p => ({ ...p, hexValue: e.target.value }))} className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
              <input type="text" value={newColor.name} onChange={e => setNewColor(p => ({ ...p, name: e.target.value }))} className="input-base flex-1" placeholder="Nama warna (cth: Hitam)" />
              <button type="button" onClick={addColor} className="btn-secondary px-4 py-2 text-sm">Tambah</button>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Ukuran</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.sizes.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full text-xs font-medium">
                  {s.size} <span className="text-gray-400">(stok: {s.stock})</span>
                  <button type="button" onClick={() => removeSize(i)} className="text-gray-400 hover:text-red-500 ml-1">✕</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="number" value={newSize.size} onChange={e => setNewSize(p => ({ ...p, size: e.target.value }))} className="input-base w-24" placeholder="Ukuran" />
              <input type="number" value={newSize.stock} onChange={e => setNewSize(p => ({ ...p, stock: e.target.value }))} className="input-base w-24" placeholder="Stok" />
              <button type="button" onClick={addSize} className="btn-secondary px-4 py-2 text-sm">Tambah</button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.tags.map((t, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-brand/10 text-brand px-3 py-1.5 rounded-full text-xs font-medium">
                  {t}
                  <button type="button" onClick={() => removeTag(i)} className="hover:text-red-500 ml-1">✕</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newTag} onChange={e => setNewTag(e.target.value)} className="input-base flex-1" placeholder="Tag baru"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
              <button type="button" onClick={addTag} className="btn-secondary px-4 py-2 text-sm">Tambah</button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 dark:border-gray-700">
          <button type="button" onClick={onClose} className="btn-secondary py-2.5">Batal</button>
          <button onClick={handleSubmit} disabled={saving} className="btn-primary py-2.5 flex items-center gap-2">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
          </button>
        </div>
      </div>
    </div>
  );
}
