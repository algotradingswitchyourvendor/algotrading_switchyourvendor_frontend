import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authHint = request.cookies.get("mp_authenticated");

  if (authHint?.value !== "true") {
    return NextResponse.redirect(
      new URL("/auth/sign-in", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/scanner/:path*",
    "/scanner-ltd/:path*",
    "/history/:path*",
    "/settings/:path*",
    "/stock/:path*",
    "/help/:path*",
    "/whats-new/:path*",
  ],
};