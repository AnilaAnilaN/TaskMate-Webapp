import UserModel from '@/models/User.model';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

interface UpdateProfilePayload {
  name?: string;
  bio?: string;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

class ProfileService {
  async getProfile(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      bio: user.bio || '',
      profileImage: user.profileImage || null,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: string, data: UpdateProfilePayload) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (data.name) {
      user.name = data.name.trim();
    }
    if (data.bio !== undefined) {
      user.bio = data.bio.trim();
    }

    await user.save();

    return {
      message: 'Profile updated successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        bio: user.bio,
      },
    };
  }

  async changePassword(userId: string, { currentPassword, newPassword }: ChangePasswordPayload) {
    const user = await UserModel.findById(userId).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await mongoose.connection.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    );

    return { message: 'Password changed successfully' };
  }
}

export const profileService = new ProfileService();