import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  ChevronLeft,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  X,
} from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const baseLinks = [
  { to: '/', label: 'الرئيسية' },
  { to: '/products', label: 'المنتجات' },
  { to: '/track', label: 'تتبع طلبي' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { totalCount } = useCart();
  const { isAdmin, logout } = useAuth();
  const links = isAdmin
    ? [...baseLinks, { to: '/admin', label: 'لوحة التحكم' }]
    : baseLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open || confirmLogout ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, confirmLogout]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const handleLogoutClick = () => {
    setOpen(false);
    setConfirmLogout(true);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all ${
          scrolled
            ? 'border-b border-ink-100/70 bg-white/80 backdrop-blur-xl dark:border-ink-800/70 dark:bg-ink-950/80'
            : 'bg-transparent'
        }`}
      >
        <div className="container-saqer flex h-14 items-center justify-between gap-2 sm:h-16 lg:h-20">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              aria-label="بحث"
              className="hidden h-10 w-10 items-center justify-center rounded-xl border
                         border-ink-100 bg-white text-ink-700 transition-colors hover:bg-saqer-50
                         hover:text-saqer-700 sm:grid
                         dark:border-ink-800 dark:bg-ink-900 dark:text-ink-50 dark:hover:bg-ink-800"
            >
              <Search className="h-5 w-5" />
            </button>

            {!isAdmin && (
              <Link
                to="/login"
                className="hidden whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-bold text-ink-700 hover:bg-ink-50 lg:inline-flex dark:text-ink-50 dark:hover:bg-ink-800"
              >
                دخول المشرف
              </Link>
            )}

            <ThemeToggle />

            <Link
              to="/cart"
              aria-label="عربة التسوق"
              className="relative grid h-9 w-9 place-items-center rounded-lg border
                         border-ink-100 bg-white text-ink-700 transition-colors hover:bg-saqer-50
                         hover:text-saqer-700 sm:h-10 sm:w-10 sm:rounded-xl
                         dark:border-ink-800 dark:bg-ink-900 dark:text-ink-50 dark:hover:bg-ink-800"
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
              {totalCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center
                             rounded-full bg-sand-500 px-0.5 text-[10px] font-black text-white
                             sm:-top-1.5 sm:-right-1.5 sm:h-5 sm:min-w-5 sm:px-1 sm:text-[11px]"
                >
                  {totalCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              aria-label="فتح القائمة"
              onClick={() => setOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-ink-100
                         bg-white text-ink-700 sm:h-10 sm:w-10 sm:rounded-xl lg:hidden
                         dark:border-ink-800 dark:bg-ink-900 dark:text-ink-50"
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </header>

      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-out lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-0 z-50 flex h-full w-full flex-col bg-white transition-opacity duration-500 ease-out dark:bg-ink-950 lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-ink-100 px-3 dark:border-ink-800 sm:h-16 sm:px-4">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="إغلاق"
            className="grid h-10 w-10 place-items-center rounded-xl hover:bg-ink-50 dark:hover:bg-ink-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-1 p-4 sm:p-6">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-bold transition-colors ${
                    isActive
                      ? 'bg-saqer-50 text-saqer-700 dark:bg-ink-800 dark:text-saqer-300'
                      : 'text-ink-700 hover:bg-ink-50 dark:text-ink-50 dark:hover:bg-ink-800'
                  }`
                }
              >
                <span>{l.label}</span>
                <ChevronLeft className="h-4 w-4 opacity-60 transition-transform group-hover:-translate-x-1" />
              </NavLink>
            ))}
          </div>

          <div className="shrink-0 space-y-2 border-t border-ink-100 p-4 dark:border-ink-800 sm:p-6">
            {isAdmin ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-saqer-600 px-4 py-3 text-sm font-bold text-white hover:bg-saqer-700"
                >
                  <ShieldCheck className="h-4 w-4" />
                  لوحة التحكم
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm font-bold text-red-600 hover:bg-ink-50 dark:border-ink-800 dark:bg-ink-900 dark:hover:bg-ink-800"
                >
                  <LogOut className="h-4 w-4" />
                  تسجيل خروج
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm font-bold text-ink-700 hover:bg-ink-50 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-50 dark:hover:bg-ink-800"
              >
                <LogIn className="h-4 w-4" />
                دخول المشرف
              </Link>
            )}
          </div>
        </nav>
      </aside>

      {confirmLogout && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setConfirmLogout(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-ink-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-red-50 dark:bg-red-900/30">
              <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-black text-ink-900 dark:text-white">
              تأكيد تسجيل الخروج
            </h3>
            <p className="mt-1 text-sm text-ink-700/80 dark:text-ink-50/70">
              هل أنت متأكد من رغبتك بتسجيل الخروج من لوحة التحكم؟
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setConfirmLogout(false)}
                className="flex-1 rounded-xl border border-ink-100 bg-white px-4 py-2.5 text-sm font-bold text-ink-700 hover:bg-ink-50 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-50 dark:hover:bg-ink-800"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  setConfirmLogout(false);
                  logout();
                }}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
              >
                نعم، خروج
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
