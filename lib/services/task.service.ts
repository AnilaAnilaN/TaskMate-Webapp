// lib/services/task.service.ts
// ==========================================
import TaskModel, { TaskStatus, TaskPriority, ITask } from '@/models/Task.model';
import CategoryModel from '@/models/Category.model';
import mongoose from 'mongoose';

interface CreateTaskPayload {
  categoryId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: Date;
  startDate?: Date;
  estimatedTime?: number;
  tags?: string[];
}

interface UpdateTaskPayload {
  categoryId?: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  startDate?: Date;
  estimatedTime?: number;
  tags?: string[];
}

interface GetTasksFilters {
  status?: TaskStatus;
  categoryId?: string;
  priority?: TaskPriority;
  search?: string;
}

// Type for populated category
interface PopulatedCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

class TaskService {
  /**
   * Helper method to get a default category object for deleted/invalid categories
   */
  private getDefaultCategoryObject(): PopulatedCategory {
    return {
      id: 'deleted',
      name: 'Deleted Category',
      color: '#6B7280',
      icon: '❌'
    };
  }

  /**
   * Transforms MongoDB document to JSON format
   */
  private transformToJSON(doc: any): any {
    if (!doc) return null;
    
    // If it's already a plain object (from .lean()), just transform it
    if (!doc.toJSON) {
      const obj = { ...doc };
      if (obj._id) {
        obj.id = obj._id.toString();
        delete obj._id;
      }
      delete obj.__v;
      return obj;
    }
    
    // If it's a Mongoose document, use toJSON
    return doc.toJSON();
  }

  /**
   * Processes a single task and ensures valid category data
   */
  private processTask(task: any): any {
    const taskObj = this.transformToJSON(task);
    
    // Handle missing or invalid category
    if (!taskObj.categoryId || typeof taskObj.categoryId !== 'object' || !taskObj.categoryId.name) {
      taskObj.categoryId = this.getDefaultCategoryObject();
    }
    
    return taskObj;
  }

  /**
   * Processes multiple tasks and ensures valid category data
   */
  private processTasks(tasks: any[]): any[] {
    return tasks.map(task => this.processTask(task));
  }

  async getUserTasks(userId: string, filters: GetTasksFilters = {}) {
    const query: any = { userId };

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.categoryId) {
      query.categoryId = filters.categoryId;
    }
    if (filters.priority) {
      query.priority = filters.priority;
    }
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const tasks = await TaskModel.find(query)
      .populate({
        path: 'categoryId',
        select: 'name color icon',
        options: { strictPopulate: false }
      })
      .sort({ createdAt: -1 });

    return this.processTasks(tasks);
  }

  async getTask(userId: string, taskId: string) {
    const task = await TaskModel.findOne({ _id: taskId, userId })
      .populate({
        path: 'categoryId',
        select: 'name color icon',
        options: { strictPopulate: false }
      });

    if (!task) {
      throw new Error('Task not found');
    }

    return this.processTask(task);
  }

  async createTask(userId: string, data: CreateTaskPayload) {
    // Verify category exists
    const categoryExists = await CategoryModel.findOne({
      _id: data.categoryId,
      userId
    });

    if (!categoryExists) {
      throw new Error('Invalid category');
    }

    const task = await TaskModel.create({
      userId,
      ...data,
    });

    const populatedTask = await TaskModel.findById(task._id)
      .populate({
        path: 'categoryId',
        select: 'name color icon',
        options: { strictPopulate: false }
      });
    
    return this.processTask(populatedTask);
  }

  async updateTask(userId: string, taskId: string, data: UpdateTaskPayload) {
    // If updating category, verify it exists
    if (data.categoryId) {
      const categoryExists = await CategoryModel.findOne({
        _id: data.categoryId,
        userId
      });

      if (!categoryExists) {
        throw new Error('Invalid category');
      }
    }

    const updateData: any = { ...data };
    if (data.status === 'completed') {
      updateData.completedAt = new Date();
    }

    const task = await TaskModel.findOneAndUpdate(
      { _id: taskId, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate({
      path: 'categoryId',
      select: 'name color icon',
      options: { strictPopulate: false }
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return this.processTask(task);
  }

  async deleteTask(userId: string, taskId: string) {
    const task = await TaskModel.findOneAndDelete({ _id: taskId, userId });

    if (!task) {
      throw new Error('Task not found');
    }
    return { message: 'Task deleted successfully' };
  }

  async incrementActualTime(userId: string, taskId: string, minutesToAdd: number) {
    const task = await TaskModel.findOneAndUpdate(
      { _id: taskId, userId },
      { $inc: { actualTime: minutesToAdd } },
      { new: true, runValidators: true }
    ).populate({
      path: 'categoryId',
      select: 'name color icon',
      options: { strictPopulate: false }
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return this.processTask(task);
  }

  async getTodayTasks(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await TaskModel.find({
      userId,
      status: { $ne: 'completed' },
      dueDate: { $gte: today, $lt: tomorrow },
    })
      .populate({
        path: 'categoryId',
        select: 'name color icon',
        options: { strictPopulate: false }
      })
      .sort({ priority: -1 });

    return this.processTasks(tasks);
  }

  async getOverdueTasks(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = await TaskModel.find({
      userId,
      status: { $ne: 'completed' },
      dueDate: { $lt: today },
    })
      .populate({
        path: 'categoryId',
        select: 'name color icon',
        options: { strictPopulate: false }
      })
      .sort({ dueDate: 1 });

    return this.processTasks(tasks);
  }

  async getTasksByDate(userId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await TaskModel.find({
      userId,
      dueDate: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate({
        path: 'categoryId',
        select: 'name color icon',
        options: { strictPopulate: false }
      })
      .sort({ dueDate: 1 });

    return this.processTasks(tasks);
  }

  async getTasksForMonth(userId: string, year: number, month: number) {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const tasks = await TaskModel.find({
      userId,
      dueDate: { $gte: startDate, $lte: endDate },
    })
      .populate({
        path: 'categoryId',
        select: 'name color icon',
        options: { strictPopulate: false }
      })
      .sort({ dueDate: 1 });

    return this.processTasks(tasks);
  }
}

export const taskService = new TaskService();