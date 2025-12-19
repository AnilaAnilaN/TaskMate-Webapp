import Link from 'next/link';

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  const status = searchParams?.status;

  const statusConfig = {
    success: {
      icon: '✅',
      title: 'Email Verified!',
      message: 'Your email has been successfully verified. You can now log in to your account.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    expired: {
      icon: '⏰',
      title: 'Link Expired',
      message:
        'This verification link has expired. Please sign up again to receive a new verification email.',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    invalid: {
      icon: '❌',
      title: 'Invalid Link',
      message:
        'This verification link is invalid. Please check the link or request a new verification email.',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  };

  const config = status && status in statusConfig 
    ? statusConfig[status as keyof typeof statusConfig]
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {config ? (
          <>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{config.icon}</div>
              <h1 className={`text-3xl font-bold ${config.color} mb-2`}>{config.title}</h1>
              <div className={`${config.bgColor} rounded-lg p-4 mt-4`}>
                <p className="text-gray-700">{config.message}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/auth" className="block">
                <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all">
                  {status === 'success' ? 'Go to Login' : 'Back to Auth'}
                </button>
              </Link>
              <Link href="/" className="block">
                <button className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all">
                  Go to Home
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying your email...</p>
          </div>
        )}
      </div>
    </div>
  );
}
