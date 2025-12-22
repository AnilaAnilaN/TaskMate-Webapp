// lib/services/category.service.ts
// ==========================================
import CategoryModel from '@/models/Category.model';
import TaskModel from '@/models/Task.model';

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
  /**
   * Creates default categories including a special "Uncategorized" category
   * that serves as a fallback for orphaned tasks
   */
  async createDefaultCategories(userId: string) {
    const defaultCategories = [
      { 
        name: 'Uncategorized', 
        color: '#6B7280', 
        icon: '📋', 
        isDefault: true,
        isUncategorized: true // Special flag for the fallback category
      },
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

  /**
   * Gets the "Uncategorized" category for a user
   * Creates it if it doesn't exist
   */
  async getUncategorizedCategory(userId: string) {
    let uncategorized = await CategoryModel.findOne({ 
      userId, 
      isUncategorized: true 
    });

    if (!uncategorized) {
      // Create it if it doesn't exist (for existing users)
      uncategorized = await CategoryModel.create({
        userId,
        name: 'Uncategorized',
        color: '#6B7280',
        icon: '📋',
        isDefault: true,
        isUncategorized: true
      });
    }

    return uncategorized;
  }

  async getUserCategories(userId: string) {
    const categories = await CategoryModel.find({ userId }).sort({ createdAt: 1 });
    return categories;
  }

  async createCategory(userId: string, data: CreateCategoryPayload) {
    const category = await CategoryModel.create({
      userId,
      ...data,
    });
    return category;
  }

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

  /**
   * Deletes a category and reassigns all its tasks to "Uncategorized"
   */
  async deleteCategory(userId: string, categoryId: string) {
    const category = await CategoryModel.findOne({ _id: categoryId, userId });

    if (!category) {
      throw new Error('Category not found');
    }

    if (category.isDefault) {
      throw new Error('Cannot delete default categories');
    }

    // Get or create the "Uncategorized" category
    const uncategorized = await this.getUncategorizedCategory(userId);

    // Count tasks that will be affected
    const taskCount = await TaskModel.countDocuments({
      userId,
      categoryId: categoryId
    });

    // Reassign all tasks from this category to "Uncategorized"
    await TaskModel.updateMany(
      { userId, categoryId: categoryId },
      { $set: { categoryId: uncategorized._id } }
    );

    // Delete the category
    await CategoryModel.findByIdAndDelete(categoryId);

    return { 
      message: 'Category deleted successfully',
      tasksReassigned: taskCount,
      newCategoryId: uncategorized._id.toString()
    };
  }
}

export const categoryService = new CategoryService();