import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

import { QueryClient } from "@tanstack/react-query";
import type { AppRouter } from "@backend/src/routers/appRouter.ts";

import { API_URL, authProvider } from "./client";

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
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  queryClient,
  client: trpcClient,
})