// models/AssistantMessage.model.ts
import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IAssistantMessage extends Document {
  userId: mongoose.Types.ObjectId;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    responseTime?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AssistantMessageSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: [10000, 'Message content cannot exceed 10000 characters'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metadata: {
      model: { type: String },
      tokens: { type: Number },
      responseTime: { type: Number },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index for efficient user chat history queries
AssistantMessageSchema.index({ userId: 1, timestamp: -1 });

const AssistantMessageModel: Model<IAssistantMessage> = mongoose.models.AssistantMessage
  ? (mongoose.models.AssistantMessage as Model<IAssistantMessage>)
  : mongoose.model<IAssistantMessage>('AssistantMessage', AssistantMessageSchema);

export default AssistantMessageModel;