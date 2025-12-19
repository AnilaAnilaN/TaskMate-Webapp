import { NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(public message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
  }
}

export const successResponse = (data: any, status = 200) => {
  return NextResponse.json({ success: true, ...data }, { status });
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
