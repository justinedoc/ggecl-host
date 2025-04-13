import { procedure, protectedProcedure, router } from "../trpc.js";
import { z } from "zod";
import { CACHE, wildcardDeleteCache } from "../utils/nodeCache.js";
import instructorModel, { IInstructor } from "../models/instructorModel.js";
import { TRPCError } from "@trpc/server";
import { FilterQuery, isValidObjectId } from "mongoose";
import { CACHE_PREFIX as CartItemsCachePrefix } from "./cartRouter.js";

// Define the instructor summary type by omitting sensitive fields.
type IInstructorSummary = Omit<
  IInstructor,
  | "password"
  | "refreshToken"
  | "emailVerificationExpires"
  | "emailVerificationToken"
  | "passwordUpdateToken"
  | "passwordUpdateTokenExpiry"
>;

interface IInstructorListResponse {
  instructors: IInstructorSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Schema for fields that can be edited.
const InstructorEditableSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    dateOfBirth: z.string().transform((str) => new Date(str)),
    gender: z.enum(["male", "female", "other"], {
      errorMap: () => ({ message: "Gender selected is not valid" }),
    }),
    picture: z.string().url(),
    bio: z.string().min(5, "Bio must be at least 5 characters"),
    topics: z.array(z.string()),
  })
  .partial();

// Schema for updating an instructor.
const InstructorUpdateSchema = z.object({
  data: InstructorEditableSchema,
  id: z.string().refine(isValidObjectId, { message: "Invalid instructor ID" }),
});

// Schema for querying instructors with pagination, search, and sorting.
const GetInstructorsZodSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  search: z.string().optional(),
  sortBy: z
    .enum(["isVerified", "fullName", "email", "schRole"])
    .default("isVerified"),
  order: z.enum(["asc", "desc"]).default("asc"),
});
type TGetInstructorsInput = z.infer<typeof GetInstructorsZodSchema>;

// Helper to generate cache key for instructor list.
const getCacheKey = (input: TGetInstructorsInput) => {
  const { page, limit, search, sortBy, order } = input;
  return `instructors-${page}-${limit}-${search}-${sortBy}-${order}`;
};

export const instructorRouter = router({
  // Get a paginated list of instructors with optional search and sorting.
  getAll: procedure.input(GetInstructorsZodSchema).query(async ({ input }) => {
    const cacheKey = getCacheKey(input);
    const cachedData = CACHE.get<IInstructorListResponse>(cacheKey);
    if (cachedData) {
      console.log(`[CACHE] Hit for ${cacheKey}`);
      return cachedData;
    }
    console.log(`[CACHE] Miss for ${cacheKey}`);

    const { page, limit, search, sortBy, order } = input;
    const skip = (page - 1) * limit;
    const sortOrder = order === "asc" ? 1 : -1;

    const searchQuery: FilterQuery<IInstructorSummary> = {};
    if (search) {
      searchQuery.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { schRole: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    try {
      const [instructors, total] = await Promise.all([
        instructorModel
          .find(searchQuery)
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .select(
            "-password -refreshToken -emailVerificationExpires -emailVerificationToken -passwordUpdateToken -passwordUpdateTokenExpiry"
          )
          .populate<{ courses: { title: string; image: string }[] }>(
            "courses",
            "title image"
          )
          .populate<{ students: { name: string; email: string }[] }>(
            "students",
            "name email"
          )
          .lean(),
        instructorModel.countDocuments(searchQuery),
      ]);

      const response = {
        instructors,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };

      CACHE.set(cacheKey, response);
      console.log(`[CACHE] Set for ${cacheKey}`);

      return response;
    } catch (error) {
      console.error("[ERROR] Fetching instructors failed:", error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch instructors",
      });
    }
  }),

  // Get a single instructor by ID.
  getById: procedure
    .input(
      z.object({
        id: z
          .string()
          .refine(isValidObjectId, { message: "Invalid instructor ID" }),
      })
    )
    .query(async ({ input }) => {
      const { id: instructorId } = input;
      const cacheKey = `instructor-${instructorId}`;

      const cachedData = CACHE.get<IInstructorSummary>(cacheKey);
      if (cachedData) {
        console.log(`[CACHE] Hit for ${cacheKey}`);
        return cachedData;
      }
      console.log(`[CACHE] Miss for ${cacheKey}`);

      try {
        const instructor = await instructorModel
          .findById(instructorId)
          .select(
            "-password -refreshToken -emailVerificationExpires -emailVerificationToken -passwordUpdateToken -passwordUpdateTokenExpiry"
          )
          .populate<{ courses: { title: string; image: string }[] }>(
            "courses",
            "title image"
          )
          .populate<{ students: { name: string; email: string }[] }>(
            "students",
            "name email"
          )
          .lean()
          .exec();

        if (!instructor) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Instructor with id ${instructorId} was not found`,
          });
        }

        CACHE.set(cacheKey, instructor);
        console.log(`[CACHE] Set for ${cacheKey}`);

        return instructor;
      } catch (error) {
        console.error("[ERROR] Fetching instructor failed:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

  // Update an instructor's information.
  update: protectedProcedure
    .input(InstructorUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { role, id: currentUserId } = ctx.user;
      const { data, id: instructorId } = input;

      try {
        // Check if the instructor exists.
        const instructorExists = await instructorModel.exists({
          _id: instructorId,
        });
        if (!instructorExists) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Instructor with id ${instructorId} does not exist`,
          });
        }

        const filterQuery: FilterQuery<IInstructor> = {
          $and: [
            { _id: instructorId },
            ...(role !== "admin" ? [{ _id: currentUserId }] : []),
          ],
        };

        const updatedInstructor = await instructorModel.findOneAndUpdate(
          filterQuery,
          data,
          {
            new: true,
            runValidators: true,
            upsert: true,
          }
        );

        if (!updatedInstructor) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not authorized to update this instructor",
          });
        }

        // Invalidate related cache entries.
        CACHE.del(`instructor-${instructorId}`);
        wildcardDeleteCache("instructors-");
        wildcardDeleteCache(`${CartItemsCachePrefix}:`);

        return updatedInstructor;
      } catch (err) {
        console.error("[ERROR] Updating instructor failed:", err);
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        });
      }
    }),
});
