// models/Category.model.ts
// ==========================================
import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ICategory extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  color: string;
  icon: string;
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
      required: [true, 'Color is required'],
      trim: true,
      maxlength: [20, 'Color cannot exceed 20 characters'],
    },
    icon: {
      type: String,
      required: [true, 'Icon is required'],
      trim: true,
      maxlength: [50, 'Icon key cannot exceed 50 characters'],
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

CategorySchema.index({ userId: 1, name: 1 });

const CategoryModel: Model<ICategory> = mongoose.models.Category
  ? (mongoose.models.Category as Model<ICategory>)
  : mongoose.model<ICategory>('Category', CategorySchema);

export default CategoryModel;