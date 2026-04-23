import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/signup"];

/**
 * Protect all routes that require authentication.
 * Full HMAC verification happens in server actions / server components;
 * this middleware handles the UX redirect only.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public auth pages through
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // If no session cookie, redirect to login
  const session = request.cookies.get("jtf_session");
  if (!session?.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon\\.ico).*)",
  ],
};
