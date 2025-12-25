// components/dashboard/Topbar.tsx (UPDATED)
'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import NotificationBell from './NotificationBell';
import AssistantNotificationBadge from '@/components/assistant/AssistantNotificationBadge';

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
    <div className="flex items-center justify-between gap-4 mb-6 md:mb-8">
      {/* Search Bar - Responsive Width */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-2.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right Section - User Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* AI Assistant Notification Badge - NEW */}
        <AssistantNotificationBadge />

        {/* Task Notification Bell */}
        <NotificationBell />

        {/* Profile Avatar */}
        <Link
          href="/profile"
          className="w-8 h-8 md:w-9 md:h-9 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 text-xs md:text-sm hover:bg-yellow-500 hover:scale-105 transition-all flex-shrink-0"
          title="View Profile"
        >
          {loading ? '...' : getInitials(userName)}
        </Link>
      </div>
    </div>
  );
}