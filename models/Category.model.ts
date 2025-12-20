// ==========================================
// 2. FIXED CATEGORY MODEL
// models/Category.model.ts
// ==========================================
import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ICategory extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    color: {
      type: String,
      required: true,
      default: '#FBBF24',
      match: [/^#[0-9A-F]{6}$/i, 'Please provide a valid hex color'],
    },
    icon: {
      type: String,
      default: '📋',
    },
    isDefault: {
      type: Boolean,
      default: false,
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

CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

const CategoryModel: Model<ICategory> = mongoose.models.Category
  ? (mongoose.models.Category as Model<ICategory>)
  : mongoose.model<ICategory>('Category', CategorySchema);

export default CategoryModel;