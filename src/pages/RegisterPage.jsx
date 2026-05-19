import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

export default function RegisterPage() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const { register, loading, error, clearError } = useAuthStore();
  const showToast = useUIStore(s => s.showToast);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      showToast('Akun berhasil dibuat! Selamat bergabung 🎉', 'success');
      navigate('/');
    } catch {
      // error is already set in the store
    }
  };

  const update = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-brand to-primary-400 rounded-xl flex items-center justify-center">
              <span className="text-xl">👟</span>
            </div>
            <span className="font-display font-bold text-2xl text-gray-900 dark:text-white">Step<span className="text-brand">Luxe</span></span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">Buat Akun Baru</h1>
          <p className="text-gray-500 dark:text-gray-400">Bergabung dengan jutaan pembeli di StepLuxe</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center justify-between">
              <span>{error}</span>
              <button onClick={clearError} className="text-red-400 hover:text-red-600 ml-2">✕</button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Nama Depan</label>
                <input type="text" required placeholder="John" value={form.firstName} onChange={update('firstName')} className="input-base" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Nama Belakang</label>
                <input type="text" required placeholder="Doe" value={form.lastName} onChange={update('lastName')} className="input-base" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Email</label>
              <input type="email" required placeholder="nama@email.com" value={form.email} onChange={update('email')} className="input-base" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Nomor HP</label>
              <input type="tel" placeholder="08xxxxxxxxxx" value={form.phone} onChange={update('phone')} className="input-base" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} required placeholder="Min. 6 karakter" value={form.password} onChange={update('password')} className="input-base pr-11" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <label className="flex items-start gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
              <input type="checkbox" required className="accent-brand mt-0.5" />
              Saya setuju dengan <a href="#" className="text-brand hover:underline">Syarat & Ketentuan</a> dan <a href="#" className="text-brand hover:underline">Kebijakan Privasi</a>
            </label>
            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 py-3.5">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</> : <>Daftar Sekarang <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Sudah punya akun? <Link to="/login" className="text-brand font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
