import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Toast from '../common/Toast';
import ScrollToTop from '../common/ScrollToTop';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toast />
      <ScrollToTop />
    </div>
  );
}
