// models/Category.model.ts
// ==========================================
import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ICategory extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
  isUncategorized?: boolean;
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
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isUncategorized: {
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

// Compound index for efficient queries
CategorySchema.index({ userId: 1, name: 1 });

const CategoryModel: Model<ICategory> = mongoose.models.Category
  ? (mongoose.models.Category as Model<ICategory>)
  : mongoose.model<ICategory>('Category', CategorySchema);

export default CategoryModel;