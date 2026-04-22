import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Search, ShieldCheck, ShoppingBag, X } from 'lucide-react';
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
  const { isAdmin } = useAuth();
  const links = isAdmin ? [...baseLinks, { to: '/admin', label: 'لوحة التحكم' }] : baseLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        scrolled
          ? 'border-b border-ink-100/70 bg-white/80 backdrop-blur-xl shadow-sm dark:border-ink-800/70 dark:bg-ink-950/80'
          : 'bg-transparent'
      }`}
    >
      <div className="container-saqer flex h-16 items-center justify-between gap-4 lg:h-20">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
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
            to={isAdmin ? '/admin' : '/login'}
            aria-label={isAdmin ? 'لوحة التحكم' : 'تسجيل دخول'}
            title={isAdmin ? 'لوحة التحكم' : 'تسجيل دخول'}
            className="hidden sm:grid h-10 w-10 place-items-center rounded-xl border
                       border-ink-100 bg-white text-ink-700 transition-colors hover:bg-saqer-50
                       hover:text-saqer-700
                       dark:border-ink-800 dark:bg-ink-900 dark:text-ink-50 dark:hover:bg-ink-800"
          >
            <ShieldCheck className="h-5 w-5" />
          </Link>

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
                           rounded-full bg-sand-500 px-1 text-[11px] font-black text-white
                           shadow-md"
              >
                {totalCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border
                       border-ink-100 bg-white text-ink-700 lg:hidden
                       dark:border-ink-800 dark:bg-ink-900 dark:text-ink-50"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-white/95 backdrop-blur lg:hidden dark:border-ink-800 dark:bg-ink-950/95">
          <nav className="container-saqer flex flex-col gap-1 py-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-base font-bold transition-colors ${
                    isActive
                      ? 'bg-saqer-50 text-saqer-700 dark:bg-ink-800 dark:text-saqer-300'
                      : 'text-ink-700 hover:bg-ink-50 dark:text-ink-50 dark:hover:bg-ink-800'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
