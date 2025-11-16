/* eslint-disable @typescript-eslint/no-explicit-any */
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { verifyToken } from "./utils/helpers/verifyJWT";

const intlMiddleware = createIntlMiddleware(routing);

// Routes that require authentication
const PROTECTED_ROUTES = ["/todos", "/profile", "/settings", "/dashboard"];

// Routes that should redirect to dashboard if already authenticated
const AUTH_ONLY_ROUTES = ["/login", "/signup"];

export async function middleware(request: any) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // Check if pathname is missing locale
    const pathnameIsMissingLocale = routing.locales.every(
        (locale) =>
            !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Get clean pathname without locale prefix
    const cleanPathname = pathnameIsMissingLocale
        ? pathname
        : pathname.replace(/^\/[^\/]+/, "");

    // Get current locale
    const locale = pathnameIsMissingLocale
        ? routing.defaultLocale
        : pathname.split("/")[1];

    let isAuthenticated = false;
    let response: NextResponse | null = null;

    // Verify access token
    if (accessToken) {
        isAuthenticated = await verifyToken(accessToken);
    }

    // If access token invalid, try refresh token
    if (!isAuthenticated && refreshToken) {
        const refreshResult = await verifyToken(refreshToken);
        if (refreshResult) {
            isAuthenticated = true;
        } else {
            // Both tokens invalid, clear cookies
            response = NextResponse.next();
            response.cookies.delete("accessToken");
            response.cookies.delete("refreshToken");
        }
    }

    // Protect routes that require authentication
    if (
        PROTECTED_ROUTES.some((route) => cleanPathname.startsWith(route)) &&
        !isAuthenticated
    ) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = `/${locale}/login`;
        loginUrl.searchParams.set("callbackUrl", pathname);

        const redirectResponse = NextResponse.redirect(loginUrl);
        // Clear invalid cookies
        redirectResponse.cookies.delete("accessToken");
        redirectResponse.cookies.delete("refreshToken");
        return redirectResponse;
    }

    // Redirect authenticated users away from auth pages to dashboard
    if (
        isAuthenticated &&
        AUTH_ONLY_ROUTES.some((route) => cleanPathname.startsWith(route))
    ) {
        const dashboardUrl = request.nextUrl.clone();
        dashboardUrl.pathname = `/${locale}/todos`;
        dashboardUrl.searchParams.delete("callbackUrl");

        return response
            ? NextResponse.redirect(dashboardUrl, { headers: response.headers })
            : NextResponse.redirect(dashboardUrl);
    }

    // Continue with i18n middleware or return modified response
    return response || intlMiddleware(request);
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|api|trpc).*)"],
};
