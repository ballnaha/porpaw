"use client";

import { useSyncExternalStore } from "react";
import { PRODUCTS, type ShopProduct } from "./productCatalog";

export const SHOP_PRODUCTS_STORAGE_KEY = "baebite-admin-products";

type StoredShopData = {
  customProducts?: ShopProduct[];
  deletedSlugs?: string[];
};

export type ClientShopData = {
  products: ShopProduct[];
  deletedSlugs: string[];
};

const SHOP_PRODUCTS_CHANGED_EVENT = "baebite-shop-products-changed";
const DEFAULT_CLIENT_SHOP_DATA: ClientShopData = { products: PRODUCTS, deletedSlugs: [] };
let lastStoredValue: string | null = null;
let lastSnapshot: ClientShopData = DEFAULT_CLIENT_SHOP_DATA;

export function readClientShopData(): ClientShopData {
  if (typeof window === "undefined") return DEFAULT_CLIENT_SHOP_DATA;

  const stored = window.localStorage.getItem(SHOP_PRODUCTS_STORAGE_KEY);
  if (stored === lastStoredValue) return lastSnapshot;
  if (!stored) {
    lastStoredValue = stored;
    lastSnapshot = DEFAULT_CLIENT_SHOP_DATA;
    return lastSnapshot;
  }

  try {
    const parsed = JSON.parse(stored) as ShopProduct[] | StoredShopData;
    const savedProducts = Array.isArray(parsed) ? parsed : parsed.customProducts ?? [];
    const deletedSlugs = Array.isArray(parsed) ? [] : parsed.deletedSlugs ?? [];
    const products = [
      ...savedProducts.filter((product) => !deletedSlugs.includes(product.slug)),
      ...PRODUCTS.filter((product) => !deletedSlugs.includes(product.slug) && !savedProducts.some((saved) => saved.slug === product.slug)),
    ];

    lastStoredValue = stored;
    lastSnapshot = { products, deletedSlugs };
    return lastSnapshot;
  } catch {
    window.localStorage.removeItem(SHOP_PRODUCTS_STORAGE_KEY);
    lastStoredValue = null;
    lastSnapshot = DEFAULT_CLIENT_SHOP_DATA;
    return lastSnapshot;
  }
}

export function readClientShopProducts() {
  return readClientShopData().products;
}

export function readClientShopProductBySlug(slug: string) {
  return readClientShopProducts().find((product) => product.slug === slug);
}

export function saveClientShopData(products: ShopProduct[], deletedSlugs: string[]) {
  const nextValue = JSON.stringify({ customProducts: products, deletedSlugs });
  window.localStorage.setItem(SHOP_PRODUCTS_STORAGE_KEY, nextValue);
  lastStoredValue = nextValue;
  lastSnapshot = { products, deletedSlugs };
  window.dispatchEvent(new Event(SHOP_PRODUCTS_CHANGED_EVENT));
}

function subscribeToClientProducts(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(SHOP_PRODUCTS_CHANGED_EVENT, callback);
  queueMicrotask(callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SHOP_PRODUCTS_CHANGED_EVENT, callback);
  };
}

function subscribeToHydration(callback: () => void) {
  queueMicrotask(callback);

  return () => {};
}

export function useClientShopData() {
  return useSyncExternalStore(subscribeToClientProducts, readClientShopData, () => DEFAULT_CLIENT_SHOP_DATA);
}

export function useClientShopProducts() {
  return useClientShopData().products;
}

export function useClientShopHydrated() {
  return useSyncExternalStore(subscribeToHydration, () => true, () => false);
}
