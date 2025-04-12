import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";

import { cloudinary } from "../cloudinary.js";
import { envConfig } from "../config/envValidator.js";
import { protectedProcedure, router } from "../trpc.js";
import studentModel from "../models/studentModel.js";

export const assignmentRouter = router({
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
        timestamp: timestamp,
        folder: folder,
        public_id: public_id,
        resource_type: "raw",
      };

      try {
        const signature = cloudinary.utils.api_sign_request(
          paramsToSign,
          envConfig.CLOUDINARY_API_SECRET
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
    .input(
      z.object({
        assignmentId: z.string(),
        publicId: z.string(),
        version: z.number().or(z.string()),
        signature: z.string(),
        fileName: z.string(),
        fileSize: z.number(),
        fileType: z.string(),
        fileUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        assignmentId,
        publicId,
        version,
        signature,
        fileName,
        fileSize,
        fileType,
        fileUrl,
      } = input;
      const userId = ctx.user.id;

      const expectedSignature = cloudinary.utils.api_sign_request(
        { public_id: publicId, version: version },
        envConfig.CLOUDINARY_API_SECRET
      );

      if (expectedSignature !== signature) {
        console.warn("Cloudinary notification signature mismatch.", {
          expectedSignature,
          signature,
        });
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid upload notification signature.",
        });
      }

      try {
        const submissionData = {
          status: "submitted",
          submissionDate: new Date(),
          submissionFileUrl: fileUrl,
          submissionPublicId: publicId,
          submissionFileName: fileName,
          submissionFileSize: fileSize,
          submissionFileType: fileType,
        };

        const updatePayload = {};
        for (const key in submissionData) {
          updatePayload[`assignments.$.${key}`] = submissionData[key];
        }

        const updatedAssignment = await studentModel.findOneAndUpdate(
          { _id: userId, "assignments._id": assignmentId },
          { $set: updatePayload },
          { new: true, runValidators: true }
        );

        if (!updatedAssignment) {
          console.error(`Assignment not found for update: ${assignmentId}`);
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "raw",
          });
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Assignment not found.",
          });
        }

        return { success: true, assignment: updatedAssignment };
      } catch (error) {
        console.error("Error marking submission complete:", error);
        if (error?.code !== "NOT_FOUND") {
          try {
            await cloudinary.uploader.destroy(publicId, {
              resource_type: "raw",
            });
          } catch (destroyError) {
            console.error(
              "Failed to delete Cloudinary file after DB error:",
              destroyError
            );
          }
        }
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update assignment submission.",
        });
      }
    }),
});
