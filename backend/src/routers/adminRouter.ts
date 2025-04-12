import { z } from "zod";
import { protectedProcedure, router } from "../trpc.js";
import { isValidObjectId } from "mongoose";
import { TRPCError } from "@trpc/server";
import adminModel, { IAdmin } from "../models/adminModel.js";
import { CACHE } from "../utils/nodeCache.js";

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

export const adminRouter = router({
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
