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

type TSubmissionData = Partial<
  Omit<IStudentAssignment, "title" | "lesson" | "dueDate">
>;
const SubmissionCompleteZodSchema = z.object({
  assignmentId: z.string(),
  publicId: z.string(),
  fileName: z.string(),
  fileSize: z.number(),
  fileType: z.string(),
  fileUrl: z.string().url(),
});

const MarkAssignmentZodSchema = z.object({
  assignmentId: z
    .string()
    .refine(isValidObjectId, { message: "Invalid assignment id" }),

  score: z
    .number()
    .min(0, { message: "Assignment score cannot be less than zero" }),
});

export const assignmentRouter = router({
  getAllForStudent: protectedProcedure.query(async ({ ctx }) => {
    const { id: studentId } = ctx.user;

    const cacheKey = `assignments-${studentId}`;

    const cachedAssignments = CACHE.get<IStudentAssignment[]>(cacheKey);
    if (cachedAssignments) {
      console.log(`[CACHE] Hit for ${cacheKey}`);
      return cachedAssignments;
    }

    console.log(`[CACHE] Miss for ${cacheKey}`);

    try {
      const student = await studentModel
        .findById(studentId)
        .populate<{ assignments: IStudentAssignment[] }>("assignments")
        .lean();

      if (!student) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Student was not found",
        });
      }

      CACHE.set(cacheKey, student.assignments);
      console.log(`[CACHE] Set for ${cacheKey}`);

      return student.assignments;
    } catch (error) {
      console.error("An error occured while getting all assignments: ", error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occured",
        cause: error,
      });
    }
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

  mark: protectedProcedure
    .input(MarkAssignmentZodSchema)
    .mutation(async ({ input, ctx }) => {
      const { role } = ctx.user;
      const { assignmentId, score } = input;

      if (role !== "admin" && role !== "instructor") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only instructors and admins can mark assignments",
        });
      }

      try {
        const assignment = await AssignmentModel.findByIdAndUpdate(
          assignmentId,
          { score },
          { runValidators: true, new: true }
        );

        if (!assignment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Assignment with id ${assignmentId} was not found`,
          });
        }

        wildcardDeleteCache("assignments-");

        return { success: true, assignment };
      } catch (err) {
        console.error(
          "An error occured while trying to mark assignment: ",
          err
        );
        if (err instanceof TRPCError) throw err;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occured",
        });
      }
    }),
});
