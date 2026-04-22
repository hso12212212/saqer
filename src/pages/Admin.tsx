import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Pencil,
  X,
  Save,
  Tag,
  Package,
  LogOut,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import {
  adminCreateProduct,
  adminDeleteCategory,
  adminDeleteProduct,
  adminSaveCategory,
  adminUpdateProduct,
  type CategoryDTO,
} from '../lib/api';
import type { Product } from '../types';
import { formatIQD, CURRENCY_LABEL } from '../lib/format';

type Tab = 'products' | 'categories';

interface ProductForm {
  id?: string;
  name: string;
  slug: string;
  category: string;
  price: string;
  oldPrice: string;
  image: string;
  stock: string;
  rating: string;
  reviews: string;
  isNew: boolean;
  isBestSeller: boolean;
  description: string;
  features: string;
  colors: string;
}

const emptyProductForm: ProductForm = {
  name: '',
  slug: '',
  category: '',
  price: '',
  oldPrice: '',
  image: '',
  stock: '10',
  rating: '5',
  reviews: '0',
  isNew: true,
  isBestSeller: false,
  description: '',
  features: '',
  colors: '',
};

function toForm(p: Product): ProductForm {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    price: String(p.price),
    oldPrice: p.oldPrice != null ? String(p.oldPrice) : '',
    image: p.image,
    stock: String(p.stock),
    rating: String(p.rating),
    reviews: String(p.reviews),
    isNew: !!p.isNew,
    isBestSeller: !!p.isBestSeller,
    description: p.description,
    features: (p.features ?? []).join('\n'),
    colors: (p.colors ?? []).join(', '),
  };
}

