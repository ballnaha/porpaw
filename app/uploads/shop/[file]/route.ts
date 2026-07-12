import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const CONTENT_TYPES: Record<string, string> = {
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const transparentPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
  "base64",
);

function imageResponse(body: Buffer, contentType: string, status = 200) {
  return new NextResponse(Uint8Array.from(body).buffer, {
    status,
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": contentType,
    },
  });
}

export async function GET(_request: Request, context: { params: Promise<{ file: string }> }) {
  const { file } = await context.params;
  const fileName = path.basename(file);

  if (fileName !== file) {
    return imageResponse(transparentPng, "image/png", 400);
  }

  const extension = path.extname(fileName).toLowerCase();
  const contentType = CONTENT_TYPES[extension];

  if (!contentType) {
    return imageResponse(transparentPng, "image/png", 400);
  }

  try {
    const uploadPath = path.join(process.cwd(), "public", "uploads", "shop", fileName);
    return imageResponse(await readFile(uploadPath), contentType);
  } catch {
    return imageResponse(transparentPng, "image/png");
  }
}
