// app/api/auth/verify-code/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { authService } from '@/lib/services/auth.service';

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { message: 'Email and code are required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const result = await authService.verifyCode(email.trim().toLowerCase(), code.trim());

    return NextResponse.json({ success: true, message: result.message });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Verification failed' },
      { status: 400 }
    );
  }
}