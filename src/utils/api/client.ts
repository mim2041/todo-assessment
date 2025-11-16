/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_BASE_URL } from '@/config/endpoints';

interface RequestOptions extends RequestInit {
    requiresAuth?: boolean;
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private getAuthToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('access_token');
    }

    private async refreshToken(): Promise<boolean> {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) return false;

            const response = await fetch(`${this.baseURL}/api/auth/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken }),
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

    async request<T>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<T> {
        const { requiresAuth = false, ...fetchOptions } = options;

        const headers: Record<string, string> = {
            ...(fetchOptions.headers as Record<string, string> || {}),
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
                headers,
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
                        headers,
                    });
                }
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            // Handle 204 No Content
            if (response.status === 204) {
                return {} as T;
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async get<T>(endpoint: string, requiresAuth = false): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'GET',
            requiresAuth,
        });
    }

    async post<T>(
        endpoint: string,
        data: FormData | Record<string, any>,
        requiresAuth = false
    ): Promise<T> {
        const headers: Record<string, string> = {};
        let body: FormData | string;

        if (data instanceof FormData) {
            body = data;
        } else {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(data);
        }

        return this.request<T>(endpoint, {
            method: 'POST',
            body,
            headers,
            requiresAuth,
        });
    }

    async patch<T>(
        endpoint: string,
        data: FormData | Record<string, any>,
        requiresAuth = false
    ): Promise<T> {
        const headers: Record<string, string> = {};
        let body: FormData | string;

        if (data instanceof FormData) {
            body = data;
        } else {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(data);
        }

        return this.request<T>(endpoint, {
            method: 'PATCH',
            body,
            headers,
            requiresAuth,
        });
    }

    async delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
            requiresAuth,
        });
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
