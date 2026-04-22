import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
} from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-16 overflow-hidden bg-gradient-to-b from-white to-saqer-50 sm:mt-20 dark:from-ink-950 dark:to-ink-900">
      <div className="pointer-events-none absolute inset-0 bg-topo-pattern opacity-60" />
      <div className="container-saqer relative py-10 sm:py-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-xs leading-6 text-ink-700/70 sm:text-sm sm:leading-7 dark:text-ink-50/60">
              متجر الصقر — وجهتك الأولى لكل ما يخص التخييم والرحلات البرية.
              جودة عالية وأسعار منافسة.
            </p>
            <div className="mt-4 flex gap-2">
              {[Instagram, Twitter, Facebook, Send].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-xl border
                             border-ink-100 bg-white text-ink-700 transition-colors
                             hover:border-saqer-500 hover:text-saqer-600
                             dark:border-ink-800 dark:bg-ink-900 dark:text-ink-50"
                  aria-label="social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-black uppercase tracking-wider text-saqer-700 sm:mb-4 sm:text-sm dark:text-saqer-300">
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: 'الرئيسية' },
                { to: '/products', label: 'جميع المنتجات' },
                { to: '/about', label: 'من نحن' },
                { to: '/cart', label: 'سلة التسوق' },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="link-underline text-ink-700 hover:text-saqer-700 dark:text-ink-50 dark:hover:text-saqer-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-black uppercase tracking-wider text-saqer-700 sm:mb-4 sm:text-sm dark:text-saqer-300">
              تواصل معنا
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-ink-700 dark:text-ink-50/80">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-saqer-600" />
                بغداد، العراق
              </li>
              <li className="flex items-center gap-2 text-ink-700 dark:text-ink-50/80">
                <Phone className="h-4 w-4 shrink-0 text-saqer-600" />
                <span dir="ltr">+964 770 000 0000</span>
              </li>
              <li className="flex items-center gap-2 text-ink-700 dark:text-ink-50/80">
                <Mail className="h-4 w-4 shrink-0 text-saqer-600" />
                info@alsaqer.store
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-ink-100 pt-5 text-xs text-ink-700/60 sm:flex-row dark:border-ink-800 dark:text-ink-50/50">
          <p>© {year} متجر الصقر. جميع الحقوق محفوظة.</p>
          <p className="font-bold">
            تم التطوير بواسطة{' '}
            <span className="text-saqer-700 dark:text-saqer-300">حسين سعد</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
