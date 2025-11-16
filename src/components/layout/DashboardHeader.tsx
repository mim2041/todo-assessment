'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FaBell, FaCalendar } from 'react-icons/fa';

export const DashboardHeader: React.FC = () => {
  const { user } = useAuth();

  const getCurrentDate = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const dayName = days[now.getDay()];
    const date = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    return `${dayName}\n${date}`;
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
          </div>
          <div>
            <div className="text-xs font-bold text-blue-600">DREAMY</div>
            <div className="text-[10px] text-blue-600">SOFTWARE</div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Calendar Button */}
          <button className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <FaCalendar className="w-4 h-4" />
          </button>

          {/* Notification Button */}
          <button className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <FaBell className="w-4 h-4" />
          </button>

          {/* Date Display */}
          <div className="text-right">
            <div className="text-xs font-semibold text-gray-700">
              {getCurrentDate().split('\n')[0]}
            </div>
            <div className="text-[10px] text-gray-500">
              {getCurrentDate().split('\n')[1]}
            </div>
          </div>

          {/* User Badge */}
          {user && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {user.first_name.split(' ')[0]}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

