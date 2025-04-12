import { router } from "../trpc.js";
import { notificationRouter } from "./notificationRouter.js";
import { forgotPasswordRouter } from "./forgotPasswordRouter.js";
import { cartRouter } from "./cartRouter.js";
import { studentRouter } from "./studentRouter.js";
import { courseRouter } from "./courseRouter.js";
import { instructorRouter } from "./instructorRouter.js";
import { adminRouter } from "./adminRouter.js";

export const appRouter = router({
  notification: notificationRouter,
  forgotPassword: forgotPasswordRouter,
  cart: cartRouter,
  course: courseRouter,
  student: studentRouter,
  instructor: instructorRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
