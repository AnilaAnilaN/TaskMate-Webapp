// components/AuthForm.tsx - Updated with new theme
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthMode = 'login' | 'signup' | 'forgot';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function AuthForm({ initialMode = 'login' }: { initialMode?: AuthMode }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (mode === 'signup') {
      if (!formData.name.trim() || formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (mode !== 'forgot') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (mode === 'signup') {
        if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          newErrors.password = 'Password must contain uppercase, lowercase, and number';
        }
      }

      if (mode === 'signup' && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      let endpoint = '/api/auth/';
      let payload: any = { email: formData.email };

      switch (mode) {
        case 'signup':
          endpoint += 'signup';
          payload = { name: formData.name, email: formData.email, password: formData.password };
          break;
        case 'login':
          endpoint += 'login';
          payload = { email: formData.email, password: formData.password };
          break;
        case 'forgot':
          endpoint += 'forgot-password';
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      setMessage({ type: 'success', text: data.message || 'Success!' });

      if (mode === 'login') {
        setTimeout(() => router.push('/dashboard'), 1500);
      } else if (mode === 'signup') {
        setTimeout(() => setMode('login'), 2000);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
    setMessage(null);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
            <span className="text-2xl">😊</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">Organizo</span>
        </div>
      </div>

      {/* Mode Toggle */}
      {mode !== 'forgot' && (
        <div className="flex rounded-full bg-gray-100 p-1 mb-8">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 py-2.5 rounded-full font-medium transition-all text-sm ${
              mode === 'login'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`flex-1 py-2.5 rounded-full font-medium transition-all text-sm ${
              mode === 'signup'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign Up
          </button>
        </div>
      )}

      {/* Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === 'login' && 'Welcome back'}
          {mode === 'signup' && 'Create account'}
          {mode === 'forgot' && 'Reset password'}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {mode === 'login' && 'Please enter your details'}
          {mode === 'signup' && 'Start organizing your tasks'}
          {mode === 'forgot' && "We'll send you a reset link"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.name ? 'border-red-500' : 'border-gray-200'
              } focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition bg-gray-50`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.email ? 'border-red-500' : 'border-gray-200'
            } focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition bg-gray-50`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {mode !== 'forgot' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.password ? 'border-red-500' : 'border-gray-200'
              } focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition bg-gray-50`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
        )}

        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
              } focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition bg-gray-50`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        )}

        {/* Forgot Password Link */}
        {mode === 'login' && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => switchMode('forgot')}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Back to Login */}
        {mode === 'forgot' && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to login
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            <>
              {mode === 'login' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgot' && 'Send Reset Link'}
            </>
          )}
        </button>

        {/* Message Display */}
        {message && (
          <div
            className={`p-4 rounded-xl ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <div className="flex items-start">
              <span className="text-lg mr-2">
                {message.type === 'success' ? '✅' : '⚠️'}
              </span>
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        )}
      </form>

      {/* Footer Links */}
      {mode === 'login' && (
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => switchMode('signup')}
            className="text-gray-900 hover:text-gray-700 font-semibold"
          >
            Sign up
          </button>
        </p>
      )}

      {mode === 'signup' && (
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <button
            onClick={() => switchMode('login')}
            className="text-gray-900 hover:text-gray-700 font-semibold"
          >
            Sign in
          </button>
        </p>
      )}
    </div>
  );
}