// ============================================
// 4. Updated ChatList.tsx (import from shared types)
// components/chat/ChatList.tsx
// ============================================
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Search, Plus, Loader2 } from 'lucide-react';
import UserSearchModal from './UserSearchModal';
import { useAbly } from './AblyProvider';
import type { Conversation } from '@/types/chat';

export default function ChatList() {
  const router = useRouter();
  const { client, isConnected } = useAbly();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (client && isConnected && conversations.length > 0) {
      subscribeToGlobalPresence();
    }
  }, [client, isConnected, conversations]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/chat/conversations');
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Fetch conversations error:', response.status, data);
        throw new Error(data.error || 'Failed to fetch conversations');
      }

      setConversations(data.conversations);
    } catch (error: any) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToGlobalPresence = async () => {
    if (!client) return;

    const presenceChannel = client.channels.get('global:presence');
    
    try {
      const members = await presenceChannel.presence.get();
      const online = new Set(
        members?.map((member: any) => member.data?.userId).filter(Boolean) || []
      );
      setOnlineUsers(online);
    } catch (err) {
      console.error('Failed to get presence:', err);
    }

    presenceChannel.presence.subscribe('enter', (member: any) => {
      if (member.data?.userId) {
        setOnlineUsers((prev) => new Set([...prev, member.data.userId]));
      }
    });

    presenceChannel.presence.subscribe('leave', (member: any) => {
      if (member.data?.userId) {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          next.delete(member.data.userId);
          return next;
        });
      }
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return messageDate.toLocaleDateString();
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUser.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-7 h-7 text-yellow-500" />
            Messages
          </h1>
          <button
            onClick={() => setSearchModalOpen(true)}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-semibold transition-all flex items-center gap-2 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'Try a different search term'
                : 'Start a conversation to see it here'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setSearchModalOpen(true)}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-semibold transition-all"
              >
                Start Your First Chat
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => {
              const isOnline = onlineUsers.has(conversation.otherUser.id);
              
              return (
                <button
                  key={conversation.id}
                  onClick={() => router.push(`/chat/${conversation.otherUser.id}`)}
                  className="w-full p-4 hover:bg-gray-50 transition-colors flex items-center gap-4 text-left"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900">
                      {conversation.otherUser.profileImage ? (
                        <img
                          src={conversation.otherUser.profileImage}
                          alt={conversation.otherUser.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        getInitials(conversation.otherUser.name)
                      )}
                    </div>
                    {isOnline && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <h3 className={`font-semibold truncate ${
                        conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {conversation.otherUser.name}
                      </h3>
                      {conversation.lastMessage && (
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm truncate ${
                      conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                    }`}>
                      {conversation.lastMessage?.text || 'Start a conversation'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <UserSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
}
