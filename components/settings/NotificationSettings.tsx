// components/settings/NotificationSettings.tsx
// ==========================================
'use client';

import { useState, useEffect } from 'react';
import { Mail, Clock } from 'lucide-react';

interface Props {
  preferences: {
    emailNotifications: {
      dailyReminder: boolean;
      reminderTime: string;
    };
  };
  onSave: (updates: any) => Promise<void>;
}

export default function NotificationSettings({ preferences, onSave }: Props) {
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [saving, setSaving] = useState(false);

  // Initialize state when preferences are loaded
  useEffect(() => {
    if (preferences?.emailNotifications) {
      setDailyReminder(preferences.emailNotifications.dailyReminder ?? true);
      setReminderTime(preferences.emailNotifications.reminderTime || '08:00');
    }
  }, [preferences]);

  const handleToggleDailyReminder = async () => {
    const newValue = !dailyReminder;
    setDailyReminder(newValue);
    setSaving(true);
    await onSave({
      preferences: {
        emailNotifications: {
          dailyReminder: newValue,
          reminderTime,
        },
      },
    });
    setSaving(false);
  };

  const handleTimeChange = async (newTime: string) => {
    setReminderTime(newTime);
    setSaving(true);
    await onSave({
      preferences: {
        emailNotifications: {
          dailyReminder,
          reminderTime: newTime,
        },
      },
    });
    setSaving(false);
  };

  const timeOptions = [];
  for (let hour = 6; hour <= 23; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    const label = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    timeOptions.push({ value: time, label });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Notifications</h2>
        <p className="text-sm text-gray-500">Manage how you receive notifications</p>
      </div>

      {/* Email Notifications */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email Notifications
        </h3>

        {/* Daily Reminder Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex-1">
            <p className="font-medium text-gray-900">Daily Task Reminders</p>
            <p className="text-sm text-gray-500 mt-1">
              Get an email every morning with your tasks due today
            </p>
          </div>
          <button
            onClick={handleToggleDailyReminder}
            disabled={saving}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              dailyReminder ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
                dailyReminder ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Reminder Time */}
        {dailyReminder && (
          <div className="p-4 bg-gray-50 rounded-xl">
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Reminder Time
            </label>
            <select
              value={reminderTime}
              onChange={(e) => handleTimeChange(e.target.value)}
              disabled={saving}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
            >
              {timeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Time is in UTC. Your local time: {new Date(`2000-01-01T${reminderTime}:00Z`).toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-900">
          <strong>📧 Email Settings:</strong> Make sure your email is verified to receive notifications.
          More notification options coming soon!
        </p>
      </div>
    </div>
  );
}