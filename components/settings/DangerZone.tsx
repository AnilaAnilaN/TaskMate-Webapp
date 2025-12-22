// components/settings/DangerZone.tsx
// ==========================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface Props {
  profile: {
    name: string;
    email: string;
  };
}

export default function DangerZone({ profile }: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setError('');

    if (!password) {
      setError('Password is required');
      return;
    }

    if (confirmation !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch('/api/settings/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, confirmation }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to goodbye page
        router.push('/goodbye');
      } else {
        setError(data.error || 'Failed to delete account');
        setDeleting(false);
      }
    } catch (error) {
      setError('Failed to delete account');
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-red-600 mb-1 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </h2>
        <p className="text-sm text-gray-500">Irreversible actions that affect your account</p>
      </div>

      {/* Warning Box */}
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-900 mb-2">Delete Account</h3>
            <p className="text-sm text-red-700 mb-4">
              Once you delete your account, there is no going back. This action will:
            </p>
            <ul className="text-sm text-red-700 space-y-1 mb-4 list-disc list-inside">
              <li>Permanently delete all your tasks and categories</li>
              <li>Remove all your notifications and settings</li>
              <li>Delete your profile and personal information</li>
              <li>Cancel any active subscriptions (if applicable)</li>
            </ul>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete My Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                Delete Account
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError('');
                  setPassword('');
                  setConfirmation('');
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Warning */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-900 font-semibold mb-2">
                  ⚠️ This action cannot be undone!
                </p>
                <p className="text-sm text-red-700">
                  All your data will be permanently deleted. We recommend downloading your data
                  before proceeding.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Account Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">You are deleting the account:</p>
                <p className="font-semibold text-gray-900">{profile.name}</p>
                <p className="text-sm text-gray-600">{profile.email}</p>
              </div>

              {/* Password Confirmation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your password to confirm
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none"
                  placeholder="Your password"
                />
              </div>

              {/* Type DELETE Confirmation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="font-bold text-red-600">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none font-mono"
                  placeholder="DELETE"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting || !password || confirmation !== 'DELETE'}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? 'Deleting Account...' : 'Delete My Account Forever'}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setError('');
                    setPassword('');
                    setConfirmation('');
                  }}
                  disabled={deleting}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}