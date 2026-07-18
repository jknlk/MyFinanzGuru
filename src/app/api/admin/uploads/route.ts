import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GitHubConfigError, putBinaryFile } from "@/lib/github";

// content/uploads is the source-of-truth in the repo (per the Git-as-CMS
// design), but Next.js can only serve static assets from /public at
// request time — so every upload is committed to both locations.
const CONTENT_UPLOADS_DIR = "content/uploads";
const PUBLIC_UPLOADS_DIR = "public/uploads";

const MAX_BYTES = 4 * 1024 * 1024; // 4MB — practical GitHub Contents API limit
const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

const bodySchema = z.object({
  filename: z.string().min(1),
  base64: z.string().min(1),
  contentType: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = bodySchema.parse(await req.json());

    const ext = ALLOWED_TYPES[body.contentType];
    if (!ext) {
      return NextResponse.json(
        { error: "Unsupported file type. Allowed: PNG, JPG, WEBP, PDF." },
        { status: 400 }
      );
    }

    const approxBytes = (body.base64.length * 3) / 4;
    if (approxBytes > MAX_BYTES) {
      return NextResponse.json(
        { error: "File is larger than 4 MB, the GitHub Contents API limit." },
        { status: 400 }
      );
    }

    const safeName = body.filename
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "-")
      .replace(/-+/g, "-");
    const filename = `${Date.now()}-${safeName}`;

    await putBinaryFile(
      `${CONTENT_UPLOADS_DIR}/${filename}`,
      body.base64,
      `content: upload ${filename}`
    );
    await putBinaryFile(
      `${PUBLIC_UPLOADS_DIR}/${filename}`,
      body.base64,
      `content: upload ${filename} (public)`
    );

    return NextResponse.json({ ok: true, url: `/uploads/${filename}` });
  } catch (err) {
    if (err instanceof GitHubConfigError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
