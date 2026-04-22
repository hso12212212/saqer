import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { CURRENCY_LABEL, formatIQD } from '../lib/format';
import { productImageSrc } from '../lib/imageUrl';

export default function ProductDetail() {
  const { slug } = useParams();
  const { products, getProductBySlug, loading } = useStore();
  const product = slug ? getProductBySlug(slug) : undefined;
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState<string | null>(
    product?.colors?.[0] ?? null,
  );

  if (!product) {
    if (loading) {
      return (
        <div className="container-saqer py-20 text-center text-ink-500">
          جاري التحميل...
        </div>
      );
    }
    return (
      <div className="container-saqer py-20 text-center">
        <h2 className="text-2xl font-black">المنتج غير موجود</h2>
        <Link to="/products" className="mt-4 inline-block btn-primary">
          العودة للمتجر
        </Link>
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discount = product.oldPrice
    ? Math.round(100 - (product.price / product.oldPrice) * 100)
    : 0;

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
          {product.name}
        </span>
      </nav>

      <div className="grid gap-6 sm:gap-10 lg:grid-cols-2">
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white sm:rounded-3xl dark:border-ink-800 dark:bg-ink-900">
            <div className="relative aspect-square">
              <img
                src={productImageSrc(product.image)}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {discount > 0 && (
                <span className="chip absolute right-3 top-3 bg-rose-500 text-white sm:right-4 sm:top-4">
                  خصم {discount}%
                </span>
              )}
            </div>
          </div>
        </div>

        <div>
          <span className="chip bg-saqer-100 text-saqer-800 dark:bg-saqer-900/40 dark:text-saqer-200">
            {product.category}
          </span>
          <h1 className="mt-2 text-xl font-black leading-tight text-ink-900 sm:mt-3 sm:text-4xl dark:text-white">
            {product.name}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:mt-3 sm:gap-3 sm:text-sm">
            <span
              className={`font-bold ${
                product.stock > 0 ? 'text-saqer-700 dark:text-saqer-300' : 'text-rose-500'
              }`}
            >
              {product.stock > 0
                ? `متوفر (${formatIQD(product.stock)})`
                : 'نفذ المخزون'}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-2 sm:mt-6 sm:gap-3">
            <span className="text-2xl font-black tabular-nums text-ink-900 sm:text-4xl dark:text-white">
              {formatIQD(product.price)}
              <span className="mx-1.5 text-sm font-bold text-ink-700/70 sm:text-lg">
                {CURRENCY_LABEL}
              </span>
            </span>
            {product.oldPrice && (
              <span className="text-sm text-ink-700/50 line-through sm:text-lg">
                {formatIQD(product.oldPrice)} {CURRENCY_LABEL}
              </span>
            )}
          </div>

          <p className="mt-3 text-sm leading-7 text-ink-700/80 sm:mt-5 sm:text-base sm:leading-8 dark:text-ink-50/70">
            {product.description}
          </p>

          <ul className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2">
            {product.features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 rounded-lg bg-saqer-50 px-2.5 py-2 text-xs font-bold text-saqer-800 sm:rounded-xl sm:px-3 sm:text-sm dark:bg-saqer-900/30 dark:text-saqer-200"
              >
                <Check className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                {f}
              </li>
            ))}
          </ul>

          {product.colors && product.colors.length > 0 && (
            <div className="mt-5 sm:mt-6">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold text-ink-700 sm:text-sm dark:text-ink-50">
                <span>اللون:</span>
                {color && (
                  <span className="text-xs font-normal text-ink-500 dark:text-ink-400">
                    {color}
                  </span>
                )}
                <span className="text-[10px] font-normal text-ink-500 dark:text-ink-400">
                  (اختياري)
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((c) => {
                  const selected = color === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(selected ? null : c)}
                      aria-label={`اختر اللون ${c}`}
                      aria-pressed={selected}
                      className={`relative grid h-10 w-10 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-white transition-all active:scale-95 dark:ring-offset-ink-950 ${
                        selected
                          ? 'ring-saqer-600 scale-110'
                          : 'ring-transparent hover:ring-ink-300 dark:hover:ring-ink-600'
                      }`}
                    >
                      <span
                        className="h-9 w-9 rounded-full border border-black/10 dark:border-white/10"
                        style={{ background: c }}
                      />
                      {selected && (
                        <Check
                          className="pointer-events-none absolute h-4 w-4 text-white mix-blend-difference"
                          strokeWidth={3}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-2 sm:mt-8 sm:gap-3">
            <div className="flex items-center rounded-xl border border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-11 w-11 place-items-center rounded-xl hover:bg-ink-50 sm:h-12 sm:w-12 dark:hover:bg-ink-800"
                aria-label="تقليل"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-black sm:w-12">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="grid h-11 w-11 place-items-center rounded-xl hover:bg-ink-50 sm:h-12 sm:w-12 dark:hover:bg-ink-800"
                aria-label="زيادة"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => addToCart(product.id, qty)}
              className="btn-primary flex-1 !px-4 !py-2.5 text-sm sm:flex-none sm:!px-5 sm:!py-3 sm:text-base"
            >
              <ShoppingCart className="h-4 w-4" />
              أضف إلى السلة
            </button>

            <button
              className="btn-outline !px-3 !py-2.5 sm:!px-4 sm:!py-3"
              aria-label="إضافة للمفضلة"
              title="إضافة للمفضلة"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12 sm:mt-20">
          <h2 className="mb-4 text-2xl font-black sm:mb-6 sm:text-4xl">
            منتجات مشابهة
          </h2>
          <div className="grid grid-cols-2 content-start items-stretch gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-4 [&>article]:h-full">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
