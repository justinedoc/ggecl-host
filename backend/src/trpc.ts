import { initTRPC } from "@trpc/server";
import { Context } from "./context.js";

export const t = initTRPC.context<Context>().create();

import { authenticator } from "./middlewares/authenticator.js";

export const router = t.router;
export const procedure = t.procedure;
export const protectedProcedure = t.procedure.use(authenticator());
