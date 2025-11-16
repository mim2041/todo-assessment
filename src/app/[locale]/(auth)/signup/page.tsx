/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // First name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = "Please enter a valid name format.";
    }

    // Last name validation
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Please enter a valid name format.";
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await signup(
        formData.first_name,
        formData.last_name,
        formData.email,
        formData.password
      );
      toast.success("Account created successfully!");

      // Small delay to ensure cookies are set
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Force page reload to ensure middleware picks up the cookies
      window.location.href = "/en/todos";
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(
        error?.message || "Failed to create account. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-50 items-center justify-center p-12">
        <div className="max-w-md">
          {/* Illustration SVG */}
          <svg
            viewBox="0 0 400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            {/* Background elements */}
            <circle cx="100" cy="80" r="60" fill="#E0E7FF" opacity="0.5" />
            <circle cx="320" cy="200" r="80" fill="#DBEAFE" opacity="0.4" />

            {/* Plant decoration */}
            <ellipse cx="60" cy="260" rx="15" ry="8" fill="#7C3AED" />
            <rect x="58" y="220" width="4" height="40" fill="#059669" />
            <ellipse cx="50" cy="215" rx="12" ry="18" fill="#10B981" />
            <ellipse cx="68" cy="218" rx="10" ry="15" fill="#10B981" />

            {/* Login card/screen - Center */}
            <rect
              x="140"
              y="80"
              width="120"
              height="140"
              rx="8"
              fill="#5B77F7"
            />

            {/* Password dots on card */}
            <circle cx="160" cy="135" r="3" fill="white" />
            <circle cx="170" cy="135" r="3" fill="white" />
            <circle cx="180" cy="135" r="3" fill="white" />
            <circle cx="190" cy="135" r="3" fill="white" />
            <circle cx="200" cy="135" r="3" fill="white" />

            {/* Avatar/Profile icon on card */}
            <circle cx="200" cy="110" r="12" fill="white" />
            <path
              d="M200 115 Q190 125 190 135 L210 135 Q210 125 200 115"
              fill="white"
            />

            {/* Decorative lines on card */}
            <rect x="160" y="155" width="80" height="4" rx="2" fill="#93AFFC" />
            <rect x="160" y="170" width="60" height="4" rx="2" fill="#93AFFC" />

            {/* Person on left */}
            <ellipse cx="100" cy="200" rx="25" ry="15" fill="#C7D2FE" />
            <circle cx="100" cy="165" r="18" fill="#FCA5A5" />
            <path
              d="M88 165 Q85 180 75 195 L85 200 L100 185 Z"
              fill="#FCA5A5"
            />
            <circle cx="95" cy="158" r="15" fill="#4C1D95" />
            <rect x="85" y="195" width="30" height="35" rx="4" fill="#5B77F7" />
            <rect x="90" y="200" width="20" height="25" fill="#1E3A8A" />

            {/* Person on right */}
            <ellipse cx="300" cy="220" rx="25" ry="15" fill="#C7D2FE" />
            <circle cx="300" cy="185" r="18" fill="#FCA5A5" />
            <circle cx="305" cy="178" r="15" fill="#7C3AED" />
            <rect
              x="285"
              y="200"
              width="30"
              height="35"
              rx="4"
              fill="#10B981"
            />

            {/* Floating document/window elements */}
            <rect x="280" y="90" width="50" height="40" rx="4" fill="#DBEAFE" />
            <rect x="290" y="100" width="30" height="3" rx="1" fill="#5B77F7" />
            <rect x="290" y="108" width="25" height="3" rx="1" fill="#5B77F7" />

            <rect x="70" cy="90" width="45" height="35" rx="4" fill="#E0E7FF" />
            <rect x="80" y="100" width="25" height="3" rx="1" fill="#5B77F7" />
            <rect x="80" y="108" width="20" height="3" rx="1" fill="#5B77F7" />
          </svg>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h1>
            <p className="text-gray-600 text-sm">
              Start managing your tasks efficiently
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.first_name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.first_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.last_name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.last_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              href="/en/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
