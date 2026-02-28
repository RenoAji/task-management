import { Resend } from "resend";
import { env } from "../config/env";
import { Task } from "../models/Task";

export const sendDeadlineReminder = async (
  email: string,
  taskTitle: string,
  taskId: string,
  dueDate?: Date,
): Promise<void> => {
  console.log(`Sending deadline reminder to ${email} for task: ${taskTitle}`);

  const resend = new Resend(env.RESEND_API_KEY);

  if (!dueDate) {
    return;
  }

  const dueDateStr =
    dueDate.toLocaleString("en-US", { timeZone: "UTC" }) + " UTC";

  const sendResult = await resend.emails.send({
    from: "Task Manager Ecode <onboarding@resend.dev>",
    to: email,
    subject: "Task Deadline Reminder",
    html: `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
  <h2 style="color: #007BFF;">Task Deadline Reminder</h2>
  <p>Dear User,</p>
  <p>This is a reminder that the task <strong>"${taskTitle}"</strong> is due on ${dueDateStr}.</p>
  <p>Please make sure to complete it on time.</p>
</div>`,
  });

  if (sendResult.error) {
    throw new Error(
      `Failed to send reminder email: ${sendResult.error.message}`,
    );
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { $set: { lastReminderSentAt: new Date() } },
    { returnDocument: "after" },
  );

  if (!updatedTask) {
    throw new Error(
      `Task ${taskId} not found when updating reminder timestamp`,
    );
  }
};
