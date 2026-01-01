// lib/utils/api-response.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export class ApiError extends Error {
  constructor(public message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
  }
}

export const successResponse = async (data: any, status = 200) => {
  const response = NextResponse.json({ success: true, ...data }, { status });

  // Copy cookies from the cookie store to the response
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  allCookies.forEach(cookie => {
    response.cookies.set(cookie.name, cookie.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  });

  return response;
};

export const errorResponse = (error: any, status = 500) => {
  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred';
  console.error('API Error:', message, error);

  return NextResponse.json(
    { success: false, error: message },
    { status: error instanceof ApiError ? error.statusCode : status }
  );
};

export const validationErrorResponse = (errors: any[]) => {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      details: errors
    },
    { status: 400 }
  );
};

export const handleApiError = async (fn: Function) => {
  try {
    return await fn();
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return errorResponse(error, 400);
    }
    if (error.message.includes('already exists')) {
      return errorResponse(error, 409);
    }
    if (
      error.message.includes('Invalid') ||
      error.message.includes('not found')
    ) {
      return errorResponse(error, 404);
    }
    if (error.message.includes('verify your email')) {
      return errorResponse(error, 403);
    }
    return errorResponse(error, 500);
  }
};

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateEmail = (email: string): void => {
  if (!email || typeof email !== 'string') {
    throw new ValidationError('Email is required');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
};

export const validatePassword = (password: string, minLength = 8): void => {
  if (!password || typeof password !== 'string') {
    throw new ValidationError('Password is required');
  }
  if (password.length < minLength) {
    throw new ValidationError(`Password must be at least ${minLength} characters`);
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    throw new ValidationError('Password must contain uppercase, lowercase, and number');
  }
};

export const validateName = (name: string): void => {
  if (!name || typeof name !== 'string') {
    throw new ValidationError('Name is required');
  }
  if (name.trim().length < 2) {
    throw new ValidationError('Name must be at least 2 characters');
  }
};