import { router } from "../trpc.js";
import { notificationRouter } from "./notificationRouter.js";
import { forgotPasswordRouter } from "./forgotPasswordRouter.js";
import { cartRouter } from "./cartRouter.js"
import { courseRouter } from "./CourseRouter.js";

export const appRouter = router({
  notification: notificationRouter,
  forgotPassword: forgotPasswordRouter,
  cart: cartRouter,
  course: courseRouter
});

export type AppRouter = typeof appRouter;
