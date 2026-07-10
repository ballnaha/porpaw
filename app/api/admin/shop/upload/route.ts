import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const files = formData.getAll("images").filter((item): item is File => item instanceof File);

  if (!files.length) {
    return NextResponse.json({ error: "No images provided" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "shop");
  await mkdir(uploadDir, { recursive: true });

  const images: string[] = [];

  for (const file of files) {
    const extension = ALLOWED_TYPES.get(file.type);
    if (!extension) {
      return NextResponse.json({ error: "Only jpg, png, webp, and gif images are allowed" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Image file is too large" }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const fileName = `${randomUUID()}.${extension}`;
    await writeFile(path.join(uploadDir, fileName), bytes);
    images.push(`/uploads/shop/${fileName}`);
  }

  return NextResponse.json({ images });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { images } = await request.json() as { images?: string[] };
  const uploadDir = path.join(process.cwd(), "public", "uploads", "shop");
  const deleted: string[] = [];

  for (const image of images ?? []) {
    if (!image.startsWith("/uploads/shop/")) continue;

    const fileName = path.basename(image);
    if (!fileName || fileName !== image.replace("/uploads/shop/", "")) continue;

    try {
      await unlink(path.join(uploadDir, fileName));
      deleted.push(image);
    } catch {
      // File may already be gone; keep delete product flow idempotent.
    }
  }

  return NextResponse.json({ deleted });
}
