import { useCallback, useEffect, useState } from 'react';
import { Link, Outlet, Navigate, useLocation } from 'react-router-dom';
import { Home, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { adminListOrders } from '../lib/api';
import type { AdminOutletContext } from '../lib/adminOutletContext';
import MushrifSideNav from '../components/admin/MushrifSideNav';
import { Skeleton } from '../components/Skeleton';

export default function AdminMushrifLayout() {
  const { isAdmin, loading, logout, email } = useAuth();
  const { products, categories, refresh } = useStore();
  const { pathname } = useLocation();
  const [ordersCount, setOrdersCount] = useState(0);
  const [adminReloadKey, setAdminReloadKey] = useState(0);

  const loadOrderCount = useCallback(() => {
    return adminListOrders()
      .then((o) => setOrdersCount(o.length))
      .catch(() => setOrdersCount(0));
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    void loadOrderCount();
  }, [isAdmin, pathname, loadOrderCount]);

  const reload = async () => {
    try {
      await refresh();
    } catch {
      /* store refresh error ignored; children may show toasts */
    }
    await loadOrderCount();
    setAdminReloadKey((k) => k + 1);
  };

  if (loading) {
    return (
      <div
        className="container-saqer flex w-full flex-1 flex-col gap-4 py-8"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton rounded="rounded-lg" className="h-6 w-40" />
            <Skeleton rounded="rounded-md" className="h-3 w-56" />
          </div>
          <Skeleton rounded="rounded-xl" className="h-10 w-24" />
        </div>
        <div className="grid gap-4 lg:grid-cols-[13rem_1fr]">
          <Skeleton rounded="rounded-2xl" className="h-40 w-full" />
          <div className="space-y-3">
            <Skeleton rounded="rounded-2xl" className="h-24 w-full" />
            <Skeleton rounded="rounded-2xl" className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const outletContext: AdminOutletContext = { adminReloadKey };

  return (
    <div
      className="container-saqer flex w-full max-w-full flex-1 flex-col py-2.5 sm:py-8"
      id="admin-dashboard-root"
    >
      <div className="mb-3 flex flex-col gap-2.5 sm:mb-6 sm:flex-row sm:items-center sm:justify-between lg:mb-4">
        <div className="min-w-0 pr-0 sm:pr-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h1 className="text-lg font-black leading-tight sm:text-3xl">لوحة التحكم</h1>
            <Link
              to="/"
              className="inline-flex items-center gap-1 rounded-lg border border-ink-200/90 bg-ink-50/80 px-2 py-0.5 text-[10px] font-bold text-ink-600 hover:border-saqer-500/50 hover:text-saqer-800 dark:border-ink-600 dark:bg-ink-800/80 dark:text-ink-200 dark:hover:border-saqer-500/50 dark:hover:text-saqer-200 sm:px-2.5 sm:py-1 sm:text-xs"
            >
              <Home className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              الموقع
            </Link>
          </div>
          <p className="mt-0.5 truncate text-[10px] text-ink-500 sm:mt-1 sm:text-sm dark:text-ink-400">
            {email} • مشرف
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => void reload()}
            className="inline-flex h-10 min-w-[2.75rem] flex-1 items-center justify-center gap-1.5 rounded-xl border border-ink-100 bg-white px-3 text-xs font-bold hover:bg-ink-50 active:scale-[0.98] dark:border-ink-800 dark:bg-ink-900 dark:hover:bg-ink-800 sm:h-auto sm:min-w-0 sm:flex-initial sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm"
          >
            <RefreshCw className="h-4 w-4 sm:h-4" /> <span>تحديث</span>
          </button>
          <button
            type="button"
            onClick={logout}
            className="inline-flex h-10 min-w-[2.75rem] flex-1 items-center justify-center gap-1.5 rounded-xl border border-ink-100 bg-white px-3 text-xs font-bold text-red-600 hover:bg-red-50 active:scale-[0.98] dark:border-ink-800 dark:bg-ink-900 dark:hover:bg-ink-800 sm:h-auto sm:min-w-0 sm:flex-initial sm:py-2 sm:text-sm"
          >
            <LogOut className="h-4 w-4" /> <span>خروج</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:gap-5 lg:flex-row lg:items-start lg:gap-8">
        <MushrifSideNav
          counts={{
            products: products.length,
            categories: categories.length,
            orders: ordersCount,
          }}
        />
        <div className="min-w-0 flex-1">
          <Outlet context={outletContext} />
        </div>
      </div>
    </div>
  );
}
