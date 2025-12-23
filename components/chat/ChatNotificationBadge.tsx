// components/chat/ChatNotificationBadge.tsx
'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function ChatNotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();

    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/chat/conversations');
      if (!response.ok) return;

      const { conversations } = await response.json();
      
      const total = conversations.reduce(
        (sum: number, conv: any) => sum + (conv.unreadCount || 0),
        0
      );
      
      setUnreadCount(total);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  return (
    <Link
      href="/chat"
      className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
    >
      <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}