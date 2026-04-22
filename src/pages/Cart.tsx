import { Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { CURRENCY_LABEL, formatIQD } from '../lib/format';

const FREE_SHIPPING_THRESHOLD = 175000;
const SHIPPING_COST = 10000;

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal } =
    useCart();
  const { getProduct } = useStore();

  const shipping =
    subtotal > FREE_SHIPPING_THRESHOLD ? 0 : subtotal > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container-saqer py-16 text-center sm:py-20">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-saqer-50 sm:h-24 sm:w-24 dark:bg-ink-900">
          <ShoppingBag className="h-8 w-8 text-saqer-600 sm:h-10 sm:w-10" />
        </div>
        <h1 className="text-2xl font-black sm:text-3xl">سلتك فارغة</h1>
        <p className="section-sub">ابدأ رحلتك باختيار أحد منتجاتنا المميزة</p>
        <Link to="/products" className="mt-6 inline-flex btn-primary">
          <ArrowLeft className="h-4 w-4" />
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="container-saqer py-6 sm:py-10">
      <h1 className="mb-5 text-2xl font-black sm:mb-8 sm:text-4xl">
        سلة التسوق
        <span className="mx-2 text-sm font-bold text-ink-700/60 sm:text-base dark:text-ink-50/60">
          ({items.length} منتج)
        </span>
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
        <div className="space-y-3 sm:space-y-4">
          {items.map((item) => {
            const p = getProduct(item.productId);
            if (!p) return null;
            return (
              <div
                key={item.productId}
                className="card flex gap-3 p-3 sm:gap-4 sm:p-4"
              >
                <Link
                  to={`/products/${p.slug}`}
                  className="block h-20 w-20 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-28 sm:rounded-xl"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-saqer-600 sm:text-xs dark:text-saqer-300">
                      {p.category}
                    </span>
                    <Link
                      to={`/products/${p.slug}`}
                      className="block line-clamp-2 text-sm font-black text-ink-900 hover:text-saqer-700 sm:text-base dark:text-white dark:hover:text-saqer-300"
                    >
                      {p.name}
                    </Link>
                    <div className="mt-1 text-xs font-bold text-ink-700 sm:text-sm dark:text-ink-50/80">
                      {formatIQD(p.price)} {CURRENCY_LABEL}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <div className="flex items-center rounded-lg border border-ink-100 sm:rounded-xl dark:border-ink-800">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="grid h-8 w-8 place-items-center hover:bg-ink-50 sm:h-9 sm:w-9 dark:hover:bg-ink-800"
                        aria-label="تقليل"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-black sm:w-9 sm:text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="grid h-8 w-8 place-items-center hover:bg-ink-50 sm:h-9 sm:w-9 dark:hover:bg-ink-800"
                        aria-label="زيادة"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-600 sm:text-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={clearCart}
            className="text-xs font-bold text-ink-700/60 hover:text-rose-500 sm:text-sm dark:text-ink-50/60"
          >
            إفراغ السلة بالكامل
          </button>
        </div>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="card p-4 sm:p-5">
            <h3 className="mb-4 text-base font-black sm:text-lg">ملخص الطلب</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-700/70 dark:text-ink-50/60">
                  المجموع الفرعي
                </dt>
                <dd className="font-bold">
                  {formatIQD(subtotal)} {CURRENCY_LABEL}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-700/70 dark:text-ink-50/60">الشحن</dt>
                <dd className="font-bold">
                  {shipping === 0 ? (
                    <span className="text-saqer-700 dark:text-saqer-300">
                      مجاني
                    </span>
                  ) : (
                    `${formatIQD(shipping)} ${CURRENCY_LABEL}`
                  )}
                </dd>
              </div>
              {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="rounded-xl bg-sand-100 p-3 text-xs font-bold text-sand-800 dark:bg-sand-900/30 dark:text-sand-200">
                  أضف {formatIQD(FREE_SHIPPING_THRESHOLD - subtotal)}{' '}
                  {CURRENCY_LABEL} للحصول على شحن مجاني!
                </p>
              )}
              <div className="mt-3 flex justify-between border-t border-ink-100 pt-3 dark:border-ink-800">
                <dt className="text-base font-black">الإجمالي</dt>
                <dd className="text-lg font-black text-saqer-700 dark:text-saqer-300">
                  {formatIQD(total)} {CURRENCY_LABEL}
                </dd>
              </div>
            </dl>

            <button className="btn-primary mt-5 w-full">
              إتمام الشراء
              <ArrowLeft className="h-4 w-4" />
            </button>

            <Link
              to="/products"
              className="mt-3 block text-center text-sm font-bold text-saqer-700 hover:underline dark:text-saqer-300"
            >
              أو متابعة التسوق
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
