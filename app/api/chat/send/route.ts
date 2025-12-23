// app/api/chat/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/db/mongoose';
import MessageModel from '@/models/Message.model';
import ConversationModel from '@/models/Conversation.model';
import { publishMessage } from '@/lib/ably/ablyServer';

export async function POST(request: NextRequest) {
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
    const userId = new mongoose.Types.ObjectId(decoded.userId);

    const body = await request.json();
    const { conversationId, recipientId, text } = body;

    if (!conversationId || !recipientId || !text?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const recipientObjectId = new mongoose.Types.ObjectId(recipientId);
    const conversationObjectId = new mongoose.Types.ObjectId(conversationId);

    // Create message in database
    const message = await MessageModel.create({
      conversationId: conversationObjectId,
      senderId: userId,
      recipientId: recipientObjectId,
      text: text.trim(),
      timestamp: new Date(),
      isRead: false,
    });

    // Update conversation's last message
    await ConversationModel.findByIdAndUpdate(conversationObjectId, {
      lastMessage: {
        text: text.trim(),
        senderId: userId,
        timestamp: message.timestamp,
      },
      $inc: {
        [`unreadCount.${recipientId}`]: 1,
      },
    });

    // Populate sender info
    const populatedMessage = await message.populate('senderId', 'name profileImage');

    // Publish to Ably real-time channel
    const channelName = `chat:${conversationId}`;
    await publishMessage(channelName, 'message', populatedMessage.toJSON());

    return NextResponse.json({
      message: populatedMessage.toJSON(),
      success: true,
    });
  } catch (error) {
    console.error('Failed to send message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}