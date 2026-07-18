import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

function constantTimeEqual(a: string, b: string): boolean {
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rate = checkRateLimit(`login:${ip}`);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${rate.retryAfterSeconds}s.` },
      { status: 429, headers: { "X-Robots-Tag": "noindex" } }
    );
  }

  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";

  if (!adminPassword || !constantTimeEqual(password, adminPassword)) {
    return NextResponse.json(
      { error: "Incorrect password." },
      { status: 401, headers: { "X-Robots-Tag": "noindex" } }
    );
  }

  const session = await getSession();
  session.isLoggedIn = true;
  await session.save();

  return NextResponse.json({ ok: true }, { headers: { "X-Robots-Tag": "noindex" } });
}
