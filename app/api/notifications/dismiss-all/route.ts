// app/api/notifications/dismiss-all/route.ts
// ==========================================
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { notificationService } from '@/lib/services/notification.service';
import { verifyToken } from '@/lib/auth/jwt';

// DELETE - Dismiss all notifications
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);

    const result = await notificationService.dismissAll(decoded.userId);

    return NextResponse.json({
      success: true,
      message: `Dismissed ${result.modifiedCount} notifications`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error: any) {
    console.error('Dismiss all error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}