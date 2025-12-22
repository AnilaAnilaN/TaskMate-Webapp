// components/settings/AppearanceSettings.tsx
// ==========================================
'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';

interface Props {
  preferences: {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
  };
  onSave: (updates: any) => Promise<void>;
}

const accentColors = [
  { name: 'Yellow', value: '#FBBF24', emoji: '🟡' },
  { name: 'Blue', value: '#3B82F6', emoji: '🔵' },
  { name: 'Purple', value: '#8B5CF6', emoji: '🟣' },
  { name: 'Green', value: '#10B981', emoji: '🟢' },
  { name: 'Red', value: '#EF4444', emoji: '🔴' },
  { name: 'Pink', value: '#EC4899', emoji: '🩷' },
];

export default function AppearanceSettings({ preferences, onSave }: Props) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [accentColor, setAccentColor] = useState('#FBBF24');
  const [saving, setSaving] = useState(false);

  // Initialize state when preferences are loaded
  useEffect(() => {
    if (preferences) {
      setTheme(preferences.theme || 'light');
      setAccentColor(preferences.accentColor || '#FBBF24');
    }
  }, [preferences]);

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setSaving(true);
    await onSave({ preferences: { theme: newTheme } });
    setSaving(false);
  };

  const handleColorChange = async (newColor: string) => {
    setAccentColor(newColor);
    setSaving(true);
    await onSave({ preferences: { accentColor: newColor } });
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Appearance</h2>
        <p className="text-sm text-gray-500">Customize how TaskMate looks</p>
      </div>

      {/* Theme Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Theme
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleThemeChange('light')}
            disabled={saving}
            className={`p-4 border-2 rounded-xl transition-all ${
              theme === 'light'
                ? 'border-yellow-400 bg-yellow-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
            <p className="text-sm font-medium text-gray-900">Light</p>
          </button>

          <button
            onClick={() => handleThemeChange('dark')}
            disabled={saving}
            className={`p-4 border-2 rounded-xl transition-all ${
              theme === 'dark'
                ? 'border-yellow-400 bg-yellow-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Moon className="w-6 h-6 mx-auto mb-2 text-gray-700" />
            <p className="text-sm font-medium text-gray-900">Dark</p>
          </button>

          <button
            onClick={() => handleThemeChange('system')}
            disabled={saving}
            className={`p-4 border-2 rounded-xl transition-all ${
              theme === 'system'
                ? 'border-yellow-400 bg-yellow-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Monitor className="w-6 h-6 mx-auto mb-2 text-gray-600" />
            <p className="text-sm font-medium text-gray-900">System</p>
          </button>
        </div>
      </div>

      {/* Accent Color */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Accent Color
        </label>
        <div className="grid grid-cols-6 gap-3">
          {accentColors.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorChange(color.value)}
              disabled={saving}
              className={`relative p-4 border-2 rounded-xl transition-all ${
                accentColor === color.value
                  ? 'border-gray-800 ring-2 ring-gray-300'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ backgroundColor: `${color.value}20` }}
            >
              <div
                className="w-8 h-8 rounded-lg mx-auto"
                style={{ backgroundColor: color.value }}
              />
              {accentColor === color.value && (
                <div className="absolute top-1 right-1">
                  <Check className="w-4 h-4 text-gray-900" />
                </div>
              )}
              <p className="text-xs font-medium text-gray-700 mt-2">{color.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> Theme changes apply immediately. Dark mode is coming in a future update!
        </p>
      </div>
    </div>
  );
}