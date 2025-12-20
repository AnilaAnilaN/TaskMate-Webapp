// components/dashboard/Sidebar.tsx
// ==========================================
'use client';

import { Calendar, Bell, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
            <span className="text-xl">😊</span>
          </div>
          <span className="font-semibold text-xl text-gray-900">TaskMate</span>
        </div>

        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              isActive('/dashboard')
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-sm">Dashboard</span>
          </Link>

          <Link
            href="/tasks"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              isActive('/tasks') || pathname.startsWith('/tasks/')
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="w-5 h-5 border-2 border-gray-400 rounded"></div>
            <span className="text-sm">My tasks</span>
          </Link>

          <Link
            href="/notifications"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              isActive('/notifications')
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="text-sm">Notifications</span>
          </Link>
        </nav>
      </div>

      <div className="flex-1"></div>

      <div className="p-6 border-t border-gray-200 space-y-1">
        <Link
          href="/settings"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
            isActive('/settings')
              ? 'bg-gray-100 text-gray-900 font-medium'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm">Settings</span>
        </Link>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-xl cursor-pointer disabled:opacity-50 transition-colors"
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