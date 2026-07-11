import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { getAllDbShopCategories, getDbShopCategories } from "../../../../lib/shopCategoriesDb";
import { prisma } from "../../../../lib/prisma";

/** GET /api/admin/shop/categories — public, used by shop frontend & admin */
export async function GET() {
  try {
    const categories = await getDbShopCategories();
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ categories: [] });
  }
}

/** POST /api/admin/shop/categories — admin only */
export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json() as { name?: string; slug?: string; icon?: string; sortOrder?: number };
    const name = (body.name ?? "").trim();
    const slug = (body.slug ?? "").trim();

    if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });
    if (!slug) return NextResponse.json({ error: "slug is required" }, { status: 400 });

    // Determine max sortOrder if not provided
    let sortOrder = body.sortOrder;
    if (sortOrder === undefined || sortOrder === null) {
      const existing = await getAllDbShopCategories();
      sortOrder = existing.length > 0 ? Math.max(...existing.map((c) => c.sortOrder)) + 1 : 1;
    }

    const category = await prisma.shopCategory.create({
      data: {
        name,
        slug,
        icon: body.icon ?? null,
        sortOrder,
        isActive: true,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "ชื่อหรือ slug ซ้ำกับที่มีอยู่แล้ว" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
