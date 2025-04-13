/* eslint-disable @typescript-eslint/no-explicit-any */
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

export type GetStudentOutput = inferProcedureOutput<
  AppRouter["student"]["getById"]
>;
export type GetInstructorOutput = inferProcedureOutput<
  AppRouter["instructor"]["getById"]
>;
export type GetAdminOutput = inferProcedureOutput<
  AppRouter["admin"]["getById"]
>;

export type ICourseSummary = GetAllCoursesOutput["courses"][number];

export const queryClient = new QueryClient();

async function customFetch(input: any, init: any) {
  let response = await fetch(input, init);

  if (response.status === 401) {
    let errorBody: any;
    try {
      errorBody = await response.clone().json();
    } catch {
      return response;
    }

    if (errorBody?.error?.message === "token has expired") {
      console.warn("Intercepting...")
      const newToken = await authProvider.refreshAccessToken();

      console.log("intercepted...", newToken);

      authProvider.setAccessToken(newToken.toString());

      init = {
        ...init,
        headers: {
          ...init.headers,
          Authorization: `Bearer ${newToken}`,
        },
      };

      response = await fetch(input, init);
    }
  }

  return response;
}

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
        return customFetch(url, {
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
