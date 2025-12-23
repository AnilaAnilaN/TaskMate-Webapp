
// ============================================
// 4. app/api/chat/messages/[id]/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/db/mongoose';
import MessageModel from '@/models/Message.model';
import ConversationModel from '@/models/Conversation.model';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    const userId = decoded.userId;

    const { id: conversationId } = await params;

    // Mark all messages in conversation as read
    const result = await MessageModel.updateMany(
      {
        conversationId: new mongoose.Types.ObjectId(conversationId),
        recipientId: new mongoose.Types.ObjectId(userId),
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    // Reset unread count in conversation
    await ConversationModel.findByIdAndUpdate(conversationId, {
      $set: {
        [`unreadCount.${userId}`]: 0,
      },
    });

    return NextResponse.json({
      success: true,
      markedRead: result.modifiedCount,
    });
  } catch (error) {
    console.error('Failed to mark messages as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    );
  }
}