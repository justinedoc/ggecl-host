import { procedure, protectedProcedure, router } from "../trpc.js";
import { z } from "zod";
import { CACHE, wildcardDeleteCache } from "../utils/nodeCache.js";
import studentModel, { IStudent } from "../models/studentModel.js";
import { TRPCError } from "@trpc/server";
import { FilterQuery, isValidObjectId } from "mongoose";
import adminModel from "../models/adminModel.js";
import { studentAuthService } from "../services/studentAuth.js";
import { generatePassword } from "../utils/genPassword.js";

// Define a summary type for students by omitting sensitive fields.
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

// Schema for editable student fields.
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

const StudentUpdateZodSchema = z.object({
  data: StudentEditableSchema,
  id: z.string().refine(isValidObjectId, { message: "Invalid Student ID" }),
});

// Schema for querying a paginated list of students.
const GetStudentsZodSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  search: z.string().optional(),
  sortBy: z.enum(["isVerified", "fullName", "email"]).default("fullName"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

const StudentRegistrationSchema = z.object({
  email: z.string().email("Invalid email format"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  gender: z
    .enum(["male", "female", "other"], {
      errorMap: () => ({ message: "Invalid gender selection" }),
    })
    .default("other"),
  picture: z.string().url("Invalid URL format").optional(),
  googleSignIn: z.boolean().default(false),
});

type TGetStudentsInput = z.infer<typeof GetStudentsZodSchema>;

// Helper to build a cache key for student lists.
const getCacheKey = (input: TGetStudentsInput) => {
  const { page, limit, search, sortBy, order } = input;
  return `students-${page}-${limit}-${search}-${sortBy}-${order}`;
};

export const studentRouter = router({
  enroll: protectedProcedure
    .input(StudentRegistrationSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: adminId, role } = ctx.user;

      try {
        const adminExists = await adminModel.exists({ _id: adminId });

        if (!adminExists || role !== "admin") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Only admins can enroll students",
          });
        }

        const studentExists = await studentAuthService.findStudentByEmail(
          input.email
        );

        if (studentExists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `Student with email ${input.email} has already been registered`,
          });
        }

        const studentPassword = generatePassword(8);

        const studentEnrollmentData = { ...input, password: studentPassword };

        const student = await studentAuthService.createStudent(
          studentEnrollmentData
        );

        const { refreshToken } = studentAuthService.generateAuthTokens(
          student._id.toString()
        );

        await studentAuthService.updateRefreshToken(
          student._id.toString(),
          refreshToken
        );

        wildcardDeleteCache("students-");

        // send mail to student containing password and email

        return { success: true };
      } catch (error) {
        console.error("An Error occured while trying to enroll student");
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occured",
        });
      }
    }),

  // Get all students (paginated, searchable, and sortable).
  getAll: protectedProcedure
    .input(GetStudentsZodSchema)
    .query(async ({ input }) => {
      const cacheKey = getCacheKey(input);
      const cachedData = CACHE.get<IStudentListResponse>(cacheKey);
      if (cachedData) {
        console.log(`[CACHE] Hit for ${cacheKey}`);
        return cachedData;
      }
      console.log(`[CACHE] Miss for ${cacheKey}`);

      const { page, limit, search, sortBy, order } = input;
      const skip = (page - 1) * limit;
      const sortOrder = order === "asc" ? 1 : -1;

      // Build search query based on optional search term.
      const searchQuery: FilterQuery<IStudentSummary> = {};
      if (search) {
        searchQuery.$or = [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
        ];
      }

      const sortOptions: Record<string, 1 | -1> = { [sortBy]: sortOrder };

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

        const response: IStudentListResponse = {
          students,
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
        console.error(`[ERROR] Fetching students failed:`, error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch students",
        });
      }
    }),

  // Get a single student by ID.
  getById: procedure
    .input(
      z.object({
        id: z
          .string()
          .refine(isValidObjectId, { message: "Invalid student ID" }),
      })
    )
    .query(async ({ input }) => {
      const { id: studentId } = input;
      const cacheKey = `student-${studentId}`;
      const cachedData = CACHE.get<IStudentSummary>(cacheKey);
      if (cachedData) {
        console.log(`[CACHE] Hit for ${cacheKey}`);
        return cachedData;
      }
      console.log(`[CACHE] Miss for ${cacheKey}`);

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
        console.log(`[CACHE] Set for ${cacheKey}`);
        return student;
      } catch (error) {
        console.error(`[ERROR] Fetching student failed:`, error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, please try again later",
        });
      }
    }),

  // Update a student's profile.
  update: protectedProcedure
    .input(StudentUpdateZodSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: currentStudentId, role } = ctx.user;
      const { data, id: studentId } = input;
      try {
        // Ensure the student exists.
        const studentExists = await studentModel.exists({ _id: studentId });
        if (!studentExists) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Student with id ${studentId} does not exist`,
          });
        }

        const filterQuery: FilterQuery<IStudent> = {
          $and: [
            { _id: studentId },
            ...(role !== "admin" ? [{ _id: currentStudentId }] : []),
          ],
        };

        const updatedStudent = await studentModel.findOneAndUpdate(
          filterQuery,
          data,
          {
            new: true,
            runValidators: true,
          }
        );

        if (!updatedStudent) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not authorized to update this student",
          });
        }

        // Invalidate cache entries related to this student.
        CACHE.del(`student-${studentId}`);
        wildcardDeleteCache("students-");

        return updatedStudent;
      } catch (err) {
        console.error(`[ERROR] Updating student failed:`, err);
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        });
      }
    }),
});
