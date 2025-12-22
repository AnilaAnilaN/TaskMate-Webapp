// app/api/notifications/mark-all-read/route.ts
// ==========================================
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { notificationService } from '@/lib/services/notification.service';
import { verifyToken } from '@/lib/auth/jwt';

// PUT - Mark all notifications as read
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);

    console.log('Mark all as read - User:', decoded.userId); // Debug

    const result = await notificationService.markAllAsRead(decoded.userId);

    return NextResponse.json({
      success: true,
      message: `Marked ${result.modifiedCount} notifications as read`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error: any) {
    console.error('Mark all as read error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}