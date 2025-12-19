'use client';

import { Calendar, Bell, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  onLogout?: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (!onLogout) return;
    setLoggingOut(true);
    await onLogout();
    setLoggingOut(false);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
          <span className="text-xl">😊</span>
        </div>
        <span className="font-semibold text-xl text-gray-900">TaskMate</span>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 px-3">
        <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-100 rounded-xl cursor-pointer">
          <Calendar className="w-5 h-5 text-gray-700" />
          <span className="font-medium text-gray-900 text-sm">Dashboard</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer">
          <div className="w-5 h-5 border-2 border-gray-400 rounded"></div>
          <span className="text-gray-600 text-sm">My tasks</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="text-gray-600 text-sm">Notifications</span>
        </div>
      </nav>

      <div className="flex-1"></div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer">
          <Settings className="w-5 h-5 text-gray-600" />
          <span className="text-gray-600 text-sm">Settings</span>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-xl cursor-pointer disabled:opacity-50"
        >
          <LogOut className="w-5 h-5 text-gray-600" />
          <span className="text-gray-600 text-sm">
            {loggingOut ? 'Logging out...' : 'Log out'}
          </span>
        </button>
      </div>
    </div>
  );
}
