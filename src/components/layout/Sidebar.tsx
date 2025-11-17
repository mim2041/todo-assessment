"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { FaCheckSquare, FaUser, FaSignOutAlt } from "react-icons/fa";
import { cn } from "@/utils/helpers/cn";
import todoIcon from "@/assets/icons/todo.svg";
import Image from "next/image";

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    window.location.href = "/en/login";
  };

  const isActive = (path: string) => pathname.includes(path);

  if (!user) return null;

  return (
    <div className="w-80 bg-gradient-to-b from-[#1e3a5f] to-[#2c5282] min-h-screen flex flex-col text-white">
      {/* Profile Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-2xl font-bold mb-3">
            {user.first_name.charAt(0).toUpperCase()}
          </div>
          <h3 className="font-semibold text-white">
            {user.first_name} {user.last_name}
          </h3>
          <p className="text-sm text-blue-200">{user.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <Link
          href="/en/todos"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors",
            isActive("/todos")
              ? "bg-white/10 text-white"
              : "text-blue-200 hover:bg-white/5"
          )}
        >
          <Image src={todoIcon} alt="Todos" className="w-5 h-5" />
          <span>Todos</span>
        </Link>

        <Link
          href="/en/profile"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors",
            isActive("/profile")
              ? "bg-white/10 text-white"
              : "text-blue-200 hover:bg-white/5"
          )}
        >
          <FaUser className="w-5 h-5" />
          <span>Account Information</span>
        </Link>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-blue-200 hover:bg-white/5 transition-colors"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
