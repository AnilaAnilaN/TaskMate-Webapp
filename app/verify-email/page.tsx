// app/verify-email/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Status = 'idle' | 'loading' | 'success' | 'error';

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');

  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !code.trim()) {
      setStatus('error');
      setMessage('Please enter the 6-digit code.');
      return;
    }

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setStatus('error');
      setMessage('Code must be exactly 6 digits.');
      return;
    }

    setStatus('loading');
    setMessage('Verifying your code...');

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: code.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Your email has been verified successfully!');
      } else {
        setStatus('error');
        setMessage(data.message || 'Invalid or expired code. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setMessage('');
    setCode('');
  };

  // Config for UI states
  const config = {
    idle: { icon: '📧', title: 'Enter Verification Code', color: 'text-gray-700', bg: 'bg-gray-100' },
    loading: { icon: '⏳', title: 'Verifying...', color: 'text-indigo-700', bg: 'bg-indigo-50' },
    success: { icon: '✅', title: 'Verified!', color: 'text-green-700', bg: 'bg-green-50' },
    error: { icon: '❌', title: 'Verification Failed', color: 'text-red-700', bg: 'bg-red-50' },
  }[status];

  // If no email in URL
  if (!email) {
    return (
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 text-center">
        <div className="text-8xl mb-6">🤔</div>
        <h1 className="text-3xl font-bold text-red-600 mb-4">Invalid Link</h1>
        <p className="text-gray-600 mb-8">This verification link is missing required information.</p>
        <Link href="/auth">
          <button className="w-full btn-primary text-lg py-4">
            Back to Signup / Login
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 text-center">
      <div className="text-8xl mb-8">{config.icon}</div>
      <h1 className={`text-3xl font-bold ${config.color} mb-6`}>{config.title}</h1>

      <div className={`${config.bg} rounded-2xl p-6 mb-8`}>
        <p className="text-gray-700 text-lg leading-relaxed">
          {status === 'idle' && (
            <>
              We've sent a <strong>6-digit code</strong> to:<br />
              <span className="font-semibold text-indigo-600">{email}</span>
              <br /><br />
              Please enter it below to verify your account.
            </>
          )}
          {status === 'loading' && <span className="font-medium">{message}</span>}
          {status === 'success' && <span className="font-medium">{message}</span>}
          {status === 'error' && <span className="font-medium text-red-600">{message}</span>}
        </p>
      </div>

      {status !== 'success' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="w-full text-center text-4xl tracking-widest font-mono py-6 bg-gray-50 rounded-2xl border-4 border-gray-300 focus:border-indigo-500 focus:outline-none transition"
            disabled={status === 'loading'}
            autoFocus
          />

          <button
            type="submit"
            disabled={status === 'loading' || code.length !== 6}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white text-xl font-bold rounded-2xl transition disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>
      )}

      {status === 'success' && (
        <div className="mt-8">
          <button
            onClick={() => router.push('/auth')}
            className="w-full btn-primary text-xl py-5 shadow-lg"
          >
            Go to Login
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-8">
          <button
            onClick={resetForm}
            className="w-full py-5 border-4 border-gray-300 hover:bg-gray-50 text-gray-700 text-xl font-bold rounded-2xl transition"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 px-4">
      <VerifyEmailForm />
    </div>
  );
}