// app/api/assistant/stream/route.ts
import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { assistantService } from '@/lib/services/assistant.service';
import { groqService } from '@/lib/services/groq.service';
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

// POST: Stream AI response
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Save user message
    await assistantService.saveMessage(userId, 'user', message.trim());

    // Get conversation context
    const context = await assistantService.getRecentContext(userId, 8);

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = '';
          const startTime = Date.now();

          for await (const chunk of groqService.generateStreamingResponse(
            message.trim(),
            context
          )) {
            fullResponse += chunk;
            
            // Send chunk to client
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: chunk, done: false })}\n\n`)
            );
          }

          // Save complete AI response
          const responseTime = Date.now() - startTime;
          await assistantService.saveMessage(userId, 'assistant', fullResponse, {
            model: 'llama-3.3-70b-versatile',
            responseTime,
            tokens: fullResponse.length,
          });

          // Send completion signal
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: '', done: true })}\n\n`)
          );
          
          controller.close();
        } catch (error: any) {
          console.error('Streaming error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: error.message, done: true })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Stream route error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}