// components/assistant/AssistantNotificationBadge.tsx
'use client';

import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AssistantNotificationBadge() {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    checkUnreadMessages();
    
    // Check every 30 seconds
    const interval = setInterval(checkUnreadMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkUnreadMessages = async () => {
    try {
      const response = await fetch('/api/assistant/stats');
      const data = await response.json();
      
      if (data.success && data.stats) {
        // Simple check: if there are AI messages, show badge
        // You can enhance this with proper lastSeen tracking
        setHasUnread(data.stats.aiMessages > 0);
      }
    } catch (error) {
      console.error('Failed to check AI assistant messages:', error);
    }
  };

  return (
    <Link
      href="/assistant"
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      title="AI Assistant"
    >
      <Sparkles className="w-5 h-5 text-gray-600" />
      {hasUnread && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
      )}
    </Link>
  );
}