(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/config/endpoints.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// API Base URL - uses environment variable or defaults to production
__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "authEndpoints",
    ()=>authEndpoints,
    "todoEndpoints",
    ()=>todoEndpoints,
    "userEndpoints",
    ()=>userEndpoints
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_BASE_URL || 'https://todo-app.pioneeralpha.com';
const authEndpoints = {
    login: `${API_BASE_URL}/api/auth/login/`,
    signup: `${API_BASE_URL}/api/users/signup/`,
    refreshToken: `${API_BASE_URL}/api/auth/refresh/`,
    changePassword: `${API_BASE_URL}/api/users/change-password/`
};
const userEndpoints = {
    profile: `${API_BASE_URL}/api/users/me/`,
    updateProfile: `${API_BASE_URL}/api/users/me/`
};
const todoEndpoints = {
    todos: `${API_BASE_URL}/api/todos/`,
    todoById: (id)=>`${API_BASE_URL}/api/todos/${id}/`,
    createTodo: `${API_BASE_URL}/api/todos/`,
    updateTodo: (id)=>`${API_BASE_URL}/api/todos/${id}/`,
    deleteTodo: (id)=>`${API_BASE_URL}/api/todos/${id}/`
};
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/api/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */ __turbopack_context__.s([
    "apiClient",
    ()=>apiClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$endpoints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/endpoints.ts [app-client] (ecmascript)");
;
class ApiClient {
    baseURL;
    constructor(baseURL){
        this.baseURL = baseURL;
    }
    getAuthToken() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return localStorage.getItem('access_token');
    }
    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) return false;
            const response = await fetch(`${this.baseURL}/api/auth/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh: refreshToken
                })
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.access);
                // Update cookie as well
                document.cookie = `accessToken=${data.access}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }
    async request(endpoint, options = {}) {
        const { requiresAuth = false, ...fetchOptions } = options;
        const headers = {
            ...fetchOptions.headers || {}
        };
        // Add auth token if required
        if (requiresAuth) {
            const token = this.getAuthToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        try {
            let response = await fetch(endpoint, {
                ...fetchOptions,
                headers
            });
            // If unauthorized and auth is required, try to refresh token
            if (response.status === 401 && requiresAuth) {
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    const token = this.getAuthToken();
                    if (token) {
                        headers['Authorization'] = `Bearer ${token}`;
                    }
                    response = await fetch(endpoint, {
                        ...fetchOptions,
                        headers
                    });
                }
            }
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }
            // Handle 204 No Content
            if (response.status === 204) {
                return {};
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    async get(endpoint, requiresAuth = false) {
        return this.request(endpoint, {
            method: 'GET',
            requiresAuth
        });
    }
    async post(endpoint, data, requiresAuth = false) {
        const headers = {};
        let body;
        if (data instanceof FormData) {
            body = data;
        } else {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(data);
        }
        return this.request(endpoint, {
            method: 'POST',
            body,
            headers,
            requiresAuth
        });
    }
    async patch(endpoint, data, requiresAuth = false) {
        const headers = {};
        let body;
        if (data instanceof FormData) {
            body = data;
        } else {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(data);
        }
        return this.request(endpoint, {
            method: 'PATCH',
            body,
            headers,
            requiresAuth
        });
    }
    async delete(endpoint, requiresAuth = false) {
        return this.request(endpoint, {
            method: 'DELETE',
            requiresAuth
        });
    }
}
const apiClient = new ApiClient(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$endpoints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useAuth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/api/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$endpoints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/endpoints.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const useAuth = ()=>{
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAuth.useEffect": ()=>{
            // Check if user is logged in and fetch profile
            const loadUser = {
                "useAuth.useEffect.loadUser": async ()=>{
                    const token = localStorage.getItem("access_token");
                    if (token) {
                        try {
                            const userData = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$endpoints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userEndpoints"].profile, true);
                            setUser(userData);
                            // Ensure cookies are set (in case page was refreshed)
                            const refreshToken = localStorage.getItem("refresh_token");
                            if (refreshToken) {
                                document.cookie = `accessToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
                                document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
                            }
                        } catch (error) {
                            console.error("Failed to load user:", error);
                            // Clear invalid tokens
                            localStorage.removeItem("access_token");
                            localStorage.removeItem("refresh_token");
                            document.cookie = "accessToken=; path=/; max-age=0";
                            document.cookie = "refreshToken=; path=/; max-age=0";
                        }
                    }
                    setLoading(false);
                }
            }["useAuth.useEffect.loadUser"];
            loadUser();
        }
    }["useAuth.useEffect"], []);
    const login = async (email, password)=>{
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$endpoints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authEndpoints"].login, formData, false);
        // Store tokens in localStorage
        localStorage.setItem("access_token", response.access);
        localStorage.setItem("refresh_token", response.refresh);
        // Also set cookies for middleware
        document.cookie = `accessToken=${response.access}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        document.cookie = `refreshToken=${response.refresh}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
        // Fetch user profile
        const userData = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$endpoints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userEndpoints"].profile, true);
        setUser(userData);
        return userData;
    };
    const signup = async (first_name, last_name, email, password)=>{
        const formData = new FormData();
        formData.append("first_name", first_name);
        formData.append("last_name", last_name);
        formData.append("email", email);
        formData.append("password", password);
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$endpoints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authEndpoints"].signup, formData, false);
        // After signup, log in to get tokens
        const userData = await login(email, password);
        return userData;
    };
    const logout = ()=>{
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // Clear cookies
        document.cookie = "accessToken=; path=/; max-age=0";
        document.cookie = "refreshToken=; path=/; max-age=0";
        setUser(null);
    };
    const updateUser = async (updates)=>{
        const formData = new FormData();
        Object.entries(updates).forEach(([key, value])=>{
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });
        const updatedUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].patch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$endpoints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userEndpoints"].updateProfile, formData, true);
        setUser(updatedUser);
        return updatedUser;
    };
    return {
        user,
        loading,
        login,
        signup,
        logout,
        updateUser,
        isAuthenticated: !!user
    };
};
_s(useAuth, "NiO5z6JIqzX62LS5UWDgIqbZYyY=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/[locale]/(public)/(landing-page)/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useAuth.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function HomePage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            if (!loading) {
                if (user) {
                    // User is logged in, redirect to todos
                    router.push("/en/todos");
                } else {
                    // User is not logged in, redirect to login
                    router.push("/en/login");
                }
            }
        }
    }["HomePage.useEffect"], [
        user,
        loading,
        router
    ]);
    // Show loading while checking auth
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center bg-gray-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
                }, void 0, false, {
                    fileName: "[project]/src/app/[locale]/(public)/(landing-page)/page.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-4 text-gray-600",
                    children: "Loading..."
                }, void 0, false, {
                    fileName: "[project]/src/app/[locale]/(public)/(landing-page)/page.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/[locale]/(public)/(landing-page)/page.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/[locale]/(public)/(landing-page)/page.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_s(HomePage, "ECuTCuyBzuCScSXDCsKsZ4/7zwU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = HomePage;
var _c;
__turbopack_context__.k.register(_c, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_82976a24._.js.map