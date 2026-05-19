import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('stepluxe-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses (expired/invalid token) → auto logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('stepluxe-token');
      localStorage.removeItem('stepluxe-user');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
