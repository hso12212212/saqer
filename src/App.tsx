import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Category from './pages/Category';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import Login from './pages/Login';
import AdminMushrifLayout from './layouts/AdminMushrifLayout';
import Admin from './pages/Admin';
import AdminOrdersList from './pages/AdminOrdersList';
import AdminOrderDetail from './pages/AdminOrderDetail';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const adminMode = pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col">
      <ScrollToTop />
      {!adminMode && <Navbar />}
      <main className={adminMode ? 'flex min-h-0 flex-1 flex-col' : 'flex-1'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/categories/:key" element={<Category />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/track/:id" element={<TrackOrder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminMushrifLayout />}>
            <Route index element={<Admin />} />
            <Route path="categories" element={<Admin />} />
            <Route path="orders" element={<AdminOrdersList />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!adminMode && <Footer />}
    </div>
  );
}
