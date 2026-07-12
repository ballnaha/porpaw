import { NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import { prisma } from "../../../../../lib/prisma";
import { mapDbShopProduct } from "../../../../../lib/shopProductsDb";
import type { ShopProduct } from "../../../../../lib/productCatalog";

type Params = { params: Promise<{ slug: string }> };
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

function productData(body: ProductPayload, categoryId: string | null, categoryTag: string) {
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
    isActive: true,
  };
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  try {
    const body = await request.json() as ProductPayload;
    const category = await getCategory(body.category);
    const row = await prisma.shopProduct.update({
      where: { slug: decodeURIComponent(slug) },
      data: productData(body, category?.id ?? null, category?.name ?? body.category),
    });

    return NextResponse.json({ product: mapDbShopProduct(row as unknown as ProductRow) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("Record to update not found")) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Slug is already used" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  try {
    await prisma.shopProduct.update({
      where: { slug: decodeURIComponent(slug) },
      data: { isActive: false },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("Record to update not found")) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}