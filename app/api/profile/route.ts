// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { profileService } from '@/lib/services/profile.service';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('🔵 Profile API called');
    await dbConnect();

    const token = request.cookies.get('auth-token')?.value;
    console.log('🔵 Token exists:', !!token);
    console.log('🔵 Token value (first 20 chars):', token?.substring(0, 20));
    
    if (!token) {
      console.log('❌ No token found');
      return NextResponse.json(
        { error: 'Unauthorized - No token' },
        { status: 401 }
      );
    }

    console.log('🔵 Attempting to verify token...');
    console.log('🔵 JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    const decoded = verifyToken(token);
    console.log('✅ Token verified, userId:', decoded.userId);
    
    const profile = await profileService.getProfile(decoded.userId);
    console.log('✅ Profile fetched:', profile.email);

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error('❌ Profile GET error:', error.message);
    console.error('❌ Full error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: error.message === 'Invalid token' ? 401 : 500 }
    );
  }
}

// PUT endpoint stays the same...
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    const body = await request.json();

    const result = await profileService.updateProfile(decoded.userId, body);

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Profile PUT error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}