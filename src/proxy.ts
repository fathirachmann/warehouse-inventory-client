import { NextRequest, NextResponse } from "next/server";

// Skeleton proxy function that redirects to /home - customize later
export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Jika user mengakses halaman dashboard tapi tidak punya token, redirect ke login
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Jika user mengakses halaman login tapi sudah punya token, redirect ke dashboard
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
