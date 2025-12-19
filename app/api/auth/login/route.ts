// app/api/auth/login/route.ts
// ===========================================

import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { authService } from '@/lib/services/auth.service';
import { validateEmail } from '@/lib/validations';
import {
  successResponse,
  handleApiError,
} from '@/lib/utils/api-response';
import type { LoginPayload } from '@/types/auth.types';

export async function POST(request: NextRequest) {
  return handleApiError(async () => {
    await dbConnect();

    const body: LoginPayload = await request.json();
    const { email, password } = body;

    validateEmail(email);
    if (!password) throw new Error('Password is required');

    const user = await authService.login({ email, password });

    const response = successResponse({
      message: 'Login successful',
      user,
    });

    return response;
  });
}
