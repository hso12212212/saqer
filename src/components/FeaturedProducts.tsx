import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { products } from '../data/products';

export default function FeaturedProducts() {
  const featured = products.slice(0, 8);
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

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
