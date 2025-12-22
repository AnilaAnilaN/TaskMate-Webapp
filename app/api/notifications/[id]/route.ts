// app/api/notifications/[id]/route.ts
// ==========================================
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { notificationService } from '@/lib/services/notification.service';
import { verifyToken } from '@/lib/auth/jwt';

// PUT - Mark notification as read
export async function PUT(
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

    console.log('Mark as read - User:', decoded.userId, 'Notification ID:', id); // Debug

    if (!id) {
      return NextResponse.json({ error: 'Invalid notification ID' }, { status: 400 });
    }

    const notification = await notificationService.markAsRead(decoded.userId, id);

    return NextResponse.json({ success: true, notification });
  } catch (error: any) {
    console.error('Mark as read error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE - Dismiss notification
export async function DELETE(
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

    console.log('Dismiss - User:', decoded.userId, 'Notification ID:', id); // Debug

    if (!id) {
      return NextResponse.json({ error: 'Invalid notification ID' }, { status: 400 });
    }

    const result = await notificationService.dismissNotification(decoded.userId, id);

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Dismiss notification error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}