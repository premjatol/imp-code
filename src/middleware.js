import { NextResponse } from "next/server";

// Always accessible regardless of auth state
const ALWAYS_PUBLIC_PATHS = ["/activate", "/reset-password"];

// Accessible only when NOT logged in
const AUTH_ONLY_PATHS = ["/login", "/signup", "/forgot_password"];

export function middleware(request) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // Always let these through — no token check at all
  const isAlwaysPublic = ALWAYS_PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );
  if (isAlwaysPublic) {
    return NextResponse.next();
  }

  const isAuthOnlyPath = AUTH_ONLY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  // Not logged in → trying to access protected route → redirect to login
  if (!token && !isAuthOnlyPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Already logged in → trying to access login/signup pages → redirect to projects
  if (token && isAuthOnlyPath) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|locales|.*\\..*).*)"],
};
