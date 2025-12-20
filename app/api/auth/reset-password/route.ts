// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { authService } from '@/lib/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { token, userId, newPassword } = body;

    // Basic validation - don't call validatePassword here!
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }
    
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json(
        { success: false, error: 'New password is required' },
        { status: 400 }
      );
    }

    // Basic password validation inline
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return NextResponse.json(
        { success: false, error: 'Password must contain uppercase, lowercase, and number' },
        { status: 400 }
      );
    }

    // Call the service to reset password
    const result = await authService.resetPassword(token, userId, newPassword);

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to reset password' 
      },
      { status: error.message?.includes('Invalid or expired') ? 400 : 500 }
    );
  }
}