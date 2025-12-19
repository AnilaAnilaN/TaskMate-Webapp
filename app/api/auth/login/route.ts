// app/api/auth/login/route.ts
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { dbConnect } from '@/lib/db/mongoose';
import { authService } from '@/lib/services/auth.service';
import { validateEmail } from '@/lib/validations';
import { successResponse, handleApiError } from '@/lib/utils/api-response';
import type { LoginPayload } from '@/types/auth.types';

export async function POST(request: NextRequest) {
  return handleApiError(async () => {
    await dbConnect();

    const body: LoginPayload = await request.json();
    const { email, password } = body;

    // Validation
    validateEmail(email);
    if (!password) {
      throw new Error('Password is required');
    }

    // Login and get JWT + user data
    const { user, token } = await authService.login({ email, password });

    // Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days (optional, recommended)
    });

    return successResponse({
      message: 'Login successful',
      user,
    });
  });
}