import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { productImageSrc } from '../lib/imageUrl';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export default function Products() {
  const { products, categories, loading } = useStore();
  const [params, setParams] = useSearchParams();
  const catParam = params.get('cat');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('featured');

  const filtered = useMemo(() => {
    let list = [...products];
    if (catParam) list = list.filter((p) => p.category === catParam);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
        break;
      default:
        list.sort(
          (a, b) => Number(!!b.isBestSeller) - Number(!!a.isBestSeller),
        );
    }
    return list;
  }, [products, catParam, query, sort]);

  const setCat = (cat: string | null) => {
    const next = new URLSearchParams(params);
    if (cat) next.set('cat', cat);
    else next.delete('cat');
    setParams(next, { replace: true });
  };

  return (
    <div className="container-saqer py-6 sm:py-10">
      <header className="mb-6 sm:mb-8">
        <span className="text-sm font-black uppercase tracking-widest text-saqer-600 dark:text-saqer-300">
          المتجر
        </span>
        <h1 className="section-title mt-1">كل منتجاتنا</h1>
        <p className="section-sub">
          {filtered.length} منتج{catParam ? ` في قسم ${catParam}` : ''}
        </p>
      </header>

      {categories.length > 0 && (
        <div className="mb-6 flex gap-3 overflow-x-auto pb-2 sm:gap-5">
          <button
            onClick={() => setCat(null)}
            className="group flex w-[72px] shrink-0 flex-col items-center gap-1.5 sm:w-[88px]"
          >
            <div
              className={`grid h-[60px] w-[60px] place-items-center rounded-full bg-gradient-to-br from-saqer-50 to-saqer-100 text-xl transition-all sm:h-[74px] sm:w-[74px] sm:text-2xl dark:from-ink-800 dark:to-ink-900 ${
                !catParam
                  ? 'ring-2 ring-saqer-600'
                  : 'ring-2 ring-transparent'
              }`}
            >
              🌟
            </div>
            <span className="text-[11px] font-bold sm:text-xs">الكل</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className="group flex w-[72px] shrink-0 flex-col items-center gap-1.5 sm:w-[88px]"
            >
              <div
                className={`overflow-hidden rounded-full bg-gradient-to-br from-saqer-50 to-saqer-100 p-[3px] transition-all dark:from-ink-800 dark:to-ink-900 ${
                  catParam === c.key
                    ? 'ring-2 ring-saqer-600'
                    : 'ring-2 ring-transparent'
                }`}
              >
                <div className="h-[54px] w-[54px] overflow-hidden rounded-full bg-white dark:bg-ink-900 sm:h-[68px] sm:w-[68px]">
                  {c.image ? (
                    <img
                      src={productImageSrc(c.image)}
                      alt={c.label}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-xl sm:text-2xl">
                      {c.emoji}
                    </div>
                  )}
                </div>
              </div>
              <span className="line-clamp-1 text-[11px] font-bold sm:text-xs">
                {c.label}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-ink-100 bg-white p-3 sm:flex-row sm:items-center dark:border-ink-800 dark:bg-ink-900">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-700/50 dark:text-ink-50/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="ابحث عن منتج..."
            className="w-full rounded-xl border border-ink-100 bg-white py-2.5 pr-10 pl-3 text-sm outline-none focus:border-saqer-500 dark:border-ink-800 dark:bg-ink-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-ink-700/60 dark:text-ink-50/60" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-saqer-500 dark:border-ink-800 dark:bg-ink-900"
          >
            <option value="featured">الأكثر طلباً</option>
            <option value="newest">الأحدث</option>
            <option value="price-asc">السعر: الأقل أولاً</option>
            <option value="price-desc">السعر: الأعلى أولاً</option>
          </select>
        </div>
      </div>

      {catParam && (
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="text-sm text-ink-500">
            <span>تصفية: </span>
            <span className="chip bg-saqer-600 text-white">{catParam}</span>
          </div>
          <Link
            to={`/categories/${encodeURIComponent(catParam)}`}
            className="text-xs font-bold text-saqer-700 hover:underline dark:text-saqer-300"
          >
            عرض صفحة الفئة ←
          </Link>
        </div>
      )}

      {loading && products.length === 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-2xl bg-ink-100 dark:bg-ink-800"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 p-16 text-center dark:border-ink-700">
          <div className="text-4xl">🔍</div>
          <h3 className="mt-3 text-lg font-black">لا توجد نتائج</h3>
          <p className="mt-1 text-sm text-ink-700/60 dark:text-ink-50/60">
            جرّب تغيير كلمات البحث أو اختر قسماً آخر
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
