// components/chat/ChatWindow.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, MoreVertical, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MessageBubble from './MessageBubble';
import { useAbly } from './AblyProvider';

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

interface ChatWindowProps {
  recipientId: string;
  currentUserId: string;
}

export default function ChatWindow({ recipientId, currentUserId }: ChatWindowProps) {
  const router = useRouter();
  const { client, isConnected } = useAbly();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    initializeChat();
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [recipientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversationId && client && isConnected) {
      subscribeToChannel();
    }
  }, [conversationId, client, isConnected]);

  const initializeChat = async () => {
    try {
      // Get or create conversation
      const convResponse = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId }),
      });

      if (!convResponse.ok) throw new Error('Failed to get conversation');

      const { conversation } = await convResponse.json();
      setConversationId(conversation.id);
      setRecipient(conversation.otherUser);

      // Fetch messages
      const messagesResponse = await fetch(
        `/api/chat/messages?conversationId=${conversation.id}`
      );

      if (messagesResponse.ok) {
        const data = await messagesResponse.json();
        setMessages(data.messages);
      }

      // Mark messages as read
      await fetch(`/api/chat/messages/${conversation.id}`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToChannel = () => {
    if (!client || !conversationId) return;

    const channel = client.channels.get(`chat:${conversationId}`);
    
    channel.subscribe('message', (message: any) => {
      const newMessage = message.data;
      setMessages((prev) => [...prev, newMessage]);
      
      // Mark as read if it's from the other user
      if (newMessage.senderId.id !== currentUserId) {
        markAsRead();
      }
    });

    channelRef.current = channel;
  };

  const markAsRead = async () => {
    if (!conversationId) return;
    
    try {
      await fetch(`/api/chat/messages/${conversationId}`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !conversationId || sending) return;

    setSending(true);
    const tempText = messageText;
    setMessageText('');

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          recipientId,
          text: tempText,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      // Message will be added via Ably subscription
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessageText(tempText);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-4">
        <button
          onClick={() => router.push('/chat')}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Recipient Info */}
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900">
            {recipient?.profileImage ? (
              <img
                src={recipient.profileImage}
                alt={recipient.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(recipient?.name || '')
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 truncate">
              {recipient?.name}
            </h2>
            <p className="text-xs text-gray-500">
              {isConnected ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start the conversation
            </h3>
            <p className="text-gray-600">
              Send a message to {recipient?.name}
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={message.senderId.id === currentUserId}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-2">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none max-h-32"
            style={{ minHeight: '48px' }}
          />
          <button
            type="submit"
            disabled={!messageText.trim() || sending}
            className="p-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {sending ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}