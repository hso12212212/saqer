import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { productImageSrc } from '../lib/imageUrl';
import { formatIQD } from '../lib/format';

export default function Products() {
  const { products, categories, loading } = useStore();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let list = [...products];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    list.sort(
      (a, b) => Number(!!b.isBestSeller) - Number(!!a.isBestSeller),
    );
    return list;
  }, [products, query]);

  return (
    <div className="container-saqer py-4 sm:py-10">
      <header className="mb-4 sm:mb-8">
        <span className="text-xs font-black uppercase tracking-widest text-saqer-600 sm:text-sm dark:text-saqer-300">
          المتجر
        </span>
        <h1 className="mt-1 break-words text-2xl font-black leading-tight text-ink-900 sm:text-3xl md:text-4xl dark:text-white">
          كل منتجاتنا
        </h1>
        <p className="mt-1 text-sm text-ink-700/70 sm:text-base dark:text-ink-50/60">
          {formatIQD(filtered.length)} منتج
        </p>
      </header>

      {categories.length > 0 && (
        <div
          className="mb-6 flex gap-4 overflow-x-auto overflow-y-visible py-1 pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:thin] sm:mb-8 sm:gap-5 sm:pb-3 sm:pt-2"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {categories.map((c) => (
            <Link
              key={c.key}
              to={`/categories/${encodeURIComponent(c.key)}`}
              className="flex w-[4.75rem] shrink-0 flex-col items-center gap-2 sm:w-[5.75rem] sm:gap-2.5"
            >
              <div className="shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-saqer-50 to-saqer-100 p-1 ring-2 ring-transparent transition-all hover:ring-saqer-600 sm:p-1.5 dark:from-ink-800 dark:to-ink-900">
                <div className="h-[4.5rem] w-[4.5rem] overflow-hidden rounded-full bg-white sm:h-24 sm:w-24">
                  {c.image ? (
                    <img
                      src={productImageSrc(c.image)}
                      alt={c.label}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-2xl sm:text-3xl">
                      {c.emoji}
                    </div>
                  )}
                </div>
              </div>
              <span className="mt-0.5 w-full min-h-[2.5rem] break-words px-0.5 text-center text-[11px] font-bold leading-snug text-ink-800 line-clamp-2 sm:min-h-[2.75rem] sm:text-xs dark:text-ink-100">
                {c.label}
              </span>
            </Link>
          ))}
        </div>
      )}

      <div className="relative mb-6 sm:mb-8">
        <label className="sr-only">بحث في المنتجات</label>
        <Search className="pointer-events-none absolute end-0 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400 sm:h-6 sm:w-6 dark:text-ink-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
          placeholder="ابحث عن منتج..."
          className="w-full border-0 border-b-2 border-ink-200 bg-transparent py-3 pe-10 text-base text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-saqer-600 sm:py-3.5 sm:pe-12 sm:text-lg dark:border-ink-600 dark:text-ink-50 dark:placeholder:text-ink-500 dark:focus:border-saqer-500"
        />
      </div>

      {loading && products.length === 0 ? (
        <div className="grid grid-cols-2 content-start items-stretch gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8 md:grid-cols-3 xl:grid-cols-4 [&>article]:h-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse bg-ink-100 dark:bg-ink-800"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center sm:py-16">
          <div className="text-4xl">🔍</div>
          <h3 className="mt-3 text-lg font-black">لا توجد نتائج</h3>
          <p className="mt-1 text-sm text-ink-700/60 dark:text-ink-50/60">
            جرّب كلمات بحث أخرى أو اختر قسماً من الأعلى
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 content-start items-stretch gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8 md:grid-cols-3 xl:grid-cols-4 [&>article]:h-full">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
