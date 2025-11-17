"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { User, AuthResponse } from "@/types/user";
import { apiClient } from "@/utils/api/client";
import { authEndpoints, userEndpoints } from "@/config/endpoints";

type UpdateUserPayload = Omit<Partial<User>, "profile_image"> & {
  profile_image?: File | null | string;
};

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) => Promise<User>;
  logout: () => void;
  updateUser: (updates: UpdateUserPayload) => Promise<User>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const isFileValue = (value: unknown): value is File =>
  typeof File !== "undefined" && value instanceof File;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const clearStoredTokens = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    document.cookie = "accessToken=; path=/; max-age=0";
    document.cookie = "refreshToken=; path=/; max-age=0";
  }, []);

  const persistTokens = useCallback((access: string, refresh: string) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    document.cookie = `accessToken=${access}; path=/; max-age=${
      7 * 24 * 60 * 60
    }; SameSite=Lax`;
    document.cookie = `refreshToken=${refresh}; path=/; max-age=${
      30 * 24 * 60 * 60
    }; SameSite=Lax`;
  }, []);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await apiClient.get<User>(userEndpoints.profile, true);
      setUser(userData);
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        persistTokens(token, refreshToken);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      clearStoredTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [clearStoredTokens, persistTokens]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const response = await apiClient.post<AuthResponse>(
        authEndpoints.login,
        formData,
        false
      );

      persistTokens(response.access, response.refresh);

      const userData = await apiClient.get<User>(userEndpoints.profile, true);
      setUser(userData);
      setLoading(false);
      return userData;
    },
    [persistTokens]
  );

  const signup = useCallback(
    async (
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

      await apiClient.post<User>(authEndpoints.signup, formData, false);
      return login(email, password);
    },
    [login]
  );

  const logout = useCallback(() => {
    clearStoredTokens();
    setUser(null);
    setLoading(false);
  }, [clearStoredTokens]);

  const updateUser = useCallback(async (updates: UpdateUserPayload) => {
    const formData = new FormData();
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      if (isFileValue(value)) {
        formData.append(key, value, value.name);
        return;
      }

      formData.append(key, value.toString());
    });

    const updatedUser = await apiClient.patch<User>(
      userEndpoints.updateProfile,
      formData,
      true
    );
    setUser(updatedUser);
    return updatedUser;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      updateUser,
      isAuthenticated: !!user,
    }),
    [user, loading, login, signup, logout, updateUser]
  );

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
