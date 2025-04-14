import { z } from "zod";
import { protectedProcedure, router } from "../trpc.js";
import { isValidObjectId } from "mongoose";
import { TRPCError } from "@trpc/server";
import adminModel, { IAdmin } from "../models/adminModel.js";
import { CACHE } from "../utils/nodeCache.js";
import { generatePassword } from "../utils/genPassword.js";
import { adminService } from "../services/adminService.js";

// Types
type IAdminSummary = Omit<
  IAdmin,
  | "password"
  | "refreshToken"
  | "emailVerificationExpires"
  | "emailVerificationToken"
  | "passwordUpdateToken"
  | "passwordUpdateTokenExpiry"
>;

// Input validation
const GetAdminByIdZodSchema = z.object({
  id: z
    .string()
    .refine(isValidObjectId, { message: "Invalid MongoDB ObjectId" }),
});

const AdminEnrollmentSchema = z.object({
  email: z.string().email("Invalid email format"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  role: z.enum(["admin", "superadmin"]).default("admin"),
  permissions: z.array(z.string()).optional().default([]),
});

export const adminRouter = router({
  enroll: protectedProcedure
    .input(AdminEnrollmentSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: adminId, role } = ctx.user;

      try {
        const adminExists = await adminModel.exists({ _id: adminId });

        if (!adminExists || role !== "admin") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Only admins can enroll admins",
          });
        }

        const adminToEnrollExists = await adminService.findAdminByEmail(
          input.email
        );

        if (adminToEnrollExists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `Admin with email ${input.email} has already been registered`,
          });
        }

        const adminPassword = generatePassword(8);
        console.log(adminPassword);

        const adminEnrollmentData = {
          ...input,
          password: adminPassword,
        };

        const admin = await adminService.createAdmin(adminEnrollmentData);

        // send mail to admin containing password and email

        return { success: true, admin };
      } catch (error) {
        console.error("An Error occured while trying to enroll admin");
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occured",
        });
      }
    }),
  getById: protectedProcedure
    .input(GetAdminByIdZodSchema)
    .query(async ({ ctx, input }) => {
      const { id: adminId } = input;
      const { role } = ctx.user;

      const cacheKey = `admin-${adminId}`;
      const cachedAdmin = CACHE.get<IAdminSummary>(cacheKey);

      if (cachedAdmin) {
        console.log(`[CACHE] Hit for ${cacheKey}`);
        return cachedAdmin;
      }

      console.log(`[CACHE] Miss for ${cacheKey}`);

      try {
        if (role !== "admin") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Only admins can view admin information.",
          });
        }

        const admin = await adminModel
          .findById(adminId)
          .select(
            "-password -refreshToken -emailVerificationExpires -emailVerificationToken -passwordUpdateToken -passwordUpdateTokenExpiry"
          )
          .lean()
          .exec();

        if (!admin) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Admin with id ${adminId} was not found`,
          });
        }

        CACHE.set(cacheKey, admin);
        console.log(`[CACHE] Set for ${cacheKey}`);

        return admin as IAdminSummary;
      } catch (error) {
        console.error(`[ERROR] Failed to get admin (${adminId}):`, error);
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred. Please try again later.",
        });
      }
    }),
});
