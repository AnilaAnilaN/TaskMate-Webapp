// ============================================
// lib/services/auth.service.ts - Auth Business Logic
// ============================================
import crypto from 'crypto';
import UserModel from '@/models/User.model';
import type { SignupPayload, LoginPayload, User } from '@/types/auth.types';
import { emailService } from './email.service';
import { validatePassword, validateEmail, validateName } from '@/lib/validations';

class AuthService {
  async signup({ name, email, password }: SignupPayload): Promise<{ message: string }> {
    validateName(name);
    validateEmail(email);
    validatePassword(password);
    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await UserModel.create({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpiry,
      emailVerified: false,
    });

    // Send verification email
    await emailService.sendVerificationEmail(email, verificationToken, user._id.toString());

    return { message: 'Account created successfully. Please check your email to verify your account.' };
  }

  async login({ email, password }: LoginPayload): Promise<User> {
    // Find user with password field
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new Error('Please verify your email before logging in');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Return user without password
    return user.toJSON() as User;
  }

  async verifyEmail(token: string, userId: string): Promise<{ message: string }> {
    const user = await UserModel.findById(userId).select(
      '+verificationToken +verificationTokenExpiry'
    );

    if (!user || !user.verificationToken || user.verificationTokenExpiry < new Date()) {
      throw new Error('Invalid or expired verification token');
    }

    const isTokenValid = await user.compareVerificationToken(token);
    if (!isTokenValid) {
      throw new Error('Invalid or expired verification token');
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return { message: 'Email verified successfully. You can now log in.' };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await UserModel.findOne({ email });
    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      return { message: 'If an account exists with this email, a password reset link has been sent.' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email
    await emailService.sendPasswordResetEmail(email, resetToken, user._id.toString());

    return { message: 'If an account exists with this email, a password reset link has been sent.' };
  }

  async resetPassword(token: string, userId: string, newPassword: string): Promise<{ message: string }> {
    validatePassword(newPassword);
    const user = await UserModel.findById(userId).select(
      '+resetPasswordToken +resetPasswordExpiry +password'
    );

    if (!user || !user.resetPasswordToken || user.resetPasswordExpiry < new Date()) {
      throw new Error('Invalid or expired reset token');
    }

    const isTokenValid = await user.compareResetPasswordToken(token);
    if (!isTokenValid) {
        throw new Error('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return { message: 'Password reset successfully. You can now log in with your new password.' };
  }
}

export const authService = new AuthService();