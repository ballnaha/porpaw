"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "./ToastProvider";

export interface CartProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  weight: string;
}

export interface CartItem extends CartProduct {
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  recentlyAddedId: number | null;
  addItem: (product: CartProduct, quantity?: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "porpaw-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<number | null>(null);
  const addLockRef = useRef(new Map<number, number>());
  const feedbackTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) setItems(JSON.parse(stored) as CartItem[]);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setHydrated(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  useEffect(() => () => {
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
  }, []);

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    recentlyAddedId,
    addItem: (product, quantity = 1) => {
      const now = Date.now();
      const lastAddedAt = addLockRef.current.get(product.id) ?? 0;
      if (now - lastAddedAt < 900) return;
      addLockRef.current.set(product.id, now);

      const safeQuantity = Math.max(1, Math.floor(quantity));
      setItems((current) => {
        const existing = current.find((item) => item.id === product.id);
        return existing
          ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + safeQuantity } : item)
          : [...current, { ...product, quantity: safeQuantity }];
      });
      setRecentlyAddedId(product.id);
      if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = window.setTimeout(() => setRecentlyAddedId(null), 900);
      showToast({ message: `${product.name} จำนวน ${safeQuantity} ชิ้น ถูกเพิ่มลงในตะกร้า` });
    },
    updateQuantity: (id, quantity) => setItems((current) => quantity <= 0
      ? current.filter((item) => item.id !== id)
      : current.map((item) => item.id === id ? { ...item, quantity } : item)),
    removeItem: (id) => setItems((current) => current.filter((item) => item.id !== id)),
    clearCart: () => setItems([]),
  }), [items, recentlyAddedId, showToast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
