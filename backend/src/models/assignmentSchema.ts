import { Schema } from "mongoose";
import { z } from "zod";

export const AssignmentZodSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  lesson: z.string({ required_error: "Lesson is required" }),
  dueDate: z.date({ required_error: "Due date is required" }),
  status: z.enum(["pending", "submitted", "graded"]).default("pending"),

  submissionDate: z.date().optional(),

  submissionPublicId: z.string().optional(),
  submissionFileUrl: z.string().url().optional(),
  submissionFileName: z.string().optional(),
  submissionFileSize: z.number().optional(),
  submissionFileType: z.string().optional(),
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
      enum: ["pending", "completed", "graded"],
      default: "pending",
      required: true,
    },
    submissionDate: Date,
    submissionFileUrl: String,
    submissionPublicId: String,
    submissionFileName: String,
    submissionFileType: String,
    submissionFileSize: Number,
  },
  {
    timestamps: true,
  }
);
