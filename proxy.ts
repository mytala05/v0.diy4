import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { guestRegex, isDevelopmentEnvironment } from "./lib/constants";

function isPublicPath(pathname: string) {
  return pathname === "/" || ["/login", "/register"].includes(pathname);
}

function isProtectedPage(pathname: string) {
  return ["/chats", "/projects"].some((path) => pathname.startsWith(path));
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function denyAdminAccess(request: NextRequest, hasToken: boolean) {
  if (!hasToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/ping")) {
    return new Response("pong", { status: 200 });
  }

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const authSecret = process.env.AUTH_SECRET || process.env.AUTH_SECRET_2;
  if (!authSecret) {
    console.error("Missing AUTH_SECRET environment variable.");
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: authSecret,
    secureCookie: !isDevelopmentEnvironment,
  });

  if (pathname.startsWith("/admincp")) {
    const isAdmin =
      token?.email && getAdminEmails().includes(token.email.toLowerCase());
    if (!isAdmin) {
      return denyAdminAccess(request, Boolean(token));
    }
  }

  if (token && !guestRegex.test(token.email ?? "") && isPublicPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token || pathname.startsWith("/api/") || isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (isProtectedPage(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/",
    "/chats/:path*",
    "/projects/:path*",
    "/api/:path*",
    "/login",
    "/register",

    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
