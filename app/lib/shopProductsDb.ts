import { prisma } from "./prisma";
import { getProductBySlug, PRODUCTS, type ProductCategory, type ShopProduct } from "./productCatalog";

type DbShopProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  detail: string;
  description: string;
  weightKg: unknown;
  weightLabel: string;
  price: number;
  oldPrice: number | null;
  image: string;
  galleryImages: unknown;
  color: string;
  badge: string | null;
  rating: unknown;
  benefits: unknown;
  ingredients: string;
  sortOrder: number;
  isActive: boolean | number;
};

function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value !== "string") return [];

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function toNumber(value: unknown, fallback: number) {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  if (value && typeof value === "object" && "toString" in value) {
    const parsed = Number(value.toString());
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function dbProductId(id: string) {
  return Array.from(`db-shop-product:${id}`).reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 3000);
}

export function mapDbShopProduct(row: DbShopProductRow): ShopProduct {
  return {
    id: dbProductId(row.id),
    slug: row.slug,
    name: row.name,
    category: row.category as ProductCategory,
    detail: row.detail,
    description: row.description,
    weight: row.weightLabel || `${toNumber(row.weightKg, 0).toLocaleString()} kg`,
    price: row.price,
    oldPrice: row.oldPrice ?? undefined,
    image: row.image,
    galleryImages: parseJsonArray(row.galleryImages),
    color: row.color,
    badge: row.badge ?? undefined,
    rating: toNumber(row.rating, 4.8),
    benefits: parseJsonArray(row.benefits),
    ingredients: row.ingredients,
  };
}

export async function getDbShopProducts() {
  try {
    const rows = await prisma.$queryRaw<DbShopProductRow[]>`
      SELECT id, slug, name, category, detail, description, weightKg, weightLabel, price, oldPrice, image, galleryImages, color, badge, rating, benefits, ingredients, sortOrder, isActive
      FROM ShopProduct
      WHERE isActive = true
      ORDER BY sortOrder ASC, createdAt DESC
    `;

    return rows.map(mapDbShopProduct);
  } catch {
    return [];
  }
}

export async function getDbShopProductBySlug(slug: string) {
  try {
    const rows = await prisma.$queryRaw<DbShopProductRow[]>`
      SELECT id, slug, name, category, detail, description, weightKg, weightLabel, price, oldPrice, image, galleryImages, color, badge, rating, benefits, ingredients, sortOrder, isActive
      FROM ShopProduct
      WHERE slug = ${slug} AND isActive = true
      LIMIT 1
    `;

    return rows[0] ? mapDbShopProduct(rows[0]) : null;
  } catch {
    return null;
  }
}

export async function getShopProductsForPage() {
  const dbProducts = await getDbShopProducts();
  const dbSlugs = new Set(dbProducts.map((product) => product.slug));

  return [...dbProducts, ...PRODUCTS.filter((product) => !dbSlugs.has(product.slug))];
}

export async function getShopProductBySlugForPage(slug: string) {
  return await getDbShopProductBySlug(slug) ?? getProductBySlug(slug) ?? null;
}
