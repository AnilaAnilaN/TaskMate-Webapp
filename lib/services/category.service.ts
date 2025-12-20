// ==========================================
// 3. CATEGORY SERVICE
// lib/services/category.service.ts
// ==========================================
import CategoryModel from '@/models/Category.model';

interface CreateCategoryPayload {
  name: string;
  color: string;
  icon: string;
}

interface UpdateCategoryPayload {
  name?: string;
  color?: string;
  icon?: string;
}

class CategoryService {
  // Create default categories for new users
  async createDefaultCategories(userId: string) {
    const defaultCategories = [
      { name: 'Work', color: '#8B5CF6', icon: '💼', isDefault: true },
      { name: 'Personal', color: '#3B82F6', icon: '🏠', isDefault: true },
      { name: 'Family', color: '#10B981', icon: '👨‍👩‍👧', isDefault: true },
      { name: 'Health', color: '#EF4444', icon: '💪', isDefault: true },
    ];

    const categories = await CategoryModel.insertMany(
      defaultCategories.map(cat => ({ ...cat, userId }))
    );

    return categories;
  }

  // Get all categories for a user
  async getUserCategories(userId: string) {
    const categories = await CategoryModel.find({ userId }).sort({ createdAt: 1 });
    return categories;
  }

  // Create a new category
  async createCategory(userId: string, data: CreateCategoryPayload) {
    const category = await CategoryModel.create({
      userId,
      ...data,
    });

    return category;
  }

  // Update a category
  async updateCategory(userId: string, categoryId: string, data: UpdateCategoryPayload) {
    const category = await CategoryModel.findOneAndUpdate(
      { _id: categoryId, userId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  // Delete a category
  async deleteCategory(userId: string, categoryId: string) {
    const category = await CategoryModel.findOne({ _id: categoryId, userId });

    if (!category) {
      throw new Error('Category not found');
    }

    if (category.isDefault) {
      throw new Error('Cannot delete default categories');
    }

    await CategoryModel.findByIdAndDelete(categoryId);

    return { message: 'Category deleted successfully' };
  }
}

export const categoryService = new CategoryService();