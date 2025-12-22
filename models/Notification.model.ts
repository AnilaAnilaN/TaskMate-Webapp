// models/Notification.model.ts
// ==========================================
import mongoose, { Schema, Model, Document } from 'mongoose';

export type NotificationType = 'due_today' | 'overdue' | 'reminder';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  taskId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  isDismissed: boolean;
  metadata: {
    taskTitle: string;
    dueDate: Date;
    priority: string;
    categoryName: string;
    categoryColor: string;
    categoryIcon: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['due_today', 'overdue', 'reminder'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    isDismissed: {
      type: Boolean,
      default: false,
      index: true,
    },
    metadata: {
      taskTitle: {
        type: String,
        required: true,
      },
      dueDate: {
        type: Date,
        required: true,
      },
      priority: {
        type: String,
        required: true,
      },
      categoryName: {
        type: String,
        required: true,
      },
      categoryColor: {
        type: String,
        required: true,
      },
      categoryIcon: {
        type: String,
        required: true,
      },
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

// Compound indexes for efficient queries
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isDismissed: 1, createdAt: -1 });
NotificationSchema.index({ taskId: 1, userId: 1, type: 1 });

const NotificationModel: Model<INotification> = mongoose.models.Notification
  ? (mongoose.models.Notification as Model<INotification>)
  : mongoose.model<INotification>('Notification', NotificationSchema);

export default NotificationModel;