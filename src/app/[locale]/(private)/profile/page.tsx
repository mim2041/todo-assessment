/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaSave,
  FaCamera,
} from "react-icons/fa";

interface FormErrors {
  name?: string;
  email?: string;
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    }
  }, [user]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.name = "First name is required";
    } else if (formData.first_name.trim().length < 2) {
      newErrors.name = "First name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await updateUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!user) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="w-full mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview Card */}
          <Card className="lg:col-span-1">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-4xl font-bold text-white mb-4">
                  {user.first_name.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-4 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <FaCamera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-600 mb-4">{user.email}</p>
              <div className="border-t pt-4">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <FaCalendar className="w-4 h-4 mr-2" />
                  <span>Member since {formattedDate}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Profile Form Card */}
          <Card className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Personal Information
              </h3>
              <p className="text-sm text-gray-600">
                Update your personal details and information
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline w-4 h-4 mr-2" />
                    First Name
                  </label>
                  <Input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    error={errors.name}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline w-4 h-4 mr-2" />
                    Last Name
                  </label>
                  <Input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline w-4 h-4 mr-2" />
                  Email Address
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FaSave className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Additional Settings Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Password Change Card */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Password & Security
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Manage your password and security settings
            </p>
            <Button variant="secondary" size="sm">
              Change Password
            </Button>
          </Card>

          {/* Danger Zone Card */}
          <Card>
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Danger Zone
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Permanently delete your account and all data
            </p>
            <Button variant="danger" size="sm">
              Delete Account
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
