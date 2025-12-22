// app/goodbye/page.tsx
// ==========================================
'use client';

import Link from 'next/link';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function GoodbyePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Account Deleted Successfully
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-2">
            Your account and all associated data have been permanently deleted.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            We're sorry to see you go. If you ever want to come back, we'd love to have you!
          </p>

          {/* Emoji */}
          <div className="text-6xl mb-8">👋</div>

          {/* Thank You */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <p className="text-gray-700 font-medium mb-2">Thank you for using TaskMate!</p>
            <p className="text-sm text-gray-500">
              We appreciate the time you spent with us. Your feedback helps us improve.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/register"
              className="block w-full px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-semibold transition-colors"
            >
              Create New Account
            </Link>
            <Link
              href="/"
              className="block w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-400 mt-8">
            Need help? <a href="mailto:support@taskmate.com" className="underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}