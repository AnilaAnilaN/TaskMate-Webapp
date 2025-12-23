// components/chat/MessageBubble.tsx
'use client';

interface Message {
  id: string;
  text: string;
  senderId: {
    id: string;
    name: string;
    profileImage?: string | null;
  };
  timestamp: Date;
  isRead: boolean;
}

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export default function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className={`flex items-end gap-2 mb-4 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar (only for other user) */}
      {!isOwnMessage && (
        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 text-sm flex-shrink-0">
          {message.senderId.profileImage ? (
            <img
              src={message.senderId.profileImage}
              alt={message.senderId.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            message.senderId.name.charAt(0).toUpperCase()
          )}
        </div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isOwnMessage
              ? 'bg-yellow-400 text-gray-900'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.text}
          </p>
        </div>
        
        {/* Timestamp */}
        <span className="text-xs text-gray-500 mt-1 px-2">
          {formatTime(message.timestamp)}
          {isOwnMessage && (
            <span className="ml-1">
              {message.isRead ? '✓✓' : '✓'}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}