function fromForm(f: ProductForm) {
  return {
    id: f.id,
    name: f.name.trim(),
    slug: f.slug.trim(),
    category: f.category.trim(),
    price: Number(f.price),
    oldPrice: f.oldPrice ? Number(f.oldPrice) : undefined,
    image: f.image.trim(),
    stock: Number(f.stock || 0),
    rating: Number(f.rating || 0),
    reviews: Number(f.reviews || 0),
    isNew: f.isNew,
    isBestSeller: f.isBestSeller,
    description: f.description.trim(),
    features: f.features
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean),
    colors: f.colors
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

export default function Admin() {
  const { isAdmin, loading, logout, email } = useAuth();
  const { products, categories, loading: loadingData, refresh } = useStore();
  const [tab, setTab] = useState<Tab>('products');
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null);

  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newCategory, setNewCategory] = useState<CategoryDTO>({
    key: '',
    label: '',
    emoji: '📦',
    description: '',
  });

  const showToast = (kind: 'ok' | 'err', msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const reload = refresh;

  useEffect(() => {
    if (isAdmin) refresh();
  }, [isAdmin, refresh]);

  const grouped = useMemo(() => {
    const map = new Map<string, Product[]>();
    for (const p of products) {
      const list = map.get(p.category) ?? [];
      list.push(p);
      map.set(p.category, list);
    }
    return map;
  }, [products]);

  if (loading) {
    return (
      <main className="container-saqer py-20 text-center text-ink-500">جاري التحقق...</main>
    );
  }
  if (!isAdmin) return <Navigate to="/login" replace />;

  const openNewProduct = () => {
    setEditingId(null);
    setProductForm({ ...emptyProductForm, category: categories[0]?.key ?? '' });
    setShowProductModal(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingId(p.id);
    setProductForm(toForm(p));
    setShowProductModal(true);
  };

  const saveProduct = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = fromForm(productForm);
      if (editingId) {
        await adminUpdateProduct(editingId, payload);
        showToast('ok', 'تم تحديث المنتج');
      } else {
        await adminCreateProduct(payload);
        showToast('ok', 'تمت إضافة المنتج');
      }
      setShowProductModal(false);
      await reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'فشل الحفظ';
      showToast('err', message);
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (p: Product) => {
    if (!confirm(`حذف المنتج "${p.name}" نهائيًا؟`)) return;
    try {
      await adminDeleteProduct(p.id);
      showToast('ok', 'تم الحذف');
      await reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'فشل الحذف';
      showToast('err', message);
    }
  };

  const addCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCategory.key.trim() || !newCategory.label.trim()) return;
    try {
      await adminSaveCategory({
        key: newCategory.key.trim(),
        label: newCategory.label.trim(),
        emoji: newCategory.emoji?.trim() || '📦',
        description: newCategory.description?.trim() || '',
      });
      showToast('ok', 'تمت إضافة الفئة');
      setNewCategory({ key: '', label: '', emoji: '📦', description: '' });
      await reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'فشل الحفظ';
      showToast('err', message);
    }
  };

  const removeCategory = async (key: string) => {
    if (!confirm(`حذف الفئة "${key}"؟`)) return;
    try {
      await adminDeleteCategory(key);
      showToast('ok', 'تم حذف الفئة');
      await reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'فشل الحذف';
      showToast('err', message);
    }
  };

  return (
    <main className="container-saqer py-6 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-saqer-500/10 text-saqer-600 dark:text-saqer-400 grid place-items-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">لوحة التحكم</h1>
            <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400">
              {email} • مشرف
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={reload} className="btn btn-outline py-2 px-3 text-sm gap-2">
            <RefreshCw className="h-4 w-4" /> تحديث
          </button>
          <button onClick={logout} className="btn btn-ghost py-2 px-3 text-sm gap-2">
            <LogOut className="h-4 w-4" /> خروج
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setTab('products')}
          className={`btn py-2 px-4 text-sm gap-2 ${
            tab === 'products' ? 'btn-primary' : 'btn-outline'
          }`}
        >
          <Package className="h-4 w-4" /> المنتجات ({products.length})
        </button>
        <button
          onClick={() => setTab('categories')}
          className={`btn py-2 px-4 text-sm gap-2 ${
            tab === 'categories' ? 'btn-primary' : 'btn-outline'
          }`}
        >
          <Tag className="h-4 w-4" /> الفئات ({categories.length})
        </button>
      </div>

      {loadingData ? (
        <div className="text-center py-20 text-ink-500">جاري التحميل...</div>
      ) : tab === 'products' ? (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">كل المنتجات</h2>
            <button onClick={openNewProduct} className="btn btn-primary py-2 px-4 text-sm gap-2">
              <Plus className="h-4 w-4" /> منتج جديد
            </button>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-ink-50 dark:bg-ink-800/60 text-ink-700 dark:text-ink-200">
                  <tr className="text-right">
                    <th className="px-3 py-3 font-bold">المنتج</th>
                    <th className="px-3 py-3 font-bold">الفئة</th>
                    <th className="px-3 py-3 font-bold">السعر</th>
                    <th className="px-3 py-3 font-bold">المخزون</th>
                    <th className="px-3 py-3 font-bold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-ink-500">
                        لا توجد منتجات — أضف أول منتج
                      </td>
                    </tr>
                  )}
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div className="min-w-0">
                            <div className="font-bold truncate max-w-[220px]">{p.name}</div>
                            <div className="text-xs text-ink-500">{p.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">{p.category}</td>
                      <td className="px-3 py-3 whitespace-nowrap font-bold">
                        {formatIQD(p.price)} <span className="text-xs">{CURRENCY_LABEL}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`chip ${
                            p.stock > 0
                              ? 'bg-saqer-500/10 text-saqer-700 dark:text-saqer-300'
                              : 'bg-red-500/10 text-red-600'
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openEditProduct(p)}
                            className="btn btn-outline py-1.5 px-2.5 text-xs gap-1"
                          >
                            <Pencil className="h-3.5 w-3.5" /> تعديل
                          </button>
                          <button
                            onClick={() => removeProduct(p)}
                            className="btn py-1.5 px-2.5 text-xs gap-1 bg-red-600 text-white hover:bg-red-700"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : (
        <section>
          <div className="grid lg:grid-cols-5 gap-6">
            <form onSubmit={addCategory} className="card p-5 lg:col-span-2 space-y-3">
              <h3 className="font-bold">إضافة فئة جديدة</h3>
              <input
                className="w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 p-2.5 text-sm"
                placeholder="المعرّف (عربي أو إنجليزي) — مثال: خيام"
                value={newCategory.key}
                onChange={(e) => setNewCategory({ ...newCategory, key: e.target.value })}
                required
              />
              <input
                className="w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 p-2.5 text-sm"
                placeholder="الاسم للعرض — مثال: الخيام"
                value={newCategory.label}
                onChange={(e) => setNewCategory({ ...newCategory, label: e.target.value })}
                required
              />
              <input
                className="w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 p-2.5 text-sm"
                placeholder="رمز تعبيري — مثال: ⛺"
                value={newCategory.emoji}
                onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })}
              />
              <textarea
                className="w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 p-2.5 text-sm"
                rows={2}
                placeholder="وصف مختصر (اختياري)"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, description: e.target.value })
                }
              />
              <button className="btn btn-primary w-full justify-center gap-2" type="submit">
                <Plus className="h-4 w-4" /> حفظ
              </button>
            </form>

            <div className="card p-5 lg:col-span-3">
              <h3 className="font-bold mb-3">الفئات الحالية</h3>
              <ul className="divide-y divide-ink-100 dark:divide-ink-800">
                {categories.length === 0 && (
                  <li className="text-center py-8 text-ink-500">لا توجد فئات</li>
                )}
                {categories.map((c) => (
                  <li key={c.key} className="py-3 flex items-center gap-3">
                    <span className="text-2xl">{c.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold">{c.label}</div>
                      <div className="text-xs text-ink-500 truncate">
                        {c.key} • {c.description || '—'} • منتجات:{' '}
                        {grouped.get(c.key)?.length ?? 0}
                      </div>
                    </div>
                    <button
                      onClick={() => removeCategory(c.key)}
                      className="btn py-1.5 px-2.5 text-xs gap-1 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                      disabled={(grouped.get(c.key)?.length ?? 0) > 0}
                      title={
                        (grouped.get(c.key)?.length ?? 0) > 0
                          ? 'لا يمكن حذف فئة بها منتجات'
                          : 'حذف'
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" /> حذف
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {showProductModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4"
          onClick={() => setShowProductModal(false)}
        >
          <form
            onSubmit={saveProduct}
            onClick={(e) => e.stopPropagation()}
            className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {editingId ? 'تعديل منتج' : 'منتج جديد'}
              </h3>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="rounded-lg p-1.5 hover:bg-ink-100 dark:hover:bg-ink-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <label className="sm:col-span-2">
                <span className="text-xs font-bold">الاسم</span>
                <input
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full mt-1 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 p-2.5 text-sm"
                />
              </label>
              <label>
                <span className="text-xs font-bold">المعرّف (slug)</span>
                <input
                  required
                  value={productForm.slug}
                  onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                  className="w-full mt-1 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 p-2.5 text-sm"
                  placeholder="my-product"
                />
              </label>
              <label>
                <span className="text-xs font-bold">الفئة</span>
                <select
                  required
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm({ ...productForm, category: e.target.value })
                  }
                  className="w-full mt-1 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 p-2.5 text-sm"
                >
                  <option value="" disabled>
                    اختر فئة
                  </option>
                  {categories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.emoji} {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="text-xs font-bold">السعر ({CURRENCY_LABEL})</span>
                <input
                  required
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="w-full mt-1 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 p-2.5 text-sm"
                />
              </label>
              <label>
                <span className="text-xs font-bold">السعر قبل الخصم (اختياري)</span>
                <input
                  type="number"
                  value={productForm.oldPrice}
                  onChange={(e) =>
                    setProductForm({ ...productForm, oldPrice: e.target.value })
                  }
                  className="w-full mt-1 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 p-2.5 text-sm"
                />
              </label>
              <label className="sm:col-span-2">
                <span className="text-xs font-bold">رابط الصورة</span>
                <input
                  required
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full mt-1 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 p-2.5 text-sm"
                  placeholder="https://..."
                />
              </label>
              <label>
                <span className="text-xs font-bold">المخزون</span>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  className="w-full mt-1 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 p-2.5 text-sm"
                />
              </label>
              <label>
                <span className="text-xs font-bold">التقييم (0-5)</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={productForm.rating}
                  onChange={(e) => setProductForm({ ...productForm, rating: e.target.value })}
                  className="w-full mt-1 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 p-2.5 text-sm"
                />
              </label>
              <label className="sm:col-span-2">
                <span className="text-xs font-bold">الوصف</span>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  className="w-full mt-1 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 p-2.5 text-sm"
                />
              </label>
              <label className="sm:col-span-2">
                <span className="text-xs font-bold">
                  المميزات (سطر لكل ميزة)
                </span>
                <textarea
                  rows={3}
                  value={productForm.features}
                  onChange={(e) =>
                    setProductForm({ ...productForm, features: e.target.value })
                  }
                  className="w-full mt-1 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 p-2.5 text-sm"
                  placeholder={`مقاومة للماء\nخفيفة الوزن`}
                />
              </label>
              <label className="sm:col-span-2">
                <span className="text-xs font-bold">الألوان (فاصلة بينها)</span>
                <input
                  value={productForm.colors}
                  onChange={(e) =>
                    setProductForm({ ...productForm, colors: e.target.value })
                  }
                  className="w-full mt-1 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 p-2.5 text-sm"
                  placeholder="أخضر, رملي, أزرق"
                />
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={productForm.isNew}
                  onChange={(e) =>
                    setProductForm({ ...productForm, isNew: e.target.checked })
                  }
                />
                <span className="text-sm">منتج جديد</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={productForm.isBestSeller}
                  onChange={(e) =>
                    setProductForm({ ...productForm, isBestSeller: e.target.checked })
                  }
                />
                <span className="text-sm">الأكثر مبيعًا</span>
              </label>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary flex-1 justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'جاري الحفظ...' : 'حفظ'}
              </button>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="btn btn-ghost"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl px-4 py-2.5 text-sm font-bold shadow-lg ${
            toast.kind === 'ok' ? 'bg-saqer-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </main>
  );
}
