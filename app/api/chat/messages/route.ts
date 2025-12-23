// ============================================
// 3. app/api/chat/messages/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/db/mongoose';
import MessageModel from '@/models/Message.model';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET as string);

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const before = searchParams.get('before');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    const query: any = {
      conversationId: new mongoose.Types.ObjectId(conversationId),
    };

    if (before) {
      query.timestamp = { $lt: new Date(before) };
    }

    const messages = await MessageModel.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('senderId', 'name profileImage')
      .lean();

    return NextResponse.json({
      messages: messages.reverse(),
    });
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}