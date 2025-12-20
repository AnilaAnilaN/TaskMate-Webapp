// ==========================================
// 7. UPDATED TOPBAR WITH LINK
// components/dashboard/Topbar.tsx
// ==========================================
'use client';

import { Search, Plus, Bell } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Topbar() {
  const [userName, setUserName] = useState('User');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.profile?.name) {
          setUserName(data.profile.name);
        }
      })
      .catch(err => console.error('Failed to fetch user'))
      .finally(() => setLoading(false));
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2.5 bg-yellow-400 text-gray-900 rounded-xl font-medium hover:bg-yellow-500 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          New task
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-xl">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>

        <Link
          href="/profile"
          className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 text-sm hover:bg-yellow-500 hover:scale-105 transition-all"
          title="View Profile"
        >
          {loading ? '...' : getInitials(userName)}
        </Link>
      </div>
    </div>
  );
}