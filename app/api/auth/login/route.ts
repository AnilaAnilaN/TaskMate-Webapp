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

    validateEmail(email);
    if (!password) throw new Error('Password is required');

    const { user, token } = await authService.login({ email, password });

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return successResponse({
      message: 'Login successful',
      user,
    });
  });
}
