import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  emailVerified: boolean;
  verificationToken: string;
  tokenExpiry: Date;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  tokenExpiry: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
