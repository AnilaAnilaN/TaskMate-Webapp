// app/api/chat/conversations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/db/mongoose';
import ConversationModel from '@/models/Conversation.model';
import UserModel from '@/models/User.model';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get auth token
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    const userId = new mongoose.Types.ObjectId(decoded.userId);

    // Get all conversations for this user
    const conversations = await ConversationModel.find({
      participants: userId,
    })
      .populate('participants', 'name email profileImage')
      .sort({ 'lastMessage.timestamp': -1 })
      .lean();

    // Calculate unread count for current user
    const conversationsWithUnread = conversations.map((conv: any) => {
      const otherParticipant = conv.participants.find(
        (p: any) => p._id.toString() !== userId.toString()
      );

      // Handle unreadCount as Map or Object
      let unreadCount = 0;
      if (conv.unreadCount instanceof Map) {
        unreadCount = conv.unreadCount.get(userId.toString()) || 0;
      } else if (conv.unreadCount) {
        unreadCount = (conv.unreadCount as any)[userId.toString()] || 0;
      }

      return {
        ...conv,
        id: conv._id.toString(),
        otherUser: {
          id: otherParticipant._id.toString(),
          name: otherParticipant.name,
          email: otherParticipant.email,
          profileImage: otherParticipant.profileImage,
        },
        unreadCount,
      };
    });

    return NextResponse.json({
      conversations: conversationsWithUnread,
    });
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// Create or get conversation with a user
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
    const { recipientId } = body;

    if (!recipientId) {
      return NextResponse.json(
        { error: 'Recipient ID is required' },
        { status: 400 }
      );
    }

    const recipientObjectId = new mongoose.Types.ObjectId(recipientId);

    // Check if conversation already exists
    let conversation = await ConversationModel.findOne({
      participants: { $all: [userId, recipientObjectId] },
    }).populate('participants', 'name email profileImage');

    // Create new conversation if it doesn't exist
    if (!conversation) {
      conversation = await ConversationModel.create({
        participants: [userId, recipientObjectId],
        unreadCount: {
          [userId.toString()]: 0,
          [recipientObjectId.toString()]: 0,
        },
      });

      conversation = await conversation.populate(
        'participants',
        'name email profileImage'
      );
    }

    const conversationObj = conversation.toJSON();
    const otherParticipant = conversationObj.participants.find(
      (p: any) => p.id !== userId.toString()
    );

    return NextResponse.json({
      conversation: {
        ...conversationObj,
        otherUser: otherParticipant,
        unreadCount: (conversationObj.unreadCount as any)?.[userId.toString()] || 0,
      },
    });
  } catch (error) {
    console.error('Failed to create/get conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}