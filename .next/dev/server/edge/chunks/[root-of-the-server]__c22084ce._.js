(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__c22084ce._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/src/i18n/routing.js [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "routing",
    ()=>routing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/routing/defineRouting.js [middleware-edge] (ecmascript) <export default as defineRouting>");
;
const routing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__["defineRouting"])({
    // A list of all locales that are supported
    locales: [
        'en',
        'bn'
    ],
    // Used when no locale matches
    defaultLocale: 'en'
});
}),
"[project]/src/utils/helpers/verifyJWT.js [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jwt$2d$decode$2f$build$2f$esm$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jwt-decode/build/esm/index.js [middleware-edge] (ecmascript)");
;
async function verifyToken(token) {
    if (!token) {
        return false;
    }
    try {
        const decoded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jwt$2d$decode$2f$build$2f$esm$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["jwtDecode"])(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp > currentTime) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}
}),
"[project]/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */ __turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$middleware$2f$middleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/middleware/middleware.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$routing$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/i18n/routing.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$helpers$2f$verifyJWT$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/helpers/verifyJWT.js [middleware-edge] (ecmascript)");
;
;
;
;
const intlMiddleware = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$middleware$2f$middleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$routing$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["routing"]);
// Routes that require authentication
const PROTECTED_ROUTES = [
    "/todos",
    "/profile",
    "/settings",
    "/dashboard"
];
// Routes that should redirect to dashboard if already authenticated
const AUTH_ONLY_ROUTES = [
    "/login",
    "/signup"
];
async function middleware(request) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    // Check if pathname is missing locale
    const pathnameIsMissingLocale = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$routing$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["routing"].locales.every((locale)=>!pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`);
    // Get clean pathname without locale prefix
    const cleanPathname = pathnameIsMissingLocale ? pathname : pathname.replace(/^\/[^\/]+/, "");
    // Get current locale
    const locale = pathnameIsMissingLocale ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$routing$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["routing"].defaultLocale : pathname.split("/")[1];
    let isAuthenticated = false;
    let response = null;
    // Verify access token
    if (accessToken) {
        isAuthenticated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$helpers$2f$verifyJWT$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["verifyToken"])(accessToken);
    }
    // If access token invalid, try refresh token
    if (!isAuthenticated && refreshToken) {
        const refreshResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$helpers$2f$verifyJWT$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["verifyToken"])(refreshToken);
        if (refreshResult) {
            isAuthenticated = true;
        } else {
            // Both tokens invalid, clear cookies
            response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
            response.cookies.delete("accessToken");
            response.cookies.delete("refreshToken");
        }
    }
    // Protect routes that require authentication
    if (PROTECTED_ROUTES.some((route)=>cleanPathname.startsWith(route)) && !isAuthenticated) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = `/${locale}/login`;
        loginUrl.searchParams.set("callbackUrl", pathname);
        const redirectResponse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
        // Clear invalid cookies
        redirectResponse.cookies.delete("accessToken");
        redirectResponse.cookies.delete("refreshToken");
        return redirectResponse;
    }
    // Redirect authenticated users away from auth pages to dashboard
    if (isAuthenticated && AUTH_ONLY_ROUTES.some((route)=>cleanPathname.startsWith(route))) {
        const dashboardUrl = request.nextUrl.clone();
        dashboardUrl.pathname = `/${locale}/todos`;
        dashboardUrl.searchParams.delete("callbackUrl");
        return response ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(dashboardUrl, {
            headers: response.headers
        }) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(dashboardUrl);
    }
    // Continue with i18n middleware or return modified response
    return response || intlMiddleware(request);
}
const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api|trpc).*)"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__c22084ce._.js.map