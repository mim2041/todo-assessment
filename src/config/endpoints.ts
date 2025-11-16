// API Base URL - uses environment variable or defaults to production
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'https://todo-app.pioneeralpha.com';

// Authentication Endpoints
export const authEndpoints = {
    login: `${API_BASE_URL}/api/auth/login/`,
    signup: `${API_BASE_URL}/api/users/signup/`,
    refreshToken: `${API_BASE_URL}/api/auth/refresh/`,
    changePassword: `${API_BASE_URL}/api/users/change-password/`,
} as const;

// User/Profile Endpoints
export const userEndpoints = {
    profile: `${API_BASE_URL}/api/users/me/`,
    updateProfile: `${API_BASE_URL}/api/users/me/`,
} as const;

// Todo Endpoints
export const todoEndpoints = {
    todos: `${API_BASE_URL}/api/todos/`,
    todoById: (id: number) => `${API_BASE_URL}/api/todos/${id}/`,
    createTodo: `${API_BASE_URL}/api/todos/`,
    updateTodo: (id: number) => `${API_BASE_URL}/api/todos/${id}/`,
    deleteTodo: (id: number) => `${API_BASE_URL}/api/todos/${id}/`,
} as const;

// Export base URL for dynamic endpoints
export { API_BASE_URL };

