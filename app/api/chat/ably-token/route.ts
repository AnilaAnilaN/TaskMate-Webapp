// ============================================
// 2. app/api/chat/ably-token/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { generateAblyToken } from '@/lib/ably/ablyServer';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    // Generate Ably token with user ID as clientId
    const ablyTokenRequest = await generateAblyToken(decoded.userId);

    return NextResponse.json({ tokenRequest: ablyTokenRequest });
  } catch (error) {
    console.error('Failed to generate Ably token:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth token' },
      { status: 500 }
    );
  }
}