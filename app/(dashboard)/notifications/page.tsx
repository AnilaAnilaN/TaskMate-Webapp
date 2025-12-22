// app/(dashboard)/notifications/page.tsx
// ==========================================
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  ArrowLeft,
  Trash2,
  Eye,
  CheckCheck,
  Filter,
  RefreshCw,
} from 'lucide-react';
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

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      const params = new URLSearchParams();
      
      if (filter === 'unread') {
        params.append('isRead', 'false');
      } else if (filter === 'read') {
        params.append('isRead', 'true');
      }

      const response = await fetch(`/api/notifications?${params}`, {
        cache: 'no-store',
      });
      const data = await response.json();

      if (response.ok) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    
    // Check for new notifications
    try {
      await fetch('/api/notifications', { method: 'POST' });
    } catch (error) {
      console.error('Failed to check for notifications:', error);
    }
    
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDismiss = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Failed to dismiss notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
      });

      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDismissAll = async () => {
    if (!confirm('Are you sure you want to dismiss all notifications?')) return;

    try {
      const response = await fetch('/api/notifications/dismiss-all', {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Failed to dismiss all:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    router.push(`/tasks/${notification.taskId}`);
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return new Date(date).toLocaleDateString();
  };

  const getTypeIcon = (type: string) => {
    if (type === 'due_today') return '📅';
    if (type === 'overdue') return '⚠️';
    return '🔔';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-blue-100 text-blue-700',
    };
    return colors[priority] || colors.medium;
  };

  // Group notifications by date
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const date = new Date(notification.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let key = '';
    if (date.toDateString() === today.toDateString()) {
      key = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      key = 'Yesterday';
    } else {
      key = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(notification);
    return acc;
  }, {} as Record<string, Notification[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-7 h-7" />
              Notifications
            </h1>
            <p className="text-sm text-gray-500 mt-1">Stay updated on your tasks</p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-6 h-6 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'unread', 'read'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  filter === f
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleMarkAllAsRead}
              disabled={notifications.filter(n => !n.isRead).length === 0}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </button>
            <button
              onClick={handleDismissAll}
              disabled={notifications.length === 0}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Dismiss All
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg mb-2">No notifications here</p>
          <p className="text-gray-400 text-sm">
            {filter === 'all' && 'You\'re all caught up! Check back later for updates.'}
            {filter === 'unread' && 'All notifications have been read.'}
            {filter === 'read' && 'No read notifications yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([date, items]) => (
            <div key={date} className="space-y-3">
              {/* Date Header */}
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2">
                {date}
              </h3>

              {/* Notifications */}
              <div className="space-y-2">
                {items.map((notification) => {
                  const IconComponent = getCategoryIcon(notification.metadata.categoryIcon);
                  
                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-yellow-400 cursor-pointer transition-all ${
                        !notification.isRead ? 'ring-2 ring-yellow-400 ring-opacity-30' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: `${notification.metadata.categoryColor}20` }}
                          >
                            <IconComponent
                              className="w-7 h-7"
                              style={{ color: notification.metadata.categoryColor }}
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <p className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-1">
                                {getTypeIcon(notification.type)} {notification.title}
                              </p>
                              <p className="text-sm text-gray-600">
                                {notification.message}
                              </p>
                            </div>
                            
                            {!notification.isRead && (
                              <div className="w-3 h-3 bg-yellow-400 rounded-full flex-shrink-0 mt-1"></div>
                            )}
                          </div>

                          <div className="flex items-center gap-3 flex-wrap mt-3">
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getPriorityColor(notification.metadata.priority)}`}>
                              {notification.metadata.priority.toUpperCase()}
                            </span>

                            <span className="text-xs text-gray-500">
                              {notification.metadata.categoryName}
                            </span>

                            <span className="text-xs text-gray-400">
                              {getTimeAgo(notification.createdAt)}
                            </span>

                            <div className="ml-auto flex items-center gap-2">
                              {!notification.isRead && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification.id);
                                  }}
                                  className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  Mark Read
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDismiss(notification.id);
                                }}
                                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Dismiss
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}