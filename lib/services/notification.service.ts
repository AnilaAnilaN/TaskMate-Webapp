// lib/services/notification.service.ts
// ==========================================
import NotificationModel, { NotificationType } from '@/models/Notification.model';
import TaskModel from '@/models/Task.model';
import CategoryModel from '@/models/Category.model';
import UserModel from '@/models/User.model';
import mongoose from 'mongoose';

interface CreateNotificationPayload {
  userId: string;
  taskId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata: {
    taskTitle: string;
    dueDate: Date;
    priority: string;
    categoryName: string;
    categoryColor: string;
    categoryIcon: string;
  };
}

class NotificationService {
  /**
   * Create a new notification
   */
  async createNotification(data: CreateNotificationPayload) {
    // Check if notification already exists for this task and type TODAY
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const existing = await NotificationModel.findOne({
      userId: data.userId,
      taskId: data.taskId,
      type: data.type,
      isDismissed: false,
      createdAt: { $gte: todayStart }, // Only check notifications created today
    });

    if (existing) {
      return existing.toJSON();
    }

    const notification = await NotificationModel.create(data);
    return notification.toJSON();
  }

  /**
   * Get all notifications for a user with filters
   */
  async getUserNotifications(userId: string, filters: {
    isRead?: boolean;
    isDismissed?: boolean;
    limit?: number;
  } = {}) {
    const query: any = { userId };

    if (filters.isRead !== undefined) {
      query.isRead = filters.isRead;
    }

    query.isDismissed = filters.isDismissed ?? false;

    const notifications = await NotificationModel.find(query)
      .sort({ createdAt: -1 })
      .limit(filters.limit || 100);

    return notifications.map(n => n.toJSON());
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    return await NotificationModel.countDocuments({
      userId,
      isRead: false,
      isDismissed: false,
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(userId: string, notificationId: string) {
    const notification = await NotificationModel.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      throw new Error('Notification not found');
    }

    return notification.toJSON();
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string) {
    const result = await NotificationModel.updateMany(
      { userId, isRead: false, isDismissed: false },
      { isRead: true }
    );

    return { modifiedCount: result.modifiedCount };
  }

  /**
   * Dismiss a notification
   */
  async dismissNotification(userId: string, notificationId: string) {
    const notification = await NotificationModel.findOneAndUpdate(
      { _id: notificationId, userId },
      { isDismissed: true },
      { new: true }
    );

    if (!notification) {
      throw new Error('Notification not found');
    }

    return { message: 'Notification dismissed' };
  }

  /**
   * Dismiss all notifications
   */
  async dismissAll(userId: string) {
    const result = await NotificationModel.updateMany(
      { userId, isDismissed: false },
      { isDismissed: true }
    );

    return { modifiedCount: result.modifiedCount };
  }

  /**
   * Clean up old "due_today" notifications that are no longer relevant
   */
  async cleanupOldDueTodayNotifications(userId: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Dismiss "due_today" notifications created before today
    const result = await NotificationModel.updateMany(
      {
        userId,
        type: 'due_today',
        isDismissed: false,
        createdAt: { $lt: todayStart },
      },
      { isDismissed: true }
    );

    return { modifiedCount: result.modifiedCount };
  }

  /**
   * Check and create notifications for due/overdue tasks
   */
  async checkAndCreateTaskNotifications(userId: string) {
    // Clean up old due_today notifications first
    await this.cleanupOldDueTodayNotifications(userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find tasks due today (not completed)
    const dueTodayTasks = await TaskModel.find({
      userId,
      status: { $ne: 'completed' },
      dueDate: { $gte: today, $lt: tomorrow },
    }).populate('categoryId', 'name color icon');

    // Find overdue tasks (not completed, due before today)
    const overdueTasks = await TaskModel.find({
      userId,
      status: { $ne: 'completed' },
      dueDate: { $lt: today },
    }).populate('categoryId', 'name color icon');

    const notifications = [];

    // Create notifications for tasks due today
    for (const task of dueTodayTasks) {
      const taskObj: any = task.toJSON();

      const notification = await this.createNotification({
        userId,
        taskId: taskObj.id,
        type: 'due_today',
        title: '📅 Task due today',
        message: `"${taskObj.title}" is due today`,
        metadata: {
          taskTitle: taskObj.title,
          dueDate: taskObj.dueDate,
          priority: taskObj.priority,
          categoryName: taskObj.categoryId?.name || 'Uncategorized',
          categoryColor: taskObj.categoryId?.color || '#6B7280',
          categoryIcon: taskObj.categoryId?.icon || '📋',
        },
      });

      notifications.push(notification);
    }

    // Create/update notification for overdue tasks (grouped)
    if (overdueTasks.length > 0) {
      // Dismiss old overdue notifications
      await NotificationModel.updateMany(
        {
          userId,
          type: 'overdue',
          isDismissed: false,
        },
        { isDismissed: true }
      );

      const firstTask: any = overdueTasks[0].toJSON();

      // Create a new overdue notification with current count
      const notification = await NotificationModel.create({
        userId,
        taskId: firstTask.id,
        type: 'overdue',
        title: '⚠️ Overdue tasks',
        message: `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`,
        metadata: {
          taskTitle: `${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`,
          dueDate: firstTask.dueDate,
          priority: 'urgent',
          categoryName: 'Multiple',
          categoryColor: '#EF4444',
          categoryIcon: '⚠️',
        },
      });

      notifications.push(notification.toJSON());
    } else {
      // If no overdue tasks, dismiss any existing overdue notifications
      await NotificationModel.updateMany(
        {
          userId,
          type: 'overdue',
          isDismissed: false,
        },
        { isDismissed: true }
      );
    }

    return notifications;
  }

  /**
   * Get tasks for daily email reminder
   */
  async getTasksForDailyReminder(userId: string) {
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
      .sort({ priority: -1, dueDate: 1 });

    return tasks.map(task => {
      const taskObj: any = task.toJSON();
      return taskObj;
    });
  }

  /**
   * Clean up old dismissed notifications (older than 30 days)
   */
  async cleanupOldNotifications() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await NotificationModel.deleteMany({
      isDismissed: true,
      updatedAt: { $lt: thirtyDaysAgo },
    });

    return { deletedCount: result.deletedCount };
  }
}

export const notificationService = new NotificationService();