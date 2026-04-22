import type { Product } from '../types';
import { products as localProducts } from '../data/products';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    console.warn('[api] fallback due to error:', err);
    return fallback;
  }
}

export const fetchProducts = (): Promise<Product[]> =>
  safeFetch<Product[]>('/api/products', localProducts);

export const fetchProductBySlug = async (
  slug: string,
): Promise<Product | undefined> => {
  try {
    const res = await fetch(`${API_URL}/api/products/${slug}`);
    if (!res.ok) return undefined;
    return (await res.json()) as Product;
  } catch {
    return localProducts.find((p) => p.slug === slug);
  }
};

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
  items: { productId: string; quantity: number }[];
  subtotal: number;
  shipping: number;
  total: number;
}

export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<{ id: number } | null> => {
  try {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return (await res.json()) as { id: number };
  } catch {
    return null;
  }
};
