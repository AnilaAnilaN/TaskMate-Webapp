// app/api/cron/daily-reminders/route.ts
// ==========================================
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { notificationService } from '@/lib/services/notification.service';
import { sendDailyTaskReminder } from '@/lib/services/email.service';
import UserModel from '@/models/User.model';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    console.log('🚀 Starting daily reminder job...');

    // Get all verified users
    const users = await UserModel.find({ emailVerified: true });
    console.log(`📊 Found ${users.length} verified users`);

    let emailsSent = 0;
    let notificationsCreated = 0;
    const errors: string[] = [];

    for (const user of users) {
      try {
        // Get tasks due today for this user
        const tasks = await notificationService.getTasksForDailyReminder(
          user._id.toString()
        );

        // Skip if no tasks due today
        if (tasks.length === 0) {
          console.log(`ℹ️  User ${user.email}: No tasks due today, skipping`);
          continue;
        }

        console.log(`📧 User ${user.email}: ${tasks.length} task(s) due today`);

        // Create in-app notifications
        const notifications = await notificationService.checkAndCreateTaskNotifications(
          user._id.toString()
        );
        notificationsCreated += notifications.length;

        // Send email reminder
        try {
          await sendDailyTaskReminder(user.email, user.name, tasks);
          emailsSent++;
          console.log(`✅ Email sent to ${user.email}`);
        } catch (emailError: any) {
          console.error(`❌ Failed to send email to ${user.email}:`, emailError.message);
          errors.push(`${user.email}: ${emailError.message}`);
        }
      } catch (userError: any) {
        console.error(`❌ Error processing user ${user.email}:`, userError);
        errors.push(`${user.email}: ${userError.message}`);
      }
    }

    console.log('✅ Daily reminder job completed');
    console.log(`📊 Summary: ${emailsSent} emails sent, ${notificationsCreated} notifications created`);

    return NextResponse.json({
      success: true,
      summary: {
        totalUsers: users.length,
        emailsSent,
        notificationsCreated,
        errors: errors.length,
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('❌ Daily reminder job failed:', error);
    return NextResponse.json(
      {
        error: 'Cron job failed',
        message: error.message,
      },
      { status: 500 }
    );
  }
}