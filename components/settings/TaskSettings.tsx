// components/settings/TaskSettings.tsx
// ==========================================
'use client';

import { useState, useEffect } from 'react';
import { CheckSquare, AlertTriangle } from 'lucide-react';

interface Props {
  preferences: {
    defaultPriority: 'low' | 'medium' | 'high' | 'urgent';
    confirmDelete: boolean;
  };
  onSave: (updates: any) => Promise<void>;
}

export default function TaskSettings({ preferences, onSave }: Props) {
  const [defaultPriority, setDefaultPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [confirmDelete, setConfirmDelete] = useState(true);
  const [saving, setSaving] = useState(false);

  // Initialize state when preferences are loaded
  useEffect(() => {
    if (preferences) {
      setDefaultPriority(preferences.defaultPriority || 'medium');
      setConfirmDelete(preferences.confirmDelete ?? true);
    }
  }, [preferences]);

  const handlePriorityChange = async (newPriority: 'low' | 'medium' | 'high' | 'urgent') => {
    setDefaultPriority(newPriority);
    setSaving(true);
    await onSave({ preferences: { defaultPriority: newPriority } });
    setSaving(false);
  };

  const handleToggleConfirmDelete = async () => {
    const newValue = !confirmDelete;
    setConfirmDelete(newValue);
    setSaving(true);
    await onSave({ preferences: { confirmDelete: newValue } });
    setSaving(false);
  };

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-200' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Task Preferences</h2>
        <p className="text-sm text-gray-500">Customize your task management experience</p>
      </div>

      {/* Default Priority */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <CheckSquare className="w-4 h-4" />
          Default Task Priority
        </label>
        <p className="text-sm text-gray-500 mb-3">
          New tasks will be set to this priority by default
        </p>
        <div className="grid grid-cols-2 gap-3">
          {priorities.map((priority) => (
            <button
              key={priority.value}
              onClick={() => handlePriorityChange(priority.value as any)}
              disabled={saving}
              className={`p-4 border-2 rounded-xl transition-all ${
                defaultPriority === priority.value
                  ? 'border-yellow-400 ring-2 ring-yellow-100'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className={`px-3 py-2 rounded-lg font-medium text-sm ${priority.color} border-2 inline-block`}
              >
                {priority.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Confirm Delete */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <p className="font-medium text-gray-900">Confirm Before Deleting</p>
            </div>
            <p className="text-sm text-gray-500">
              Show confirmation dialog when deleting tasks
            </p>
          </div>
          <button
            onClick={handleToggleConfirmDelete}
            disabled={saving}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              confirmDelete ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
                confirmDelete ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-900">
          <strong>💡 Tip:</strong> More task customization options (default view, sorting, auto-archive)
          are coming in future updates!
        </p>
      </div>
    </div>
  );
}