import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader2,
  Package,
  PackageCheck,
  RefreshCw,
  Search,
  ShoppingBag,
  Trash2,
  Truck,
  XCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { trackOrder, type OrderDTO, type OrderStatus } from '../lib/api';
import { CURRENCY_LABEL, formatIQD } from '../lib/format';
import { productImageSrc, productPrimaryImage } from '../lib/imageUrl';
import { loadMyOrders, removeMyOrder, saveMyOrder } from '../lib/myOrders';
import { OrderRowSkeleton, Skeleton } from '../components/Skeleton';

function normalizeIraqPhone11(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 11);
}

const STATUS_META: Record<
  OrderStatus,
  { label: string; color: string; bg: string; icon: typeof Clock }
> = {
  pending: {
    label: 'بانتظار التأكيد',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    icon: Clock,
  },
  confirmed: {
    label: 'تم التأكيد',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    icon: CheckCircle2,
  },
  shipped: {
    label: 'جارٍ التوصيل',
    color: 'text-indigo-700 dark:text-indigo-300',
    bg: 'bg-indigo-50 dark:bg-indigo-900/30',
    icon: Truck,
  },
  delivered: {
    label: 'تم التوصيل',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    icon: PackageCheck,
  },
  cancelled: {
    label: 'ملغي',
    color: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-50 dark:bg-rose-900/30',
    icon: XCircle,
  },
};

const ORDER_STEPS: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered'];

