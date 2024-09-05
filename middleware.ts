import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";

export async function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get("authjs.session-token");
  const ApiRoute = req.nextUrl.pathname.startsWith(apiAuthPrefix);
  const PublicRoute = publicRoutes.includes(req.nextUrl.pathname);
  const AuthRoute = authRoutes.includes(req.nextUrl.pathname);

  if (ApiRoute) {
    return NextResponse.next();
  }
  if (AuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    }
    return NextResponse.next();
  }
  if (!isLoggedIn && !PublicRoute) {
    return Response.redirect(new URL("/Login", req.url));
  }
  NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
