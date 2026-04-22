import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { productImageSrc } from '../lib/imageUrl';
import { CategoryCircleSkeleton } from './Skeleton';

export default function CategoriesSection() {
  const { categories, loading } = useStore();

  if (!loading && categories.length === 0) return null;

  return (
    <section className="container-saqer py-8 sm:py-14">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-saqer-600 sm:text-sm dark:text-saqer-300">
            الأقسام
          </span>
          <h2 className="mt-1 text-2xl font-bold leading-snug tracking-tight text-ink-900 sm:text-3xl dark:text-white">
            تسوّق حسب الفئة
          </h2>
        </div>
        <Link
          to="/products"
          className="link-underline text-xs font-bold text-saqer-700 sm:text-sm dark:text-saqer-300"
        >
          عرض الكل ←
        </Link>
      </div>

      <div className="relative -mx-3 min-w-0 sm:mx-0">
        <div
          className="flex max-sm:snap-x max-sm:snap-mandatory gap-4 overflow-x-auto overflow-y-hidden py-1 pb-3 pl-3 pr-3 [-ms-overflow-style:none] [scrollbar-width:thin] sm:justify-center sm:gap-6 sm:overflow-x-visible sm:overflow-y-visible sm:pb-1 sm:pl-0 sm:pr-0"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
        {loading && categories.length === 0
          ? Array.from({ length: 6 }).map((_, i) => (
              <CategoryCircleSkeleton key={i} />
            ))
          : categories.map((c) => (
          <Link
            key={c.key}
            to={`/categories/${encodeURIComponent(c.key)}`}
            className="group flex w-[4.75rem] shrink-0 max-sm:snap-start flex-col items-center gap-2 sm:w-[5.75rem] sm:gap-2.5"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-saqer-50 to-saqer-100 p-1 ring-2 ring-transparent transition-all group-hover:ring-saqer-500 sm:h-24 sm:w-24 sm:p-1.5 dark:from-ink-800 dark:to-ink-900">
              <div className="h-full w-full overflow-hidden rounded-full bg-white dark:bg-ink-900">
                {c.image ? (
                  <img
                    src={productImageSrc(c.image)}
                    alt={c.label}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-saqer-50 to-saqer-100 text-2xl transition-transform duration-500 group-hover:scale-110 sm:text-3xl dark:from-ink-800 dark:to-ink-900">
                    {c.emoji}
                  </div>
                )}
              </div>
            </div>
            <span className="w-full min-h-[2.5rem] break-words px-0.5 text-center text-[11px] font-bold leading-snug text-ink-800 line-clamp-2 sm:min-h-[2.75rem] sm:text-xs dark:text-ink-100">
              {c.label}
            </span>
          </Link>
        ))}
        </div>
      </div>
    </section>
  );
}
