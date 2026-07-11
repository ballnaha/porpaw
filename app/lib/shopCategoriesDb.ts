import { prisma } from "./prisma";
import { PRODUCTS } from "./productCatalog";

export type ShopCategoryRow = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  sortOrder: number;
  isActive: boolean | number;
};

export type ShopCategoryItem = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
};

function mapDbCategory(row: ShopCategoryRow): ShopCategoryItem {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    icon: row.icon ?? "",
    sortOrder: row.sortOrder,
    isActive: Boolean(row.isActive),
  };
}

/** Derive fallback categories from the hardcoded catalog */
function fallbackCategories(): ShopCategoryItem[] {
  const seen = new Set<string>();
  const items: ShopCategoryItem[] = [];
  let order = 0;

  for (const product of PRODUCTS) {
    if (!seen.has(product.category)) {
      seen.add(product.category);
      items.push({
        id: `local-${product.category}`,
        slug: product.category.toLowerCase().replace(/\s+/g, "-"),
        name: product.category,
        icon: "",
        sortOrder: ++order,
        isActive: true,
      });
    }
  }

  return items;
}

export async function getDbShopCategories(): Promise<ShopCategoryItem[]> {
  try {
    const rows = await prisma.$queryRaw<ShopCategoryRow[]>`
      SELECT id, slug, name, icon, sortOrder, isActive
      FROM ShopCategory
      WHERE isActive = true
      ORDER BY sortOrder ASC, name ASC
    `;
    return rows.map(mapDbCategory);
  } catch {
    return [];
  }
}

export async function getShopCategoriesForPage(): Promise<ShopCategoryItem[]> {
  const dbCategories = await getDbShopCategories();
  return dbCategories.length > 0 ? dbCategories : fallbackCategories();
}

export async function getAllDbShopCategories(): Promise<ShopCategoryItem[]> {
  try {
    const rows = await prisma.$queryRaw<ShopCategoryRow[]>`
      SELECT id, slug, name, icon, sortOrder, isActive
      FROM ShopCategory
      ORDER BY sortOrder ASC, name ASC
    `;
    return rows.map(mapDbCategory);
  } catch {
    return [];
  }
}
