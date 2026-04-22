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
  { to: '/about', label: 'من نحن' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all ${
          scrolled
            ? 'border-b border-ink-100/70 bg-white/80 backdrop-blur-xl dark:border-ink-800/70 dark:bg-ink-950/80'
            : 'bg-transparent'
        }`}
      >
        <div className="container-saqer flex h-16 items-center justify-between gap-3 lg:h-20">
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

          <div className="flex items-center gap-2">
            <button
              aria-label="بحث"
              className="hidden h-10 w-10 items-center justify-center rounded-xl border
                         border-ink-100 bg-white text-ink-700 transition-colors hover:bg-saqer-50
                         hover:text-saqer-700 sm:grid
                         dark:border-ink-800 dark:bg-ink-900 dark:text-ink-50 dark:hover:bg-ink-800"
            >
              <Search className="h-5 w-5" />
            </button>

            <ThemeToggle />

            <Link
              to="/cart"
              aria-label="عربة التسوق"
              className="relative grid h-10 w-10 place-items-center rounded-xl border
                         border-ink-100 bg-white text-ink-700 transition-colors hover:bg-saqer-50
                         hover:text-saqer-700
                         dark:border-ink-800 dark:bg-ink-900 dark:text-ink-50 dark:hover:bg-ink-800"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center
                             rounded-full bg-sand-500 px-1 text-[11px] font-black text-white"
                >
                  {totalCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              aria-label="فتح القائمة"
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border
                         border-ink-100 bg-white text-ink-700
                         dark:border-ink-800 dark:bg-ink-900 dark:text-ink-50"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-80 max-w-[90vw] flex-col bg-white transition-transform duration-300 ease-out dark:bg-ink-950 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-ink-100 px-4 dark:border-ink-800 lg:h-20">
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
          <div className="flex-1 p-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-xl px-4 py-3 text-base font-bold transition-colors ${
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

          <div className="shrink-0 space-y-2 border-t border-ink-100 p-4 dark:border-ink-800">
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
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
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
    </>
  );
}
