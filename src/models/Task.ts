import { Schema, model, type Document, type Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "completed";
  userId: Types.ObjectId; // reference to User
  dueDate?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  lastReminderSentAt?: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    closedAt: {
      type: Date,
      required: false,
    },
    lastReminderSentAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Task = model<ITask>("Task", taskSchema);
