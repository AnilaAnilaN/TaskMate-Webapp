// app/not-found.tsx
// ==========================================
import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-yellow-400">404</h1>
          <div className="text-6xl mb-4">🔍</div>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Oops! The page you're looking for doesn't exist. 
          It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Link>
          <Link
            href="/tasks"
            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium border border-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            View Tasks
          </Link>
        </div>

        {/* Quick Links */}
        <div className="border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 mb-4">Quick Links:</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/dashboard" className="text-yellow-600 hover:text-yellow-700 font-medium">
              Dashboard
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/tasks" className="text-yellow-600 hover:text-yellow-700 font-medium">
              Tasks
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/dashboard/categories" className="text-yellow-600 hover:text-yellow-700 font-medium">
              Categories
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/profile" className="text-yellow-600 hover:text-yellow-700 font-medium">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}