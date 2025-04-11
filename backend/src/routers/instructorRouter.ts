import { procedure, protectedProcedure, router } from "../trpc.js";
import z from "zod";
import { CACHE, wildcardDeleteCache } from "../utils/nodeCache.js";
import instructorModel, { IInstructor } from "../models/instructorModel.js";
import { TRPCError } from "@trpc/server";
import { FilterQuery } from "mongoose";

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

const getCacheKey = (input: TGetInstructorsInput) => {
  const { page, limit, search, sortBy, order } = input || {};
  return `instructors-${page}-${limit}-${search}-${sortBy}-${order}`;
};

export const instructorRouter = router({
  getAll: procedure.input(GetInstructorsZodSchema).query(async ({ input }) => {
    const cacheKey = getCacheKey(input);

    const cachedData = CACHE.get<IInstructorListResponse>(cacheKey);
    if (cachedData) {
      console.log("Cache hit for:", cacheKey);
      return cachedData;
    }
    console.log("Cache miss for:" + cacheKey);

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

    const sortOptions: Record<string, 1 | -1> = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder;
    }

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
      console.log("Cache set for:", cacheKey);

      return response;
    } catch (error) {
      console.error("Error fetching instructors:", error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch instructors",
      });
    }
  }),

  getById: procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id: instructorId } = input;

      const cacheKey = `instructor-${instructorId}`;

      const cachedData = CACHE.get<IInstructorSummary>(cacheKey);
      if (cachedData) {
        console.log("Cache hit for:", cacheKey);
        return cachedData;
      }
      console.log("Cache miss for:", cacheKey);

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
        console.log("Cache set for: ", cacheKey);

        return instructor;
      } catch (error) {
        console.log("Error while fetching instructor with id", error);

        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

  update: protectedProcedure
    .input(InstructorEditableSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: instructorId } = ctx.user;

      try {
        const instructorExists = await instructorModel.exists({
          _id: instructorId,
        });

        if (!instructorExists) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `instructor with id ${instructorId} does not exist`,
          });
        }

        await instructorModel.findByIdAndUpdate(instructorId, input, {
          runValidators: true,
        });

        CACHE.del(`instructor-${instructorId}`);
        wildcardDeleteCache("instructors-");
      } catch (err) {
        console.error("Error updating instructor: ", err);
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
