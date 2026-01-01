// lib/services/auth.service.ts
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import UserModel from '@/models/User.model';
import { sendVerificationCode, sendPasswordResetEmail } from './email.service';
import type { SignupPayload, LoginPayload, AuthResult, User } from '@/types/auth.types';

class AuthService {
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Helper to safely transform Mongoose doc to User DTO
  private transformUserToDTO(user: any): User {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async signup({ name, email, password }: SignupPayload): Promise<{ message: string }> {
    const existingUser = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const verificationCode = this.generateVerificationCode();
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await UserModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      verificationCode,
      verificationCodeExpiry,
      emailVerified: false,
    });

    // Send verification email
    try {
      await sendVerificationCode(email, verificationCode);
    } catch (error) {
      console.error('Failed to send verification code email:', error);
    }

    return {
      message: 'Account created successfully! Please check your email for the 6-digit verification code.',
    };
  }

  async verifyCode(email: string, code: string): Promise<{ message: string }> {
    if (!email || !code) {
      throw new Error('Email and code are required');
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() })
      .select('+verificationCode +verificationCodeExpiry');

    if (!user) {
      throw new Error('Invalid email or code');
    }

    if (!user.verificationCodeExpiry || user.verificationCodeExpiry < new Date()) {
      throw new Error('Verification code has expired');
    }

    if (user.verificationCode !== code.trim()) {
      throw new Error('Invalid verification code');
    }

    user.emailVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();

    return { message: 'Email verified successfully!' };
  }

  async login({ email, password }: LoginPayload): Promise<AuthResult> {
    const user = await UserModel.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.emailVerified) {
      throw new Error('Please verify your email before logging in');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: this.transformUserToDTO(user),
    };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return { message: 'If an account exists, a password reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, resetToken, user._id.toString());
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }

    return { message: 'If an account exists, a password reset link has been sent.' };
  }

  async resetPassword(token: string, userId: string, newPassword: string): Promise<{ message: string }> {
    const user = await UserModel.findOne({
      _id: new mongoose.Types.ObjectId(userId),
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() },
    }).lean();

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const result = await mongoose.connection.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date()
        },
        $unset: {
          resetPasswordToken: '',
          resetPasswordExpiry: ''
        },
      }
    );

    if (result.modifiedCount === 0) {
      throw new Error('Failed to update password');
    }

    return { message: 'Password reset successfully. You can now log in with your new password.' };
  }
}

export const authService = new AuthService();
