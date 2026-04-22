import type { Product } from '../types';
import { products as localProducts } from '../data/products';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

export interface CategoryDTO {
  key: string;
  label: string;
  emoji?: string;
  description?: string;
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('al-saqer-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

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

export const fetchCategories = (): Promise<CategoryDTO[]> =>
  safeFetch<CategoryDTO[]>('/api/categories', []);

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

export async function loginAdmin(
  email: string,
  password: string,
): Promise<{ token: string; email: string }> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'فشل تسجيل الدخول');
  return data;
}

export async function verifyAdmin(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, { headers: authHeaders() });
    return res.ok;
  } catch {
    return false;
  }
}

async function adminRequest<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data as T;
}

export type ProductInput = Omit<Product, 'category'> & { category: string };

export const adminCreateProduct = (p: Partial<ProductInput>) =>
  adminRequest<{ id: string }>('POST', '/api/admin/products', p);

export const adminUpdateProduct = (id: string, p: Partial<ProductInput>) =>
  adminRequest<{ ok: true }>('PUT', `/api/admin/products/${id}`, p);

export const adminDeleteProduct = (id: string) =>
  adminRequest<{ ok: true }>('DELETE', `/api/admin/products/${id}`);

export const adminSaveCategory = (c: CategoryDTO) =>
  adminRequest<{ ok: true }>('POST', '/api/admin/categories', c);

export const adminDeleteCategory = (key: string) =>
  adminRequest<{ ok: true }>('DELETE', `/api/admin/categories/${encodeURIComponent(key)}`);

export async function adminUploadProductImage(file: File): Promise<{ url: string }> {
  const body = new FormData();
  body.append('image', file, file.name);
  const res = await fetch(`${API_URL}/api/admin/upload`, {
    method: 'POST',
    headers: authHeaders(),
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'فشل رفع الصورة');
  return data;
}
