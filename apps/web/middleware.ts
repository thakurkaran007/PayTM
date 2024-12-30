import NextAuth from "next-auth";
import authConfig from "./auth.config";
import type { NextRequest } from "next/server";
import { apiAuthRoute, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "./route";

const { auth } = NextAuth(authConfig);

export default auth((req: NextRequest) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl }  = req;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthRoute);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) return;

    if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/auth/login", nextUrl));
    }
    return;
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}