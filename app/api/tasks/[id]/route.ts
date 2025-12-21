// ==========================================
// FIXED: app/api/tasks/[id]/route.ts
// ==========================================
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { taskService } from '@/lib/services/task.service';
import { verifyToken } from '@/lib/auth/jwt';

// GET - Get single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ Changed to Promise
) {
  try {
    await dbConnect();

    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { id } = await params;  // ✅ Await the params

    const task = await taskService.getTask(decoded.userId, id);

    return NextResponse.json({ success: true, task });
  } catch (error: any) {
    console.error('Get task error:', error);  // ✅ Added logging
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

// PUT - Update task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ Changed to Promise
) {
  try {
    await dbConnect();

    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { id } = await params;  // ✅ Await the params
    const body = await request.json();

    const task = await taskService.updateTask(decoded.userId, id, body);

    return NextResponse.json({ success: true, task });
  } catch (error: any) {
    console.error('Update task error:', error);  // ✅ Added logging
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ Changed to Promise
) {
  try {
    await dbConnect();

    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { id } = await params;  // ✅ Await the params
    const result = await taskService.deleteTask(decoded.userId, id);

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Delete task error:', error);  // ✅ Added logging
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}