export default function TrackOrder() {
  const { id: routeId } = useParams();
  const [search] = useSearchParams();
  const routePhone = search.get('phone') ?? '';

  const [myOrders, setMyOrders] = useState<OrderDTO[]>([]);
  const [loadingMine, setLoadingMine] = useState(true);
  const [singleOrder, setSingleOrder] = useState<OrderDTO | null>(null);
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleError, setSingleError] = useState<string | null>(null);

  const [showSearch, setShowSearch] = useState(false);
  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const loadMine = useCallback(async () => {
    const refs = loadMyOrders();
    if (refs.length === 0) {
      setMyOrders([]);
      setLoadingMine(false);
      return;
    }
    setLoadingMine(true);
    const results = await Promise.all(
      refs.map((r) => trackOrder(r.id, r.phone).catch(() => null)),
    );
    const ok: OrderDTO[] = [];
    results.forEach((o, i) => {
      if (o) ok.push(o);
      else removeMyOrder(refs[i].id);
    });
    ok.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    setMyOrders(ok);
    setLoadingMine(false);
  }, []);

  useEffect(() => {
    void loadMine();
  }, [loadMine]);

  useEffect(() => {
    if (!routeId) {
      setSingleOrder(null);
      setSingleError(null);
      return;
    }
    let cancelled = false;
    setSingleLoading(true);
    setSingleError(null);
    (async () => {
      try {
        const phoneForLookup =
          routePhone ||
          loadMyOrders().find((o) => o.id === Number(routeId))?.phone ||
          '';
        if (!phoneForLookup) {
          throw new Error('لا يمكن عرض هذا الطلب بدون رقم الهاتف');
        }
        const res = await trackOrder(routeId, normalizeIraqPhone11(phoneForLookup));
        if (!cancelled) setSingleOrder(res);
      } catch (err) {
        if (!cancelled) {
          setSingleOrder(null);
          setSingleError(
            err instanceof Error ? err.message : 'تعذّر العثور على الطلب',
          );
        }
      } finally {
        if (!cancelled) setSingleLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [routeId, routePhone]);

  const onSubmitSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim() || phone.length !== 11) {
      setSearchError('أدخل رقم الطلب ورقم الهاتف (11 رقمًا)');
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    try {
      const res = await trackOrder(id.trim(), phone);
      saveMyOrder({ id: res.id, phone });
      await loadMine();
      setId('');
      setPhone('');
      setShowSearch(false);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'تعذّر العثور على الطلب');
    } finally {
      setSearchLoading(false);
    }
  };

  const removeFromMine = (oid: number) => {
    if (!confirm('إزالة هذا الطلب من قائمة طلباتي؟')) return;
    removeMyOrder(oid);
    setMyOrders((prev) => prev.filter((o) => o.id !== oid));
  };

  if (routeId) {
    return (
      <div className="container-saqer py-6 sm:py-10">
        <Link
          to="/track"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-ink-700/85 hover:text-saqer-700 dark:text-ink-200/90 dark:hover:text-saqer-300"
        >
          <ArrowLeft className="h-4 w-4" />
          العودة إلى طلباتي
        </Link>
        {singleLoading && (
          <div className="mx-auto max-w-3xl space-y-4">
            <Skeleton rounded="rounded-2xl" className="h-24 w-full" />
            <Skeleton rounded="rounded-2xl" className="h-28 w-full" />
            <Skeleton rounded="rounded-2xl" className="h-40 w-full" />
            <Skeleton rounded="rounded-2xl" className="h-56 w-full" />
          </div>
        )}
        {singleError && !singleLoading && (
          <div className="mx-auto max-w-xl rounded-xl border border-rose-200 bg-rose-50 px-4 py-6 text-center text-sm font-bold text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300">
            {singleError}
          </div>
        )}
        {singleOrder && !singleLoading && !singleError && (
          <OrderView order={singleOrder} />
        )}
      </div>
    );
  }

  return (
    <div className="container-saqer py-6 sm:py-10">
      <header className="mb-6 text-center sm:mb-8">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-saqer-50 text-saqer-700 sm:h-16 sm:w-16 dark:bg-ink-900 dark:text-saqer-300">
          <Package className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
        <h1 className="text-2xl font-black sm:text-4xl">طلباتي</h1>
        <p className="mt-1 text-sm text-ink-700/70 dark:text-ink-50/60">
          تظهر هنا طلباتك السابقة تلقائيًا
        </p>
      </header>

      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => void loadMine()}
            disabled={loadingMine}
            className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 py-2 text-xs font-bold text-ink-700 hover:border-saqer-500/60 hover:text-saqer-700 disabled:opacity-60 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-200 dark:hover:text-saqer-300 sm:text-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingMine ? 'animate-spin' : ''}`} />
            تحديث
          </button>
          <button
            type="button"
            onClick={() => setShowSearch((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 py-2 text-xs font-bold text-ink-700 hover:border-saqer-500/60 hover:text-saqer-700 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-200 dark:hover:text-saqer-300 sm:text-sm"
            aria-expanded={showSearch}
          >
            <Search className="h-3.5 w-3.5" />
            إضافة طلب برقم
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${showSearch ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {showSearch && (
          <form
            onSubmit={onSubmitSearch}
            className="grid gap-3 rounded-2xl border border-ink-200 bg-white p-4 dark:border-ink-600 dark:bg-ink-900 sm:grid-cols-[1fr_1.2fr_auto] sm:items-start"
          >
            <div>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="رقم الطلب"
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-saqer-500 sm:text-base dark:border-ink-600 dark:bg-ink-950 dark:text-white dark:placeholder:text-ink-500"
              />
            </div>
            <div>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={11}
                value={phone}
                onChange={(e) => setPhone(normalizeIraqPhone11(e.target.value))}
                placeholder="07XXXXXXXXX"
                dir="ltr"
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-saqer-500 sm:text-base dark:border-ink-600 dark:bg-ink-950 dark:text-white dark:placeholder:text-ink-500"
              />
            </div>
            <button
              type="submit"
              disabled={searchLoading}
              className="btn-primary !px-5 disabled:opacity-60"
            >
              {searchLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              إضافة
            </button>
            {searchError && (
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400 sm:col-span-3">
                {searchError}
              </p>
            )}
          </form>
        )}

        {loadingMine ? (
          <ul className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i}>
                <OrderRowSkeleton />
              </li>
            ))}
          </ul>
        ) : myOrders.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="space-y-3">
            {myOrders.map((o) => (
              <li key={o.id}>
                <MyOrderCard order={o} onRemove={() => removeFromMine(o.id)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-8 text-center dark:border-ink-700 dark:bg-ink-900 sm:p-12">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-ink-50 text-ink-400 dark:bg-ink-800 dark:text-ink-500">
        <ShoppingBag className="h-6 w-6" />
      </div>
      <p className="text-base font-black text-ink-900 dark:text-white">
        لا توجد طلبات بعد
      </p>
      <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">
        سجّل أول طلب وستظهر لك هنا تلقائيًا
      </p>
      <Link to="/products" className="btn-primary mx-auto mt-4 w-fit">
        تسوّق الآن
      </Link>
    </div>
  );
}

function MyOrderCard({
  order,
  onRemove,
}: {
  order: OrderDTO;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const meta = STATUS_META[order.status];
  const Icon = meta.icon;
  const itemsCount = useMemo(
    () => order.items.reduce((s, i) => s + i.quantity, 0),
    [order.items],
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm dark:border-ink-600 dark:bg-ink-900">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-3 text-right transition-colors hover:bg-ink-50/60 dark:hover:bg-ink-800/50 sm:p-4"
        aria-expanded={open}
      >
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${meta.bg}`}>
          <Icon className={`h-5 w-5 ${meta.color}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-black text-ink-900 dark:text-white sm:text-base">
              طلب #{order.id}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black sm:text-[11px] ${meta.bg} ${meta.color}`}
            >
              {meta.label}
            </span>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-ink-500 dark:text-ink-400 sm:text-xs">
            <span>{new Date(order.createdAt).toLocaleDateString('ar-IQ')}</span>
            <span>•</span>
            <span>
              {itemsCount} {itemsCount === 1 ? 'قطعة' : 'قطع'}
            </span>
            {order.governorate && (
              <>
                <span>•</span>
                <span>{order.governorate}</span>
              </>
            )}
          </div>
        </div>
        <div className="shrink-0 text-left">
          <div className="text-sm font-black tabular-nums text-saqer-700 dark:text-saqer-300 sm:text-base">
            {formatIQD(order.total)}
          </div>
          <div className="mt-0.5 text-[9px] font-bold text-ink-500 sm:text-[10px]">
            {CURRENCY_LABEL}
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="border-t border-ink-100 bg-ink-50/40 p-3 dark:border-ink-700 dark:bg-ink-950/40 sm:p-4">
          <OrderView order={order} compact />
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/30"
            >
              <Trash2 className="h-3.5 w-3.5" />
              إزالة من القائمة
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderView({ order, compact = false }: { order: OrderDTO; compact?: boolean }) {
  const { getProduct } = useStore();
  const meta = STATUS_META[order.status];
  const Icon = meta.icon;
  const currentIndex = ORDER_STEPS.indexOf(order.status);

  return (
    <div className={`mx-auto max-w-3xl space-y-4 sm:space-y-5 ${compact ? '!max-w-none' : ''}`}>
      {!compact && (
        <div
          className={`card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${meta.bg}`}
        >
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/80 dark:bg-ink-950/60">
              <Icon className={`h-6 w-6 ${meta.color}`} />
            </div>
            <div>
              <div className="text-xs font-bold text-ink-700/70 dark:text-ink-50/60">
                طلب رقم #{order.id}
              </div>
              <div className={`text-lg font-black ${meta.color}`}>{meta.label}</div>
            </div>
          </div>
          <div className="text-xs font-bold text-ink-700/70 sm:text-sm dark:text-ink-50/60">
            {new Date(order.createdAt).toLocaleString('ar-IQ')}
          </div>
        </div>
      )}

      {order.status !== 'cancelled' && (
        <div className="card p-4 sm:p-5">
          <h3 className="mb-4 text-sm font-black sm:text-base">مراحل الطلب</h3>
          <ol className="grid grid-cols-4 gap-1 sm:gap-2">
            {ORDER_STEPS.map((step, i) => {
              const active = i <= currentIndex;
              const s = STATUS_META[step];
              const StepIcon = s.icon;
              return (
                <li key={step} className="flex flex-col items-center text-center">
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-full transition-colors sm:h-12 sm:w-12 ${
                      active
                        ? 'bg-saqer-600 text-white'
                        : 'bg-ink-100 text-ink-400 dark:bg-ink-800 dark:text-ink-500'
                    }`}
                  >
                    <StepIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <span
                    className={`mt-2 text-[10px] font-bold leading-tight sm:text-xs ${
                      active
                        ? 'text-ink-900 dark:text-white'
                        : 'text-ink-400 dark:text-ink-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <div className="card p-4 sm:p-5">
        <h3 className="mb-3 text-sm font-black sm:text-base">معلومات التوصيل</h3>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-ink-700/60 dark:text-ink-50/50">الاسم</dt>
            <dd className="font-bold">{order.customerName}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-700/60 dark:text-ink-50/50">الهاتف</dt>
            <dd className="font-bold tabular-nums" dir="ltr">
              {order.customerPhone}
            </dd>
          </div>
          {order.governorate && (
            <div>
              <dt className="text-xs text-ink-700/60 dark:text-ink-50/50">المحافظة</dt>
              <dd className="font-bold">{order.governorate}</dd>
            </div>
          )}
          <div className="sm:col-span-2">
            <dt className="text-xs text-ink-700/60 dark:text-ink-50/50">العنوان</dt>
            <dd className="font-bold">{order.customerAddress}</dd>
          </div>
          {order.notes && (
            <div className="sm:col-span-2">
              <dt className="text-xs text-ink-700/60 dark:text-ink-50/50">ملاحظات</dt>
              <dd>{order.notes}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="card border-ink-200 p-4 dark:border-ink-600 sm:p-5">
        <h3 className="mb-4 text-sm font-black sm:text-base dark:text-white">تفاصيل الطلب</h3>
        <ul className="mb-4 space-y-3 text-sm">
          {order.items.map((it, idx) => {
            const prod = it.productId ? getProduct(it.productId) : undefined;
            return (
              <li
                key={idx}
                className="flex items-center gap-3 border-b border-ink-100 pb-3 last:border-0 last:pb-0 dark:border-ink-700/80"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-ink-100 bg-ink-50 dark:border-ink-600 dark:bg-ink-800 sm:h-16 sm:w-16">
                  {prod && productPrimaryImage(prod) ? (
                    <img
                      src={productImageSrc(productPrimaryImage(prod))}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-lg">📦</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-bold text-ink-900 dark:text-white">
                    {it.name ?? it.productId}
                  </p>
                  <p className="text-xs text-ink-500 dark:text-ink-400">الكمية: {it.quantity}</p>
                </div>
                {it.price != null && (
                  <span className="shrink-0 font-bold tabular-nums text-ink-900 dark:text-ink-100">
                    {formatIQD(it.price * it.quantity)}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <dl className="space-y-1 border-t border-ink-100 pt-3 text-sm dark:border-ink-800">
          <div className="flex justify-between">
            <dt className="text-ink-700/70 dark:text-ink-50/60">المجموع الفرعي</dt>
            <dd className="font-bold tabular-nums">
              {formatIQD(order.subtotal)} {CURRENCY_LABEL}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-700/70 dark:text-ink-50/60">الشحن</dt>
            <dd className="font-bold tabular-nums">
              {order.shipping === 0
                ? 'مجاني'
                : `${formatIQD(order.shipping)} ${CURRENCY_LABEL}`}
            </dd>
          </div>
          <div className="flex justify-between border-t border-ink-100 pt-2 dark:border-ink-800">
            <dt className="font-black">الإجمالي</dt>
            <dd className="font-black tabular-nums text-saqer-700 dark:text-saqer-300">
              {formatIQD(order.total)} {CURRENCY_LABEL}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
