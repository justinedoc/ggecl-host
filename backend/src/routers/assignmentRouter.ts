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

type TSubmissionData = Partial<
  Omit<IStudentAssignment, "title" | "lesson" | "dueDate" | "question">
>;

// -- Validation Schemas --------------------------------------------------
const SubmissionCompleteZodSchema = z.object({
  assignmentId: z
    .string()
    .refine(isValidObjectId, { message: "Invalid assignment ID" }),
  publicId: z.string(),
  fileName: z.string(),
  fileSize: z.number(),
  fileType: z.string(),
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

  createCloudinarySignature: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        originalFileName: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { assignmentId, originalFileName } = input;
      const userId = ctx.user.id;
      const timestamp = Math.round(new Date().getTime() / 1000);

      const folder = `assignments/${assignmentId}/${userId}`;
      const uniqueSuffix = randomUUID();
      const baseFileName = originalFileName
        ? originalFileName.split(".").slice(0, -1).join(".")
        : "submission";
      const public_id = `${folder}/${baseFileName}-${uniqueSuffix}`;

      const paramsToSign = {
        folder,
        public_id,
        timestamp,
      };

      try {
        const signature = cloudinary.utils.api_sign_request(
          paramsToSign,
          envConfig.CLOUDINARY_API_SECRET!
        );

        return {
          signature,
          timestamp,
          apiKey: envConfig.CLOUDINARY_API_KEY!,
          cloudName: envConfig.CLOUDINARY_CLOUD_NAME!,
          folder,
          publicId: public_id,
        };
      } catch (error) {
        console.error("Error signing Cloudinary request:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create upload signature.",
        });
      }
    }),

  markSubmissionComplete: protectedProcedure
    .input(SubmissionCompleteZodSchema)
    .mutation(async ({ ctx, input }) => {
      const { assignmentId, publicId, fileName, fileSize, fileType, fileUrl } =
        input;

      const userId = ctx.user.id;

      try {
        const student = await studentModel
          .findOne({
            _id: userId,
            assignments: assignmentId,
          })
          .lean();

        if (!student) {
          console.error(
            `Assignment ${assignmentId} not associated with student ${userId}. Attempting rollback.`
          );
          try {
            await cloudinary.uploader.destroy(publicId, {
              resource_type: "raw",
            });
            console.log(`Orphaned Cloudinary file ${publicId} deleted.`);
          } catch (destroyError) {
            console.error(
              `Failed to delete orphaned Cloudinary file ${publicId}:`,
              destroyError
            );
          }
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not assigned to this assignment.",
          });
        }

        // 2. Prepare submission data for update
        const submissionData: TSubmissionData = {
          status: "submitted",
          submissionDate: new Date(),
          submissionFileUrl: fileUrl,
          submissionPublicId: publicId,
          submissionFileName: fileName,
          submissionFileSize: fileSize,
          submissionFileType: fileType,
        };

        // 3. Update the Assignment document
        const updatedAssignment = await AssignmentModel.findOneAndUpdate(
          { _id: assignmentId },
          { $set: submissionData },
          { new: true, runValidators: true }
        );

        if (!updatedAssignment) {
          console.error(
            `Assignment not found for update: ${assignmentId}. Attempting rollback.`
          );
          try {
            await cloudinary.uploader.destroy(publicId, {
              resource_type: "raw",
            });
            console.log(
              `Cloudinary file ${publicId} deleted due to failed DB update.`
            );
          } catch (destroyError) {
            console.error(
              `Failed to delete Cloudinary file ${publicId} after DB error:`,
              destroyError
            );
          }
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Assignment could not be updated.",
          });
        }

        return { success: true, assignment: updatedAssignment };
      } catch (error) {
        console.error("Error marking submission complete:", error);

        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update assignment submission.",
          cause: error,
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
