// app/reset-password/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('error');

  useEffect(() => {
    const tokenParam = searchParams?.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      router.push('/auth');
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password.length < 8) {
      setMessage('Password must be at least 8 characters');
      setMessageType('error');
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setMessage('Password must contain uppercase, lowercase, and number');
      setMessageType('error');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setMessage(data.message || 'Password reset successfully!');
      setMessageType('success');

      setTimeout(() => router.push('/auth'), 2000);
    } catch (error: any) {
      setMessage(error.message || 'An error occurred');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔐</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Organizo</span>
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Reset password</h2>
            <p className="text-gray-500 text-sm mt-1">Enter your new password below</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Min 8 chars with uppercase, lowercase & number
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            {message && (
              <div className={`p-4 rounded-xl ${
                messageType === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="text-sm font-medium flex items-center">
                  <span className="text-lg mr-2">{messageType === 'success' ? '✅' : '⚠️'}</span>
                  {message}
                </p>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/auth')}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

// app/auth/page.tsx - Update to match theme
// Just change the background from gradient to solid:
// className="min-h-screen grid place-items-center bg-gray-50 p-6"

// app/dashboard/page.tsx - Create this file
// Copy the Dashboard component from the artifact above