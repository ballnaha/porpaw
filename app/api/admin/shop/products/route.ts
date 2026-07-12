import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "../../../../lib/prisma";
import { mapDbShopProduct } from "../../../../lib/shopProductsDb";
import type { ShopProduct } from "../../../../lib/productCatalog";

type ProductPayload = Omit<ShopProduct, "id"> & { id?: number };

type ProductRow = Parameters<typeof mapDbShopProduct>[0];

function toWeightKg(weight: string) {
  const value = Number(weight);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

async function getCategory(categoryName: string) {
  return await prisma.shopCategory.findFirst({
    where: { OR: [{ name: categoryName }, { slug: categoryName }] },
    select: { id: true, name: true },
  });
}

function productData(body: ProductPayload, categoryId: string | null, categoryTag: string, sortOrder?: number) {
  return {
    slug: body.slug.trim(),
    name: body.name.trim(),
    categoryId,
    categoryTag,
    detail: body.detail.trim(),
    description: body.description.trim(),
    weightKg: toWeightKg(body.weight),
    weightLabel: body.weight,
    price: Math.round(Number(body.price) || 0),
    oldPrice: body.oldPrice ? Math.round(Number(body.oldPrice)) : null,
    image: body.image,
    galleryImages: body.galleryImages ?? [],
    color: body.color,
    badge: body.badge || null,
    rating: Number(body.rating) || 4.8,
    benefits: body.benefits,
    ingredients: body.ingredients.trim(),
    ...(sortOrder !== undefined ? { sortOrder } : {}),
    isActive: true,
  };
}

async function nextSortOrder() {
  const row = await prisma.shopProduct.findFirst({ orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
  return (row?.sortOrder ?? 0) + 1;
}

export async function GET() {
  try {
    const rows = await prisma.shopProduct.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ products: rows.map((row) => mapDbShopProduct(row as unknown as ProductRow)) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message, products: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json() as ProductPayload;
    const category = await getCategory(body.category);
    const row = await prisma.shopProduct.create({
      data: productData(body, category?.id ?? null, category?.name ?? body.category, await nextSortOrder()),
    });

    return NextResponse.json({ product: mapDbShopProduct(row as unknown as ProductRow) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Slug is already used" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}