import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton, Skeleton } from '../components/Skeleton';
import { useStore } from '../context/StoreContext';
import { fetchCategory } from '../lib/api';
import type { CategoryDTO } from '../lib/api';
import { productImageSrc } from '../lib/imageUrl';

export default function Category() {
  const { key } = useParams();
  const { products, categories, loading } = useStore();
  const [cat, setCat] = useState<CategoryDTO | undefined>(undefined);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!key) return;
    const local = categories.find((c) => c.key === decodeURIComponent(key));
    if (local) setCat(local);
    else fetchCategory(decodeURIComponent(key)).then(setCat);
  }, [key, categories]);

  const decodedKey = key ? decodeURIComponent(key) : '';

  const list = useMemo(() => {
    let out = products.filter((p) => p.category === decodedKey);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    return out;
  }, [products, decodedKey, query]);

  if (!cat && !loading) {
    return (
      <div className="container-saqer py-20 text-center">
        <h2 className="text-2xl font-black">الفئة غير موجودة</h2>
        <Link to="/products" className="mt-4 inline-block btn-primary">
          العودة للمتجر
        </Link>
      </div>
    );
  }

  return (
    <div className="container-saqer py-5 sm:py-8">
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-[11px] text-ink-700/70 sm:mb-6 sm:gap-2 sm:text-sm dark:text-ink-50/60">
        <Link to="/" className="hover:text-saqer-700">
          الرئيسية
        </Link>
        <ChevronRight className="h-3 w-3 rotate-180 sm:h-4 sm:w-4" />
        <Link to="/products" className="hover:text-saqer-700">
          المنتجات
        </Link>
        <ChevronRight className="h-3 w-3 rotate-180 sm:h-4 sm:w-4" />
        <span className="line-clamp-1 text-ink-900 dark:text-white">
          {cat?.label ?? decodedKey}
        </span>
      </nav>

      <header className="mb-6 flex flex-col items-center gap-4 text-center sm:mb-10 sm:flex-row sm:text-right">
        {!cat && loading ? (
          <Skeleton rounded="rounded-full" className="h-24 w-24 shrink-0 sm:h-28 sm:w-28" />
        ) : (
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-saqer-50 to-saqer-100 p-1 sm:h-28 sm:w-28 dark:from-ink-800 dark:to-ink-900">
            <div className="h-full w-full overflow-hidden rounded-full bg-white dark:bg-ink-900">
              {cat?.image ? (
                <img
                  src={productImageSrc(cat.image)}
                  alt={cat.label}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-4xl">
                  {cat?.emoji ?? '📦'}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="min-w-0 flex-1">
          {!cat && loading ? (
            <div className="space-y-2">
              <Skeleton rounded="rounded-lg" className="mx-auto h-7 w-48 sm:mx-0 sm:h-9" />
              <Skeleton rounded="rounded-md" className="mx-auto h-4 w-64 sm:mx-0" />
              <Skeleton rounded="rounded-md" className="mx-auto h-3 w-20 sm:mx-0" />
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold leading-snug text-ink-900 sm:text-3xl dark:text-white">
                {cat?.label ?? decodedKey}
              </h1>
              {cat?.description && (
                <p className="mt-2 text-sm text-ink-700/70 sm:text-base dark:text-ink-50/60">
                  {cat.description}
                </p>
              )}
              <div className="mt-2 text-xs text-ink-500 sm:text-sm">
                {list.length} منتج
              </div>
            </>
          )}
        </div>
      </header>

      <div className="mb-6 flex items-center gap-2 rounded-2xl border border-ink-100 bg-white p-2.5 dark:border-ink-800 dark:bg-ink-900">
        <Search className="h-4 w-4 shrink-0 text-ink-700/50 dark:text-ink-50/50" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
          placeholder={`ابحث في ${cat?.label ?? 'هذه الفئة'}...`}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {loading && list.length === 0 ? (
        <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 p-12 text-center dark:border-ink-700">
          <div className="text-4xl">📦</div>
          <h3 className="mt-3 text-lg font-black">لا توجد منتجات بعد</h3>
        </div>
      ) : (
        <div className="grid grid-cols-2 content-start items-stretch gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8 md:grid-cols-3 xl:grid-cols-4 [&>article]:h-full">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
