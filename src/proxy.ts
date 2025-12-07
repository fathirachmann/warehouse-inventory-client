import { NextRequest, NextResponse } from "next/server";
import { parseJwt } from "@/lib/jwt";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Redirect / to /dashboard if token exists
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 2. Protect /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Explicitly allow non-admin routes to bypass RBAC check
    if (
      pathname.startsWith("/dashboard/barang") ||
      pathname.startsWith("/dashboard/stok") ||
      pathname.startsWith("/dashboard/pembelian") ||
      pathname.startsWith("/dashboard/penjualan")
    ) {
      return NextResponse.next();
    }

    // 3. RBAC: Protect /dashboard/users (Admin only)
    if (pathname.startsWith("/dashboard/users")) {
      const payload = parseJwt(token);
      if (!payload || payload.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
