import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";

import { cloudinary } from "../cloudinary.js";
import { envConfig } from "../config/envValidator.js";
import { protectedProcedure, router } from "../trpc.js";
import studentModel from "../models/studentModel.js";
import AssignmentModel, {
  IStudentAssignment,
} from "../models/assignmentModel.js";
import { CACHE, wildcardDeleteCache } from "../utils/nodeCache.js";
import { isValidObjectId } from "mongoose";
import { ICourse } from "../models/coursesModel.js";

// -- Validation Schemas --------------------------------------------------
const SubmissionCompleteSchema = z.object({
  assignmentId: z
    .string()
    .refine(isValidObjectId, { message: "Invalid assignment ID" }),
  publicId: z.string().min(1),
  fileName: z.string().min(1),
  fileSize: z.number().positive(),
  fileType: z.string().min(1),
  fileUrl: z.string().url(),
});

const MarkAssignmentSchema = z.object({
  assignmentId: z
    .string()
    .refine(isValidObjectId, { message: "Invalid assignment ID" }),
  grade: z.enum(["A", "B", "C", "D", "E", "F"]),
  remark: z.string().optional(),
});

const CreateAssignmentSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  course: z.string().refine(isValidObjectId, { message: "Invalid course ID" }),
  question: z.string(),
  dueDate: z.date(),
});

async function getCacheOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = CACHE.get<T>(key);
  if (cached) {
    console.debug(`[CACHE] hit ${key}`);
    return cached;
  }
  console.debug(`[CACHE] miss ${key}`);
  const data = await fetcher();
  CACHE.set(key, data);
  console.debug(`[CACHE] set ${key}`);
  return data;
}

export const assignmentRouter = router({
  create: protectedProcedure
    .input(CreateAssignmentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const assignment = await AssignmentModel.create({
          ...input,
          instructorId: ctx.user.id,
        });
        // Invalidate instructor cache
        wildcardDeleteCache(`assignments-instructor-${ctx.user.id}`);
        return assignment;
      } catch (err) {
        console.error("Failed to create assignment:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create assignment",
          cause: err,
        });
      }
    }),

  // Get all assignments for a student
  getAllForStudent: protectedProcedure.query(async ({ ctx }) => {
    const studentId = ctx.user.id;
    const cacheKey = `assignments-student-${studentId}`;

    return getCacheOrFetch(cacheKey, async () => {
      const student = await studentModel
        .findById(studentId)
        .populate<{ assignments: IStudentAssignment[] }>("assignments")
        .lean();
      if (!student) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Student not found",
        });
      }
      return student.assignments;
    });
  }),

  // Get all assignments for an instructor
  getAllForInstructor: protectedProcedure.query(async ({ ctx }) => {
    const instructorId = ctx.user.id;
    const cacheKey = `assignments-instructor-${instructorId}`;

    return getCacheOrFetch(cacheKey, async () => {
      const assignments = await AssignmentModel.find({ instructorId })
        .populate<{ course: ICourse }>("course")
        .lean();

      if (!assignments) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No assignments found",
        });
      }

      return assignments;
    });
  }),

  // Generate Cloudinary upload signature
  createCloudinarySignature: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string().refine(isValidObjectId),
        originalFileName: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { assignmentId, originalFileName } = input;
      const userId = ctx.user.id;
      const timestamp = Math.floor(Date.now() / 1000);
      const folder = `assignments/${assignmentId}/${userId}`;
      const suffix = randomUUID();
      const name = originalFileName?.replace(/\.[^.]+$/, "") || "submission";
      const publicId = `${folder}/${name}-${suffix}`;

      try {
        const signature = cloudinary.utils.api_sign_request(
          { folder, public_id: publicId, timestamp },
          envConfig.CLOUDINARY_API_SECRET!
        );
        return {
          apiKey: envConfig.CLOUDINARY_API_KEY!,
          cloudName: envConfig.CLOUDINARY_CLOUD_NAME!,
          timestamp,
          signature,
          publicId,
        };
      } catch (err) {
        console.error("Cloudinary signature error:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate upload signature",
        });
      }
    }),

  // Submit assignment
  markSubmissionComplete: protectedProcedure
    .input(SubmissionCompleteSchema)
    .mutation(async ({ ctx, input }) => {
      const { assignmentId, publicId, fileName, fileSize, fileType, fileUrl } =
        input;
      const userId = ctx.user.id;

      const student = await studentModel.exists({
        _id: userId,
        assignments: assignmentId,
      });

      if (!student) {
        await cloudinary.uploader
          .destroy(publicId, { resource_type: "raw" })
          .catch(console.error);
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized for this assignment",
        });
      }

      try {
        const updated = await AssignmentModel.findByIdAndUpdate(
          assignmentId,
          {
            status: "submitted",
            submissionDate: new Date(),
            submissionFileUrl: fileUrl,
            submissionPublicId: publicId,
            submissionFileName: fileName,
            submissionFileSize: fileSize,
            submissionFileType: fileType,
          },
          { new: true, runValidators: true }
        );
        if (!updated) throw new Error("DB update failed");

        wildcardDeleteCache(`assignments-student-`);
        wildcardDeleteCache(`assignments-instructor-`);

        return updated;
      } catch (err) {
        // Rollback on error
        await cloudinary.uploader
          .destroy(publicId, { resource_type: "raw" })
          .catch(console.error);
        console.error("Submission update error:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit assignment",
          cause: err,
        });
      }
    }),

  // Grade assignment
  mark: protectedProcedure
    .input(MarkAssignmentSchema)
    .mutation(async ({ ctx, input }) => {
      const { role } = ctx.user;
      if (!["admin", "instructor"].includes(role)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Insufficient permissions",
        });
      }

      try {
        const updated = await AssignmentModel.findByIdAndUpdate(
          input.assignmentId,
          { grade: input.grade, status: "graded", remark: input.remark },
          { new: true, runValidators: true }
        );

        if (!updated) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Assignment not found",
          });
        }

        wildcardDeleteCache(`assignments-`);
        return updated;
      } catch (err) {
        console.error("Grading error:", err);
        if (err instanceof TRPCError) throw err;
      }
    }),
});
