// ==========================================
// 4. TASK SERVICE
// lib/services/task.service.ts
// ==========================================
import TaskModel, { TaskStatus, TaskPriority } from '@/models/Task.model';

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

class TaskService {
  // Get all tasks for a user with filters
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
      .populate('categoryId', 'name color icon')
      .sort({ createdAt: -1 });

    return tasks;
  }

  // Get single task
  async getTask(userId: string, taskId: string) {
    const task = await TaskModel.findOne({ _id: taskId, userId })
      .populate('categoryId', 'name color icon');

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }

  // Create a new task
  async createTask(userId: string, data: CreateTaskPayload) {
    const task = await TaskModel.create({
      userId,
      ...data,
    });

    // Populate category before returning
    await task.populate('categoryId', 'name color icon');

    return task;
  }

  // Update a task
  async updateTask(userId: string, taskId: string, data: UpdateTaskPayload) {
    // If status is being changed to completed, set completedAt
    if (data.status === 'completed') {
      (data as any).completedAt = new Date();
    }

    const task = await TaskModel.findOneAndUpdate(
      { _id: taskId, userId },
      { $set: data },
      { new: true, runValidators: true }
    ).populate('categoryId', 'name color icon');

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }

  // Delete a task
  async deleteTask(userId: string, taskId: string) {
    const task = await TaskModel.findOneAndDelete({ _id: taskId, userId });

    if (!task) {
      throw new Error('Task not found');
    }

    return { message: 'Task deleted successfully' };
  }

  // Get today's tasks
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
      .populate('categoryId', 'name color icon')
      .sort({ priority: -1 });

    return tasks;
  }

  // Get overdue tasks
  async getOverdueTasks(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = await TaskModel.find({
      userId,
      status: { $ne: 'completed' },
      dueDate: { $lt: today },
    })
      .populate('categoryId', 'name color icon')
      .sort({ dueDate: 1 });

    return tasks;
  }
}

export const taskService = new TaskService();
