import { Schema } from "mongoose";
import { z } from "zod";

export const AssignmentZodSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  lesson: z.string({
    required_error: "Lesson is required",
  }),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  status: z.enum(["pending", "completed"]).default("pending"),
  submitted: z.boolean({
    required_error: "Submission status is required",
  }),
});

export type IStudentAssignment = z.infer<typeof AssignmentZodSchema>;

/**
 * Mongoose schema for the Assignment model.
 */
export const AssignmentSchema = new Schema<IStudentAssignment>(
  {
    title: { type: String, required: true },
    lesson: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
      required: true,
    },
    submitted: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);
