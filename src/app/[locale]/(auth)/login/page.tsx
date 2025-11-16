/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import loginImg from "@/assets/images/loginImg.svg";
import Image from "next/image";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await login(formData.email, formData.password);
      toast.success("Welcome back!");

      // Small delay to ensure cookies are set
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Force page reload to ensure middleware picks up the cookies
      window.location.href = "/en/todos";
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(
        error?.message || "Invalid email or password. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Side - Illustration */}
      <div className="hidden md:block md:w-2/5 h-screen bg-[#E2ECF8]">
        {/* Illustration SVG */}
        <Image
          src={loginImg}
          alt="Login Illustration"
          className="object-contain w-full h-screen"
        />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white md:w-3/5 ">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[22px] md:text-[26px] lg:text-[30px] font-bold text-gray-900 mb-2">
              Log in to your account
            </h1>
            <p className="text-[#4B5563]">
              Start managing your tasks efficiently
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#8CA3CD] ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#D1D5DB]"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-[#EE0039] mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#8CA3CD] ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#D1D5DB]"
                }`}
              />
              {errors.password && (
                <p className="text-xs text-[#EE0039] mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-[#374151]"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="text-[#5272FF] hover:text-[#3B5BDB] font-medium"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#5272FF] hover:bg-[#3B5BDB] text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:bg-[#7A9BFF] disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/en/signup"
              className="text-[#5272FF] hover:text-[#3B5BDB] font-medium"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
