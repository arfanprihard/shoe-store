import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin
import AdminLayout from './components/admin/AdminLayout';
import AdminRoute from './components/admin/AdminRoute';
import DashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminPromosPage from './pages/admin/AdminPromosPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminBrandsPage from './pages/admin/AdminBrandsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Store Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="orders" element={<OrderHistoryPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="promos" element={<AdminPromosPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="brands" element={<AdminBrandsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
