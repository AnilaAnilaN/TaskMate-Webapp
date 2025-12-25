// lib/services/assistant.service.ts
import mongoose from 'mongoose';
import AssistantMessageModel from '@/models/AssistantMessage.model';
import { groqService } from './groq.service';
import type { AssistantMessage, SendMessagePayload } from '@/types/assistant.types';

class AssistantService {
  /**
   * Save a message to database
   */
  async saveMessage(
    userId: string,
    role: 'user' | 'assistant',
    content: string,
    metadata?: any
  ): Promise<AssistantMessage> {
    const message = await AssistantMessageModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      role,
      content,
      metadata,
      timestamp: new Date(),
    });

    // Manually transform to match AssistantMessage type
    return {
      id: message._id.toString(),
      userId: message.userId.toString(),
      role: message.role,
      content: message.content,
      timestamp: message.timestamp,
      metadata: message.metadata,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }

  /**
   * Get conversation history for a user
   */
  async getHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<AssistantMessage[]> {
    const messages = await AssistantMessageModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    return messages.reverse().map((msg: any) => ({
      id: msg._id.toString(),
      userId: msg.userId.toString(),
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
      metadata: msg.metadata,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
    }));
  }

  /**
   * Get recent conversation context (last N messages)
   */
  async getRecentContext(userId: string, limit: number = 10): Promise<AssistantMessage[]> {
    const messages = await AssistantMessageModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return messages.reverse().map((msg: any) => ({
      id: msg._id.toString(),
      userId: msg.userId.toString(),
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
      metadata: msg.metadata,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
    }));
  }

  /**
   * Send a message and get AI response
   */
  async sendMessage(
    userId: string,
    payload: SendMessagePayload
  ): Promise<{ userMessage: AssistantMessage; aiMessage: AssistantMessage }> {
    const { message, conversationContext } = payload;

    // Save user message
    const userMessage = await this.saveMessage(userId, 'user', message);

    // Get recent context if not provided
    const context = conversationContext || (await this.getRecentContext(userId, 8));

    // Generate AI response
    const { text, metadata } = await groqService.generateResponse(
      message,
      context
    );

    // Save AI response
    const aiMessage = await this.saveMessage(userId, 'assistant', text, metadata);

    return { userMessage, aiMessage };
  }

  /**
   * Delete all conversation history for a user
   */
  async clearHistory(userId: string): Promise<void> {
    await AssistantMessageModel.deleteMany({
      userId: new mongoose.Types.ObjectId(userId),
    });
  }

  /**
   * Delete a specific message
   */
  async deleteMessage(messageId: string, userId: string): Promise<void> {
    const result = await AssistantMessageModel.deleteOne({
      _id: new mongoose.Types.ObjectId(messageId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      throw new Error('Message not found or unauthorized');
    }
  }

  /**
   * Get conversation statistics
   */
  async getStats(userId: string): Promise<{
    totalMessages: number;
    userMessages: number;
    aiMessages: number;
    firstMessageDate: Date | null;
  }> {
    const stats = await AssistantMessageModel.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          userMessages: {
            $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] },
          },
          aiMessages: {
            $sum: { $cond: [{ $eq: ['$role', 'assistant'] }, 1, 0] },
          },
          firstMessageDate: { $min: '$timestamp' },
        },
      },
    ]);

    if (stats.length === 0) {
      return {
        totalMessages: 0,
        userMessages: 0,
        aiMessages: 0,
        firstMessageDate: null,
      };
    }

    return {
      totalMessages: stats[0].totalMessages,
      userMessages: stats[0].userMessages,
      aiMessages: stats[0].aiMessages,
      firstMessageDate: stats[0].firstMessageDate,
    };
  }

  /**
   * Check if user has unread AI messages (for notification badge)
   */
  async hasUnreadMessages(userId: string, lastSeenAt: Date): Promise<boolean> {
    const count = await AssistantMessageModel.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      role: 'assistant',
      timestamp: { $gt: lastSeenAt },
    });

    return count > 0;
  }
}

export const assistantService = new AssistantService();