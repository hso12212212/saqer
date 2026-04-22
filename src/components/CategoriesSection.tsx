import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { categories } from '../data/products';

export default function CategoriesSection() {
  return (
    <section className="container-saqer py-10 sm:py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-10">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-saqer-600 sm:text-sm dark:text-saqer-300">
            الأقسام
          </span>
          <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-4xl">
            تسوّق حسب الفئة
          </h2>
          <p className="mt-1 text-xs text-ink-700/70 sm:text-base dark:text-ink-50/60">
            كل ما تحتاجه لمغامرتك القادمة في مكان واحد
          </p>
        </div>
        <Link
          to="/products"
          className="link-underline text-xs font-bold text-saqer-700 sm:text-sm dark:text-saqer-300"
        >
          عرض الكل ←
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-7">
        {categories.map((c, i) => (
          <Link
            key={c.key}
            to={`/products?cat=${encodeURIComponent(c.key)}`}
            className="group relative overflow-hidden rounded-xl border border-ink-100 bg-white p-3 text-center
                       transition-all hover:-translate-y-1 hover:border-saqer-500 hover:shadow-glow
                       sm:rounded-2xl sm:p-5
                       dark:border-ink-800 dark:bg-ink-900"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-saqer-100 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-saqer-900/40" />
            <div className="relative mx-auto mb-2 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-saqer-50 to-saqer-100 text-xl transition-transform group-hover:scale-110 sm:mb-3 sm:h-14 sm:w-14 sm:rounded-2xl sm:text-3xl dark:from-ink-800 dark:to-ink-900">
              {c.emoji}
            </div>
            <div className="relative text-xs font-black text-ink-900 sm:text-sm dark:text-white">
              {c.label}
            </div>
            <div className="relative mt-1 line-clamp-2 text-[10px] leading-[14px] text-ink-700/60 sm:text-[11px] sm:leading-4 dark:text-ink-50/50">
              {c.desc}
            </div>
            <ArrowLeft className="relative mx-auto mt-2 hidden h-4 w-4 -translate-x-1 text-saqer-600 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 sm:block" />
          </Link>
        ))}
      </div>
    </section>
  );
}
