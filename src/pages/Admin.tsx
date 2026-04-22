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
  Image as ImageIcon,
  Upload,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import {
  adminCreateProduct,
  adminDeleteCategory,
  adminDeleteProduct,
  adminSaveCategory,
  adminUpdateProduct,
  adminUploadProductImage,
  type CategoryDTO,
} from '../lib/api';
import type { Product } from '../types';
import { formatIQD, CURRENCY_LABEL } from '../lib/format';
import { productImageSrc } from '../lib/imageUrl';

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
  isNew: boolean;
  isBestSeller: boolean;
  description: string;
  features: string;
  colors: string[];
}

interface CategoryForm {
  key: string;
  label: string;
  emoji: string;
  description: string;
  image: string;
}

const emptyProductForm: ProductForm = {
  name: '',
  slug: '',
  category: '',
  price: '',
  oldPrice: '',
  image: '',
  stock: '10',
  isNew: true,
  isBestSeller: false,
  description: '',
  features: '',
  colors: [],
};

const emptyCategoryForm: CategoryForm = {
  key: '',
  label: '',
  emoji: '📦',
  description: '',
  image: '',
};

const COLOR_PRESETS: { name: string; value: string }[] = [
  { name: 'أخضر', value: '#059669' },
  { name: 'رملي', value: '#d4a574' },
  { name: 'أزرق', value: '#2563eb' },
  { name: 'أحمر', value: '#dc2626' },
  { name: 'أسود', value: '#111827' },
  { name: 'أبيض', value: '#f9fafb' },
  { name: 'رمادي', value: '#6b7280' },
  { name: 'برتقالي', value: '#ea580c' },
  { name: 'أصفر', value: '#eab308' },
  { name: 'بنفسجي', value: '#7c3aed' },
  { name: 'زيتي', value: '#4d7c0f' },
  { name: 'بني', value: '#78350f' },
];

function toProductForm(p: Product): ProductForm {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    price: String(p.price),
    oldPrice: p.oldPrice != null ? String(p.oldPrice) : '',
    image: p.image,
    stock: String(p.stock),
    isNew: !!p.isNew,
    isBestSeller: !!p.isBestSeller,
    description: p.description,
    features: (p.features ?? []).join('\n'),
    colors: p.colors ?? [],
  };
}

function fromProductForm(f: ProductForm) {
  return {
    id: f.id,
    name: f.name.trim(),
    slug: f.slug.trim(),
    category: f.category.trim(),
    price: Number(f.price),
    oldPrice: f.oldPrice ? Number(f.oldPrice) : undefined,
    image: f.image.trim(),
    stock: Number(f.stock || 0),
    rating: 0,
    reviews: 0,
    isNew: f.isNew,
    isBestSeller: f.isBestSeller,
    description: f.description.trim(),
    features: f.features
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean),
    colors: f.colors,
  };
}

