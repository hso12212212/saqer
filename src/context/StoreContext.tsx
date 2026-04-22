import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Product } from '../types';
import { fetchCategories, fetchProducts, type CategoryDTO } from '../lib/api';
import { categories as localCategories } from '../data/products';

interface StoreCtx {
  products: Product[];
  categories: CategoryDTO[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
}

const StoreContext = createContext<StoreCtx | undefined>(undefined);

const fallbackCategories: CategoryDTO[] = localCategories.map((c) => ({
  key: c.key,
  label: c.label,
  emoji: c.emoji,
  description: c.desc,
}));

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>(fallbackCategories);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [prodsRes, catsRes] = await Promise.allSettled([
      fetchProducts(),
      fetchCategories(),
    ]);

    if (prodsRes.status === 'fulfilled') {
      setProducts(prodsRes.value);
    } else if (!hasLoadedOnce) {
      setProducts([]);
    }

    if (catsRes.status === 'fulfilled') {
      setCategories(catsRes.value);
    }

    if (prodsRes.status === 'rejected' || catsRes.status === 'rejected') {
      const err =
        prodsRes.status === 'rejected'
          ? prodsRes.reason
          : (catsRes as PromiseRejectedResult).reason;
      setError(err instanceof Error ? err.message : 'فشل تحميل البيانات');
    }

    setHasLoadedOnce(true);
    setLoading(false);
  }, [hasLoadedOnce]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const productsById = useMemo(() => {
    const m = new Map<string, Product>();
    for (const p of products) m.set(p.id, p);
    return m;
  }, [products]);

  const productsBySlug = useMemo(() => {
    const m = new Map<string, Product>();
    for (const p of products) m.set(p.slug, p);
    return m;
  }, [products]);

  const value = useMemo<StoreCtx>(
    () => ({
      products,
      categories,
      loading,
      error,
      refresh,
      getProduct: (id) => productsById.get(id),
      getProductBySlug: (slug) => productsBySlug.get(slug),
    }),
    [products, categories, loading, error, refresh, productsById, productsBySlug],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
