import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
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
    <article className="card group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:border-saqer-500">
      <Link
        to={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-ink-50 dark:bg-ink-800"
      >
        <img
          src={productImageSrc(product.image)}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-saqer-600 sm:text-[11px] dark:text-saqer-300">
          {product.category}
        </span>

        <Link to={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-extrabold leading-5 text-ink-900 transition-colors group-hover:text-saqer-700 sm:text-base sm:leading-6 dark:text-white dark:group-hover:text-saqer-300">
            {product.name}
          </h3>
        </Link>

        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c}
                className="h-3.5 w-3.5 rounded-full border border-black/10 dark:border-white/15"
                style={{ background: c }}
                title={c}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-ink-500">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black leading-none text-ink-900 sm:text-lg dark:text-white">
                {formatIQD(product.price)}
              </span>
              <span className="text-[10px] font-bold text-ink-700/70 sm:text-xs dark:text-ink-50/60">
                {CURRENCY_LABEL}
              </span>
            </div>
            {product.oldPrice && (
              <span className="text-[11px] text-ink-700/50 line-through dark:text-ink-50/40">
                {formatIQD(product.oldPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToCart(product.id)}
            aria-label="أضف إلى السلة"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-saqer-600 text-white
                       transition-all hover:bg-saqer-700 active:scale-95
                       sm:h-10 sm:w-10 sm:rounded-xl"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
