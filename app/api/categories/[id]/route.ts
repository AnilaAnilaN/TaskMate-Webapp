// ==========================================
// FIXED: app/api/categories/[id]/route.ts
// ==========================================
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { categoryService } from '@/lib/services/category.service';
import { verifyToken } from '@/lib/auth/jwt';

// PUT - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ Changed to Promise
) {
  try {
    await dbConnect();

    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { id } = await params;  // ✅ Await the params
    const body = await request.json();

    const category = await categoryService.updateCategory(
      decoded.userId,
      id,
      body
    );

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error('Update category error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ Changed to Promise
) {
  try {
    await dbConnect();

    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { id } = await params;  // ✅ Await the params

    const result = await categoryService.deleteCategory(decoded.userId, id);

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Delete category error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}