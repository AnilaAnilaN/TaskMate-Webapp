// app/api/notifications/route.ts
// ==========================================
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { notificationService } from '@/lib/services/notification.service';
import { verifyToken } from '@/lib/auth/jwt';

// GET - Get all notifications
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { searchParams } = new URL(request.url);

    const isReadParam = searchParams.get('isRead');
    const limit = searchParams.get('limit');

    const filters: any = {};

    if (isReadParam !== null) {
      filters.isRead = isReadParam === 'true';
    }

    if (limit) {
      filters.limit = parseInt(limit);
    }

    const notifications = await notificationService.getUserNotifications(
      decoded.userId,
      filters
    );

    const unreadCount = await notificationService.getUnreadCount(decoded.userId);

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Check and create notifications for due tasks
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);

    const notifications = await notificationService.checkAndCreateTaskNotifications(
      decoded.userId
    );

    return NextResponse.json({
      success: true,
      notifications,
      count: notifications.length,
    });
  } catch (error: any) {
    console.error('Create notifications error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}