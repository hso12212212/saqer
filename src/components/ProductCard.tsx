import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { CURRENCY_LABEL, formatIQD } from '../lib/format';
import { productImageSrc } from '../lib/imageUrl';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const discount = product.oldPrice
    ? Math.round(100 - (product.price / product.oldPrice) * 100)
    : 0;

  return (
    <article className="card group overflow-hidden hover:-translate-y-1 hover:shadow-glow">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-ink-50 dark:bg-ink-800">
          <img
            src={productImageSrc(product.image)}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute right-2 top-2 flex flex-col gap-1 sm:right-3 sm:top-3 sm:gap-1.5">
            {product.isBestSeller && (
              <span className="chip !px-2 !py-0.5 !text-[9px] bg-sand-500 text-white sm:!px-3 sm:!py-1 sm:!text-xs">
                الأكثر مبيعاً
              </span>
            )}
            {product.isNew && (
              <span className="chip !px-2 !py-0.5 !text-[9px] bg-saqer-600 text-white sm:!px-3 sm:!py-1 sm:!text-xs">
                جديد
              </span>
            )}
            {discount > 0 && (
              <span className="chip !px-2 !py-0.5 !text-[9px] bg-rose-500 text-white sm:!px-3 sm:!py-1 sm:!text-xs">
                -{discount}%
              </span>
            )}
          </div>

          <button
            type="button"
            aria-label="المفضلة"
            onClick={(e) => {
              e.preventDefault();
            }}
            className="absolute left-2 top-2 hidden h-8 w-8 place-items-center rounded-full
                       bg-white/90 text-ink-700 opacity-0 shadow-md backdrop-blur transition-all
                       group-hover:opacity-100 hover:bg-white hover:text-rose-500
                       sm:left-3 sm:top-3 sm:grid sm:h-9 sm:w-9
                       dark:bg-ink-900/90 dark:text-ink-50"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </Link>

      <div className="p-2.5 sm:p-4">
        <div className="mb-1 flex items-center justify-between gap-1.5 sm:mb-2">
          <span className="truncate text-[9px] font-bold uppercase tracking-wider text-saqer-600 sm:text-[11px] dark:text-saqer-300">
            {product.category}
          </span>
          <span className="flex shrink-0 items-center gap-0.5 text-[10px] font-bold text-ink-700/70 sm:gap-1 sm:text-xs dark:text-ink-50/60">
            <Star className="h-3 w-3 fill-sand-500 text-sand-500 sm:h-3.5 sm:w-3.5" />
            {product.rating}
          </span>
        </div>

        <Link to={`/products/${product.slug}`}>
          <h3 className="mb-2 line-clamp-2 min-h-[2.25rem] text-xs font-extrabold leading-[1.25rem] text-ink-900 transition-colors group-hover:text-saqer-700 sm:mb-3 sm:min-h-[3rem] sm:text-base sm:leading-6 dark:text-white dark:group-hover:text-saqer-300">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-end justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1 truncate">
              <span className="text-sm font-black leading-none text-ink-900 sm:text-lg dark:text-white">
                {formatIQD(product.price)}
              </span>
              <span className="text-[10px] font-bold text-ink-700/70 sm:text-xs dark:text-ink-50/60">
                {CURRENCY_LABEL}
              </span>
            </div>
            {product.oldPrice && (
              <span className="text-[10px] text-ink-700/50 line-through sm:text-xs dark:text-ink-50/40">
                {formatIQD(product.oldPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToCart(product.id)}
            aria-label="أضف إلى السلة"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-saqer-600 text-white
                       shadow-glow transition-all hover:bg-saqer-700 active:scale-95
                       sm:h-10 sm:w-10 sm:rounded-xl"
          >
            <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
