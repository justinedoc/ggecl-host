import { procedure, router, protectedProcedure } from "../trpc.js";
import { z } from "zod";
import Course, { ICourse } from "../models/coursesModel.js";
import { FilterQuery } from "mongoose";
import { TRPCError } from "@trpc/server";
import Instructor from "../models/instructorModel.js";
import { Review } from "../models/reviewSchema.js";
import { CACHE, wildcardDeleteCache } from "../utils/nodeCache.js";

export type ICourseSummary = Omit<
  ICourse,
  "description" | "syllabus" | "reviews"
> & {
  instructor: { _id: string; fullName: string; picture: string };
};

interface ICourseListResponse {
  courses: ICourseSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Zod Schemas
const CourseInputSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  certification: z.string().min(3),
  syllabus: z.array(z.string()).optional().default([]),
  duration: z.string().min(1),
  lectures: z.number().int().positive(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.number().positive(),
  img: z.string(),
  totalRating: z.number().min(0).default(0),
  totalStar: z.number().min(0).default(0),
});

const CourseUpdateInputSchema = z.object({
  courseId: z.string().min(1, "Course Id is required"),
  courseData: CourseInputSchema.partial(),
});

const GetCoursesZodSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  search: z.string().optional(),
  sortBy: z.enum(["title", "price", "rating"]).default("title"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

type TGetCoursesInput = z.infer<typeof GetCoursesZodSchema>;

const getCacheKey = (input: TGetCoursesInput) => {
  const { page, limit, search, sortBy, order } = input || {};
  return `courses-${page}-${limit}-${search}-${sortBy}-${order}`;
};

export const courseRouter = router({
  getAll: procedure.input(GetCoursesZodSchema).query(async ({ input }) => {
    const cacheKey = getCacheKey(input);

    const cachedData = CACHE.get<ICourseListResponse>(cacheKey);
    if (cachedData) {
      console.log("Cache hit for:", cacheKey);
      return cachedData;
    }
    console.log("Cache miss for:" + cacheKey);

    const { page, limit, search, sortBy, order } = input;
    const skip = (page - 1) * limit;
    const sortOrder = order === "asc" ? 1 : -1;

    const searchQuery: FilterQuery<ICourse> = {};
    if (search) {
      searchQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions: Record<string, 1 | -1> = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder;
    }

    try {
      // Get courses with instructor populated, and select only summary fields.
      const [courses, total] = await Promise.all([
        Course.find(searchQuery)
          .populate<{
            instructor: { _id: string; fullName: string; picture: string };
          }>("instructor", "fullName picture")
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .select("-syllabus -reviews -description")
          .lean(),
        Course.countDocuments(searchQuery),
      ]);

      const response = {
        courses,
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
      console.error("Error fetching courses:", error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch courses",
      });
    }
  }),

  getById: procedure
    .input(z.object({ courseId: z.string().min(1, "Course ID is required") }))
    .query(async ({ input }) => {
      const { courseId } = input;
      const cacheKey = `course-${courseId}`;

      const cachedData = CACHE.get<ICourse>(cacheKey);
      if (cachedData) {
        console.log("Cache hit for:", cacheKey);
        return cachedData;
      }
      console.log("Cache miss for:", cacheKey);

      try {
        const course = await Course.findById(courseId)
          .populate<{
            instructor: {
              _id: string;
              fullName: string;
              picture: string;
              bio: string;
              schRole: string;
              reviews: Review[];
              courses: string[];
              students: string[];
            };
          }>(
            "instructor",
            "fullName picture bio schRole reviews courses students"
          )
          .lean();
        if (!course) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Course with ID ${courseId} not found.`,
          });
        }

        CACHE.set(cacheKey, course);
        console.log("Cache set for:", cacheKey);

        return course;
      } catch (error) {
        console.error("Error fetching course:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch course",
        });
      }
    }),

  create: protectedProcedure
    .input(CourseInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { id: instructorId, role } = ctx.user;
      if (role !== "instructor") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only instructors can create courses.",
        });
      }

      const duplicateCourse = await Course.findOne({
        title: input.title,
        instructor: instructorId,
      });
      if (duplicateCourse) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A course with this title already exists.",
        });
      }

      const newCourse = new Course({
        ...input,
        instructor: instructorId,
      });

      try {
        const savedCourse = await newCourse.save();
        await Instructor.findByIdAndUpdate(instructorId, {
          $push: { courses: savedCourse._id },
        });
        wildcardDeleteCache("courses-");
        return savedCourse;
      } catch (error) {
        console.error("Error creating course:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create course",
        });
      }
    }),

  update: protectedProcedure
    .input(CourseUpdateInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { id: instructorId, role } = ctx.user;
      const { courseId, courseData: updateData } = input;

      try {
        if (role !== "instructor" && role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "Only instructors and admins are allowed to update courses",
          });
        }

        const courseExists = await Course.exists({
          _id: courseId,
          instructor: instructorId,
        });
        if (!courseExists) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Unauthorized to perform this action",
          });
        }

        const course = await Course.findByIdAndUpdate(courseId, updateData, {
          new: true,
          runValidators: true,
        })
          .populate<{ instructor: { _id: string; fullName: string } }>(
            "instructor",
            "fullName"
          )
          .lean();

        CACHE.del(`course-${courseId}`);
        wildcardDeleteCache("courses-");
        return course;
      } catch (error) {
        console.error("An error occurred while updating the course:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update course",
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ courseId: z.string().min(1, "Course ID is required") }))
    .mutation(async ({ input, ctx }) => {
      const { courseId } = input;
      const { id: instructorId, role } = ctx.user;
      if (role !== "instructor") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only instructors can delete courses.",
        });
      }
      try {
        const courseExists = await Course.exists({
          _id: courseId,
          instructor: instructorId,
        });
        if (!courseExists) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Unauthorized to perform this action",
          });
        }

        await Course.findByIdAndDelete(courseId);
        CACHE.del(`course-${courseId}`);
        wildcardDeleteCache("courses-");
        return { success: true };
      } catch (err) {
        console.error("An error occured while deleting course: ", err);
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occured while trying to delete course",
        });
      }
    }),
});
