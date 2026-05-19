import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading, error, clearError } = useAuthStore();
  const showToast = useUIStore(s => s.showToast);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form.email, form.password);
      showToast('Login berhasil! Selamat datang 👋', 'success');
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch {
      // error is already set in the store
    }
  };

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
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">Selamat Datang!</h1>
          <p className="text-gray-500 dark:text-gray-400">Login ke akun StepLuxe kamu</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center justify-between">
              <span>{error}</span>
              <button onClick={clearError} className="text-red-400 hover:text-red-600 ml-2">✕</button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Email</label>
              <input
                type="email" required placeholder="nama@email.com"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-base"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'} required placeholder="••••••••"
                  value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input-base pr-11"
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-brand" /> Ingat saya
              </label>
              <a href="#" className="text-brand hover:underline">Lupa password?</a>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 py-3.5">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</> : <>Login <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div>
            <div className="relative text-center"><span className="bg-white dark:bg-dark-card px-3 text-sm text-gray-400">atau</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="btn-secondary flex items-center justify-center gap-2 py-3 text-sm">
              <span>🌐</span> Google
            </button>
            <button className="btn-secondary flex items-center justify-center gap-2 py-3 text-sm">
              <span>📘</span> Facebook
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Belum punya akun?{' '}
            <Link to="/register" className="text-brand font-semibold hover:underline">Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
