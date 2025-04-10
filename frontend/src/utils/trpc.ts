import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import type { AppRouter } from "@backend/src/routers/appRouter";
import { API_URL, authProvider } from "../api/client";
import { inferProcedureOutput } from "@trpc/server";

export type GetAllCoursesOutput = inferProcedureOutput<
  AppRouter["course"]["getAll"]
>;

export type GetCourseOutput = inferProcedureOutput<
  AppRouter["course"]["getById"]
>;

export type ICourseSummary = GetAllCoursesOutput["courses"][number];

export const queryClient = new QueryClient();

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: API_URL + "/trpc",
      headers() {
        return {
          Authorization: `Bearer ${authProvider.getAccessToken()}`,
        };
      },
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
      transformer: superjson,
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
