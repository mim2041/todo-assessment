"use client";

import { useState, useEffect } from "react";
import { User, SignupData, LoginData, AuthResponse } from "@/types/user";
import { apiClient } from "@/utils/api/client";
import { authEndpoints, userEndpoints } from "@/config/endpoints";

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in and fetch profile
        const loadUser = async () => {
            const token = localStorage.getItem("access_token");
            if (token) {
                try {
                    const userData = await apiClient.get<User>(userEndpoints.profile, true);
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

    const login = async (email: string, password: string) => {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        const response = await apiClient.post<AuthResponse>(
            authEndpoints.login,
            formData,
            false
        );

        // Store tokens in localStorage
        localStorage.setItem("access_token", response.access);
        localStorage.setItem("refresh_token", response.refresh);

        // Also set cookies for middleware
        document.cookie = `accessToken=${response.access}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        document.cookie = `refreshToken=${response.refresh}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;

        // Fetch user profile
        const userData = await apiClient.get<User>(userEndpoints.profile, true);
        setUser(userData);

        return userData;
    };

    const signup = async (
        first_name: string,
        last_name: string,
        email: string,
        password: string
    ) => {
        const formData = new FormData();
        formData.append("first_name", first_name);
        formData.append("last_name", last_name);
        formData.append("email", email);
        formData.append("password", password);

        await apiClient.post<User>(
            authEndpoints.signup,
            formData,
            false
        );

        // After signup, log in to get tokens
        const userData = await login(email, password);

        return userData;
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // Clear cookies
        document.cookie = "accessToken=; path=/; max-age=0";
        document.cookie = "refreshToken=; path=/; max-age=0";

        setUser(null);
    };

    const updateUser = async (updates: Partial<User>) => {
        const formData = new FormData();
        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });

        const updatedUser = await apiClient.patch<User>(
            userEndpoints.updateProfile,
            formData,
            true
        );
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
        isAuthenticated: !!user,
    };
};
