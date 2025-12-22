// app/api/settings/delete-account/route.ts
// ==========================================
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { verifyToken } from '@/lib/auth/jwt';
import UserModel from '@/models/User.model';
import TaskModel from '@/models/Task.model';
import CategoryModel from '@/models/Category.model';
import NotificationModel from '@/models/Notification.model';

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { password, confirmation } = await request.json();

    // Validate confirmation
    if (confirmation !== 'DELETE') {
      return NextResponse.json(
        { error: 'Please type DELETE to confirm' },
        { status: 400 }
      );
    }

    // Get user with password
    const user = await UserModel.findById(decoded.userId).select('+password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Password is incorrect' },
        { status: 401 }
      );
    }

    // Get statistics before deletion
    const taskCount = await TaskModel.countDocuments({ userId: decoded.userId });
    const categoryCount = await CategoryModel.countDocuments({ userId: decoded.userId });

    // Delete all user data
    await Promise.all([
      TaskModel.deleteMany({ userId: decoded.userId }),
      CategoryModel.deleteMany({ userId: decoded.userId }),
      NotificationModel.deleteMany({ userId: decoded.userId }),
      UserModel.findByIdAndDelete(decoded.userId),
    ]);

    // Clear auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
      stats: {
        tasksDeleted: taskCount,
        categoriesDeleted: categoryCount,
      },
    });

    response.cookies.delete('auth-token');

    return response;
  } catch (error: any) {
    console.error('Delete account error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}