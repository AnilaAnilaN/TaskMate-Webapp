// app/api/assistant/route.ts
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

// GET: Fetch conversation history
export async function GET(request: NextRequest) {
  return handleApiError(async () => {
    await dbConnect();
    
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return errorResponse(new Error('Unauthorized'), 401);
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const messages = await assistantService.getHistory(userId, limit, offset);

    return successResponse({ messages });
  });
}

// POST: Send a message and get AI response
export async function POST(request: NextRequest) {
  return handleApiError(async () => {
    await dbConnect();
    
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return errorResponse(new Error('Unauthorized'), 401);
    }

    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return errorResponse(new Error('Message is required'), 400);
    }

    if (message.length > 5000) {
      return errorResponse(new Error('Message is too long (max 5000 characters)'), 400);
    }

    console.log('🔵 Processing message for user:', userId);
    console.log('🔵 Message:', message.substring(0, 50) + '...');

    try {
      const result = await assistantService.sendMessage(userId, {
        message: message.trim(),
      });

      console.log('✅ AI response generated successfully');

      return successResponse({
        userMessage: result.userMessage,
        aiMessage: result.aiMessage,
      });
    } catch (error: any) {
      console.error('❌ Error in assistant POST:', error);
      
      // Check if it's an API key error
      if (error.message.includes('Invalid Groq API key') || error.message.includes('invalid_api_key')) {
        return errorResponse(
          new Error('AI service configuration error. Please contact support.'),
          500
        );
      }
      
      throw error;
    }
  });
}

// DELETE: Clear all conversation history
export async function DELETE(request: NextRequest) {
  return handleApiError(async () => {
    await dbConnect();
    
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return errorResponse(new Error('Unauthorized'), 401);
    }

    await assistantService.clearHistory(userId);

    return successResponse({ message: 'Conversation history cleared successfully' });
  });
}