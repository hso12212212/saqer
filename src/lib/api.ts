import type { Product } from '../types';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

export interface CategoryDTO {
  key: string;
  label: string;
  emoji?: string;
  description?: string;
  image?: string | null;
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('al-saqer-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const noStore: RequestInit = { cache: 'no-store' };

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, noStore);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

export const fetchProducts = (): Promise<Product[]> =>
  apiGet<Product[]>('/api/products');

export const fetchProductBySlug = async (
  slug: string,
): Promise<Product | undefined> => {
  try {
    const res = await fetch(`${API_URL}/api/products/${slug}`, noStore);
    if (res.status === 404) return undefined;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as Product;
  } catch {
    return undefined;
  }
};

export const fetchCategories = (): Promise<CategoryDTO[]> =>
  apiGet<CategoryDTO[]>('/api/categories');

export const fetchCategory = async (
  key: string,
): Promise<CategoryDTO | undefined> => {
  try {
    const res = await fetch(
      `${API_URL}/api/categories/${encodeURIComponent(key)}`,
      noStore,
    );
    if (res.status === 404) return undefined;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as CategoryDTO;
  } catch {
    return undefined;
  }
};

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  governorate?: string;
  notes?: string;
  items: { productId: string; quantity: number; price?: number; name?: string }[];
  subtotal: number;
  shipping: number;
  total: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderDTO {
  id: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  governorate?: string | null;
  notes?: string | null;
  items: { productId: string; quantity: number; price?: number; name?: string }[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<OrderDTO> => {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'فشل إنشاء الطلب');
  return {
    id: data.id,
    status: data.status ?? 'pending',
    createdAt: data.createdAt,
    customerName: payload.customerName,
    customerPhone: payload.customerPhone,
    customerAddress: payload.customerAddress,
    governorate: payload.governorate ?? null,
    notes: payload.notes ?? null,
    items: payload.items,
    subtotal: payload.subtotal,
    shipping: payload.shipping,
    total: payload.total,
  };
};

export const trackOrder = async (
  id: number | string,
  phone: string,
): Promise<OrderDTO> => {
  const res = await fetch(
    `${API_URL}/api/orders/${encodeURIComponent(String(id))}?phone=${encodeURIComponent(phone)}`,
    noStore,
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'تعذّر جلب الطلب');
  return data as OrderDTO;
};

export const adminListOrders = () =>
  adminRequest<OrderDTO[]>('GET', '/api/admin/orders');

export const adminGetOrder = (id: number) =>
  adminRequest<OrderDTO>('GET', `/api/admin/orders/${id}`);

export const adminUpdateOrderStatus = (id: number, status: OrderStatus) =>
  adminRequest<{ ok: true }>('PATCH', `/api/admin/orders/${id}`, { status });

export const adminDeleteOrder = (id: number) =>
  adminRequest<{ ok: true }>('DELETE', `/api/admin/orders/${id}`);

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
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: authHeaders(),
      ...noStore,
    });
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
    ...noStore,
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
    ...noStore,
    headers: authHeaders(),
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'فشل رفع الصورة');
  return data;
}
