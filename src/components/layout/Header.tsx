"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { FaUser, FaSignOutAlt, FaCheckSquare } from "react-icons/fa";
import { cn } from "@/utils/helpers/cn";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname.includes(path);

  const handleLogout = () => {
    logout();
    window.location.href = "/en/login";
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/en/todos" className="flex items-center space-x-2">
            <FaCheckSquare className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TodoApp</span>
          </Link>

          {/* Navigation */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/en/todos"
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive("/todos")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                My Todos
              </Link>
              <Link
                href="/en/profile"
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive("/profile")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                Profile
              </Link>
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                      {user.first_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.first_name} {user.last_name}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-700"
                >
                  <FaSignOutAlt className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/en/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/en/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
