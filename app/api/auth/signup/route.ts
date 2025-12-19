// app/api/auth/signup/route.ts
// ===========================================

import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { authService } from '@/lib/services/auth.service';
import {
  validateEmail,
  validatePassword,
  validateName,
} from '@/lib/validations';
import {
  successResponse,
  handleApiError,
} from '@/lib/utils/api-response';
import type { SignupPayload } from '@/types/auth.types';

export async function POST(request: NextRequest) {
  return handleApiError(async () => {
    await dbConnect();

    const body: SignupPayload = await request.json();
    const { name, email, password } = body;

    validateName(name);
    validateEmail(email);
    validatePassword(password);

    const result = await authService.signup({ name, email, password });

    return successResponse(result, 201);
  });
}