import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { CURRENCY_LABEL, formatIQD } from '../lib/format';
import { productImageSrc, productPrimaryImage } from '../lib/imageUrl';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const discount = product.oldPrice
    ? Math.round(100 - (product.price / product.oldPrice) * 100)
    : 0;

  return (
    <article className="group flex h-full min-h-0 flex-col text-start">
      <div className="relative shrink-0 overflow-hidden bg-ink-100 dark:bg-ink-800">
        <Link
          to={`/products/${product.slug}`}
          className="relative block aspect-[3/4] w-full"
        >
          <img
            src={productImageSrc(productPrimaryImage(product))}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-[transform,opacity] duration-500 group-hover:scale-[1.03]"
          />
        </Link>

        {(product.isNew || product.isBestSeller || discount > 0) && (
          <div className="pointer-events-none absolute start-1.5 top-1.5 flex max-w-[85%] flex-wrap gap-1 sm:start-2 sm:top-2">
            {product.isBestSeller && (
              <span className="rounded bg-amber-600/95 px-1.5 py-0.5 text-[9px] font-extrabold text-white sm:text-[10px]">
                مميز
              </span>
            )}
            {product.isNew && (
              <span className="rounded bg-saqer-600/90 px-1.5 py-0.5 text-[9px] font-semibold text-white sm:text-[10px]">
                جديد
              </span>
            )}
            {discount > 0 && (
              <span className="rounded bg-rose-600/90 px-1.5 py-0.5 text-[9px] font-semibold text-white sm:text-[10px]">
                -{discount}%
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-2 flex min-h-0 flex-1 flex-col sm:mt-2.5">
        <Link
          to={`/products/${product.slug}`}
          className="mb-0.5 block shrink-0"
        >
          <h3
            className="line-clamp-2 min-h-[2.45rem] break-words text-[13px] font-medium
                       leading-[1.3] text-ink-900 transition-colors
                       [overflow-wrap:anywhere] group-hover:text-saqer-800
                       sm:min-h-[2.7rem] sm:text-sm sm:leading-[1.35] dark:text-ink-100
                       dark:group-hover:text-saqer-300"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>

        <div className="flex min-h-[0.875rem] shrink-0 items-center gap-0.5 pt-0.5">
          {product.colors && product.colors.length > 0 ? (
            <>
              {product.colors.slice(0, 5).map((c) => (
                <span
                  key={c}
                  className="h-2 w-2 shrink-0 rounded-full border border-ink-200/80 dark:border-ink-600"
                  style={{ background: c }}
                  title={c}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-[9px] text-ink-500">+{product.colors.length - 5}</span>
              )}
            </>
          ) : null}
        </div>

        <div className="mt-auto flex w-full flex-col gap-2 pt-1.5 sm:gap-2.5 sm:pt-2">
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
            <span className="text-base font-bold tabular-nums text-ink-900 sm:text-lg dark:text-white">
              {formatIQD(product.price)}
            </span>
            <span className="text-xs font-semibold text-ink-500 sm:text-sm dark:text-ink-400">
              {CURRENCY_LABEL}
            </span>
            {product.oldPrice != null && (
              <span className="text-xs text-ink-400 line-through tabular-nums sm:text-sm dark:text-ink-500">
                {formatIQD(product.oldPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToCart(product.id)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2
                       border-saqer-600 bg-saqer-50 py-2.5 text-sm font-extrabold
                       text-saqer-900 transition-colors hover:border-saqer-700
                       hover:bg-saqer-600 hover:text-white active:scale-[0.99] sm:py-3
                       sm:text-base dark:border-saqer-400 dark:bg-saqer-500/25
                       dark:text-white dark:ring-1 dark:ring-saqer-400/50
                       dark:hover:border-saqer-300 dark:hover:bg-saqer-500
                       dark:hover:ring-saqer-300"
          >
            <ShoppingCart className="h-5 w-5 shrink-0" />
            أضف للسلة
          </button>
        </div>
      </div>
    </article>
  );
}
