import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/session";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

const PUBLIC_ADMIN_PATHS = ["/admin", "/api/admin/login"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex");

  if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
    return res;
  }

  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  if (!session.isLoggedIn) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401, headers: { "X-Robots-Tag": "noindex" } }
      );
    }
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return res;
}
