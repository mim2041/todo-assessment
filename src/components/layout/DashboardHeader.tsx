"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { FaBell, FaCalendar, FaCalendarAlt } from "react-icons/fa";
import logo from "@/assets/logo/logo.svg";
import Image from "next/image";
import { GoBell } from "react-icons/go";

export const DashboardHeader: React.FC = () => {
  const { user } = useAuth();

  const getCurrentDate = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const now = new Date();
    const dayName = days[now.getDay()];
    const date = now.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    return `${dayName}\n${date}`;
  };

  return (
    <div className="bg-white border-b border-gray-200 px-16 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src={logo} alt="Logo" />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notification Button */}
          <button className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <GoBell className="w-4 h-4" />
          </button>
          {/* Calendar Button */}
          <button className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <FaCalendarAlt className="w-4 h-4" />
          </button>

          {/* Date Display */}
          <div className="text-right text-[15px] text-[#0D224A] font-medium">
            <div>{getCurrentDate().split("\n")[0]}</div>
            <div className="text-[14px]">{getCurrentDate().split("\n")[1]}</div>
          </div>

          {/* User Badge */}
          {/* {user && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {user.first_name.split(" ")[0]}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};
