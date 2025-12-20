// models/Task.model.ts
// ==========================================
import mongoose, { Schema, Model, Document } from 'mongoose';

export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId; // Keep as ObjectId
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  startDate?: Date;
  completedAt?: Date;
  estimatedTime?: number;
  actualTime: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'completed', 'cancelled'],
      default: 'todo',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      index: true,
    },
    dueDate: {
      type: Date,
      index: true,
    },
    startDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    estimatedTime: {
      type: Number,
      min: [0, 'Estimated time cannot be negative'],
    },
    actualTime: {
      type: Number,
      default: 0,
      min: [0, 'Actual time cannot be negative'],
    },
    tags: {
      type: [String],
      default: [],
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

TaskSchema.index({ userId: 1, status: 1, dueDate: 1 });
TaskSchema.index({ userId: 1, categoryId: 1 });

const TaskModel: Model<ITask> = mongoose.models.Task
  ? (mongoose.models.Task as Model<ITask>)
  : mongoose.model<ITask>('Task', TaskSchema);

export default TaskModel;

