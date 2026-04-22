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
import {
  categories as localCategories,
  products as localProducts,
} from '../data/products';

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
  const [products, setProducts] = useState<Product[]>(localProducts);
  const [categories, setCategories] = useState<CategoryDTO[]>(fallbackCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prods, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
      if (prods.length > 0) setProducts(prods);
      if (cats.length > 0) setCategories(cats);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, []);

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
