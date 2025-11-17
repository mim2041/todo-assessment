"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa6";
import { PiUploadFill } from "react-icons/pi";

interface FormErrors {
  name?: string;
  email?: string;
  address?: string;
  contact_number?: string;
  birthday?: string;
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    contact_number: "",
    birthday: "",
    bio: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetFormState = useCallback(
    (targetUser = user) => {
      if (!targetUser) return;
      setFormData({
        first_name: targetUser.first_name,
        last_name: targetUser.last_name,
        email: targetUser.email,
        address: targetUser.address || "",
        contact_number: targetUser.contact_number || "",
        birthday: targetUser.birthday || "",
        bio: targetUser.bio || "",
      });
      setProfileImagePreview(targetUser.profile_image || "");
      setProfileImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [user]
  );

  useEffect(() => {
    if (user) {
      resetFormState(user);
    }
  }, [user, resetFormState]);

  useEffect(() => {
    if (!profileImageFile) return;
    const previewUrl = URL.createObjectURL(profileImageFile);
    setProfileImagePreview(previewUrl);
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [profileImageFile]);

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
      const payload: Parameters<typeof updateUser>[0] = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        address: formData.address,
        contact_number: formData.contact_number,
        birthday: formData.birthday,
        bio: formData.bio,
      };
      if (profileImageFile) {
        payload.profile_image = profileImageFile;
      }
      await updateUser(payload);
      toast.success("Profile updated successfully!");
      setProfileImageFile(null);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    setProfileImageFile(file);
  };

  const handleRemoveImage = () => {
    setProfileImageFile(null);
    setProfileImagePreview(user?.profile_image || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-8 ">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-[24px] font-semibold text-gray-900">
            Account Information
          </h1>
          <div className="h-0.5 w-20 bg-[#5272FF] rounded-full"></div>
        </div>

        <div className="flex flex-col gap-6 rounded-xl">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1 my-auto border border-[#A1A3ABA1] rounded-xl py-4 px-10 w-fit">
            <div className="flex items-center gap-6">
              <div className="relative inline-block">
                <div className="relative w-24 h-24 rounded-full bg-[#9F9F9F] flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
                  {profileImagePreview ? (
                    <Image
                      src={profileImagePreview}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                      sizes="96px"
                      unoptimized
                    />
                  ) : (
                    <span>
                      {user.first_name?.[0]}
                      {user.last_name?.[0]}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                >
                  <FaCamera className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#5272FF] rounded-xl text-white py-2 px-6 cursor-pointer hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  <PiUploadFill className="w-5 h-5" />
                  <span className="text-sm">Upload New Photo</span>
                </button>
                {profileImageFile && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-sm text-red-600 hover:underline"
                    disabled={isSubmitting}
                  >
                    Remove Photo
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
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
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    error={errors.contact_number}
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

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Bio
                </label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  disabled={isSubmitting}
                  placeholder="Tell us a little about yourself"
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
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => resetFormState()}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300 w-48"
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
