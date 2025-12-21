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

    return tasks.map((task) => task.toJSON());
  }

  async getTask(userId: string, taskId: string) {
    const task = await TaskModel.findOne({ _id: taskId, userId })
      .populate('categoryId', 'name color icon');

    if (!task) {
      throw new Error('Task not found');
    }
    return task.toJSON();
  }

  async createTask(userId: string, data: CreateTaskPayload) {
    const task = await TaskModel.create({
      userId,
      ...data,
    });

    await task.populate('categoryId', 'name color icon');
    return task.toJSON();
  }

  async updateTask(userId: string, taskId: string, data: UpdateTaskPayload) {
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
    return task.toJSON();
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
    ).populate('categoryId', 'name color icon');

    if (!task) {
      throw new Error('Task not found');
    }
    return task.toJSON();
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
      .populate('categoryId', 'name color icon')
      .sort({ priority: -1 });

    return tasks.map((task) => task.toJSON());
  }

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

    return tasks.map((task) => task.toJSON());
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
      .populate('categoryId', 'name color icon')
      .sort({ dueDate: 1 });

    return tasks.map((task) => task.toJSON());
  }

  async getTasksForMonth(userId: string, year: number, month: number) {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const tasks = await TaskModel.find({
      userId,
      dueDate: { $gte: startDate, $lte: endDate },
    })
      .populate('categoryId', 'name color icon')
      .sort({ dueDate: 1 });

    return tasks.map((task) => task.toJSON());
  }
}

export const taskService = new TaskService();