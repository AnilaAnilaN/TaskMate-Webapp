// components/chat/UserSearchModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search, X, MessageCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string | null;
  bio?: string;
}

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserSearchModal({ isOpen, onClose }: UserSearchModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setUsers([]);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers(searchQuery);
      } else {
        setUsers([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const searchUsers = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/chat/users?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError('Failed to search users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startChat = async (userId: string) => {
    try {
      // Create or get conversation
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: userId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(data.error || 'Failed to create conversation');
      }

      console.log('Conversation created:', data);
      
      onClose();
      router.push(`/chat/${userId}`);
    } catch (err: any) {
      console.error('Failed to start chat:', err);
      alert(`Failed to start chat: ${err.message}`);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Find Users</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-500">
              {error}
            </div>
          )}

          {!loading && !error && searchQuery && users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found. Try a different search.
            </div>
          )}

          {!loading && !searchQuery && (
            <div className="text-center py-8 text-gray-400">
              Start typing to search for users...
            </div>
          )}

          {!loading && users.length > 0 && (
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-4"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 flex-shrink-0">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {user.email}
                    </p>
                    {user.bio && (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {user.bio}
                      </p>
                    )}
                  </div>

                  {/* Chat Button */}
                  <button
                    onClick={() => startChat(user.id)}
                    className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-medium transition-colors flex items-center gap-2 flex-shrink-0"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}