import { create } from 'zustand';
import api from '../utils/api';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('stepluxe-user') || 'null'),
  token: localStorage.getItem('stepluxe-token') || null,
  loading: false,
  error: null,

  get isLoggedIn() { return !!get().token; },
  get isAdmin() { return get().user?.role === 'ADMIN'; },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { user, token } = data.data;
      localStorage.setItem('stepluxe-token', token);
      localStorage.setItem('stepluxe-user', JSON.stringify(user));
      set({ user, token, loading: false });
      return user;
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Login gagal';
      set({ loading: false, error: msg });
      throw new Error(msg);
    }
  },

  register: async ({ email, password, firstName, lastName, phone }) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { email, password, firstName, lastName, phone });
      const { user, token } = data.data;
      localStorage.setItem('stepluxe-token', token);
      localStorage.setItem('stepluxe-user', JSON.stringify(user));
      set({ user, token, loading: false });
      return user;
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Registrasi gagal';
      set({ loading: false, error: msg });
      throw new Error(msg);
    }
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me');
      const user = data.data;
      localStorage.setItem('stepluxe-user', JSON.stringify(user));
      set({ user });
      return user;
    } catch {
      get().logout();
    }
  },

  logout: () => {
    localStorage.removeItem('stepluxe-token');
    localStorage.removeItem('stepluxe-user');
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
}));
