import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/login", "/signup", "/api/auth", "/api/auth/callback"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Prepare redirect
  const response = NextResponse.redirect(new URL("/login", req.url));

  // Always kill the session cookie
  response.cookies.set({
    name: "__Secure-next-auth.session-token",
    value: "",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set({
    name: "next-auth.session-token",
    value: "",
    path: "/",
    maxAge: 0,
  });

  if (!token) return response;

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
