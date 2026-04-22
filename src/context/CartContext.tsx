import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem } from '../types';
import { useStore } from './StoreContext';

interface CartCtx {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartCtx | undefined>(undefined);

const STORAGE_KEY = 'saqer-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const { getProduct } = useStore();
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (productId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    );
  };

  const clearCart = () => setItems([]);

  const { totalCount, subtotal } = useMemo(() => {
    let count = 0;
    let sum = 0;
    for (const item of items) {
      count += item.quantity;
      const p = getProduct(item.productId);
      if (p) sum += p.price * item.quantity;
    }
    return { totalCount: count, subtotal: sum };
  }, [items, getProduct]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
