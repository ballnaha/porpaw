"use client";

import { useEffect, useState } from "react";
import type { ShopCategoryItem } from "./shopCategoriesDb";

export type { ShopCategoryItem };

const DEFAULT_CATEGORIES: ShopCategoryItem[] = [
  { id: "local-food-dog", slug: "food-dog", name: "อาหารสุนัข", icon: "🐕", sortOrder: 1, isActive: true },
  { id: "local-food-cat", slug: "food-cat", name: "อาหารแมว", icon: "🐈", sortOrder: 2, isActive: true },
  { id: "local-snack", slug: "snack", name: "ขนม", icon: "🦴", sortOrder: 3, isActive: true },
  { id: "local-supplement", slug: "supplement", name: "อาหารเสริม", icon: "💊", sortOrder: 4, isActive: true },
  { id: "local-toy", slug: "toy", name: "ของเล่น", icon: "🎾", sortOrder: 5, isActive: true },
  { id: "local-grooming", slug: "grooming", name: "อุปกรณ์ดูแล", icon: "✂️", sortOrder: 6, isActive: true },
  { id: "local-bed-home", slug: "bed-home", name: "ที่นอน & บ้าน", icon: "🏠", sortOrder: 7, isActive: true },
];

type FetchState = {
  categories: ShopCategoryItem[];
  loading: boolean;
  error: string | null;
};

const cache: { data: ShopCategoryItem[] | null; fetching: boolean; listeners: Set<() => void> } = {
  data: null,
  fetching: false,
  listeners: new Set(),
};

function notifyListeners() {
  cache.listeners.forEach((fn) => fn());
}

export async function fetchCategories(): Promise<ShopCategoryItem[]> {
  if (cache.data !== null) return cache.data;
  if (cache.fetching) {
    return new Promise((resolve) => {
      const off = () => { cache.listeners.delete(off); resolve(cache.data ?? DEFAULT_CATEGORIES); };
      cache.listeners.add(off);
    });
  }

  cache.fetching = true;
  try {
    const res = await fetch("/api/admin/shop/categories");
    const json = await res.json() as { categories?: ShopCategoryItem[] };
    cache.data = json.categories && json.categories.length > 0 ? json.categories : DEFAULT_CATEGORIES;
  } catch {
    cache.data = DEFAULT_CATEGORIES;
  } finally {
    cache.fetching = false;
    notifyListeners();
  }

  return cache.data ?? DEFAULT_CATEGORIES;
}

export function invalidateCategoriesCache() {
  cache.data = null;
  cache.fetching = false;
  notifyListeners();
}

/** React hook — ดึง categories จาก API พร้อม loading state */
export function useShopCategories(): FetchState {
  const [state, setState] = useState<FetchState>({
    categories: cache.data ?? DEFAULT_CATEGORIES,
    loading: cache.data === null,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    const refresh = () => {
      if (!mounted) return;
      setState({ categories: cache.data ?? DEFAULT_CATEGORIES, loading: false, error: null });
    };

    cache.listeners.add(refresh);

    if (cache.data === null) {
      fetchCategories().then((cats) => {
        if (mounted) setState({ categories: cats, loading: false, error: null });
      }).catch(() => {
        if (mounted) setState({ categories: DEFAULT_CATEGORIES, loading: false, error: "โหลด categories ไม่สำเร็จ" });
      });
    }

    return () => {
      mounted = false;
      cache.listeners.delete(refresh);
    };
  }, []);

  return state;
}
