// app/api/assistant/stats/route.ts
import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { assistantService } from '@/lib/services/assistant.service';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/api-response';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function getUserIdFromRequest(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

// GET: Get assistant conversation statistics
export async function GET(request: NextRequest) {
  return handleApiError(async () => {
    await dbConnect();
    
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return errorResponse(new Error('Unauthorized'), 401);
    }

    const stats = await assistantService.getStats(userId);

    return successResponse({ stats });
  });
}