import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './components/Home/Home.jsx';
import Product from './Pages/Product.jsx';
import ProductDetail from './Pages/ProductDetail.jsx';
import About from './Pages/About.jsx';
import Gallery from './Pages/Gallery.jsx';
import Contacts from './Pages/Contacts.jsx';
import Book from './Pages/Book.jsx';
import AdminLogin from './Pages/Admin/AdminLogin.jsx';
import AdminDashboard from './Pages/Admin/AdminDashboard.jsx';
import StaffLogin from './Pages/staff/StaffLogin.jsx';
import StaffDashboard from './Pages/staff/StaffDashboard.jsx';
import UserAuth from './Pages/User/UserAuth.jsx';
import UserDashboard from './Pages/User/UserDashboard.jsx';
import { getAdminAuth, getStaffAuth, initFirebaseAutoSync } from './utils/storage.js';
import CustomKitModal from './components/CustomKit/CustomKitModal.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';

// Layout wrapper to hide public Navbar/Footer on Admin and Staff screens
const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isStaffRoute = location.pathname.startsWith('/staff');
  const isPortalView = isAdminRoute || location.pathname === '/staff/dashboard';
  const [isCustomKitOpen, setIsCustomKitOpen] = useState(false);

  useEffect(() => {
    initFirebaseAutoSync();
  }, []);


  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-950 selection:bg-[#d91478] selection:text-white">
      <ScrollToTop />
      {!isPortalView && <Navbar onOpenCustomKit={() => setIsCustomKitOpen(true)} />}
      
      <div className="flex-grow">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home onOpenCustomKit={() => setIsCustomKitOpen(true)} />} />
            <Route path="/product" element={<Product onOpenCustomKit={() => setIsCustomKitOpen(true)} />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contacts />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/book" element={<Book />} />

            {/* User Auth & Customer Dashboard Routes */}
            <Route path="/login" element={<UserAuth />} />
            <Route path="/register" element={<UserAuth />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={<Navigate to={getAdminAuth() ? '/admin/dashboard' : '/admin/login'} replace />}
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Staff Portal Routes */}
            <Route
              path="/staff"
              element={<Navigate to={getStaffAuth() ? '/staff/dashboard' : '/staff/login'} replace />}
            />
            <Route path="/staff/login" element={<StaffLogin />} />
            <Route path="/staff/dashboard" element={<StaffDashboard />} />

            <Route path="*" element={<Home onOpenCustomKit={() => setIsCustomKitOpen(true)} />} />
          </Routes>
        </ErrorBoundary>
      </div>

      {/* Interactive Custom Kit Builder Modal */}
      <CustomKitModal
        isOpen={isCustomKitOpen}
        onClose={() => setIsCustomKitOpen(false)}
      />

      {!isPortalView && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;

