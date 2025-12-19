// app/api/auth/reset-password/route.ts
import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import UserModel from '@/models/User.model';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { token, newPassword } = body;

    console.log('🔍 Direct Reset - Received:', { 
      hasToken: !!token, 
      hasPassword: !!newPassword,
      passwordLength: newPassword?.length 
    });

    // Simple validation
    if (!token) {
      return NextResponse.json({ success: false, error: 'Token required' }, { status: 400 });
    }
    
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ success: false, error: 'Password must be 8+ characters' }, { status: 400 });
    }

    // Find user directly
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpiry');

    if (!user) {
      console.log('❌ User not found or token expired');
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 400 });
    }

    // Update password directly
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    console.log('✅ Password reset successful!');

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully!'
    });

  } catch (error: any) {
    console.error('❌ Reset error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Server error' 
    }, { status: 500 });
  }
}