export default function Admin() {
  const { isAdmin, loading, logout, email } = useAuth();
  const { products, categories, loading: loadingData, refresh } = useStore();
  const [tab, setTab] = useState<Tab>('products');
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null);
  const [search, setSearch] = useState('');

  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [categoryForm, setCategoryForm] = useState<CategoryForm>(emptyCategoryForm);
  const [editingCategoryKey, setEditingCategoryKey] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryImageUploading, setCategoryImageUploading] = useState(false);

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

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.trim().toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [products, search]);

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
    setProductForm(toProductForm(p));
    setShowProductModal(true);
  };

  const saveProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!productForm.image.trim()) {
      showToast('err', 'ارفع صورة للمنتج أولًا');
      return;
    }
    setSaving(true);
    try {
      const payload = fromProductForm(productForm);
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

  const openNewCategory = () => {
    setEditingCategoryKey(null);
    setCategoryForm(emptyCategoryForm);
    setShowCategoryModal(true);
  };

  const openEditCategory = (c: CategoryDTO) => {
    setEditingCategoryKey(c.key);
    setCategoryForm({
      key: c.key,
      label: c.label,
      emoji: c.emoji ?? '📦',
      description: c.description ?? '',
      image: c.image ?? '',
    });
    setShowCategoryModal(true);
  };

  const saveCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!categoryForm.key.trim() || !categoryForm.label.trim()) {
      showToast('err', 'المعرّف والاسم مطلوبان');
      return;
    }
    setSavingCategory(true);
    try {
      await adminSaveCategory({
        key: categoryForm.key.trim(),
        label: categoryForm.label.trim(),
        emoji: categoryForm.emoji?.trim() || '📦',
        description: categoryForm.description?.trim() || '',
        image: categoryForm.image?.trim() || null,
      });
      showToast('ok', editingCategoryKey ? 'تم تحديث الفئة' : 'تمت إضافة الفئة');
      setShowCategoryModal(false);
      await reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'فشل الحفظ';
      showToast('err', message);
    } finally {
      setSavingCategory(false);
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

  const toggleProductColor = (value: string) => {
    setProductForm((prev) => ({
      ...prev,
      colors: prev.colors.includes(value)
        ? prev.colors.filter((c) => c !== value)
        : [...prev.colors, value],
    }));
  };

  return (
    <main className="container-saqer py-5 sm:py-8">
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">لوحة التحكم</h1>
          <p className="text-xs text-ink-500 sm:text-sm dark:text-ink-400">
            {email} • مشرف
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={reload}
            className="inline-flex items-center gap-1.5 rounded-xl border border-ink-100 bg-white px-3 py-2 text-xs font-bold hover:bg-ink-50 dark:border-ink-800 dark:bg-ink-900 dark:hover:bg-ink-800 sm:text-sm"
          >
            <RefreshCw className="h-4 w-4" /> تحديث
          </button>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-ink-100 bg-white px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:border-ink-800 dark:bg-ink-900 dark:hover:bg-ink-800 sm:text-sm"
          >
            <LogOut className="h-4 w-4" /> خروج
          </button>
        </div>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto border-b border-ink-100 dark:border-ink-800">
        <button
          onClick={() => setTab('products')}
          className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
            tab === 'products'
              ? 'border-saqer-600 text-saqer-700 dark:text-saqer-300'
              : 'border-transparent text-ink-700 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white'
          }`}
        >
          <Package className="h-4 w-4" />
          المنتجات
          <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-black dark:bg-ink-800">
            {products.length}
          </span>
        </button>
        <button
          onClick={() => setTab('categories')}
          className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
            tab === 'categories'
              ? 'border-saqer-600 text-saqer-700 dark:text-saqer-300'
              : 'border-transparent text-ink-700 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white'
          }`}
        >
          <Tag className="h-4 w-4" />
          الفئات
          <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-black dark:bg-ink-800">
            {categories.length}
          </span>
        </button>
      </div>

      {loadingData && products.length === 0 ? (
        <div className="py-20 text-center text-ink-500">جاري التحميل...</div>
      ) : tab === 'products' ? (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 rounded-2xl border border-ink-100 bg-white p-2.5 dark:border-ink-800 dark:bg-ink-900 sm:flex-1">
              <Search className="h-4 w-4 shrink-0 text-ink-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="search"
                placeholder="ابحث في المنتجات..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <button
              onClick={openNewProduct}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-saqer-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-saqer-700"
            >
              <Plus className="h-4 w-4" /> منتج جديد
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-4xl">📦</div>
              <p className="mt-3 font-bold">لا توجد منتجات</p>
              <button onClick={openNewProduct} className="btn btn-primary mt-4">
                <Plus className="h-4 w-4" /> أضف أول منتج
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:hidden">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="card p-3">
                    <div className="flex gap-3">
                      <img
                        src={productImageSrc(p.image)}
                        alt={p.name}
                        className="h-20 w-20 shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-black">{p.name}</h3>
                            <div className="mt-0.5 text-[11px] text-ink-500">
                              {p.category}
                            </div>
                          </div>
                          <span
                            className={`chip shrink-0 ${
                              p.stock > 0
                                ? 'bg-saqer-500/10 text-saqer-700 dark:text-saqer-300'
                                : 'bg-red-500/10 text-red-600'
                            }`}
                          >
                            {p.stock}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-sm font-black">
                            {formatIQD(p.price)}{' '}
                            <span className="text-[10px]">{CURRENCY_LABEL}</span>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => openEditProduct(p)}
                              className="grid h-8 w-8 place-items-center rounded-lg border border-ink-100 dark:border-ink-800"
                              aria-label="تعديل"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => removeProduct(p)}
                              className="grid h-8 w-8 place-items-center rounded-lg bg-red-600 text-white"
                              aria-label="حذف"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card hidden overflow-hidden sm:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-ink-50 text-ink-700 dark:bg-ink-800/60 dark:text-ink-200">
                      <tr className="text-right">
                        <th className="px-4 py-3 font-bold">المنتج</th>
                        <th className="px-4 py-3 font-bold">الفئة</th>
                        <th className="px-4 py-3 font-bold">السعر</th>
                        <th className="px-4 py-3 font-bold">المخزون</th>
                        <th className="px-4 py-3 font-bold"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                      {filteredProducts.map((p) => (
                        <tr key={p.id}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={productImageSrc(p.image)}
                                alt={p.name}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                              <div className="min-w-0">
                                <div className="max-w-[220px] truncate font-bold">
                                  {p.name}
                                </div>
                                <div className="text-xs text-ink-500">{p.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">{p.category}</td>
                          <td className="whitespace-nowrap px-4 py-3 font-bold">
                            {formatIQD(p.price)}{' '}
                            <span className="text-xs">{CURRENCY_LABEL}</span>
                          </td>
                          <td className="px-4 py-3">
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
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openEditProduct(p)}
                                className="inline-flex items-center gap-1 rounded-lg border border-ink-100 px-2.5 py-1.5 text-xs font-bold hover:bg-ink-50 dark:border-ink-800 dark:hover:bg-ink-800"
                              >
                                <Pencil className="h-3.5 w-3.5" /> تعديل
                              </button>
                              <button
                                onClick={() => removeProduct(p)}
                                className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-red-700"
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
            </>
          )}
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black sm:text-lg">كل الفئات</h2>
            <button
              onClick={openNewCategory}
              className="inline-flex items-center gap-2 rounded-xl bg-saqer-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-saqer-700"
            >
              <Plus className="h-4 w-4" /> فئة جديدة
            </button>
          </div>

          {categories.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-4xl">🏷️</div>
              <p className="mt-3 font-bold">لا توجد فئات</p>
              <button onClick={openNewCategory} className="btn btn-primary mt-4">
                <Plus className="h-4 w-4" /> أضف أول فئة
              </button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {categories.map((c) => {
                const count = grouped.get(c.key)?.length ?? 0;
                return (
                  <div key={c.key} className="card p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900">
                        {c.image ? (
                          <img
                            src={productImageSrc(c.image)}
                            alt={c.label}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-2xl">
                            {c.emoji}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-black">{c.label}</h3>
                        <div className="text-[11px] text-ink-500">
                          {c.key} • {count} منتج
                        </div>
                      </div>
                    </div>
                    {c.description && (
                      <p className="mt-3 line-clamp-2 text-xs text-ink-600 dark:text-ink-300">
                        {c.description}
                      </p>
                    )}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => openEditCategory(c)}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-ink-100 px-3 py-2 text-xs font-bold hover:bg-ink-50 dark:border-ink-800 dark:hover:bg-ink-800"
                      >
                        <Pencil className="h-3.5 w-3.5" /> تعديل
                      </button>
                      <button
                        onClick={() => removeCategory(c.key)}
                        disabled={count > 0}
                        title={count > 0 ? 'لا يمكن حذف فئة بها منتجات' : 'حذف'}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> حذف
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {showProductModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-end bg-black/60 backdrop-blur-sm sm:place-items-center sm:p-4"
          onClick={() => setShowProductModal(false)}
        >
          <form
            onSubmit={saveProduct}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[92vh] overflow-y-auto rounded-t-2xl bg-white p-5 sm:max-w-2xl sm:rounded-2xl sm:p-6 dark:bg-ink-900"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black">
                {editingId ? 'تعديل منتج' : 'منتج جديد'}
              </h3>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="rounded-lg p-1.5 hover:bg-ink-50 dark:hover:bg-ink-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="الاسم" span>
                <input
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="المعرّف (slug)">
                <input
                  required
                  value={productForm.slug}
                  onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                  className="input"
                  placeholder="my-product"
                />
              </Field>
              <Field label="الفئة">
                <select
                  required
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm({ ...productForm, category: e.target.value })
                  }
                  className="input"
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
              </Field>
              <Field label={`السعر (${CURRENCY_LABEL})`}>
                <input
                  required
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="السعر قبل الخصم (اختياري)">
                <input
                  type="number"
                  value={productForm.oldPrice}
                  onChange={(e) =>
                    setProductForm({ ...productForm, oldPrice: e.target.value })
                  }
                  className="input"
                />
              </Field>
              <Field label="المخزون">
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  className="input"
                />
              </Field>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold">صورة المنتج</label>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink-100 bg-ink-50 dark:border-ink-800 dark:bg-ink-800">
                    {productForm.image ? (
                      <img
                        src={productImageSrc(productForm.image)}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-ink-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-ink-100 bg-white px-4 py-2 text-sm font-bold hover:bg-ink-50 dark:border-ink-800 dark:bg-ink-900 dark:hover:bg-ink-800">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="sr-only"
                        disabled={imageUploading || saving}
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          e.target.value = '';
                          if (!f) return;
                          setImageUploading(true);
                          try {
                            const { url } = await adminUploadProductImage(f);
                            setProductForm((prev) => ({ ...prev, image: url }));
                            showToast('ok', 'تم رفع الصورة');
                          } catch (err) {
                            const msg = err instanceof Error ? err.message : 'فشل رفع الصورة';
                            showToast('err', msg);
                          } finally {
                            setImageUploading(false);
                          }
                        }}
                      />
                      {imageUploading ? (
                        'جاري الرفع...'
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          اختر من المعرض
                        </>
                      )}
                    </label>
                    <p className="text-[11px] text-ink-500 dark:text-ink-400">
                      JPEG, PNG, WebP, GIF — حتى 5MB
                    </p>
                  </div>
                </div>
              </div>

              <Field label="الوصف" span>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  className="input"
                />
              </Field>

              <Field label="المميزات (سطر لكل ميزة)" span>
                <textarea
                  rows={3}
                  value={productForm.features}
                  onChange={(e) =>
                    setProductForm({ ...productForm, features: e.target.value })
                  }
                  className="input"
                  placeholder={`مقاومة للماء\nخفيفة الوزن`}
                />
              </Field>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold">الألوان المتاحة (اختياري)</label>
                <p className="mt-1 text-[11px] text-ink-500">
                  اختر الألوان التي يمكن للعميل الاختيار منها
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((c) => {
                    const active = productForm.colors.includes(c.value);
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => toggleProductColor(c.value)}
                        className={`relative grid h-11 w-11 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-white transition-all dark:ring-offset-ink-900 ${
                          active ? 'ring-saqer-600 scale-110' : 'ring-transparent'
                        }`}
                        title={c.name}
                        aria-pressed={active}
                        aria-label={c.name}
                      >
                        <span
                          className="h-9 w-9 rounded-full border border-black/10 dark:border-white/10"
                          style={{ background: c.value }}
                        />
                        {active && (
                          <span className="absolute text-xs font-black text-white mix-blend-difference">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {productForm.colors.length > 0 && (
                  <div className="mt-2 text-[11px] text-ink-500">
                    تم اختيار {productForm.colors.length} لون
                  </div>
                )}
              </div>

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

            <div className="mt-5 flex gap-2">
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

      {showCategoryModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-end bg-black/60 backdrop-blur-sm sm:place-items-center sm:p-4"
          onClick={() => setShowCategoryModal(false)}
        >
          <form
            onSubmit={saveCategory}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[92vh] overflow-y-auto rounded-t-2xl bg-white p-5 sm:max-w-lg sm:rounded-2xl sm:p-6 dark:bg-ink-900"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black">
                {editingCategoryKey ? 'تعديل فئة' : 'فئة جديدة'}
              </h3>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="rounded-lg p-1.5 hover:bg-ink-50 dark:hover:bg-ink-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold">صورة الفئة</label>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900">
                    {categoryForm.image ? (
                      <img
                        src={productImageSrc(categoryForm.image)}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-3xl">
                        {categoryForm.emoji || '📦'}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-ink-100 bg-white px-4 py-2 text-sm font-bold hover:bg-ink-50 dark:border-ink-800 dark:bg-ink-900 dark:hover:bg-ink-800">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="sr-only"
                        disabled={categoryImageUploading || savingCategory}
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          e.target.value = '';
                          if (!f) return;
                          setCategoryImageUploading(true);
                          try {
                            const { url } = await adminUploadProductImage(f);
                            setCategoryForm((prev) => ({ ...prev, image: url }));
                            showToast('ok', 'تم رفع الصورة');
                          } catch (err) {
                            const msg = err instanceof Error ? err.message : 'فشل رفع الصورة';
                            showToast('err', msg);
                          } finally {
                            setCategoryImageUploading(false);
                          }
                        }}
                      />
                      {categoryImageUploading ? (
                        'جاري الرفع...'
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          اختر صورة
                        </>
                      )}
                    </label>
                    {categoryForm.image && (
                      <button
                        type="button"
                        onClick={() => setCategoryForm({ ...categoryForm, image: '' })}
                        className="block text-[11px] font-bold text-red-600"
                      >
                        إزالة الصورة
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <Field label="المعرّف (key) — عربي أو إنجليزي">
                <input
                  className="input"
                  required
                  disabled={!!editingCategoryKey}
                  value={categoryForm.key}
                  onChange={(e) => setCategoryForm({ ...categoryForm, key: e.target.value })}
                  placeholder="مثال: خيام"
                />
              </Field>
              <Field label="الاسم للعرض">
                <input
                  className="input"
                  required
                  value={categoryForm.label}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, label: e.target.value })
                  }
                  placeholder="مثال: الخيام"
                />
              </Field>
              <Field label="رمز تعبيري (يستخدم إن لم توجد صورة)">
                <input
                  className="input"
                  value={categoryForm.emoji}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, emoji: e.target.value })
                  }
                  placeholder="⛺"
                />
              </Field>
              <Field label="وصف مختصر (اختياري)">
                <textarea
                  className="input"
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, description: e.target.value })
                  }
                />
              </Field>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="submit"
                disabled={savingCategory}
                className="btn btn-primary flex-1 justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {savingCategory ? 'جاري الحفظ...' : 'حفظ'}
              </button>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
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
          className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl px-4 py-2.5 text-sm font-bold text-white ${
            toast.kind === 'ok' ? 'bg-saqer-600' : 'bg-red-600'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </main>
  );
}

function Field({
  label,
  children,
  span,
}: {
  label: string;
  children: React.ReactNode;
  span?: boolean;
}) {
  return (
    <label className={span ? 'sm:col-span-2' : undefined}>
      <span className="text-xs font-bold">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
