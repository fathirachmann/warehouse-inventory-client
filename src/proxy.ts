import { NextRequest, NextResponse } from "next/server";

// Skeleton proxy function that redirects to /home - customize later
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL("/home", request.url));
}

export const config = {
  matcher: "/about/:path*",
};
