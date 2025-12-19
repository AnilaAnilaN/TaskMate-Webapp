// app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { authService } from '@/lib/services/auth.service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ status: 'invalid', message: 'No token provided' }, { status: 400 });
  }

  try {
    await dbConnect();
    const result = await authService.verifyEmail(token);
    return NextResponse.json({ status: 'success', message: result.message });
  } catch (err: any) {
    console.error('Email verification error:', err);
    return NextResponse.json({ status: 'error', message: err.message || 'Token invalid or expired' }, { status: 400 });
  }
}