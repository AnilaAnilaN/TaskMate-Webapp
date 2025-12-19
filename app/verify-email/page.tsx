// app/verify-email/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Status = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // If no token is present in the URL
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing from the URL.');
      return;
    }

    async function verifyEmail() {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();

        if (res.ok && data.status === 'success') {
          setStatus('success');
          setMessage(data.message || 'Your email has been verified successfully!');
        } else {
          // API returned an error (e.g., invalid or expired token)
          setStatus('error');
          setMessage(
            data.message ||
              data.error ||
              'Verification failed. The link may be invalid or expired.'
          );
        }
      } catch (err) {
        // Network or unexpected error
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again later.');
      }
    }

    verifyEmail();
  }, [token]);

  // Configuration for different states
  const statusConfig = {
    loading: {
      icon: '⏳',
      title: 'Verifying your email...',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
    },
    success: {
      icon: '✅',
      title: 'Email Verified Successfully!',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    error: {
      icon: '❌',
      title: 'Verification Failed',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center">
          {/* Icon */}
          <div className="text-7xl mb-6">{config.icon}</div>

          {/* Title */}
          <h1 className={`text-3xl font-bold ${config.textColor} mb-4`}>
            {config.title}
          </h1>

          {/* Message Box */}
          <div className={`${config.bgColor} rounded-xl p-5`}>
            <p className="text-gray-800 text-base leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Action Buttons - Only show after loading */}
        {status !== 'loading' && (
          <div className="mt-8 space-y-4">
            <Link href="/auth" className="block w-full">
              <button className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-lg font-semibold rounded-xl transition-all duration-200 shadow-md">
                {status === 'success' ? 'Go to Login' : 'Back to Login'}
              </button>
            </Link>

            <Link href="/" className="block w-full">
              <button className="w-full py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 text-lg font-semibold rounded-xl transition-all duration-200">
                Go to Home
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}