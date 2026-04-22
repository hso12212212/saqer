import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating';

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
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
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
    <div className="container-saqer py-10">
      <header className="mb-8">
        <span className="text-sm font-black uppercase tracking-widest text-saqer-600 dark:text-saqer-300">
          المتجر
        </span>
        <h1 className="section-title mt-1">كل منتجاتنا</h1>
        <p className="section-sub">
          {filtered.length} منتج{catParam ? ` في قسم ${catParam}` : ''}
        </p>
      </header>

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
            <option value="price-asc">السعر: الأقل أولاً</option>
            <option value="price-desc">السعر: الأعلى أولاً</option>
            <option value="rating">التقييم</option>
          </select>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setCat(null)}
          className={`chip transition-colors ${
            !catParam
              ? 'bg-saqer-600 text-white'
              : 'border border-ink-100 bg-white text-ink-700 hover:border-saqer-500 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-50'
          }`}
        >
          الكل
        </button>
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={`chip transition-colors ${
              catParam === c.key
                ? 'bg-saqer-600 text-white'
                : 'border border-ink-100 bg-white text-ink-700 hover:border-saqer-500 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-50'
            }`}
          >
            <span>{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>

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
