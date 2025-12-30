// models/TaskChat.model.ts
import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ITaskChat extends Document {
  taskId: mongoose.Types.ObjectId;
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

const TaskChatSchema = new Schema(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      index: true,
    },
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
      maxlength: [5000, 'Message content cannot exceed 5000 characters'],
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

// Compound index for efficient queries
TaskChatSchema.index({ taskId: 1, timestamp: -1 });
TaskChatSchema.index({ userId: 1, taskId: 1 });

const TaskChatModel: Model<ITaskChat> = mongoose.models.TaskChat
  ? (mongoose.models.TaskChat as Model<ITaskChat>)
  : mongoose.model<ITaskChat>('TaskChat', TaskChatSchema);

export default TaskChatModel;