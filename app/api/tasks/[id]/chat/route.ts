// app/api/tasks/[id]/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { taskChatService } from '@/lib/services/task-chat.service';
import { taskService } from '@/lib/services/task.service';
import { verifyToken } from '@/lib/auth/jwt';

async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return null;
    const decoded = verifyToken(token);
    return decoded.userId;
  } catch {
    return null;
  }
}

// GET: Fetch chat history for a task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: taskId } = await params;
    
    // Verify task belongs to user
    const task = await taskService.getTask(userId, taskId);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const messages = await taskChatService.getTaskChatHistory(taskId, userId);

    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    console.error('Get task chat error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Send a message and get AI response
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: taskId } = await params;
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json({ error: 'Message too long (max 2000 characters)' }, { status: 400 });
    }

    // Get task details for context
    const task = await taskService.getTask(userId, taskId);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Build task context
    const taskContext = {
      id: task.id,
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      categoryName: task.categoryId?.name,
      estimatedTime: task.estimatedTime,
      actualTime: task.actualTime,
    };

    console.log('🔵 Sending message to task chat:', { taskId, message: message.substring(0, 50) });

    const result = await taskChatService.sendMessage(
      taskId,
      userId,
      message.trim(),
      taskContext
    );

    console.log('✅ Task chat response generated');

    return NextResponse.json({
      success: true,
      userMessage: result.userMessage,
      aiMessage: result.aiMessage,
    });
  } catch (error: any) {
    console.error('❌ Task chat error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Clear chat history for a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: taskId } = await params;
    
    // Verify task belongs to user
    const task = await taskService.getTask(userId, taskId);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    await taskChatService.clearTaskChat(taskId, userId);

    return NextResponse.json({ success: true, message: 'Chat history cleared' });
  } catch (error: any) {
    console.error('Clear task chat error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}