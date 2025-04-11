import { procedure, protectedProcedure, router } from "../trpc.js";
import z from "zod";
import { CACHE, wildcardDeleteCache } from "../utils/nodeCache.js";
import studentModel, { IStudent } from "../models/studentModel.js";
import { TRPCError } from "@trpc/server";
import { FilterQuery } from "mongoose";

type IStudentSummary = Omit<
  IStudent,
  | "password"
  | "refreshToken"
  | "emailVerificationExpires"
  | "emailVerificationToken"
  | "passwordUpdateToken"
  | "passwordUpdateTokenExpiry"
>;

interface IStudentListResponse {
  students: IStudentSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const StudentEditableSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    gender: z.enum(["male", "female", "other"], {
      errorMap: () => ({ message: "Gender selected is not valid" }),
    }),
    email: z.string().email(),
    username: z.string(),
    picture: z.string().url(),
  })
  .partial();

const GetStudentsZodSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  search: z.string().optional(),
  sortBy: z.enum(["isVerified", "fullName", "email"]).default("isVerified"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

type TGetStudentsInput = z.infer<typeof GetStudentsZodSchema>;

const getCacheKey = (input: TGetStudentsInput) => {
  const { page, limit, search, sortBy, order } = input || {};
  return `students-${page}-${limit}-${search}-${sortBy}-${order}`;
};

export const studentRouter = router({
  getAll: protectedProcedure
    .input(GetStudentsZodSchema)
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin" && ctx.user?.role !== "instructor") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const cacheKey = getCacheKey(input);

      const cachedData = CACHE.get<IStudentListResponse>(cacheKey);
      if (cachedData) {
        console.log("Cache hit for:", cacheKey);
        return cachedData;
      }
      console.log("Cache miss for:" + cacheKey);

      const { page, limit, search, sortBy, order } = input;
      const skip = (page - 1) * limit;
      const sortOrder = order === "asc" ? 1 : -1;

      const searchQuery: FilterQuery<IStudentSummary> = {};
      if (search) {
        searchQuery.$or = [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
        ];
      }

      const sortOptions: Record<string, 1 | -1> = {};
      if (sortBy) {
        sortOptions[sortBy] = sortOrder;
      }

      try {
        const [students, total] = await Promise.all([
          studentModel
            .find(searchQuery)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .select(
              "-password -refreshToken -emailVerificationExpires -emailVerificationToken -passwordUpdateToken -passwordUpdateTokenExpiry"
            )
            .lean(),
          studentModel.countDocuments(searchQuery),
        ]);

        const response = {
          students,
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
        console.error("Error fetching students:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch students",
        });
      }
    }),

  getById: procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id: studentId } = input;

      const cacheKey = `student-${studentId}`;

      const cachedData = CACHE.get<IStudentSummary>(cacheKey);
      if (cachedData) {
        console.log("Cache hit for:", cacheKey);
        return cachedData;
      }
      console.log("Cache miss for:", cacheKey);

      try {
        const student = await studentModel
          .findById(studentId)
          .select(
            "-password -refreshToken -emailVerificationExpires -emailVerificationToken -passwordUpdateToken -passwordUpdateTokenExpiry"
          )
          .lean();

        if (!student) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Student with id ${studentId} was not found`,
          });
        }


        CACHE.set(cacheKey, student);
        console.log("Cache set for: ", cacheKey);

        return student;
      } catch (error) {
        console.log("Error while fetching student with id", error);

        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, try again later",
        });
      }
    }),

  update: protectedProcedure
    .input(StudentEditableSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: studentId } = ctx.user;

      try {
        const studentExists = await studentModel.exists({ _id: studentId });

        if (!studentExists) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Student with id ${studentId} does not exist`,
          });
        }

        await studentModel.findByIdAndUpdate(studentId, input, {
          runValidators: true,
        });

        CACHE.del(`student-${studentId}`);
        wildcardDeleteCache("students-");
      } catch (err) {
        console.error("Error updating student: ", err);
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
