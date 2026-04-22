import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useStore } from '../context/StoreContext';

export default function FeaturedProducts() {
  const { products, loading } = useStore();
  const featured = products
    .slice()
    .sort((a, b) => Number(!!b.isBestSeller) - Number(!!a.isBestSeller))
    .slice(0, 8);

  return (
    <section className="container-saqer py-10 sm:py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-10">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-saqer-600 sm:text-sm dark:text-saqer-300">
            مختارات الصقر
          </span>
          <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-4xl">
            المنتجات الأكثر طلباً
          </h2>
          <p className="mt-1 text-xs text-ink-700/70 sm:text-base dark:text-ink-50/60">
            منتجات مختارة بعناية لمغامريك القادمين
          </p>
        </div>
        <Link
          to="/products"
          className="btn-outline !px-3 !py-2 text-xs sm:!px-5 sm:!py-3 sm:text-base"
        >
          تصفح الكل
        </Link>
      </div>

      {loading && featured.length === 0 ? (
        <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse bg-ink-100 dark:bg-ink-800"
            />
          ))}
        </div>
      ) : featured.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 p-12 text-center dark:border-ink-700">
          <div className="text-3xl">📦</div>
          <p className="mt-2 font-bold">لا توجد منتجات بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 content-start items-stretch gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-4 [&>article]:h-full">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
