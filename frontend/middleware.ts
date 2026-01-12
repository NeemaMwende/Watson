import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

console.log("🔥 MIDDLEWARE HIT:", new Date().toISOString());

const PUBLIC_PATHS = ["/login", "/signup", "/api/auth"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Read JWT session
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log("🔐 Token payload:", token);

  // If no session → redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated → allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
