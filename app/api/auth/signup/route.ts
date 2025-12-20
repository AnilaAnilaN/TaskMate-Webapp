// app/api/auth/signup/route.ts
// ==========================================
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { authService } from '@/lib/services/auth.service';
import { categoryService } from '@/lib/services/category.service';
import { validateName, validateEmail, validatePassword } from '@/lib/validations';
import type { SignupPayload } from '@/types/auth.types';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body: SignupPayload = await request.json();
    const { name, email, password } = body;

    validateName(name);
    validateEmail(email);
    validatePassword(password);

    const result = await authService.signup({ name, email, password });
    
    const UserModel = (await import('@/models/User.model')).default;
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    
    if (user) {
      await categoryService.createDefaultCategories(user._id.toString());
    }

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}