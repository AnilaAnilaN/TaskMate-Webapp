// 2. Updated MessageBubble.tsx
// components/chat/MessageBubble.tsx
// ============================================
'use client';

import { formatDistanceToNow } from 'date-fns';
import type { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export default function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'just now';
    }
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isOwnMessage
            ? 'bg-yellow-400 text-gray-900'
            : 'bg-white text-gray-900 border border-gray-200'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs ${isOwnMessage ? 'text-gray-700' : 'text-gray-500'}`}>
            {formatTime(message.timestamp)}
          </span>
          {isOwnMessage && message.isRead && (
            <span className="text-xs text-gray-700">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
}
