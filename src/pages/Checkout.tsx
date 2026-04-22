import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { CURRENCY_LABEL, formatIQD } from '../lib/format';
import { createOrder } from '../lib/api';
import { productImageSrc, productPrimaryImage } from '../lib/imageUrl';
import { shippingForSubtotal } from '../lib/shipping';
import { saveMyOrder } from '../lib/myOrders';

const IRAQ_GOVERNORATES = [
  'بغداد',
  'البصرة',
  'نينوى',
  'أربيل',
  'النجف',
  'كربلاء',
  'ذي قار',
  'بابل',
  'الأنبار',
  'واسط',
  'ديالى',
  'صلاح الدين',
  'كركوك',
  'ميسان',
  'المثنى',
  'القادسية',
  'السليمانية',
  'دهوك',
  'حلبجة',
];

interface FormState {
  name: string;
  phone: string;
  governorate: string;
  address: string;
  notes: string;
}

function normalizeIraqPhone11(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 11);
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { getProduct } = useStore();

  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    governorate: '',
    address: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const shipping = useMemo(() => shippingForSubtotal(subtotal), [subtotal]);
  const total = subtotal + shipping;

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const onChange = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const v = e.target.value;
    if (key === 'phone') {
      setForm((f) => ({ ...f, phone: normalizeIraqPhone11(v) }));
    } else {
      setForm((f) => ({ ...f, [key]: v }));
    }
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (!form.name.trim() || form.name.trim().length < 3) {
      next.name = 'الرجاء إدخال اسم ثلاثي على الأقل';
    }
    const phone = form.phone;
    if (phone.length !== 11) {
      next.phone = 'رقم الموبايل يجب أن يكون 11 رقمًا بالضبط (07…)';
    } else if (!/^07\d{9}$/.test(phone)) {
      next.phone = 'صيغة غير صحيحة. ابدأ بـ 07 ثم 9 أرقام';
    }
    if (!form.governorate) {
      next.governorate = 'اختر المحافظة';
    }
    if (!form.address.trim() || form.address.trim().length < 8) {
      next.address = 'أدخل عنواناً دقيقاً (منطقة، شارع، أقرب نقطة دالة)';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const orderItems = items
        .map((it) => {
          const p = getProduct(it.productId);
          return p
            ? {
                productId: it.productId,
                quantity: it.quantity,
                price: p.price,
                name: p.name,
              }
            : null;
        })
        .filter((x): x is NonNullable<typeof x> => x != null);

      const order = await createOrder({
        customerName: form.name.trim(),
        customerPhone: form.phone,
        customerAddress: form.address.trim(),
        governorate: form.governorate,
        notes: form.notes.trim() || undefined,
        items: orderItems,
        subtotal,
        shipping,
        total,
      });
      saveMyOrder({ id: order.id, phone: form.phone });
      clearCart();
      navigate(`/track`, { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'فشل إرسال الطلب');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-saqer py-6 sm:py-10">
      <div className="mb-5 sm:mb-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1 text-sm font-bold text-ink-700/80 hover:text-saqer-700 dark:text-ink-200/80 dark:hover:text-saqer-400"
        >
          <ArrowLeft className="h-4 w-4 rotate-180" />
          العودة إلى السلة
        </Link>
        <h1 className="mt-2 text-2xl font-black text-ink-900 sm:text-4xl dark:text-white">إتمام الطلب</h1>
        <p className="mt-1 text-sm text-ink-700/80 dark:text-ink-300/90">
          أدخل معلومات التوصيل وسنقوم بالتواصل معك لتأكيد الطلب
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid gap-6 lg:grid-cols-[1fr_360px] lg:gap-8"
      >
        <div className="space-y-5">
          <section className="card space-y-4 border-ink-200 p-4 dark:border-ink-600 sm:p-5">
            <h2 className="text-base font-black sm:text-lg dark:text-white">معلومات المستلم</h2>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink-800 sm:text-sm dark:text-ink-200">
                الاسم الكامل
              </label>
              <input
                type="text"
                value={form.name}
                onChange={onChange('name')}
                placeholder="مثال: محمد علي حسين"
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none transition focus:border-saqer-500 sm:text-base dark:border-ink-600 dark:bg-ink-900 dark:text-white dark:placeholder:text-ink-500"
              />
              {errors.name && (
                <p className="mt-1 text-xs font-bold text-rose-600 dark:text-rose-400">{errors.name}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-ink-800 sm:text-sm dark:text-ink-200">
                  رقم الموبايل (11 رقم)
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={11}
                  value={form.phone}
                  onChange={onChange('phone')}
                  placeholder="07XXXXXXXXX"
                  dir="ltr"
                  className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none transition focus:border-saqer-500 sm:text-base dark:border-ink-600 dark:bg-ink-900 dark:text-white dark:placeholder:text-ink-500"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs font-bold text-rose-600 dark:text-rose-400">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-ink-800 sm:text-sm dark:text-ink-200">
                  المحافظة
                </label>
                <select
                  value={form.governorate}
                  onChange={onChange('governorate')}
                  className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-saqer-500 sm:text-base dark:border-ink-600 dark:bg-ink-900 dark:text-white"
                >
                  <option value="">اختر المحافظة</option>
                  {IRAQ_GOVERNORATES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                {errors.governorate && (
                  <p className="mt-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                    {errors.governorate}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink-800 sm:text-sm dark:text-ink-200">
                العنوان الدقيق
              </label>
              <textarea
                value={form.address}
                onChange={onChange('address')}
                placeholder="القضاء، الناحية، الحي، الشارع، أقرب نقطة دالة"
                rows={3}
                className="w-full resize-none rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-saqer-500 sm:text-base dark:border-ink-600 dark:bg-ink-900 dark:text-white dark:placeholder:text-ink-500"
              />
              {errors.address && (
                <p className="mt-1 text-xs font-bold text-rose-600 dark:text-rose-400">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink-800 sm:text-sm dark:text-ink-200">
                ملاحظات إضافية
              </label>
              <p className="mb-1.5 text-[11px] text-ink-500 dark:text-ink-400">اختياري</p>
              <textarea
                value={form.notes}
                onChange={onChange('notes')}
                placeholder="أي تعليمات خاصة بالتوصيل"
                rows={2}
                className="w-full resize-none rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-saqer-500 sm:text-base dark:border-ink-600 dark:bg-ink-900 dark:text-white dark:placeholder:text-ink-500"
              />
            </div>
          </section>

          {serverError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800 dark:border-rose-800/50 dark:bg-rose-950/40 dark:text-rose-200">
              {serverError}
            </div>
          )}
        </div>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="card border-ink-200 p-4 dark:border-ink-600 sm:p-5">
            <h3 className="mb-4 text-base font-black sm:text-lg dark:text-white">ملخص الطلب</h3>

            <ul className="mb-4 space-y-3 text-sm">
              {items.map((it) => {
                const p = getProduct(it.productId);
                if (!p) return null;
                return (
                  <li
                    key={it.productId}
                    className="flex gap-3 border-b border-ink-100 pb-3 last:border-0 last:pb-0 dark:border-ink-700/80"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-100 dark:bg-ink-800 sm:h-20 sm:w-20">
                      <img
                        src={productImageSrc(productPrimaryImage(p))}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 font-bold leading-snug text-ink-900 dark:text-white">
                        {p.name}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">الكمية: {it.quantity}</p>
                      <p className="mt-1 text-sm font-black tabular-nums text-saqer-700 dark:text-saqer-400">
                        {formatIQD(p.price * it.quantity)} {CURRENCY_LABEL}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <dl className="space-y-2 border-t border-ink-200 pt-3 text-sm dark:border-ink-600">
              <div className="flex justify-between">
                <dt className="text-ink-700/85 dark:text-ink-300/90">المجموع الفرعي</dt>
                <dd className="font-bold tabular-nums text-ink-900 dark:text-white">
                  {formatIQD(subtotal)} {CURRENCY_LABEL}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-700/85 dark:text-ink-300/90">الشحن</dt>
                <dd className="font-bold tabular-nums text-ink-900 dark:text-white">
                  {formatIQD(shipping)} {CURRENCY_LABEL}
                </dd>
              </div>
              <div className="mt-2 flex justify-between border-t border-ink-200 pt-3 dark:border-ink-600">
                <dt className="text-base font-black text-ink-900 dark:text-white">الإجمالي</dt>
                <dd className="text-lg font-black tabular-nums text-saqer-700 dark:text-saqer-400">
                  {formatIQD(total)} {CURRENCY_LABEL}
                </dd>
              </div>
            </dl>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary mt-5 w-full disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جارٍ الإرسال...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  تأكيد وإرسال الطلب
                </>
              )}
            </button>

            <p className="mt-3 text-center text-xs text-ink-600 dark:text-ink-400/90">
              الدفع عند الاستلام — توصيل لكل المحافظات
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
