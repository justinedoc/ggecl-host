import z from "zod";

// ==================== Shared Schemas ====================
const NotificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  createdAt: z.string().optional(),
  isRead: z.boolean().optional().default(false),
});

const ReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  reviewer: z.string().min(1, "Reviewer name is required"),
  date: z.string(),
  comment: z.string().min(1, "Comment is required"),
  image: z.string().url("Invalid image URL"),
  stars: z.number().min(0).max(5),
});

// ============= Student schema ========== //
const StudentSchemaNotificationSchema = NotificationSchema;

export const StudentSchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).default("other"),
  picture: z.string(),
  username: z.string(),
  googleSignIn: z.boolean(),
  emailVerified: z.boolean(),
  isVerified: z.boolean(),
  email: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  notifications: z.array(StudentSchemaNotificationSchema),
});

// ==================== Instructor Schema ====================
const InstructorNotificationSchema = NotificationSchema;
const InstructorTopicsSchema = z.array(z.string().min(1));

export const InstructorSchema = z.object({
  fullName: z.string(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).default("other"),
  picture: z.string().url(),
  username: z.string(),
  googleSignIn: z.boolean(),
  emailVerified: z.boolean(),
  isVerified: z.boolean(),
  email: z.string().email(),

  notifications: z.array(InstructorNotificationSchema).default([]),

  reviews: z.array(ReviewSchema).default([]),
  students: z.array(z.string()).default([]),
  courses: z.array(z.string()).default([]),
  bio: z.string().default(""),
  topics: InstructorTopicsSchema.default([]),
});

// ==================== Course Schema ====================
export const CourseSchema = z.object({
  title: z.string(),
  instructor: z.string(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  certification: z.string(),
  syllabus: z.array(z.string()).default([]),
  reviews: z.array(ReviewSchema).default([]),
  totalRating: z.number().min(0),
  totalStar: z.number().min(0),
  duration: z.string().min(1, "Duration is required"),
  lectures: z.number().int().positive(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.number().positive(),
  img: z.string().url("Invalid image URL"),
});

// ==================== Utility Types ====================
export type Instructor = z.infer<typeof InstructorSchema>;
export type Student = z.infer<typeof StudentSchema>;
export type Course = z.infer<typeof CourseSchema>;
export type Review = z.infer<typeof ReviewSchema>;
