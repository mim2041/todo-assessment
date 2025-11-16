module.exports = [
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/config/endpoints.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://todo-app.pioneeralpha.com';
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
}),
"[project]/src/utils/api/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */ __turbopack_context__.s([
    "apiClient",
    ()=>apiClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/endpoints.ts [app-ssr] (ecmascript)");
;
class ApiClient {
    baseURL;
    constructor(baseURL){
        this.baseURL = baseURL;
    }
    getAuthToken() {
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
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
const apiClient = new ApiClient(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_BASE_URL"]);
}),
"[project]/src/hooks/useAuth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/api/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/endpoints.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const useAuth = ()=>{
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Check if user is logged in and fetch profile
        const loadUser = async ()=>{
            const token = localStorage.getItem("access_token");
            if (token) {
                try {
                    const userData = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userEndpoints"].profile, true);
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
        };
        loadUser();
    }, []);
    const login = async (email, password)=>{
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authEndpoints"].login, formData, false);
        // Store tokens in localStorage
        localStorage.setItem("access_token", response.access);
        localStorage.setItem("refresh_token", response.refresh);
        // Also set cookies for middleware
        document.cookie = `accessToken=${response.access}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        document.cookie = `refreshToken=${response.refresh}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
        // Fetch user profile
        const userData = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userEndpoints"].profile, true);
        setUser(userData);
        return userData;
    };
    const signup = async (first_name, last_name, email, password)=>{
        const formData = new FormData();
        formData.append("first_name", first_name);
        formData.append("last_name", last_name);
        formData.append("email", email);
        formData.append("password", password);
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authEndpoints"].signup, formData, false);
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
        const updatedUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].patch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userEndpoints"].updateProfile, formData, true);
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
}),
"[project]/src/assets/images/loginImg.svg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/loginImg.6ff0d81c.svg");}),
"[project]/src/assets/images/loginImg.svg.mjs { IMAGE => \"[project]/src/assets/images/loginImg.svg (static in ecmascript, tag client)\" } [app-ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$loginImg$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/images/loginImg.svg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$loginImg$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 606,
    height: 840,
    blurWidth: 0,
    blurHeight: 0
};
}),
"[project]/src/app/[locale]/(auth)/login/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */ __turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useAuth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$loginImg$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$loginImg$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/images/loginImg.svg.mjs { IMAGE => "[project]/src/assets/images/loginImg.svg (static in ecmascript, tag client)" } [app-ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
function LoginPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { login } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        email: "",
        password: "",
        rememberMe: false
    });
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const validate = ()=>{
        const newErrors = {};
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!validate()) return;
        try {
            setIsSubmitting(true);
            await login(formData.email, formData.password);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success("Welcome back!");
            // Small delay to ensure cookies are set
            await new Promise((resolve)=>setTimeout(resolve, 100));
            // Force page reload to ensure middleware picks up the cookies
            window.location.href = "/en/todos";
        } catch (error) {
            console.error("Login error:", error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error(error?.message || "Invalid email or password. Please try again.");
            setIsSubmitting(false);
        }
    };
    const handleChange = (e)=>{
        const { name, value, type, checked } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev)=>({
                    ...prev,
                    [name]: undefined
                }));
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden md:block md:w-2/5 h-screen bg-[#E2ECF8]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$loginImg$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$loginImg$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                    alt: "Login Illustration",
                    className: "object-contain w-full h-screen"
                }, void 0, false, {
                    fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex items-center justify-center p-8 bg-white md:w-3/5 ",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-[22px] md:text-[26px] lg:text-[30px] font-bold text-gray-900 mb-2",
                                    children: "Log in to your account"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[#4B5563]",
                                    children: "Start managing your tasks efficiently"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                                    lineNumber: 104,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSubmit,
                            className: "space-y-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "Email"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                                            lineNumber: 113,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "email",
                                            name: "email",
                                            placeholder: "Enter your email",
                                            value: formData.email,
                                            onChange: handleChange,
                                            disabled: isSubmitting,
                                            className: `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#8CA3CD] ${errors.email ? "border-red-500 focus:ring-red-500" : "border-[#D1D5DB]"}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                                            lineNumber: 114,
                                            columnNumber: 15
                                        }, this),
                                        errors.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-[#EE0039] mt-1",
                                            children: errors.email
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                                            lineNumber: 128,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                                    lineNumber: 112,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "Password"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                                            lineNumber: 134,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "password",
                                            name: "password",
                                            placeholder: "Enter your password",
                                            value: formData.password,
                                            onChange: handleChange,
                                            disabled: isSubmitting,
                                            className: `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#8CA3CD] ${errors.password ? "border-red-500 focus:ring-red-500" : "border-[#D1D5DB]"}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                                            lineNumber: 135,
                                            columnNumber: 15
                                        }, this),
                                        errors.password && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-[#EE0039] mt-1",
                                            children: errors.password
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                                            lineNumber: 149,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                                    lineNumber: 133,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    id: "rememberMe",
                                                    name: "rememberMe",
                                                    type: "checkbox",
                                                    checked: formData.rememberMe,
                                                    onChange: handleChange,
                                                    className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                                                    lineNumber: 156,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "rememberMe",
                                                    className: "ml-2 block text-sm text-[#374151]",
                                                    children: "Remember me"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                                                    lineNumber: 164,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                                            lineNumber: 155,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "#",
                                                className: "text-[#5272FF] hover:text-[#3B5BDB] font-medium",
                                                children: "Forgot your password?"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                                                lineNumber: 173,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                                            lineNumber: 172,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: isSubmitting,
                                    className: "w-full bg-[#5272FF] hover:bg-[#3B5BDB] text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:bg-[#7A9BFF] disabled:cursor-not-allowed",
                                    children: isSubmitting ? "Logging in..." : "Log In"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                                    lineNumber: 183,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                            lineNumber: 110,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-center text-sm text-gray-600 mt-6",
                            children: [
                                "Don't have an account?",
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/en/signup",
                                    className: "text-[#5272FF] hover:text-[#3B5BDB] font-medium",
                                    children: "Register now"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                                    lineNumber: 195,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                            lineNumber: 193,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/[locale]/(auth)/login/page.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2e79c531._.js.map