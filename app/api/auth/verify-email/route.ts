import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { dbConnect } from '@/lib/db/mongoose';
import { authService } from '@/lib/services/auth.service';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return redirect('/verify-email?status=invalid');
    }

    try {
      await authService.verifyEmail(token);
      return redirect('/verify-email?status=success');
    } catch (error: any) {
      if (error.message.includes('expired')) {
        return redirect('/verify-email?status=expired');
      }
      return redirect('/verify-email?status=invalid');
    }
  } catch (error) {
    return redirect('/verify-email?status=invalid');
  }
}
