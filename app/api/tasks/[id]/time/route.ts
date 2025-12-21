import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { taskService } from '@/lib/services/task.service';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { id } = await params;
    const { minutesToAdd } = await request.json();

    if (!minutesToAdd || minutesToAdd < 0) {
      return NextResponse.json({ error: 'Invalid time value' }, { status: 400 });
    }

    const task = await taskService.incrementActualTime(
      decoded.userId,
      id,
      Math.floor(minutesToAdd)
    );

    return NextResponse.json({ success: true, task });
  } catch (error: any) {
    console.error('Add time error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
