import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from './Skeleton';
import { useStore } from '../context/StoreContext';

export default function FeaturedProducts() {
  const { products, loading } = useStore();
  const featured = products.filter((p) => p.isBestSeller);

  if (!loading && featured.length === 0) {
    return null;
  }

  return (
    <section className="container-saqer border-t border-ink-100/80 bg-ink-50/35 py-10 sm:py-16 dark:border-ink-800/80 dark:bg-ink-900/30">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-10">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-saqer-600 sm:text-sm dark:text-saqer-300">
            مختارة بعناية
          </span>
          <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-4xl">منتجات مميزة</h2>
        </div>
        <Link
          to="/products"
          className="link-underline text-xs font-bold text-saqer-700 sm:text-sm dark:text-saqer-300"
        >
          كل المنتجات ←
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {loading && featured.length === 0
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : featured.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
      </div>
    </section>
  );
}
