import cron from "node-cron";
import { Task } from "../models/Task";
import { User } from "../models/User";
import { sendDeadlineReminder } from "../services/emailService";
import { env } from "../config/env";

// Rate limiter
const RATE_LIMIT_MS = 600;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const initEmailCronJobs = () => {
  // "* * * * *" => run cron job every 1 min
  // "0 * * * *" => run cron job every hour at minute 0
  cron.schedule(env.CRON_SCHEDULE, async () => {
    console.log("Running deadline check...");

    const now = new Date();
    const twentyFourHoursFromNow = new Date(
      now.getTime() + 24 * 60 * 60 * 1000,
    );

    try {
      const seedUser = await User.findOne({
        email: "seeduser@example.com",
      }).select("_id");

      // Task that not completed and due date is before 24 hours from now (including overdue)
      const tasksToNotify = await Task.find({
        status: { $ne: "completed" },
        dueDate: { $lte: twentyFourHoursFromNow },
        userId: {
          $nin: seedUser?._id ? [null, seedUser._id] : [null],
        },
        $or: [
          { lastReminderSentAt: { $exists: false } },
          {
            lastReminderSentAt: {
              $lte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        ],
      }).populate("userId", "email");

      console.log(
        `Found ${tasksToNotify.length} tasks nearing or past their deadline.`,
      );

      // send email for each task
      let successCount = 0;
      for (const task of tasksToNotify) {
        try {
          const userEmail = (task as any).userId.email;
          await sendDeadlineReminder(
            userEmail,
            task.title,
            task._id.toString(),
            task.dueDate,
          );
          successCount++;
          await sleep(RATE_LIMIT_MS);
        } catch (error) {
          console.error(`Failed to send reminder for task ${task._id}:`, error);
        }
      }

      console.log(
        `Successfully sent ${successCount}/${tasksToNotify.length} reminders.`,
      );
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });
};
