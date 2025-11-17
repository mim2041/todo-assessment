/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaCalendar, FaSave } from "react-icons/fa";
import { FaCamera } from "react-icons/fa6";
import { PiUploadFill } from "react-icons/pi";

interface FormErrors {
  name?: string;
  email?: string;
  address?: string;
  number?: string;
  birthday?: string;
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    number: "",
    birthday: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        address: user.address || "",
        number: user.number || "",
        birthday: user.birthday || "",
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
      <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-8 ">
        {/* Page Header */}
        <div className="mb-4">
          <h1 className="text-[24px] font-semibold text-gray-900 mb-2">
            Account Information
          </h1>
        </div>

        <div className="flex flex-col gap-6 rounded-xl">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1 my-auto border border-[#A1A3ABA1] rounded-xl py-4 px-10 w-fit">
            <div className="flex items-center gap-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-[#9F9F9F] flex items-center justify-center text-4xl font-bold text-white"></div>
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <FaCamera className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-[#5272FF] rounded-xl text-white py-2 px-6 cursor-pointer hover:bg-blue-700 transition-colors">
                <PiUploadFill className="inline w-5 h-5  mr-2" />
                <span className="text-sm">Upload New Photo</span>
              </div>
            </div>
          </div>

          {/* Profile Form Card */}
          <div className="lg:col-span-2 my-auto border border-[#A1A3ABA1] rounded-xl py-4 px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
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
                  <label className="block text-sm font-medium text-gray-800 mb-1">
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
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Email
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Address
                  </label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    error={errors.address}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Contact Number
                  </label>
                  <Input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Birthday
                </label>
                <Input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  error={errors.birthday}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex justify-center items-center gap-4 pt-6 text-[14px] font-medium">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="bg-[#5272FF] hover:bg-blue-700 w-48"
                >
                  Save Changes
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="bg-[#5272FF] hover:bg-blue-700 w-48"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
