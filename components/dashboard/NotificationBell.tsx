// components/dashboard/NotificationBell.tsx
// ==========================================
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, X, Check, CheckCheck, Eye } from 'lucide-react';
import { getCategoryIcon } from '@/lib/config/categoryIcons';

interface Notification {
  id: string;
  type: 'due_today' | 'overdue' | 'reminder';
  title: string;
  message: string;
  isRead: boolean;
  taskId: string;
  metadata: {
    taskTitle: string;
    dueDate: string;
    priority: string;
    categoryName: string;
    categoryColor: string;
    categoryIcon: string;
  };
  createdAt: string;
}

export default function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    checkForNewNotifications();

    // Refresh notifications every 5 minutes
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?limit=10', { cache: 'no-store' });
      const data = await response.json();

      if (response.ok) {
        console.log('Fetched notifications:', data.notifications); // Debug
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } else {
        console.error('Failed to fetch notifications:', data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const checkForNewNotifications = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to check notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log('Marking as read, notification ID:', notificationId); // Debug
    
    if (!notificationId) {
      console.error('Invalid notification ID');
      return;
    }

    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Mark as read response:', response.status, data); // Debug

      if (response.ok) {
        // Update local state immediately
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        console.error('Failed to mark as read:', data);
        alert('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
      alert('Failed to mark notification as read');
    }
  };

  const handleDismiss = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log('Dismissing notification ID:', notificationId); // Debug
    
    if (!notificationId) {
      console.error('Invalid notification ID');
      return;
    }

    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      console.log('Dismiss response:', response.status, data); // Debug

      if (response.ok) {
        // Remove from local state immediately
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        setUnreadCount(prev => {
          const notification = notifications.find(n => n.id === notificationId);
          return notification && !notification.isRead ? Math.max(0, prev - 1) : prev;
        });
      } else {
        console.error('Failed to dismiss:', data);
        alert('Failed to dismiss notification');
      }
    } catch (error) {
      console.error('Failed to dismiss notification:', error);
      alert('Failed to dismiss notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
      });

      if (response.ok) {
        // Update all notifications to read in local state
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      } else {
        console.error('Failed to mark all as read');
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    console.log('Notification clicked:', notification); // Debug
    
    if (!notification.isRead) {
      handleMarkAsRead(notification.id, {} as React.MouseEvent);
    }
    setShowDropdown(false);
    router.push(`/tasks/${notification.taskId}`);
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getTypeIcon = (type: string) => {
    if (type === 'due_today') return '📅';
    if (type === 'overdue') return '⚠️';
    return '🔔';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-linear-to-r from-yellow-50 to-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </h3>
              <button
                onClick={() => setShowDropdown(false)}
                className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={loading}
                className="text-sm text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-1 disabled:opacity-50"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 text-sm">No notifications yet</p>
                <p className="text-gray-400 text-xs mt-1">
                  You'll see updates about your tasks here
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const IconComponent = getCategoryIcon(notification.metadata.categoryIcon);
                
                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.isRead ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="shrink-0 mt-1">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${notification.metadata.categoryColor}20` }}
                        >
                          <IconComponent
                            className="w-5 h-5"
                            style={{ color: notification.metadata.categoryColor }}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            {getTypeIcon(notification.type)} {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-yellow-400 rounded-full shrink-0 mt-1"></div>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {getTimeAgo(notification.createdAt)}
                          </span>

                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <button
                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                                title="Mark as read"
                              >
                                <Eye className="w-3.5 h-3.5 text-gray-500" />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDismiss(notification.id, e)}
                              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                              title="Dismiss"
                            >
                              <X className="w-3.5 h-3.5 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  router.push('/notifications');
                }}
                className="w-full px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-medium text-sm transition-colors"
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}