import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { authService } from '@/lib/services/auth.service';
import { validateEmail } from '@/lib/validations';
import { successResponse, handleApiError } from '@/lib/utils/api-response';

export async function POST(request: NextRequest) {
  return handleApiError(async () => {
    await dbConnect();

    const body = await request.json();
    const { email } = body;

    validateEmail(email);

    const result = await authService.forgotPassword(email);

    return successResponse(result);
  });
}