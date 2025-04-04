import NodeCache from "node-cache";
import z from "zod";
import StudentModel from "../models/studentModel.js";
import { protectedProcedure, router } from "../trpc.js";
import { CartZodSchema, ICart } from "../models/cartSchema.js";
import { TRPCError } from "@trpc/server";

const cache = new NodeCache({ stdTTL: 600 });

const getCachedCartItems = (key: string): ICart[] | undefined => {
  return cache.get(`cartItems:${key}`);
};

const setCachedCartItems = (key: string, items: ICart[]): void => {
  cache.set(`cartItems:${key}`, items);
};

const deleteCachedCartItems = (id: string) => cache.del(`cartItems:${id}`);

export const cartRouter = router({
  getAllItems: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const cachedCartItems = getCachedCartItems(userId);

    if (cachedCartItems) {
      return cachedCartItems;
    }

    try {
      const user = await StudentModel.findById(userId);

      if (!user) {
        throw new TRPCError({
          message: "User not found",
          code: "NOT_FOUND",
        });
      }

      const cartItems = user.cartItems;
      setCachedCartItems(userId, cartItems);
      return cartItems;
    } catch (error) {
      console.error("Failed to retrieve cart items:", error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        message: "An unexpected error occurred",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),

  deleteItem: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id: itemId }, ctx: { user } }) => {
      try {
        const updatedUser = await StudentModel.findOneAndUpdate(
          { _id: user.id },
          { $pull: { cartItems: { _id: itemId } } },
          { new: true }
        );

        if (!updatedUser) {
          throw new TRPCError({
            message: "User not found",
            code: "NOT_FOUND",
          });
        }

        deleteCachedCartItems(user.id);
        return true;
      } catch (error) {
        console.error("Error occurred while deleting cart item:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          message: "An unexpected error occurred",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  addItem: protectedProcedure
    .input(CartZodSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      try {
        const updatedUser = await StudentModel.findByIdAndUpdate(
          userId,
          { cartItems: { $push: input } },
          { new: true }
        );

        if (!updatedUser) {
          throw new TRPCError({
            message: "User not found",
            code: "NOT_FOUND",
          });
        }

        const newCartItems = updatedUser.cartItems;

        deleteCachedCartItems(userId);
        setCachedCartItems(userId, newCartItems);

        return newCartItems;
      } catch (error) {
        console.error("Error occurred while adding cart item:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          message: "An unexpected error occurred",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
