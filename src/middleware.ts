import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN } from "./constants/localStorage";
import { PUBLIC_ROUTES } from "./constants/routes";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN);
  const pathname = request.nextUrl.pathname;

  if (PUBLIC_ROUTES.includes(pathname)) {
    if (accessToken) {
      return NextResponse.redirect(new URL("/", request.nextUrl.clone()));
    } else {
      return NextResponse.next();
    }
  } else {
    if (accessToken) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", request.nextUrl.clone()));
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|favicon.ico).*)",
  ],
};
