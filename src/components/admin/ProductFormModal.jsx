import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Loader2, Trash2, Layers, Check } from 'lucide-react';
import api from '../../utils/api';
import { addProductToStore, getVariantStock } from '../../data/products';
import { useProductStore } from '../../store/productStore';

const colorPresetMap = {
  hitam: '#000000',
  putih: '#ffffff',
  merah: '#ef4444',
  biru: '#3b82f6',
  hijau: '#16a34a',
  kuning: '#eab308',
  coklat: '#92400e',
  navy: '#1e3a5f',
  abu: '#6b7280',
  'abu-abu': '#6b7280',
};

const defaultHexes = ['#000000', '#ef4444', '#ffffff', '#3b82f6', '#16a34a', '#eab308', '#92400e', '#6b7280'];

const normalizeColorObj = (c, index) => {
  if (!c) return { name: `Warna ${index + 1}`, hexValue: defaultHexes[index % defaultHexes.length] };
  if (typeof c === 'string') {
    const nameLower = c.toLowerCase().trim();
    if (colorPresetMap[nameLower]) {
      return { name: c.trim(), hexValue: colorPresetMap[nameLower] };
    }
    if (c.startsWith('#')) {
      const foundName = Object.keys(colorPresetMap).find(k => colorPresetMap[k] === c.toLowerCase());
      return { name: foundName ? foundName.charAt(0).toUpperCase() + foundName.slice(1) : `Warna ${index + 1}`, hexValue: c };
    }
    return { name: c.trim(), hexValue: defaultHexes[index % defaultHexes.length] };
  }
  return {
    name: c.name || `Warna ${index + 1}`,
    hexValue: c.hexValue || colorPresetMap[c.name?.toLowerCase()] || defaultHexes[index % defaultHexes.length],
  };
};

