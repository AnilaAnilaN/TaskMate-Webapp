// components/chat/ChatButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ChatButton() {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch unread count
    fetch('/api/chat/conversations')
      .then(res => res.json())
      .then(data => {
        const total = data.conversations?.reduce(
          (sum: number, conv: any) => sum + (conv.unreadCount || 0),
          0
        );
        setUnreadCount(total || 0);
      })
      .catch(console.error);
  }, []);

  return (
    <button
      onClick={() => router.push('/chat')}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 md:w-16 md:h-16 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 group"
      aria-label="Open chat"
    >
      <MessageCircle className="w-6 h-6 md:w-7 md:h-7 group-hover:rotate-12 transition-transform" />
      
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}