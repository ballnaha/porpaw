import { NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import { prisma } from "../../../../../lib/prisma";

type Params = { params: Promise<{ id: string }> };

/** PATCH /api/admin/shop/categories/[id] — update a category */
export async function PATCH(request: Request, { params }: Params) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json() as {
      name?: string;
      slug?: string;
      icon?: string;
      sortOrder?: number;
      isActive?: boolean;
    };

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name.trim();
    if (body.slug !== undefined) data.slug = body.slug.trim();
    if (body.icon !== undefined) data.icon = body.icon;
    if (body.sortOrder !== undefined) data.sortOrder = body.sortOrder;
    if (body.isActive !== undefined) data.isActive = body.isActive;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const category = await prisma.shopCategory.update({
      where: { id },
      data,
    });

    return NextResponse.json({ category });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    if (msg.includes("Record to update not found")) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "ชื่อหรือ slug ซ้ำกับที่มีอยู่แล้ว" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/** DELETE /api/admin/shop/categories/[id] — delete a category (guard if products use it) */
export async function DELETE(_request: Request, { params }: Params) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Check if any active products are linked to this category
    const usageCount = await prisma.shopProduct.count({
      where: { categoryId: id, isActive: true },
    });

    if (usageCount > 0) {
      return NextResponse.json(
        { error: `ไม่สามารถลบได้ มีสินค้า ${usageCount} รายการใช้ category นี้อยู่` },
        { status: 409 },
      );
    }

    await prisma.shopCategory.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    if (msg.includes("Record to delete does not exist")) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