export default function ProductFormModal({ product, brands, categories, onClose, onSaved }) {
  const isEdit = !!product;
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const initialColors = product?.colors?.length
    ? product.colors.map((c, i) => normalizeColorObj(c, i))
    : [{ name: 'Hitam', hexValue: '#000000' }];

  const initialSizes = product?.sizes?.length
    ? product.sizes.map(s => ({ size: s.size || s, stock: s.stock || 0 }))
    : [
        { size: 39, stock: 5 },
        { size: 40, stock: 5 },
        { size: 41, stock: 5 },
        { size: 42, stock: 5 },
      ];

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
    colors: initialColors,
    sizes: initialSizes,
    variants: typeof product?.variants === 'string' ? JSON.parse(product.variants) : (product?.variants || {}),
    tags: product?.tags?.map(t => t.tag || t) || [],
  });

  const [newColor, setNewColor] = useState({ name: '', hexValue: '#1a1a1a' });
  const [newSize, setNewSize] = useState({ size: '', stock: 5 });
  const [newTag, setNewTag] = useState('');

  const getVariantKey = (c, s, colorIndex) => {
    const cObj = normalizeColorObj(c, colorIndex);
    const hexStr = (cObj.hexValue || '#000000').toString().toLowerCase().trim();
    const sizeNum = (s.size || s).toString();
    return `${hexStr}_${sizeNum}`;
  };

  // Auto-initialize variant stocks if empty
  useEffect(() => {
    if (form.colors.length > 0 && form.sizes.length > 0) {
      setForm(p => {
        const nextVariants = { ...p.variants };
        let updated = false;
        p.colors.forEach((c, cIdx) => {
          const cObj = normalizeColorObj(c, cIdx);
          p.sizes.forEach(s => {
            const kHex = getVariantKey(cObj, s, cIdx);
            const defaultVal = s.stock || 5;
            if (nextVariants[kHex] === undefined) {
              nextVariants[kHex] = defaultVal;
              updated = true;
            }
          });
        });
        if (!updated) return p;

        let total = 0;
        p.colors.forEach((color, cIdx) => {
          const cObj = normalizeColorObj(color, cIdx);
          p.sizes.forEach(size => {
            const k = getVariantKey(cObj, size, cIdx);
            total += (nextVariants[k] !== undefined ? Number(nextVariants[k]) : 5);
          });
        });
        return { ...p, variants: nextVariants, stock: total || p.stock };
      });
    }
  }, [form.colors.length, form.sizes.length]);

  const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const update = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(p => {
      const nextName = field === 'name' ? val : p.name;
      return {
        ...p,
        [field]: val,
        slug: generateSlug(nextName),
      };
    });
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
    if (!newColor.name.trim()) return;
    const nameTrimmed = newColor.name.trim();
    const nameLower = nameTrimmed.toLowerCase();
    const nextIdx = form.colors.length;
    const defaultHex = defaultHexes[nextIdx % defaultHexes.length];

    const finalHex = (newColor.hexValue === '#1a1a1a' && colorPresetMap[nameLower])
      ? colorPresetMap[nameLower]
      : (newColor.hexValue === '#1a1a1a' ? defaultHex : newColor.hexValue);

    const newColorObj = { name: nameTrimmed, hexValue: finalHex };
    setForm(p => ({
      ...p,
      colors: [...p.colors, newColorObj]
    }));
    setNewColor({ name: '', hexValue: '#1a1a1a' });
  };

  const removeColor = (idx) => setForm(p => ({ ...p, colors: p.colors.filter((_, i) => i !== idx) }));

  const addSize = () => {
    if (!newSize.size) return;
    setForm(p => ({ ...p, sizes: [...p.sizes, { size: +newSize.size, stock: +newSize.stock || 5 }] }));
    setNewSize({ size: '', stock: 5 });
  };

  const removeSize = (idx) => setForm(p => ({ ...p, sizes: p.sizes.filter((_, i) => i !== idx) }));

  const handleVariantStockChange = (c, s, colorIndex, stockVal) => {
    const val = Math.max(0, parseInt(stockVal, 10) || 0);
    const cObj = normalizeColorObj(c, colorIndex);
    const kHex = getVariantKey(cObj, s, colorIndex);

    setForm(p => {
      const nextVariants = {
        ...p.variants,
        [kHex]: val,
      };

      let totalStock = 0;
      p.colors.forEach((color, cIdx) => {
        const normC = normalizeColorObj(color, cIdx);
        p.sizes.forEach(size => {
          const k = getVariantKey(normC, size, cIdx);
          totalStock += (nextVariants[k] !== undefined ? Number(nextVariants[k]) : 5);
        });
      });

      return {
        ...p,
        variants: nextVariants,
        stock: totalStock,
      };
    });
  };

  const setAllVariantStocks = (defaultVal = 5) => {
    setForm(p => {
      const nextVariants = {};
      p.colors.forEach((c, cIdx) => {
        const cObj = normalizeColorObj(c, cIdx);
        p.sizes.forEach(s => {
          const kHex = getVariantKey(cObj, s, cIdx);
          nextVariants[kHex] = defaultVal;
        });
      });
      const totalStock = p.colors.length * p.sizes.length * defaultVal;
      return { ...p, variants: nextVariants, stock: totalStock };
    });
  };

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
      const computedTotalStock = Object.keys(form.variants).length > 0
        ? form.colors.reduce((sumC, c, cIdx) => {
            const cObj = normalizeColorObj(c, cIdx);
            return sumC + form.sizes.reduce((sumS, s) => {
              const k = getVariantKey(cObj, s, cIdx);
              return sumS + (form.variants[k] !== undefined ? Number(form.variants[k]) : 5);
            }, 0);
          }, 0)
        : +form.stock;

      const payload = {
        ...form,
        colors: form.colors.map((c, i) => normalizeColorObj(c, i)),
        price: +form.price,
        originalPrice: form.originalPrice ? +form.originalPrice : null,
        stock: computedTotalStock,
      };

      let res;
      if (isEdit) {
        res = await api.put(`/admin/products/${product.id}`, payload);
      } else {
        res = await api.post('/admin/products', payload);
      }

      const createdId = res?.data?.data?.id || (isEdit ? product.id : Date.now());
      const selectedBrandObj = brands?.find(b => b.id == payload.brandId || b.name == payload.brandId);
      const selectedCatObj = categories?.find(c => c.id == payload.categoryId || c.slug == payload.categoryId);

      const formattedStoreProduct = {
        id: Number(createdId),
        name: payload.name,
        brand: selectedBrandObj?.name || 'Nike',
        category: selectedCatObj?.slug || selectedCatObj?.name?.toLowerCase() || 'sneakers',
        price: payload.price,
        originalPrice: payload.originalPrice,
        image: payload.images[0] || '/images/products/nike1.jpg',
        images: payload.images.length > 0 ? payload.images : ['/images/products/nike1.jpg'],
        colors: payload.colors.map(c => (c.hexValue || c).toLowerCase()),
        sizes: payload.sizes.map(s => Number(s.size || s)),
        variants: payload.variants || {},
        rating: product?.rating || 5.0,
        reviewCount: product?.reviewCount || 1,
        stock: payload.stock,
        isNew: payload.isNew,
        isBestSeller: payload.isBestSeller,
      };

      addProductToStore(formattedStoreProduct);
      useProductStore.getState().addProduct(formattedStoreProduct);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Gagal menyimpan produk');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-3xl animate-slide-up my-4 overflow-hidden border border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">
              {isEdit ? 'Edit Produk & Varian Stok' : 'Tambah Produk Baru & Varian'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Kelola detail produk, warna, ukuran, dan matriks stok per varian</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 block mb-1">Nama Produk *</label>
            <input type="text" required value={form.name} onChange={update('name')} className="input-base" placeholder="Contoh: Nike Air Max 270" />
            <span className="text-xs text-gray-400 mt-1 block">Slug URL Otomatis: <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-brand font-mono">{form.slug || 'nama-produk'}</code></span>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 block mb-1">Deskripsi</label>
            <textarea rows={3} value={form.description} onChange={update('description')} className="input-base" placeholder="Jelaskan spesifikasi dan keunggulan produk ini..." />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 block mb-1">Harga Jual (Rp) *</label>
              <input type="number" required value={form.price} onChange={update('price')} className="input-base font-semibold text-brand" placeholder="1500000" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 block mb-1">Harga Asli (Rp)</label>
              <input type="number" value={form.originalPrice} onChange={update('originalPrice')} className="input-base" placeholder="Diskon jika diisi" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 block mb-1">Total Stok Keseluruhan</label>
              <input type="number" readOnly value={form.stock} className="input-base bg-gray-100 dark:bg-gray-800 font-bold text-gray-700 dark:text-gray-300" title="Dihitung otomatis dari jumlah stok varian warna & ukuran" />
            </div>
          </div>

          {/* Brand & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 block mb-1">Brand *</label>
              <select required value={form.brandId} onChange={update('brandId')} className="input-base">
                <option value="">-- Pilih Brand --</option>
                {brands?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 block mb-1">Kategori *</label>
              <select required value={form.categoryId} onChange={update('categoryId')} className="input-base">
                <option value="">-- Pilih Kategori --</option>
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Flags */}
          <div className="flex items-center gap-6 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" checked={form.isNew} onChange={update('isNew')} className="accent-brand w-4 h-4 rounded" />
              ✨ Label "Produk Baru"
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" checked={form.isBestSeller} onChange={update('isBestSeller')} className="accent-brand w-4 h-4 rounded" />
              🔥 Label "Best Seller"
            </label>
          </div>

          {/* Images Upload */}
          <div>
            <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 block mb-2">Foto / Gambar Produk</label>
            <div className="flex flex-wrap gap-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 group shadow-sm">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                  {i === 0 && <span className="absolute top-1 left-1 bg-brand text-white text-[10px] px-2 py-0.5 rounded-md font-bold shadow">Utama</span>}
                </div>
              ))}
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-gray-400 hover:text-brand hover:border-brand transition-colors bg-gray-50/50 dark:bg-gray-800/30">
                {uploading ? <Loader2 className="w-6 h-6 animate-spin text-brand" /> : <><Upload className="w-5 h-5 mb-1" /><span className="text-[11px] font-medium">Upload</span></>}
              </button>
              <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
            </div>
          </div>

          {/* Colors Management */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 block mb-2">1. Pilihan Warna Produk</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {form.colors.map((c, i) => {
                const cObj = normalizeColorObj(c, i);
                return (
                  <span key={i} className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-gray-200 dark:border-gray-700">
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: cObj.hexValue }} />
                    {cObj.name}
                    {form.colors.length > 1 && (
                      <button type="button" onClick={() => removeColor(i)} className="text-gray-400 hover:text-red-500 ml-1">✕</button>
                    )}
                  </span>
                );
              })}
            </div>
            <div className="flex gap-2 max-w-md">
              <input type="color" value={newColor.hexValue} onChange={e => setNewColor(p => ({ ...p, hexValue: e.target.value }))} className="w-10 h-10 rounded-xl border border-gray-300 dark:border-gray-600 cursor-pointer p-0.5" title="Pilih Kode Warna" />
              <input type="text" value={newColor.name} onChange={e => setNewColor(p => ({ ...p, name: e.target.value }))} className="input-base flex-1 text-xs" placeholder="Nama warna (contoh: Hitam, Merah)" />
              <button type="button" onClick={addColor} className="btn-secondary px-4 py-2 text-xs font-semibold">Tambah Warna</button>
            </div>
          </div>

          {/* Sizes Management */}
          <div>
            <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 block mb-2">2. Pilihan Ukuran (Size)</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {form.sizes.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-gray-200 dark:border-gray-700">
                  👟 Size {s.size || s}
                  {form.sizes.length > 1 && (
                    <button type="button" onClick={() => removeSize(i)} className="text-gray-400 hover:text-red-500 ml-1">✕</button>
                  )}
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-md">
              <input type="number" value={newSize.size} onChange={e => setNewSize(p => ({ ...p, size: e.target.value }))} className="input-base text-xs flex-1" placeholder="Ukuran sepatu (contoh: 40)" />
              <button type="button" onClick={addSize} className="btn-secondary px-4 py-2 text-xs font-semibold">Tambah Size</button>
            </div>
          </div>

          {/* Matriks Stok Varian (Warna x Ukuran) */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand" /> 3. Matriks Stok Varian (Warna & Ukuran)
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Atur jumlah stok spesifik untuk setiap kombinasi Warna & Ukuran di bawah ini</p>
              </div>
              <button type="button" onClick={() => setAllVariantStocks(5)} className="text-xs text-brand hover:underline font-semibold">
                Set Semua Stok = 5
              </button>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
                    <th className="p-3 font-semibold text-gray-700 dark:text-gray-300">Warna Produk</th>
                    <th className="p-3 font-semibold text-gray-700 dark:text-gray-300">Ukuran (Size)</th>
                    <th className="p-3 font-semibold text-gray-700 dark:text-gray-300">Jumlah Stok Tersedia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-dark-card">
                  {form.colors.map((c, cIdx) => {
                    const colorObj = normalizeColorObj(c, cIdx);
                    return form.sizes.map((s, sIdx) => {
                      const sz = s.size || s;
                      const vKey = getVariantKey(colorObj, s, cIdx);
                      const currentStock = form.variants[vKey] !== undefined ? form.variants[vKey] : 5;
                      return (
                        <tr key={vKey} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                          <td className="p-3 font-medium text-gray-800 dark:text-gray-200">
                            <div className="flex items-center gap-2">
                              <span className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: colorObj.hexValue }} />
                              {colorObj.name} <span className="text-[10px] text-gray-400">({colorObj.hexValue})</span>
                            </div>
                          </td>
                          <td className="p-3 font-semibold text-gray-900 dark:text-white">
                            Size {sz}
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                value={currentStock}
                                onChange={e => handleVariantStockChange(c, s, cIdx, e.target.value)}
                                className="w-24 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-brand focus:border-transparent"
                              />
                              <span className="text-gray-500 text-[11px]">pasang</span>
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tags */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 block mb-2">Tags / Label Pencarian</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.tags.map((t, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-brand/10 text-brand px-3 py-1.5 rounded-full text-xs font-medium">
                  #{t}
                  <button type="button" onClick={() => removeTag(i)} className="hover:text-red-500 ml-1">✕</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-md">
              <input type="text" value={newTag} onChange={e => setNewTag(e.target.value)} className="input-base text-xs flex-1" placeholder="Tag baru (contoh: casual, running)"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
              <button type="button" onClick={addTag} className="btn-secondary px-4 py-2 text-xs font-semibold">Tambah Tag</button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Total Stok: <strong className="text-brand text-sm">{form.stock} pasang</strong>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="btn-secondary py-2 px-4 text-xs font-semibold">Batal</button>
            <button onClick={handleSubmit} disabled={saving} className="btn-primary py-2 px-5 text-xs font-semibold flex items-center gap-2">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
